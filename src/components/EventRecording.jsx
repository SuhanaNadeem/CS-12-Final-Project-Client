import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect, useRef } from "react";
import { Button, View, Text, Image, Pressable } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { Audio } from "expo-av";
import { RNS3 } from "react-native-aws3";
import { v4 as uuidv4 } from "uuid";
import * as FileSystem from "expo-file-system";
import { sendPushNotification } from "../util/notifications";
import { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, S3_CS_BUCKET } from "@env";
import { RECORDING_OPTIONS_PRESET_HIGH_QUALITY } from "./InterimRecording";
import { GET_TRANSCRIPTION_BY_USER } from "./LiveTranscription";
import styles from "../styles/recordStyles";
import Icon from "react-native-vector-icons/FontAwesome5";

/* Event recordings are triggered by (a) the user's pre-set 'start' voice key, (b) police 
speech-detection, or (c) thief speech-detection. They are stopped by (d) the user's pre-set 'stop'
voice key, or (e) their pre-set 'panic' key (which programmatically sends a (pre-selected) text 
message to their emergency contact in addition to stopping the event recording). 

This component handles periodic `handleDanger` mutation calls if background recordings, managed in
InterimRecording.jsx, have picked up one of (a), (b), or (c). Each call of `handleDanger` sends the
last audio recording (a component of the entire event) to be transcribed and analysed. As soon as a
`handleDanger` call detects (d) or (e), the event recording is completed and appropriate action is 
taken. */

