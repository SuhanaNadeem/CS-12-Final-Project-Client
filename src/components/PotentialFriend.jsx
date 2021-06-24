import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import styles from "../styles/friendsStyles";
import Icon from "react-native-vector-icons/FontAwesome";

/* Used by PotentialFriends.jsx to display individual users from a list of search results and give the user the option to
 send a friend request to those users. Utilizes the `sendFriendRequest` mutation to add the current user to their potential friend's
 requesterIds. */

function PotentialFriend({ name, matchedUser, user }) {
  const [values, setValues] = useState({
    requesterId: user && user.id,
    receiverId: "",
  });
  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST, {
    update() {
      setValues({
        ...values,
        receiverId: "",
      }); // Reset the receiver ID
    },
    onError(err) {
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
      {
        query: GET_USER_MATCHES,
        variables: { name: name && name },
      },
    ],
    variables: values,
    client: userClient,
  });
  return user && matchedUser ? (
    <Pressable
      onPress={async () => {
        await setValues({ ...values, receiverId: matchedUser.id });
        sendFriendRequest();
      }}
      disabled={
        (matchedUser && matchedUser.requesterIds.includes(user.id)) ||
        user.friendIds.includes(matchedUser.id)
          ? true
          : false // Button is disabled if the user is already friends with this user or has already requested to be
      }
      style={({ pressed }) => [
        {
          shadowColor: "#2f4f4f",
          shadowOffset: pressed
            ? { width: 0, height: 1 }
            : { width: 0, height: 0 },
          shadowOpacity: pressed ? 0.8 : 0,
          shadowRadius: pressed ? 0 : 1,
        }, // Handle style change on press
        (matchedUser && matchedUser.requesterIds.includes(user.id)) ||
        user.friendIds.includes(matchedUser.id)
          ? styles.disabledCard
          : styles.card, // Handle style change if button is disabled (i.e. request cannot be sent)
      ]}
    >
      <View style={{ flexDirection: "column", color: "white" }}>
        <Text style={styles.cardText}>{matchedUser.name}</Text>

        <Text style={{ fontSize: 15 }}>
          {matchedUser && matchedUser.requesterIds.includes(user.id)
            ? "Sent Request"
            : user.friendIds.includes(matchedUser.id)
            ? "Added Friend"
            : "Send Request"}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <Icon
          name={
            (matchedUser && matchedUser.requesterIds.includes(user.id)) ||
            user.friendIds.includes(matchedUser.id)
              ? "check"
              : "send"
          }
          size={30}
          color="#2f4f4f"
        />
      </View>
    </Pressable>
  ) : (
    <></>
  );
}

export const SEND_FRIEND_REQUEST = gql`
  mutation sendFriendRequest($requesterId: String!, $receiverId: String!) {
    sendFriendRequest(requesterId: $requesterId, receiverId: $receiverId)
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

export const GET_FRIENDS = gql`
  query getFriends($userId: String!) {
    getFriends(userId: $userId) {
      id
      email
      startKey
      stopKey
      panicKey
      friendIds
      requesterIds
      location
      locationOn
      name
    }
  }
`;

export default PotentialFriend;
