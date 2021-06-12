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
  const [enabled, setEnabled] = useState({ allowed: false, inProgress: false });

  const {
    data: { getEventRecordingState: eventRecordingState } = {},
  } = useQuery(GET_EVENT_RECORDING_STATE, {
    variables: { userId },
    client: userClient,
  });

  return (
    <View>
      {!eventRecordingState && (
        <GCloudDetector
          userId={userId}
          navigation={navigation}
          enabled={enabled}
          setEnabled={setEnabled}
        />
      )}
      <Record
        setSoundToPlay={setSoundToPlay}
        userId={userId}
        enabled={enabled}
        setEnabled={setEnabled}
      />

      <Button
        title="Account"
        onPress={() => {
          navigation.navigate("Account", { userId });
        }}
      />
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
