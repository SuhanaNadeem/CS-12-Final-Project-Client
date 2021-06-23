import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import AddedFriend from "./AddedFriend";
import styles from "../styles/friendsStyles";
import { GET_FRIENDS } from "./AddedFriend";

const AddedFriends = ({ user }) => {
  const [values, setValues] = useState({ userId: user && user.id });
  const { data: { getFriends: friends } = {} } = useQuery(GET_FRIENDS, {
    variables: values,
    client: userClient,
  });

  console.log("in friends:");
  console.log(friends);
  return user && friends ? (
    <View style={{ paddingHorizontal: 25, marginBottom: 40 }}>
      <Text style={styles.titleText}>Your Friends</Text>
      <Text style={[styles.baseText, { paddingBottom: 30 }]}>
        Unfriend added users here.
      </Text>
      {friends.map((friend, index) => (
        <AddedFriend key={index} friend={friend} user={user} />
      ))}
    </View>
  ) : (
    <View></View>
  );
};

export default AddedFriends;
