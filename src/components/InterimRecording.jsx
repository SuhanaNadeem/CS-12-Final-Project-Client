import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Audio } from "expo-av";
import { RNS3 } from "react-native-aws3";
import {
  Button,
  StyleSheet,
  StatusBar,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "../util/notifications";
import { GET_TRANSCRIPTION_BY_USER } from "./LiveTranscription";
import { GET_EVENT_RECORDINGS_BY_USER } from "./RecordingPlayback";
import styles from "../styles/recordStyles";
import Icon from "react-native-vector-icons/FontAwesome5";

const InterimRecording = ({
  user,
  detectedStatus,
  setDetectedStatus,
  enabled,
  setEnabled,
  expoPushToken,
}) => {
  const [values, setValues] = useState({
    userId: user && user.id,
    recordingBytes: "",
  });

  const [recording, setRecording] = useState();
  const [start, setStart] = useState(true);

  const [detectDanger, loadingDetectDanger] = useMutation(DETECT_DANGER, {
    update(_, { data: { detectDanger: detectedStatusData } }) {
      console.log("Submitted interim recording");
      setValues({ ...values, recordingBytes: "" });
      setDetectedStatus(detectedStatusData);
    },
    onError(err) {
      console.log("Unsuccessful");
      console.log(err);
    },
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
    variables: values,
    client: userClient,
  });

  async function startRecording() {
    try {
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
      console.log("******************** START RECORDING: " + Date());

      setRecording(recording);
    } catch (err) {
      // console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync();
      setRecording(undefined);

      console.log("******************** STOP RECORDING: " + Date());

      const fileUri = recording.getURI();

      await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      }).then((bytes) => {
        console.log("detected");
        console.log(detectedStatus);
        if (detectedStatus === "stop") {
          setValues({
            ...values,
            recordingBytes: bytes,
          });

          detectDanger();
        }
      });
    } catch (err) {
      // console.error("Failed to stop recording", err);
    }
  }

  const [finalStatus, setFinalStatus] = useState(false);
  async function checkStatus() {
    const { status: currentStatus } = await Audio.getPermissionsAsync();
    if (currentStatus !== "granted") {
      await Audio.requestPermissionsAsync();
    }
    setFinalStatus(true);
  }

  useEffect(() => {
    console.log("ennterin");
    // const { status } = Permissions.getAsync(Permissions.AUDIO_RECORDING);
    checkStatus();
    if (finalStatus) {
      const interval = setInterval(
        async () => {
          if (
            enabled &&
            // !enabled.inProgress &&
            detectedStatus === "stop"
          ) {
            if (start) {
              // console.log(1);
              await startRecording();
            } else {
              // console.log(2);
              await stopRecording();
            }
            setStart(!start);
          }
        },
        start ? 50 : 10000
      );

      // if (!enabled.allowed && !enabled.inProgress && detectedStatus === "stop") {
      if (detectedStatus === "start" || !enabled) {
        // if (recording) {
        stopRecording();
        // }
        setStart(true);
        // setRecording(undefined);
      }

      return () => clearInterval(interval);
    }
    // startRecording();
  }, [enabled, start, detectedStatus, finalStatus]);

  return (
    <View>
      <Image
        source={require("../images/record1.png")}
        style={styles.image}
      ></Image>
      <View style={{ paddingHorizontal: 25 }}>
        <Text style={styles.titleText}>Background Recordings</Text>
        {/* <Text style={styles.baseText}>
          If misconduct is detected in the background, an event recording is
          triggered and stored for future reference. Background recordings
          themselves are not stored.
        </Text>*/}
        <Text style={{ fontSize: 16, paddingBottom: 20 }}>
          Allow danger-detection against thieves and police.
        </Text>
        <View style={styles.buttonBackground}>
          <Pressable
            disabled={detectedStatus === "start"}
            onPress={async () => {
              if (expoPushToken) {
                console.log("ENTERS THIS");
                await sendPushNotification({
                  expoPushToken,
                  title: "Danger Detection",
                  body: !enabled
                    ? "Your audio is currently being recorded to detect danger"
                    : "Recording audio to detect danger has been disabled",
                });
              }
              setEnabled(!enabled);
            }}
            style={
              detectedStatus === "start"
                ? styles.disabledCenteredView
                : ({ pressed }) => [
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
                  ? "In-Progress"
                  : "Disallow"
                : detectedStatus == "start"
                ? "In-Progress"
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
