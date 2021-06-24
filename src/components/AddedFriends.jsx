import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import AddedFriend from "./AddedFriend";
import styles from "../styles/friendsStyles";
import { GET_FRIENDS } from "./AddedFriend";

/* Map each user that has already been added as a friend by the current user. */

const AddedFriends = ({ user }) => {
  const { data: { getFriends: friends } = {} } = useQuery(GET_FRIENDS, {
    variables: { userId: user && user.id },
    client: userClient,
  });

  // Store queried friends in a useState to allow other components' refetchQueries to function
  const [fetchedFriends, setFetchedFriends] = useState();
  useEffect(() => {
    setFetchedFriends(friends);
  }, [friends]);

  return user && fetchedFriends ? (
    <View style={{ paddingHorizontal: 25, marginBottom: 40 }}>
      <Text style={styles.titleText}>Your Friends</Text>
      <Text style={[styles.baseText, { paddingBottom: 30 }]}>
        Unfriend added users here.
      </Text>
      {fetchedFriends.map((friend, index) => (
        <AddedFriend key={index} friend={friend} user={user} />
      ))}
    </View>
  ) : (
    <></>
  );
};

export default AddedFriends;
