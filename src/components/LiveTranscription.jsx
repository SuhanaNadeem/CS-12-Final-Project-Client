import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const LiveTranscription = ({ user, styles, enabled }) => {
  const { data: { getTranscriptionByUser: transcription } = {} } = useQuery(
    GET_TRANSCRIPTION_BY_USER,
    {
      variables: { userId: user && user.id },
      client: userClient,
    }
  );

  return enabled ? (
    <View>
      <Text style={styles.titleText}>Live Transcription</Text>

      {transcription && transcription != "" ? (
        <Text style={styles.baseText}>{transcription.replace(/(\r\n|\n|\r)/gm,"")}</Text>
      ) : (
        <Text style={(styles.baseText, { fontStyle: "italic" })}>
          No speaking detected.
        </Text>
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
