import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import Requester from "./Requester";
import styles from "../styles/friendsStyles";

const Requesters = ({ user }) => {
  const { data: { getFriendRequests: requesters } = {} } = useQuery(
    GET_FRIEND_REQUESTS,
    {
      variables: { userId: user && user.id },
      client: userClient,
    }
  );

  return user && requesters ? (
    <View style={{ paddingHorizontal: 25 }}>
      <Text style={styles.bareTitleText}>Add Friends</Text>
      <Text style={styles.baseText}>
        You can add users who have requested to be your friend here.
      </Text>
      {requesters.length != 0 && (
        <View style={{ marginTop: 30 }}>
          {requesters.map((requester, index) => (
            <Requester key={index} requester={requester} user={user} />
          ))}
        </View>
      )}
    </View>
  ) : (
    <Text></Text>
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
