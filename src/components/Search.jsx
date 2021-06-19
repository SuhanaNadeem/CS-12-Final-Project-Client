import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";
import { userClient } from "../../GraphqlApolloClients";
import { View, TextInput, Button, Text } from "react-native";
import PotentialFriends from "./PotentialFriends";

const Search = ({ user, styles }) => {
  console.log("Enters Search bar");
  const [name, setName] = useState("");
  const [matchedUsers, setMatchedUsers] = useState();

  //   const [getUserMatches, { data: { getUserMatches: matchedUsers } = {} }] = useQuery(
  //     GET_USER_MATCHES,
  //     {
  //       variables: { name },
  //       client: userClient,
  //     }
  //   );
  const [
    getUserMatches,
    { loading, data: { getUserMatches: fetchedUsers } = {} },
  ] = useLazyQuery(GET_USER_MATCHES, {
    // variables: { name: values.name },
    // update(_) {
    //   console.log("Got users");
    //   setName("");
    // },
    onCompleted() {
      console.log("Got users");
      //   console.log(matchedUsers.length);
      //   setName("");
      setMatchedUsers(fetchedUsers);
    },
    client: userClient,
  });

  return (
    <View>
      <Text style={styles.titleText}>Send Friend Requests</Text>
      <Text style={styles.baseText}>
        Request users to be friends. Note that when you make your location
        visible, your friends will be able to see it, in case of an emergency.
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: "flex",
        }}
      >
        <TextInput
          onChangeText={(text) => setName(text)}
          value={name}
          style={{ overflow: "hidden" }}
          placeholder={"Search users here"}
        />
        <Button
          onPress={() => {
            console.log("Enters properly");
            //   console.log(values.name);
            getUserMatches({
              variables: { name: name },
            });
            console.log("Exits properly");
          }}
          title="Search"
        />
      </View>
      {matchedUsers && matchedUsers.length != 0 ? (
        <PotentialFriends
          matchedUsers={matchedUsers}
          styles={styles}
          user={user}
        />
      ) : (
        matchedUsers &&
        matchedUsers.length == 0 && (
          <Text style={(styles.bodyText, { justifyContent: "center" })}>
            No matches
          </Text>
        )
      )}
      {matchedUsers && (
        <Button
          onPress={() => {
            setMatchedUsers();
            setName("");
          }}
          title="Clear Search"
        />
      )}
    </View>
  );
};

export const GET_USER_MATCHES = gql`
  query getUserMatches($name: String!) {
    getUserMatches(name: $name) {
      name
      email
      id
      requesterIds
      friendIds
    }
  }
`;

export default Search;
