import { gql, useMutation } from "@apollo/client";
import React from "react";
import { View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../styles/friendsStyles";

/* Displays a user that has already been added as a friend by the current user. */

const AddedFriend = ({ friend, user }) => {
  const [removeFriend] = useMutation(REMOVE_FRIEND, {
    // update() {
    //   console.log("Submitted removeFriend");
    // },
    onError(err) {
      console.log(err);
    },
    refetchQueries: [
      {
        query: GET_FRIENDS,
        variables: { userId: user && user.id },
      },
      {
        query: GET_USER_MATCHES,
        variables: { name: user && user.name },
      },
    ],
    variables: {
      userId: user && user.id,
      friendId: friend && friend.id,
    },
    client: userClient,
  });

  // Once `user` and `friend` have loaded, display the friend's name and allow them to be "unfriended"
  return user && friend ? (
    <View style={styles.card}>
      <Text style={styles.cardText}>{friend.name}</Text>
      <View style={styles.iconContainer}>
        <Icon
          onPress={() => {
            removeFriend();
          }}
          name="account-minus"
          size={30}
          color="#2f4f4f"
        />
      </View>
    </View>
  ) : (
    <></>
  );
};

export const REMOVE_FRIEND = gql`
  mutation removeFriend($friendId: String!, $userId: String!) {
    removeFriend(friendId: $friendId, userId: $userId)
  }
`;
export const GET_FRIENDS = gql`
  query getFriends($userId: String!) {
    getFriends(userId: $userId) {
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

export default AddedFriend;