const EventRecording = ({
  user,
  detectedStatus,
  setDetectedStatus,
  expoPushToken,
}) => {
  const [handleDangerValues, setHandleDangerValues] = useState({
    userId: user && user.id,
    eventRecordingFileKey: "",
    recordingBytes: "",
  });
  const [start, setStart] = useState(true); // Used to start and stop the recordings periodically
  const [recording, setRecording] = useState(); // Store current audio recording object for global access

  const [sendTwilioSMS] = useMutation(SEND_TWILIO_SMS, {
    // update(_, { data: { sendTwilioSMS: message } }) {
    //   console.log(message);
    // },
    onError(err) {
      console.log(err);
    },
    variables: {
      message:
        user.location == ""
          ? user && user.panicMessage
          : user &&
            JSON.parse(user.location) &&
            user.panicMessage +
              ` Sent from ${JSON.parse(user.location).coords.latitude}, ${
                JSON.parse(user.location).coords.longitude
              }`, // Append the user's current location, if available, to the 'panic' message they chose.
      phoneNumber: user && user.panicPhone,
    },
    client: userClient,
  });

  const [handleDanger] = useMutation(HANDLE_DANGER, {
    update() {
      setHandleDangerValues({
        ...handleDangerValues,
        eventRecordingUrl: "",
        eventRecordingFileKey: "",
      });
    },
    // Live transcription needs to be updated
    refetchQueries: [
      {
        query: GET_TRANSCRIPTION_BY_USER,
        variables: { userId: user && user.id },
      },
    ],
    onError(err) {
      console.log(err);
    },
    variables: handleDangerValues,
    client: userClient,
  });

  async function startRecording() {
    try {
      // Request permissions and configure device audio mode
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      // Prepare and start new recording
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();

      console.log("STARTED EVENT RECORDING");

      setRecording(recording); // Load the current recording into the useState
    } catch (err) {
      // console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      // Clear the current recording object
      await recording.stopAndUnloadAsync();
      setRecording(undefined);

      console.log("STOPPED EVENT RECORDING");

      // Get the file just stored by its local device URI
      const fileUri = recording.getURI();
      const file = {
        uri: fileUri,
        name: `${uuidv4()}.wav`,
        type: "audio/wav",
      };

      // Configure AWS upload settings
      const options = {
        keyPrefix: "uploads/",
        bucket: S3_CS_BUCKET,
        region: AWS_REGION,
        accessKey: AWS_ACCESS_KEY,
        secretKey: AWS_SECRET_KEY,
        successActionStatus: 201,
      };

      // Upload recording to AWS
      await RNS3.put(file, options).then(async (response) => {
        if (response.status !== 201) {
          throw new Error("Failed to upload recording to S3");
        }

        // If the last run of `handleDanger` didn't indicate to 'stop' or 'panic', run it again
        if (detectedStatus === "start") {
          // Get the bytes of the audio file from its URI
          await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
          }).then((bytes) => {
            // Call `handleDanger` with appropriate values
            setHandleDangerValues({
              ...handleDangerValues,
              recordingBytes: bytes,
              eventRecordingUrl: response.body.postResponse.location,
            });
            handleDanger();
          });
        }
      });
    } catch (err) {
      // console.error("Failed to stop recording", err);
    }
  }

  // This useEffect runs every time `status` or `detectedStatus` changes (i.e. per `handleDanger`
  // call, it's refreshed)
  useEffect(() => {
    // Alternate between stopping and starting a recording every 15 s, with a 50 ms pause to
    // avoid recordConflicts -- this records 15 s long event recording components
    const interval = setInterval(
      async () => {
        if (detectedStatus === "start") {
          if (start) {
            await startRecording();
          } else {
            await stopRecording();
          }
          setStart(!start);
        }
      },
      start ? 50 : 15000
    );

    if (detectedStatus === "stop") {
      // The user has said their 'stop' key -- just wants to end the event recording
      stopRecording();
      setStart(true);
    } else if (detectedStatus === "panic") {
      // The user has said their 'panic' key -- wants to end the event recording and send a Twilio SMS
      stopRecording();
      setStart(true);
      sendTwilioSMS();
      setDetectedStatus("stop");
    }

    return () => clearInterval(interval);
  }, [detectedStatus, start]);

  return user ? (
    <View>
      <Image
        source={require("../images/record2.png")}
        style={styles.bodyImage}
      ></Image>
      <View style={{ paddingHorizontal: 25 }}>
        <Text style={styles.titleText}>Event Recordings</Text>
        <Text style={{ fontSize: 16, paddingBottom: 20 }}>
          Start a recording when you anticipate danger or rely on your
          voice-activated 'start' key and background danger-detection.
        </Text>
        <View style={styles.buttonBackground}>
          <Pressable
            style={({ pressed }) => [
              {
                shadowColor: "#2f4f4f",
                shadowOffset: pressed
                  ? { width: 0, height: 1 }
                  : { width: 0, height: 0 },
                shadowOpacity: pressed ? 0.8 : 0,
                shadowRadius: pressed ? 0 : 1,
              },
              styles.centeredView,
            ]}
            onPress={async () => {
              if (expoPushToken) {
                console.log("ENTERS THIS");
                await sendPushNotification({
                  expoPushToken,
                  data: { someData: "goeshere" },
                  title: "Danger Handling",
                  body:
                    detectedStatus === "start" // need to print the opposite because setting happens after
                      ? "Event recording has been stopped and will be handled"
                      : detectedStatus === "stop" &&
                        "Event recording has started",
                });
              }
              if (detectedStatus === "start") {
                setDetectedStatus("stop");
              } else if (detectedStatus === "stop") {
                setDetectedStatus("start");
              }
            }}
          >
            <Text style={styles.pressableText}>
              {detectedStatus == "start" ? "Stop" : "Start"}
            </Text>
          </Pressable>
          <View style={styles.iconContainer}>
            <Icon
              name={
                detectedStatus == "start" ? "microphone" : "microphone-slash"
              }
              size={30}
              color="#2f4f4f"
            />
          </View>
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.loadingContainer}>
      <Text>Loading...</Text>
    </View>
  );
};

export const HANDLE_DANGER = gql`
  mutation handleDanger(
    $userId: String!
    $recordingBytes: String!
    $eventRecordingUrl: String!
  ) {
    handleDanger(
      userId: $userId
      recordingBytes: $recordingBytes
      eventRecordingUrl: $eventRecordingUrl
    )
  }
`;

export const GET_USER_BY_ID = gql`
  query getUserById($userId: String!) {
    getUserById(userId: $userId) {
      id
      name
      password
      email
      startKey
      panicKey
      stopKey
      createdAt
      token
      location
      locationOn
      friendIds
      requesterIds
      panicMessage
      panicPhone
    }
  }
`;

export const SEND_TWILIO_SMS = gql`
  mutation sendTwilioSMS($message: String!, $phoneNumber: String!) {
    sendTwilioSMS(message: $message, phoneNumber: $phoneNumber)
  }
`;

export default EventRecording;
