import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";

const Requester = ({ requester, user, styles }) => {
  const [values, setValues] = useState({
    userId: user && user.id,
    friendId: requester && requester.id,
  });
  const [addFriend, loadingAddFriend] = useMutation(ADD_FRIEND, {
    update(_, { data: { addFriend: sendFriendRequestData } }) {
      console.log("Submitted addFriend");
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
    ],
    variables: values,
    client: userClient,
  });

  return user && requester ? (
    <View style={(styles.container, styles.iconAndText)}>
      <Text style={{ paddingRight: 12, color: "white" }}>{requester.name}</Text>
      <Button
        onPress={() => {
          addFriend();
        }}
        title={"Add Friend"}
        style={styles.button}
      />
    </View>
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

export default Requester;
