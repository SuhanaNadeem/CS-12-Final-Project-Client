import { gql, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../styles/recordStyles";

const LiveTranscription = ({ user, enabled }) => {
  const [currentTranscription, setCurrentTranscription] = useState("");

  var { data: { getTranscriptionByUser: transcription } = {} } = useQuery(
    GET_TRANSCRIPTION_BY_USER,
    {
      variables: { userId: user && user.id },
      client: userClient,
    }
  );
  useEffect(() => {
    setCurrentTranscription(transcription);
  }, [transcription]);
  console.log("Inside live transcri");
  console.log(transcription);

  return enabled ? (
    <View style={{ paddingHorizontal: 25 }}>
      <Text style={styles.titleText}>Live Transcription</Text>
      {currentTranscription && currentTranscription != "" ? (
        <Text style={styles.baseText}>
          {currentTranscription.replace(/(\r\n|\n|\r)/gm, "")}
        </Text>
      ) : (
        <Text style={styles.baseTextEmphasized}>No speaking detected.</Text>
      )}
    </View>
  ) : (
    <></>
  );
};

export const GET_TRANSCRIPTION_BY_USER = gql`
  query getTranscriptionByUser($userId: String!) {
    getTranscriptionByUser(userId: $userId)
  }
`;

export default LiveTranscription;
