import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, StatusBar, Text, View } from "react-native";
import EventRecording from "../components/EventRecording";
import Play from "../components/Play";
import InterimRecording from "../components/InterimRecording";
import { userClient } from "../../GraphqlApolloClients";
// TODO Implement solution
// TODO get and play recordings
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
  const [enabled, setEnabled] = useState({ allowed: false, inProgress: false });
  const [detectedStatus, setDetectedStatus] = useState("stop");
  // const {
  //   data: { getEventRecordingTriggered: eventRecordingTriggered } = {},
  // } = useQuery(GET_EVENT_RECORDING_STATE, {
  //   variables: { userId },
  //   client: userClient,
  // });

  return (
    <View style={styles.container}>
      <InterimRecording
        userId={userId}
        navigation={navigation}
        enabled={enabled}
        setEnabled={setEnabled}
        styles={styles}
        detectedStatus={detectedStatus}
        setDetectedStatus={setDetectedStatus}
      />
      <EventRecording
        setSoundToPlay={setSoundToPlay}
        userId={userId}
        enabled={enabled}
        setEnabled={setEnabled}
        styles={styles}
        detectedStatus={detectedStatus}
        setDetectedStatus={setDetectedStatus}
      />

      <Button
        title="Account"
        onPress={() => {
          navigation.navigate("Account", { userId });
        }}
      />
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

export default Record;
