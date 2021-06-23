import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect, useRef } from "react";
import { Button, View, Text, Image, Pressable } from "react-native";
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
import * as Location from "expo-location";
import { GET_TRANSCRIPTION_BY_USER } from "./LiveTranscription";
import { GET_EVENT_RECORDINGS_BY_USER } from "./RecordingPlayback";
import styles from "../styles/record";

// TODO For me - get the event recording group refetch to work

const EventRecording = ({ user, detectedStatus, setDetectedStatus }) => {
  const [latestUrl, setLatestUrl] = useState();

  const [sendTwilioSMS, loadingSendPhoneCode] = useMutation(SEND_TWILIO_SMS, {
    update(_, { data: { sendTwilioSMS: message } }) {
      console.log(message);
      console.log("sendTwilioSMS successful");
    },
    onError(err) {
      console.log(user.panicMessage);
      console.log(user.panicPhone);
      console.log(err);
    },
    variables: {
      message: user && user.panicMessage,
      // TODO once you get location working in Map.jsx, make this the message:
      // message: user && user.panicMessage + ` Sent from ${user.location}.`,

      phoneNumber: user && user.panicPhone,
      eventRecordingUrl: latestUrl && latestUrl != "" && latestUrl,
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
    client: userClient,
  });

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

  // const [values, setValues] = useState({ userId, eventRecordingUrl: "" });
  const [values, setValues] = useState({
    userId: user && user.id,
    eventRecordingFileKey: "",
    recordingBytes: "",
  });
  const [start, setStart] = useState(true);
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
    refetchQueries: [
      {
        query: GET_TRANSCRIPTION_BY_USER,
        variables: { userId: user && user.id },
      },
    ],
    onError(err) {
      console.log(err);
    },
    variables: values,
    client: userClient,
  });

  const [recording, setRecording] = useState();

  // TODO: For me - RUNS IT TWICE THE FIRST TIME

  async function startRecording() {
    try {
      console.log("event's startRecording is detectedStatus");
      console.log(detectedStatus);

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
      // console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
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
            setLatestUrl(response.body.postResponse.location);

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
      });

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
    } catch (err) {
      // console.error("Failed to stop recording", err);
    }
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
      start ? 50 : 15000
    );

    if (detectedStatus === "stop") {
      console.log("useeffect found detectedStatus is stop, without panic");
      // if (recording) {
      stopRecording();
      // }
      setStart(true);
    } else if (detectedStatus === "panic") {
      console.log("useeffect found detectedStatus is panic");
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
        <Text style={styles.baseText}>
          You can manually start a recording below, when you anticipate danger.
        </Text>
        <Text style={styles.baseText}>
          You can also say your 'start' key or rely on our danger-detection in
          this case, if you've allowed background recordings.
        </Text>
      </View>

      <Pressable
        style={styles.centeredView}
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
        }}
      >
        <Text style={styles.pressableText}>
          {detectedStatus == "start" ? "Stop" : "Start"}
        </Text>
      </Pressable>
    </View>
  ) : (
    <Text>Loading...</Text>
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
      email
      startKey
      stopKey
      panicKey
      panicMessage
      panicPhone
      name
      requesterIds
      friendIds
    }
  }
`;

export const SEND_TWILIO_SMS = gql`
  mutation sendTwilioSMS(
    $message: String!
    $phoneNumber: String!
    $eventRecordingUrl: String
  ) {
    sendTwilioSMS(
      message: $message
      phoneNumber: $phoneNumber
      eventRecordingUrl: $eventRecordingUrl
    )
  }
`;

export default EventRecording;
