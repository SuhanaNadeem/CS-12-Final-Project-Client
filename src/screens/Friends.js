import { useQuery } from "@apollo/client";
import React from "react";
import { ScrollView } from "react-native";
import { Text, View, KeyboardAvoidingView } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import Requesters from "../components/Requesters";
import Search from "../components/Search";
import AddedFriends from "../components/AddedFriends";
import styles from "../styles/friendsStyles";
import { GET_USER_BY_ID } from "../components/PotentialFriend";

/* This page allows the user to send friend requests, add friends who have sent them friend requests, search
for other users, and view/delete existing friends. See comments in `src/components` for details. */

const Friends = ({ route }) => {
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
      <ScrollView style={styles.container}>
        <Search user={user} />
        <Requesters user={user} />
        <AddedFriends user={user} />
      </ScrollView>
    </KeyboardAvoidingView>
  ) : (
    <View style={styles.loadingContainer}>
      <Text>Loading...</Text>
    </View>
  );
};

export default Friends;
