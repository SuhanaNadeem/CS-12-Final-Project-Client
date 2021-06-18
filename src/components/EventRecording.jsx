import { gql, useMutation } from "@apollo/client";
import React, { useState, useEffect, useRef } from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { Audio } from "expo-av";
import { RNS3 } from "react-native-aws3";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import * as SMS from "expo-sms";
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "../util/notifications";
import { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, S3_CS_BUCKET } from "@env";
import { RECORDING_OPTIONS_PRESET_HIGH_QUALITY } from "./InterimRecording";

const EventRecording = ({
  userId,
  setSoundToPlay,
  styles,
  detectedStatus,
  setDetectedStatus,
}) => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  /* 1. Wait for the rest of 30 sec to be finished
 2. Send it to AWS
 3. Convert it to bytes
 4. Pass 2 and 3 into the backend
 5. Run transcription (takes time)
 6. Transcription matching
 7. Return "stop" if applicable */

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // const [values, setValues] = useState({ userId, eventRecordingUrl: "" });
  const [values, setValues] = useState({
    userId,
    eventRecordingFileKey: "",
    recordingBytes: "",
  });
  const [start, setStart] = useState(true);
  const [latestUrl, setLatestUrl] = useState();
  const [handleDanger, loadingHandleDanger] = useMutation(HANDLE_DANGER, {
    update(_, { data: { handleDanger: detectedStatusData } }) {
      console.log("handled danger");
      setValues({
        ...values,
        eventRecordingUrl: "",
        eventRecordingFileKey: "",
      });
      console.log("event's update's detectedStatus:");
      setDetectedStatus(detectedStatusData);
      console.log(detectedStatus);
    },
    onError(err) {
      console.log(err);
    },
    variables: values,
    client: userClient,
  });

  const [recording, setRecording] = useState();

  // TODO: RUNS IT TWICE THE FIRST TIME
  // TODO: LONG DELAY BETWEEN STOP/PANIC and actually doing it

  async function startRecording() {
    try {
      console.log("event's startRecording is detectedStatus");
      console.log(detectedStatus);

      // console.log("entered start in record.jsx");

      // setEnabled({ ...enabled, inProgress: true });

      await Audio.requestPermissionsAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const recording = new Audio.Recording();

      await recording.prepareToRecordAsync(
        RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      await recording.startAsync();

      console.log("STARTED EVENT RECORDING at " + Date());

      setRecording(recording);
    } catch (err) {
      // console.log("err in record.jsx start");
      // console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      // console.log("entered stop in record.jsx");
      // setEnabled({ ...enabled, inProgress: false });

      await recording.stopAndUnloadAsync();
      setRecording(undefined);

      console.log("STOPPED EVENT RECORDING at " + Date());

      const fileUri = recording.getURI();

      // Upload file to AWS S3 Bucket
      const file = {
        uri: fileUri,
        name: `${uuidv4()}.wav`,
        type: "audio/wav",
      };

      setLatestUrl(fileUri);

      const options = {
        keyPrefix: "uploads/",
        bucket: S3_CS_BUCKET,
        region: AWS_REGION,
        accessKey: AWS_ACCESS_KEY,
        secretKey: AWS_SECRET_KEY,
        successActionStatus: 201,
      };

      await RNS3.put(file, options).then(async (response) => {
        if (response.status !== 201)
          throw new Error("Failed to upload recording to S3");
        console.log("event recording:");
        console.log(response.body.postResponse.location);
        if (detectedStatus === "start") {
          await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
          }).then((bytes) => {
            console.log("latestUrl: " + latestUrl);
            setValues({
              ...values,
              // eventRecordingFileKey: response.body.postResponse.key,
              recordingBytes: bytes,
              eventRecordingUrl: response.body.postResponse.location,
            });
            handleDanger();
          });
        }
        // }
      });

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
      const { sound } = await recording.createNewLoadedSoundAsync({});
      setSoundToPlay(sound);
    } catch (err) {
      // console.log("err in record.jsx stop");
    }
  }
  const isAvailable = SMS.isAvailableAsync();

  if (isAvailable) {
    console.log("availablee");
  } else {
    console.log("not availablee");
  }
  async function sendMessage() {
    const isAvailable = await SMS.isAvailableAsync();
    console.log(
      "`````````````````````````````````entered sendMessage```````````````````````````````"
    );
    if (isAvailable) {
      console.log("available");
    } else {
      console.log("not available");
    }

    const { result } = await SMS.sendSMSAsync(
      ["6475157981"],
      "TEST - This is an automated message: I might be in danger from a police officer or thief.",
      latestUrl && {
        attachments: {
          uri: latestUrl,
          mimeType: "audio/wav",
          filename: "myfile.wav",
        },
      }
    );
    console.log(result);
  }

  useEffect(() => {
    const interval = setInterval(
      async () => {
        if (detectedStatus === "start") {
          if (start) {
            console.log("startRec");
            await startRecording();
          } else {
            console.log("stopRec");
            await stopRecording();
          }
          setStart(!start);
        }
      },
      start ? 50 : 30000
    );

    if (detectedStatus === "stop") {
      console.log("useeffect found detectedStatus is stop, without panic");
      // if (recording) {
      stopRecording();
      // }
      setStart(true);
    } else if (detectedStatus === "panic") {
      // TODO automate clicking the send button
      console.log("useeffect found detectedStatus is panic");
      stopRecording();
      setStart(true);
      sendMessage();
      setDetectedStatus("stop");
    }

    return () => clearInterval(interval);
  }, [detectedStatus, start]);

  return (
    <View>
      <Text style={styles.titleText}>Event Recordings</Text>

      <Text style={styles.baseText}>
        Start, stop, and view your recordings here.
      </Text>

      <Button
        title={detectedStatus == "start" ? "Stop" : "Start"}
        onPress={async () => {
          if (expoPushToken) {
            await sendPushNotification({
              expoPushToken,
              data: { someData: "goeshere" },
              title: "Danger Handling",
              body:
                detectedStatus === "start" // need to print the opposite because setting happens after
                  ? "Event recording has been stopped and will be handled"
                  : detectedStatus === "stop" && "Event recording has started",
            });
          }
          if (detectedStatus === "start") {
            setDetectedStatus("stop");
          } else if (detectedStatus === "stop") {
            setDetectedStatus("start");
          }
          //i;
        }}
      />
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
export default EventRecording;
