import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Text,
  ScrollView,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import FlaggedTokens from "../components/FlaggedTokens";
import Keys from "../components/Keys";
import Logout from "../components/Logout";
import MessageInfo from "../components/MessageInfo";
import styles from "../styles/accountStyles";

// import NavBar from "../components/NavBar";
import { UserAuthContext } from "../context/userAuth";

// Manage keys and other account info
const Account = ({ route, navigation }) => {
  // TODO look at the rest of the app's *finished UI to fix the UI of this page so it's consistent
  // - *note, it's not finished yet but will be by the time you finish the features
  // Also, look at what I did with the search feature to show a "Collapse" button after someone clicks "See more"

  const { userId } = route.params;
  const { data: { getUserById: user } = {} } = useQuery(GET_USER_BY_ID, {
    variables: { userId: userId && userId },
    client: userClient,
  });

  console.log("user in acc:");
  console.log(user);

  return user ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#2f4f4f" }}
    >
      <ScrollView style={styles.container}>
        <View style={{ paddingHorizontal: 25 }}>
          <Text style={styles.titleText}>Hi, {user.name}</Text>
          <Text style={styles.baseText}>
            Here, you can manage your emergency message contact and phone, voice
            keys, and more.
          </Text>
        </View>
        <Logout navigation={navigation} />
        <MessageInfo user={user} />
        <Keys user={user} />
        <FlaggedTokens user={user} />
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
      name
      panicMessage
      startKey
      stopKey
      panicKey
      friendIds
      requesterIds
      panicPhone
    }
  }
`;

export default Account;
