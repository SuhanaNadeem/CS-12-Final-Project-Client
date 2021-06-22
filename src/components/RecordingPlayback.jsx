import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import PlayShareRemove from "./PlayShareRemove";

const RecordingPlayback = ({ user, styles }) => {
  const { data: { getEventRecordingsByUser: eventRecordings } = {} } = useQuery(
    GET_EVENT_RECORDINGS_BY_USER,
    {
      variables: { userId: user && user.id },
      client: userClient,
    }
  );

  return eventRecordings ? (
    <View>
      <Text style={styles.titleText}>Saved Recordings</Text>
      {eventRecordings.map((eventRecording, index) => (
        <PlayShareRemove
          eventRecording={eventRecording}
          userId={user && user.id}
          key={index}
          createdAt={eventRecording.createdAt}
        />
      ))}
    </View>
  ) : (
    <></>
  );
};

export const GET_EVENT_RECORDINGS_BY_USER = gql`
  query getEventRecordingsByUser($userId: String!) {
    getEventRecordingsByUser(userId: $userId) {
      eventRecordingUrls
      userId
      createdAt
      id
    }
  }
`;

export default RecordingPlayback;
