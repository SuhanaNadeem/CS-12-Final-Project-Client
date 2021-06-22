import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, StatusBar, Text, ScrollView } from "react-native";
import EventRecording from "../components/EventRecording";
import InterimRecording from "../components/InterimRecording";
import { userClient } from "../../GraphqlApolloClients";
import Welcome from "../components/Welcome";

import * as SMS from "expo-sms";
import LiveTranscription from "../components/LiveTranscription";
import RecordingPlayback from "../components/RecordingPlayback";

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
    <ScrollView style={styles.container}>
      <Welcome
        userId={userId}
        welcomeOpen={welcomeOpen}
        setWelcomeOpen={setWelcomeOpen}
        styles={styles}
      />
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
      <LiveTranscription user={user} styles={styles} enabled={enabled} />
      <RecordingPlayback user={user} styles={styles} />
      {/* TODO move this and the associated mutation next to each EventRecording's play/pause/stop/delete buttons in PlayShareRemove.jsx*/}
      {/* <Button onPress={sendMessage} title="Share" /> */}
    </ScrollView>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    flexDirection: "column",
    paddingHorizontal: 25,
  },

  baseText: {
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 30,
    paddingBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 60,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2f4f4f",
    marginTop: 15,
  },
  textStyle: {
    color: "white",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
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
