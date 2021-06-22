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
} from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import Requesters from "../components/Requesters";
import Search from "../components/Search";
import AddedFriends from "../components/AddedFriends";
import Map from "../components/Map";

// import NavBar from "../components/NavBar";
import { UserAuthContext } from "../context/userAuth";

// Manage keys and other account info
const Friends = ({ route, navigation }) => {
  const { userId } = route.params;

  const { data: { getUserById: user } = {} } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
    client: userClient,
  });

  console.log("User in friends");
  console.log(user);

  return user ? (
    <ScrollView style={styles.container}>
      <Map styles={styles} user={user} />

      <Requesters styles={styles} user={user} />

      <Search styles={styles} user={user} />

      <AddedFriends styles={styles} user={user} />
    </ScrollView>
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
    // justifyContent: "center",
    flexDirection: "column",
    paddingHorizontal: 25,
  },
  button: {
    // flex: 1,
    backgroundColor: "#f50",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    color: "white",
  },
  iconAndText: {
    alignItems: "center",
    paddingVertical: 16,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 32,
    shadowRadius: 32,
    color: "white",
    backgroundColor: "#2f4f4f",
  },
  map: {
    width: Dimensions.get("window").height / 2.5,
    height: Dimensions.get("window").height / 2,
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
      friendIds
      requesterIds
      location
      name
    }
  }
`;

export default Friends;
