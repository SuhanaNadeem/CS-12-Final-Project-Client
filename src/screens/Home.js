import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, StatusBar, Text, View } from "react-native";
import Record, { GET_EVENT_RECORDING_STATE } from "../components/Record";
import Play from "../components/Play";
import GCloudDetector from "../components/GCloudDetector";
import { userClient } from "../../GraphqlApolloClients";

const Home = ({ route, navigation }) => {
  const { userId } = route.params;
  const [soundToPlay, setSoundToPlay] = useState();

  const {
    data: { getEventRecordingState: eventRecordingState } = {},
  } = useQuery(GET_EVENT_RECORDING_STATE, {
    variables: { userId },
    client: userClient,
  });

  // User home page (where recordings are triggered, previous are shown,
  //   graphic/button to toggle "listening"/not)
  return (
    <View>
      <Text>RECORDINGS</Text>
      <Text>Start, stop, and view your recordings here.</Text>
      <Record setSoundToPlay={setSoundToPlay} userId={userId} />
      {!eventRecordingState && (
        <View>
          <Text>DETECTING DANGERS</Text>
          <Text>Start, stop, and view your recordings here.</Text>
          <GCloudDetector userId={userId} navigation={navigation} />
        </View>
      )}
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  button: {
    // flex: 1,
    backgroundColor: "#f50",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
});

export default Home;
