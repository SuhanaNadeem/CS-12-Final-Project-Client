import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import AddedFriend from "./AddedFriend";

const AddedFriends = ({ user, styles }) => {
  const [values, setValues] = useState({ userId: user && user.id });
  const { data: { getFriends: friends } = {} } = useQuery(GET_FRIENDS, {
    variables: values,
    client: userClient,
  });

  console.log("in friends:");
  console.log(friends);
  return user && friends ? (
    <View>
      <Text style={styles.titleText}>Your Friends</Text>
      {friends.map((friend, index) => (
        <AddedFriend key={index} friend={friend} styles={styles} user={user} />
      ))}
    </View>
  ) : (
    <View></View>
  );
};

export const GET_FRIENDS = gql`
  query getFriends($userId: String!) {
    getFriends(userId: $userId) {
      id
      email
      startKey
      stopKey
      panicKey
      name
      requesterIds
      friendIds
    }
  }
`;

export default AddedFriends;
