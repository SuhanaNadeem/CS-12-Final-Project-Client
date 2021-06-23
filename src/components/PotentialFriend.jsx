import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Button, View, Text, Pressable } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { GET_FRIENDS } from "./Map";
import { GET_FRIEND_REQUESTS } from "./Requesters";
import styles from "../styles/friendsStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import { GET_USER_MATCHES } from "./Search";

function PotentialFriend({ name, matchedUser, user }) {
  const [values, setValues] = useState({
    requesterId: user && user.id,
    receiverId: "",
  });
  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST, {
    update() {
      console.log("Submitted sendFriendRequest");
      setValues({
        ...values,
        receiverId: "",
      });
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
        query: GET_USER_BY_ID,
        variables: { userId: matchedUser && matchedUser.id },
      },
      {
        query: GET_USER_MATCHES,
        variables: { name: name && name },
      },
    ],
    variables: values,
    client: userClient,
  });
  console.log("Got name " + name);
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
          : false
      }
      style={({ pressed }) => [
        {
          shadowColor: "#2f4f4f",
          shadowOffset: pressed
            ? { width: 0, height: 1 }
            : { width: 0, height: 0 },
          shadowOpacity: pressed ? 0.8 : 0,
          shadowRadius: pressed ? 0 : 1,
        },
        (matchedUser && matchedUser.requesterIds.includes(user.id)) ||
        user.friendIds.includes(matchedUser.id)
          ? styles.disabledCard
          : styles.card,
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

// Send invite?

export const SEND_FRIEND_REQUEST = gql`
  mutation sendFriendRequest($requesterId: String!, $receiverId: String!) {
    sendFriendRequest(requesterId: $requesterId, receiverId: $receiverId)
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

export default PotentialFriend;
