import { gql, useQuery } from "@apollo/client";
import React from "react";
import { ScrollView } from "react-native";
import { Text, View, KeyboardAvoidingView } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import Map from "../components/Map";
import styles from "../styles/trackStyles";

/* This page allows the user to view their/their friends locations and toggle location sharing and
  refresh. See comments in `src/components` for details. */

const Track = ({ route }) => {
  const { userId } = route.params;

  const { data: { getUserById: user } = {} } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
    client: userClient,
  });

  return user ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScrollView style={styles.mapContainer}>
        <Map user={user} />
      </ScrollView>
    </KeyboardAvoidingView>
  ) : (
    <View style={styles.loadingContainer}>
      <Text>Loading...</Text>
    </View>
  );
};

export const GET_USER_BY_ID = gql`
  query getUserById($userId: String!) {
    getUserById(userId: $userId) {
      id
      email
      startKey
      stopKey
      panicKey
      friendIds
      requesterIds
      location
      locationOn
      name
    }
  }
`;

export default Track;
