import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import Requester from "./Requester";

const Requesters = ({ user, styles }) => {
  const { data: { getFriendRequests: requesters } = {} } = useQuery(
    GET_FRIEND_REQUESTS,
    {
      variables: { userId: user && user.id },
      client: userClient,
    }
  );

  console.log("in friend requests:");
  console.log(requesters);
  return user && requesters ? (
    <View>
      <Text style={styles.titleText}>Add Friends</Text>
      <Text style={styles.baseText}>
        You can add users who have requested to be your friend here.
      </Text>
      {requesters.map((requester, index) => (
        <Requester
          key={index}
          requester={requester}
          styles={styles}
          user={user}
        />
      ))}
    </View>
  ) : (
    <View></View>
  );
};

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

export default Requesters;
