import { gql, useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { userClient } from "../../GraphqlApolloClients";
import { View, TextInput, Text } from "react-native";
import PotentialFriends from "./PotentialFriends";
import styles from "../styles/friendsStyles";
import Icon from "react-native-vector-icons/FontAwesome5";
// import { GET_USER_MATCHES } from "./PotentialFriend";

/* The Search component is displayed in the Friends screen of the app and is used to search through the database
  of users to add friends. This component uses the getUserMatches query to find users in the database matching
  the search terms, and displays them to the user who will have the option to add them. */

const Search = ({ user }) => {
  const [name, setName] = useState("");
  const [matchedUsers, setMatchedUsers] = useState();

  const [
    getUserMatches,
    { data: { getUserMatches: fetchedUsers } = {} },
  ] = useLazyQuery(GET_USER_MATCHES, {
    onCompleted() {
      setMatchedUsers(fetchedUsers);
    },
    client: userClient,
  }); // Use a lazy query to be able to call the query when the search field is entered

  return (
    <View style={{ paddingHorizontal: 25 }}>
      <Text style={styles.titleText}>Send Friend Requests</Text>
      <Text style={styles.baseText}>
        When you make your location visible, your friends will be able to see it
        in case of an emergency.
      </Text>
      <View style={styles.searchBar}>
        <TextInput
          style={{ color: "white", fontSize: 16, overflow: "hidden" }}
          onChangeText={(text) => setName(text)}
          value={name}
          placeholder={"Search users here"}
          placeholderTextColor="white"
        />

        <Icon
          onPress={() => {
            getUserMatches({
              variables: { name: name },
            });
          }}
          name="search"
          size={25}
          color="white"
        />
      </View>
      {matchedUsers && matchedUsers.length != 0 ? (
        <PotentialFriends name={name} matchedUsers={matchedUsers} user={user} />
      ) : (
        matchedUsers &&
        matchedUsers.length == 0 && (
          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontStyle: "italic",
                paddingBottom: 18,
              }}
            >
              No matches
            </Text>
          </View>
        )
      )}
      {matchedUsers && (
        <View
          style={{
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 40,
          }}
        >
          <Icon
            onPress={() => {
              setMatchedUsers();
              setName("");
            }}
            size={40}
            color="#2f4f4f"
            name="times"
          />
        </View>
      )}
    </View>
  );
};

export const GET_USER_MATCHES = gql`
  query getUserMatches($name: String!) {
    getUserMatches(name: $name) {
      id
      name
      password
      email
      startKey
      panicKey
      stopKey
      createdAt
      token
      location
      locationOn
      friendIds
      requesterIds
      panicMessage
      panicPhone
    }
  }
`;

export default Search;
