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
import styles from "../styles/record";

const InterimRecording = ({
  user,
  detectedStatus,
  setDetectedStatus,
  enabled,
  setEnabled,
}) => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

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

  useEffect(() => {
    console.log("ennterin");
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
    // TODO For me - fix this: to configure permissions as of now, you might need to uncomment the following line and
    // comment everything else in this useEffect, grant permissions through the phone, and then change it back to this original
    // commenting state
    // startRecording();
  }, [enabled, start, detectedStatus]);

  return (
    <View>
      <Image
        source={require("../images/record1.png")}
        style={styles.image}
      ></Image>
      <View style={{ paddingHorizontal: 25 }}>
        <Text style={styles.titleText}>Background Recordings</Text>
        <Text style={styles.baseText}>
          If misconduct is detected in these recordings, an Event Recording is
          triggered and stored for future reference. Background recordings
          themselves are not stored.
        </Text>
        <Text style={styles.baseText}>
          Allow thief-, police-, and other danger-detection.
        </Text>
      </View>
      <Pressable
        disabled={detectedStatus === "start"}
        onPress={async () => {
          if (expoPushToken) {
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
        style={styles.centeredView}
      >
        <Text style={styles.pressableText}>
          {enabled
            ? detectedStatus == "start"
              ? "In Progress"
              : "Disallow"
            : detectedStatus == "start"
            ? "In Progress"
            : "Allow"}
        </Text>
      </Pressable>

      {enabled && (
        <View style={styles.gifBackground}>
          <Image
            source={require("../images/interim.gif")}
            style={styles.gif}
          ></Image>
        </View>
      )}
      <StatusBar style="light" />
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
