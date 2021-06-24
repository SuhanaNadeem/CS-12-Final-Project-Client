import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import {
  Button,
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import Requesters from "../components/Requesters";
import Search from "../components/Search";
import AddedFriends from "../components/AddedFriends";
import styles from "../styles/friendsStyles";
import { GET_USER_BY_ID } from "../components/PotentialFriend";

// Manage keys and other account info
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

// export const GET_USER_BY_ID = gql`
//   query getUserById($userId: String!) {
//     getUserById(userId: $userId) {
//       id
//       email
//       startKey
//       stopKey
//       panicKey
//       friendIds
//       requesterIds
//       location
//       locationOn
//       name
//     }
//   }
// `;

export default Friends;
