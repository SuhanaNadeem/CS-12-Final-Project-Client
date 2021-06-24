import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";
import { Text, View, Pressable, Image } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import * as FileSystem from "expo-file-system";
import { sendPushNotification } from "../util/notifications";
import { GET_TRANSCRIPTION_BY_USER } from "./LiveTranscription";
import { GET_EVENT_RECORDINGS_BY_USER } from "./PlayShareRemove";
import styles from "../styles/recordStyles";
import Icon from "react-native-vector-icons/FontAwesome5";

/* Background recordings are enabled by the user through a button. These are periodic, temporary 
recordings meant only to detect whether or not an event recording must be triggered. 

When background recordings are enabled, the `detectDanger` mutation is called periodically on chunks
of recording audio, to listen for (a) the user's pre-set 'start' voice key, (b) police, and (c) 
thieves. 

If any of these are detected, an event recording is triggered (handled in EventRecording.jsx)
which is stored for the user. */

const InterimRecording = ({
  user,
  detectedStatus,
  setDetectedStatus,
  enabled,
  setEnabled,
  expoPushToken,
}) => {
  const [detectDangerValues, setDetectDangerValues] = useState({
    userId: user && user.id,
    recordingBytes: "",
  });
  const [start, setStart] = useState(true); // Used to start and stop the recordings periodically
  const [recording, setRecording] = useState(); // Store current audio recording object for global access
  const [finalStatus, setFinalStatus] = useState(false); // Used to handle audio permissions only once

  const [detectDanger] = useMutation(DETECT_DANGER, {
    update(_, { data: { detectDanger: detectedStatusData } }) {
      setDetectDangerValues({ ...detectDangerValues, recordingBytes: "" });
      setDetectedStatus(detectedStatusData);
    },
    onError(err) {
      console.log(err);
    },
    // Live transcription needs to be updated
    refetchQueries: [
      {
        query: GET_TRANSCRIPTION_BY_USER,
        variables: { userId: user && user.id },
      },
      {
        query: GET_EVENT_RECORDINGS_BY_USER,
        variables: { userId: user && user.id },
      },
    ],
    variables: detectDangerValues,
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

      console.log("STARTED BACKGROUND RECORDING");

      setRecording(recording);
    } catch (err) {
      // console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      // Clear the current recording object
      await recording.stopAndUnloadAsync();
      setRecording(undefined);

      console.log("STOPPED BACKGROUND RECORDING");

      // Get the file just stored's local device URI
      const fileUri = recording.getURI();

      // Get the bytes of the audio file from its URI
      await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      }).then((bytes) => {
        // Call `detectDanger` with appropriate values
        if (detectedStatus === "stop") {
          setDetectDangerValues({
            ...detectDangerValues,
            recordingBytes: bytes,
          });
          detectDanger();
        }
      });
    } catch (err) {
      // console.error("Failed to stop recording", err);
    }
  }

  // Check if Audio permissions have been granted
  async function checkAudioPermissions() {
    const { status: currentStatus } = await Audio.getPermissionsAsync();
    var foundStatus = currentStatus;
    if (currentStatus !== "granted") {
      const { status } = await Audio.requestPermissionsAsync();
      foundStatus = status;
    }
    setFinalStatus(foundStatus === "granted");
  }

  // This useEffect runs every time `enabled`. `start`, `detectedStatus`, or `finalStatus`
  // changes (i.e. every `detectDanger` call, it's refreshed)
  useEffect(() => {
    checkAudioPermissions();

    // If Audio permissions have been handled...
    if (finalStatus) {
      // Alternate between stopping and starting a recording every 10 s, with a 50 ms pause to
      // avoid record conflicts -- this records 10 s long temporary background recordings

      const interval = setInterval(
        async () => {
          if (enabled && detectedStatus === "stop") {
            if (start) {
              await startRecording();
            } else {
              await stopRecording();
            }
            setStart(!start);
          }
        },
        start ? 50 : 10000 // Ternary to switch between stopping previously started recording and starting new one
      );

      if (detectedStatus === "start" || !enabled) {
        // Either a background recording has detected danger (an event recording will
        // now start) or background recordings have been disabled by the user
        stopRecording();
        setStart(true);
      }
      return () => clearInterval(interval);
    }
  }, [enabled, start, detectedStatus, finalStatus]);

  return (
    <View>
      <Image
        source={require("../images/record1.png")}
        style={styles.image}
      ></Image>
      <View style={{ paddingHorizontal: 25 }}>
        <Text style={styles.titleText}>Background Recordings</Text>

        <Text style={{ fontSize: 16, paddingBottom: 20 }}>
          Allow danger-detection against thieves and police.
        </Text>
        <View style={styles.buttonBackground}>
          <Pressable
            disabled={detectedStatus === "start"}
            onPress={async () => {
              if (expoPushToken) {
                // If we have permission, send notifications at different milestones in `detectDanger`
                await sendPushNotification({
                  expoPushToken,
                  title: "Danger Detection",
                  body: !enabled
                    ? "Your audio is currently being recorded to detect danger"
                    : "Recording audio to detect danger has been disabled",
                });
              }
              // Toggle whether or not the feature is enabled
              setEnabled(!enabled);
            }}
            style={
              detectedStatus === "start"
                ? styles.disabledCenteredView
                : ({ pressed }) => [
                    // Handle style change when button is pressed
                    {
                      shadowColor: "#2f4f4f",
                      shadowOffset: pressed
                        ? { width: 0, height: 1 }
                        : { width: 0, height: 0 },
                      shadowOpacity: pressed ? 0.8 : 0,
                      shadowRadius: pressed ? 0 : 1,
                    },
                    styles.centeredView,
                  ]
            }
          >
            <Text
              style={
                detectedStatus === "start"
                  ? styles.disabledText
                  : styles.pressableText
              }
            >
              {enabled
                ? detectedStatus == "start"
                  ? "Recording Event Now"
                  : "Disallow" // Display button message based on if enabled and the need for event recording is detected
                : detectedStatus == "start"
                ? "Recording Event Now"
                : "Allow"}
            </Text>
          </Pressable>
          <View style={styles.iconContainer}>
            <Icon
              name={
                enabled && detectedStatus != "start"
                  ? "microphone-alt"
                  : "microphone-alt-slash"
              }
              size={30}
              color="#2f4f4f"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export const DETECT_DANGER = gql`
  mutation detectDanger($recordingBytes: String!, $userId: String!) {
    detectDanger(recordingBytes: $recordingBytes, userId: $userId)
  }
`;

// Set recording options compatible with GCloud speech-to-text
export const RECORDING_OPTIONS_PRESET_HIGH_QUALITY = {
  isMeteringEnabled: true,
  android: {
    extension: ".m4a",
    sampleRate: 44100,
  },
  ios: {
    extension: ".wav",
    sampleRate: 44100,
  },
};

export default InterimRecording;
