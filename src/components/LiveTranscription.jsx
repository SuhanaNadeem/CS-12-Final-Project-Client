import { gql, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import styles from "../styles/recordStyles";

/* As event and background recordings are taken, and only if background recordings are displayed, the latest transcription of 
one of these two types of recordings' components is displayed here. 
Resources:
- https://www.google.com/search?q=remove+newlines+javascript&rlz=1C1CHBF_enCA844CA844&oq=remove+newlines+javascript&aqs=chrome..69i57.5416j0j7&sourceid=chrome&ie=UTF-8
*/

const LiveTranscription = ({ user, enabled }) => {
  // Store the fetched transcription in a state to allow refetching to work as expected

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

  return enabled ? ( // Only display if background recordings are displayed
    <View style={{ paddingHorizontal: 25 }}>
      <Text style={styles.titleText}>Live Transcription</Text>

      {currentTranscription && currentTranscription != "" ? (
        <Text style={styles.baseText}>
          {currentTranscription.replace(/(\r\n|\n|\r)/gm, "")}
        </Text>
      ) : (
        <Text style={styles.baseTextEmphasized}>No speech detected.</Text>
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
