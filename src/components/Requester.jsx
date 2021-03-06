import { gql, useMutation } from "@apollo/client";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { GET_FRIENDS } from "./AddedFriend";
import styles from "../styles/friendsStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

/* A component used by the Requester component that allows a user to add another user who has requested to friend them.
  Utilizes the addFriend mutation to accept friend requests and add their userIds to the user's friendIds */

const Requester = ({ requester, user }) => {
  const [addFriend] = useMutation(ADD_FRIEND, {
    // update() {
    //   console.log("Submitted addFriend");
    // },
    onError(err) {
      console.log(err);
    },
    // Refetch to update other friend displays
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
      <View style={styles.iconContainer}>
        <Icon name={"account-plus"} size={30} color="#2f4f4f" />
      </View>
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

export const GET_FRIEND_REQUESTS = gql`
  query getFriendRequests($userId: String!) {
    getFriendRequests(userId: $userId) {
      id
      email
      startKey
      stopKey
      name
      panicKey
    }
  }
`;
export default Requester;
