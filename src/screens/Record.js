import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, StatusBar, Text, ScrollView } from "react-native";
import EventRecording from "../components/EventRecording";
import Play from "../components/Play";
import InterimRecording from "../components/InterimRecording";
import { userClient } from "../../GraphqlApolloClients";
import Welcome from "../components/Welcome";

import * as SMS from "expo-sms";
import LiveTranscription from "../components/LiveTranscription";

// TODO Optimize
// TODO get and play recordings (group events fix and play together)
// TODO page where you can see flagged tokens and add
// TODO call/record on panic
// TODO maps to see friends, if enabled, if panic, etc

/*
  enable interim recordings
  detectDanger
    transcribe interim recording
    if user start key is detectedStatus
      return true
    else if police is detectedStatus
      return true
    else if thief is detectedStatus
      return true 
  detectedStatus is set to true (passed to EventRecording.jsx)
  useEffect in EventRecording checks it's detectedStatus, so starts and stops every 30 seconds
  startRecording/stopRecording for event needs to record the entire thing until they say stop/panic
*/

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

  const [soundToPlay, setSoundToPlay] = useState();
  const [detectedStatus, setDetectedStatus] = useState("stop");

  const { data: { getEventRecordingsByUser: eventRecordings } = {} } = useQuery(
    GET_EVENT_RECORDINGS_BY_USER,
    {
      variables: { userId },
      client: userClient,
    }
  );

  const { data: { getUserById: user } = {} } = useQuery(GET_USER_BY_ID, {
    variables: { userId: userId && userId },
    client: userClient,
  });

  // TODO as mentioned below, this needs to be moved...
  async function sendMessage() {
    // Opens up message dialog box where user can manually enter contact + message, but the attachment is already added
    const { result } = await SMS.sendSMSAsync([], "", {
      // TODO put the current EventRecording chunk's last url?
      // attachments: {
      //   uri: latestUrl,
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
        setSoundToPlay={setSoundToPlay}
        user={user}
        styles={styles}
        detectedStatus={detectedStatus}
        setDetectedStatus={setDetectedStatus}
      />
      {/* TODO move the mapping in a separate component and call it here */}
      {/* {eventRecordings &&
        eventRecordings.map((eventRecording, index) => (
          <Play key={index} eventRecording={eventRecording} userId={userId} />
        ))} */}
      {/* TODO move this and the associated mutation next to each EventRecording's play/pause/stop/delete buttons */}
      {/* <Button onPress={sendMessage} title="Share" /> */}

      <LiveTranscription user={user} styles={styles} enabled={enabled} />
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
      friendIds
      requesterIds
      panicPhone
    }
  }
`;
export const GET_EVENT_RECORDINGS_BY_USER = gql`
  query getEventRecordingsByUser($userId: String!) {
    getEventRecordingsByUser(userId: $userId) {
      eventRecordingUrls
      userId
      id
    }
  }
`;

export default Record;
