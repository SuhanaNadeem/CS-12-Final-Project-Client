import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text, Image } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import PlayShareRemove from "./PlayShareRemove";
import styles from "../styles/recordStyles";
import { GET_EVENT_RECORDINGS_BY_USER } from "./PlayShareRemove";

const RecordingPlayback = ({ user }) => {
  const { data: { getEventRecordingsByUser: eventRecordings } = {} } = useQuery(
    GET_EVENT_RECORDINGS_BY_USER,
    {
      variables: { userId: user && user.id },
      client: userClient,
    }
  );

  return eventRecordings ? (
    <View>
      <Image
        source={require("../images/record3.png")}
        style={styles.bodyImage}
      ></Image>
      <View style={{ paddingHorizontal: 25, marginBottom: 40 }}>
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
    </View>
  ) : (
    <></>
  );
};

export default RecordingPlayback;
