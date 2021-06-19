import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, StatusBar, Text, View } from "react-native";
import EventRecording from "../components/EventRecording";
import Play from "../components/Play";
import InterimRecording from "../components/InterimRecording";
import { userClient } from "../../GraphqlApolloClients";

import * as SMS from "expo-sms";

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
  const [soundToPlay, setSoundToPlay] = useState();
  const [detectedStatus, setDetectedStatus] = useState("stop");
  // const {
  //   data: { getEventRecordingTriggered: eventRecordingTriggered } = {},
  // } = useQuery(GET_EVENT_RECORDING_STATE, {
  //   variables: { userId },
  //   client: userClient,
  // });
  const { data: { getUserById: user } = {} } = useQuery(GET_USER_BY_ID, {
    variables: { userId: userId && userId },
    client: userClient,
  });

  // TODO as mentioned below, this needs to be moved...
  async function sendMessage() {
    // Opens up message dialog box where user can manually enter contact + message, but the attachment is already added
    const { result } = await SMS.sendSMSAsync({
      // TODO put the current EventRecording chunk's last url?
      // attachments: {
      //   uri: latestUrl,
      //   mimeType: "audio/wav",
      //   filename: "myfile.wav",
      // },
    });
    console.log(result);
  }

  return (
    <View style={styles.container}>
      <InterimRecording
        userId={userId}
        navigation={navigation}
        styles={styles}
        detectedStatus={detectedStatus}
        setDetectedStatus={setDetectedStatus}
      />
      <EventRecording
        setSoundToPlay={setSoundToPlay}
        userId={userId}
        styles={styles}
        detectedStatus={detectedStatus}
        setDetectedStatus={setDetectedStatus}
      />
      {/* TODO: incorporate this into each EventRecording chunk display (i.e. move the 
        sendMessage stuff into your mapped eventrecording chunk component), setting the file uri appropriately */}
      {user && <Button onPress={sendMessage} title="Share" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    paddingHorizontal: 25,
  },
  button: {
    // flex: 1,
    backgroundColor: "#f50",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
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
});
export const GET_USER_BY_ID = gql`
  query getUserById($userId: String!) {
    getUserById(userId: $userId) {
      id
      email
      startKey
      stopKey
      panicKey
      name
      requesterIds
      friendIds
      panicMessage
      shareMessage
      panicPhone
    }
  }
`;
export default Record;
