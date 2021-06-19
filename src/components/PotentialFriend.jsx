import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";

const PotentialFriend = ({ matchedUser, user, styles }) => {
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
      <Button
        onPress={async () => {
          await setValues({ ...values, receiverId: matchedUser.id });
          sendFriendRequest();
        }}
        title={
          matchedUser.requesterIds.includes(user.id)
            ? "Sent Invite"
            : user.friendIds.includes(matchedUser.id)
            ? "Added Friend"
            : "Send Invite"
        }
        disabled={
          matchedUser.requesterIds.includes(user.id) ||
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
};

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
