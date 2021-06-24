import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Text, ScrollView, View, KeyboardAvoidingView } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import FlaggedTokens from "../components/FlaggedTokens";
import Keys from "../components/Keys";
import Logout from "../components/Logout";
import MessageInfo from "../components/MessageInfo";
import styles from "../styles/accountStyles";

/* This page allows the user to log out, configure their 'panic' contact info, set their voice keys, and view the
flagged tokens in our growing database. See comments in `src/components` for details. */

const Account = ({ route, navigation }) => {
  const { userId } = route.params; // Grab the userId from the route, passed on navigate
  const { data: { getUserById: user } = {} } = useQuery(GET_USER_BY_ID, {
    variables: { userId: userId && userId },
    client: userClient,
  });

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
