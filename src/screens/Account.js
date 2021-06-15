import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Button, Text, View, TextInput, StyleSheet } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import Keys from "../components/Keys";
// import NavBar from "../components/NavBar";
import { UserAuthContext } from "../context/userAuth";

// Manage keys and other account info
const Account = ({ route, navigation }) => {
  const { userId } = route.params;

  const { data: { getUserById: user } = {} } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
    client: userClient,
  });

  return user ? (
    <View style={styles.container}>
      <Keys styles={styles} user={user} />
      <FlaggedTokens styles={styles} user={user} />
    </View>
  ) : (
    <View>
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    paddingHorizontal: 25,
  },
  button: {
    // flex: 1,
    backgroundColor: "#f50",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  baseText: {
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 30,
    paddingBottom: 10,
  },
});

export const GET_USER_BY_ID = gql`
  query getUserById($userId: String!) {
    getUserById(userId: $userId) {
      id
      email
      startKey
      stopKey
      panicKey
    }
  }
`;
export default Account;
