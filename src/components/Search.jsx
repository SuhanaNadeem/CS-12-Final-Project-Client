import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";
import { userClient } from "../../GraphqlApolloClients";
import { View, TextInput, Button, Text } from "react-native";
import PotentialFriends from "./PotentialFriends";
import styles from "../styles/friendsStyles";
import Icon from "react-native-vector-icons/FontAwesome5";
import { GET_USER_MATCHES } from "./PotentialFriend";

const Search = ({ user }) => {
  const [name, setName] = useState("");
  const [matchedUsers, setMatchedUsers] = useState();

  const [
    getUserMatches,
    { loading, data: { getUserMatches: fetchedUsers } = {} },
  ] = useLazyQuery(GET_USER_MATCHES, {
    onCompleted() {
      setMatchedUsers(fetchedUsers);
    },
    client: userClient,
  });

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
            console.log("Enters properly");
            //   console.log(values.name);
            getUserMatches({
              variables: { name: name },
            });
            console.log("Exits properly");
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

export default Search;
