import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../styles/friendsStyles";

const AddedFriend = ({ friend, user }) => {
  const [values, setValues] = useState({
    userId: user && user.id,
    friendId: friend && friend.id,
  });
  const [removeFriend, loadingRemoveFriend] = useMutation(REMOVE_FRIEND, {
    update(_, { data: { removeFriend: removeFriendData } }) {
      console.log("Submitted removeFriend");
    },
    onError(err) {
      console.log(err);
    },
    refetchQueries: [
      {
        query: GET_FRIENDS,
        variables: { userId: user && user.id },
      },
    ],
    variables: values,
    client: userClient,
  });

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

export default AddedFriend;
