import { useQuery } from "@apollo/client";
import React from "react";
import { View, Text, Image } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import PlayShareRemove from "./PlayShareRemove";
import styles from "../styles/recordStyles";
import { GET_EVENT_RECORDINGS_BY_USER } from "./PlayShareRemove";

/* A component responsible for listing all EventRecording objects that are associated with the current user,
and creating PlayShareRemove components for the user to interact with each recording. Utilizes the getEventRecordingsByUser
query in order to grab all EventRecordings associated with the passed user. */

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
