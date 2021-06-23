import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
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

import * as SMS from "expo-sms";
import LiveTranscription from "../components/LiveTranscription";
import RecordingPlayback from "../components/RecordingPlayback";

import styles from "../styles/recordStyles";

const Record = ({ route, navigation }) => {
  const { userId } = route.params;
  const { newUser } = route.params;
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);

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

  // TODO as mentioned below, this needs to be moved...
  async function sendMessage() {
    // Opens up message dialog box where user can manually enter contact + message, but the attachment is already added
    const { result } = await SMS.sendSMSAsync([], "", {
      // TODO put the current EventRecording chunk's first url
      // attachments: {
      //   uri: latestUrl, // CHANGE THIS
      //   mimeType: "audio/wav",
      //   filename: "myfile.wav",
      // },
    });
    console.log(result);
  }

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
        />
        <EventRecording
          user={user}
          styles={styles}
          detectedStatus={detectedStatus}
          setDetectedStatus={setDetectedStatus}
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
