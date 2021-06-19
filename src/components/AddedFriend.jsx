import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";

const AddedFriend = ({ friend, user, styles }) => {
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
    <View style={(styles.container, styles.iconAndText)}>
      <Text>{friend.name}</Text>
      <Button
        onPress={() => {
          removeFriend();
        }}
        title={"Remove Friend"}
        style={styles.button}
      />
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
