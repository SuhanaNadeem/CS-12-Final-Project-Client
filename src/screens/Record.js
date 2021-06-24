import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  ScrollView,
} from "react-native";
import EventRecording from "../components/EventRecording";
import InterimRecording from "../components/InterimRecording";
import { userClient } from "../../GraphqlApolloClients";
import Welcome from "../components/Welcome";
import * as Notifications from "expo-notifications";
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "../util/notifications";

import * as SMS from "expo-sms";
import LiveTranscription from "../components/LiveTranscription";
import RecordingPlayback from "../components/RecordingPlayback";

import styles from "../styles/recordStyles";

const Record = ({ route, navigation }) => {
  const { userId } = route.params;
  const { newUser } = route.params;
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);

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
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

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
  }, [notification]);

  useEffect(() => {
    if (newUser) {
      setWelcomeOpen(true);
    }
  }, [newUser]);

  const [detectedStatus, setDetectedStatus] = useState("stop");

  const { data: { getUserById: user } = {} } = useQuery(GET_USER_BY_ID, {
    variables: { userId: userId && userId },
    client: userClient,
  });

  return user ? (
    <>
      <ScrollView style={styles.container}>
        <Welcome
          userId={userId}
          welcomeOpen={welcomeOpen}
          setWelcomeOpen={setWelcomeOpen}
          styles={styles}
        />
        <LiveTranscription user={user} styles={styles} enabled={enabled} />

        <InterimRecording
          user={user}
          navigation={navigation}
          styles={styles}
          detectedStatus={detectedStatus}
          setDetectedStatus={setDetectedStatus}
          enabled={enabled}
          setEnabled={setEnabled}
          expoPushToken={expoPushToken}
        />
        <EventRecording
          user={user}
          styles={styles}
          detectedStatus={detectedStatus}
          setDetectedStatus={setDetectedStatus}
          expoPushToken={expoPushToken}
        />
        <RecordingPlayback user={user} styles={styles} />
      </ScrollView>
    </>
  ) : (
    <></>
  );
};

export const GET_USER_BY_ID = gql`
  query getUserById($userId: String!) {
    getUserById(userId: $userId) {
      id
      email
      name
      panicMessage
      startKey
      stopKey
      panicKey
      location
      friendIds
      requesterIds
      panicPhone
    }
  }
`;

export default Record;
