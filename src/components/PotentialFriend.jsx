import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { GET_FRIENDS } from "./Map";
import { GET_FRIEND_REQUESTS } from "./Requesters";

function PotentialFriend({ matchedUser, user, styles }) {
  const { data: { getUserById: matchedUserObject } = {} } = useQuery(
    GET_USER_BY_ID,
    {
      variables: { userId: matchedUser && matchedUser.id },
      client: userClient,
    }
  );

  const [values, setValues] = useState({
    requesterId: user && user.id,
    receiverId: "",
  });
  const [sendFriendRequest, loadingSendFriendRequest] = useMutation(
    SEND_FRIEND_REQUEST,
    {
      update(_, { data: { sendFriendRequest: sendFriendRequestData } }) {
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
          query: GET_FRIEND_REQUESTS,
          variables: { userId: user && user.id },
        },
      ],
      variables: values,
      client: userClient,
    }
  );

  return user && matchedUser ? (
    <View style={(styles.container, styles.iconAndText)}>
      <Text style={{ paddingRight: 12, color: "white" }}>
        {matchedUser.name}
      </Text>
      <Text>,{matchedUserObject && matchedUserObject.requesterIds}</Text>
      <Button
        onPress={async () => {
          await setValues({ ...values, receiverId: matchedUser.id });
          sendFriendRequest();
        }}
        title={
          matchedUserObject && matchedUserObject.requesterIds.includes(user.id)
            ? "Sent Invite"
            : user.friendIds.includes(matchedUser.id)
            ? "Added Friend"
            : "Send Invite"
        }
        disabled={
          (matchedUserObject &&
            matchedUserObject.requesterIds.includes(user.id)) ||
          user.friendIds.includes(matchedUser.id)
            ? true
            : false
        }
        style={styles.button}
      />
    </View>
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
