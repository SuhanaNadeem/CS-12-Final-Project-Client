import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text, Pressable } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { GET_FRIENDS } from "./AddedFriend";
import { GET_FRIEND_REQUESTS } from "./Requesters";
import styles from "../styles/friendsStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Requester = ({ requester, user }) => {
  const [addFriend, loadingAddFriend] = useMutation(ADD_FRIEND, {
    update(_, { data: { addFriend: sendFriendRequestData } }) {
      console.log("Submitted addFriend");
    },
    onError(err) {
      console.log("Didnt submit addFriend");
      console.log(err);
    },
    refetchQueries: [
      {
        query: GET_USER_BY_ID,
        variables: { userId: user && user.id },
      },
      {
        query: GET_FRIENDS,
        variables: { userId: user && user.id },
      },
      {
        query: GET_FRIEND_REQUESTS,
        variables: { userId: user && user.id },
      },
    ],
    variables: {
      userId: user && user.id,
      requesterId: requester && requester.id,
    },
    client: userClient,
  });

  return user && requester ? (
    <Pressable
      onPress={() => {
        addFriend();
      }}
      style={styles.card}
    >
      <View style={{ flexDirection: "column", color: "white" }}>
        <Text style={styles.cardText}>{requester.name}</Text>
        <Text style={{ fontSize: 15 }}>Add Friend</Text>
      </View>
      <Icon name={"account-plus"} size={30} color="#2f4f4f" />
    </Pressable>
  ) : (
    <></>
  );
};

export const ADD_FRIEND = gql`
  mutation addFriend($requesterId: String!, $userId: String!) {
    addFriend(requesterId: $requesterId, userId: $userId)
  }
`;

export const GET_USER_BY_ID = gql`
  query getUserById($userId: String!) {
    getUserById(userId: $userId) {
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

export default Requester;
