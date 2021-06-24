import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState, useRef } from "react";
import { ScrollView } from "react-native";
import EventRecording from "../components/EventRecording";
import InterimRecording from "../components/InterimRecording";
import { userClient } from "../../GraphqlApolloClients";
import Welcome from "../components/Welcome";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../util/notifications";
import LiveTranscription from "../components/LiveTranscription";
import RecordingPlayback from "../components/RecordingPlayback";
import styles from "../styles/recordStyles";

/* This page allows the user to start event and background recordings through speech-to-text and various
  other analyses. See comments in `src/components` for details. */

const Record = ({ route, navigation }) => {
  const { userId } = route.params; // Grab user info from the route
  const { newUser } = route.params;

  const [welcomeOpen, setWelcomeOpen] = useState(false); // Open the welcome modal if applicable

  const [enabled, setEnabled] = useState(false); // Global state that checks if background recordings are enabled
  const [detectedStatus, setDetectedStatus] = useState("stop"); // Global state that checks the state of event recordings, set after calls to danger detection mutations

  const { data: { getUserById: user } = {} } = useQuery(GET_USER_BY_ID, {
    variables: { userId: userId && userId },
    client: userClient,
  });

  // Lines 32-72 set up push notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // States required for push notification configuration
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

  // Open the welcome modal if needed
  useEffect(() => {
    if (newUser) {
      setWelcomeOpen(true);
    }
  }, [newUser]);

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
