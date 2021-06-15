import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";

import { Button, Text, View, TextInput } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { useRoute } from "@react-navigation/core";

const FlaggedTokens = ({ userId, styles }) => {
  const { data: { getUserById: user } = {} } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
    client: userClient,
  });

  {
    /* TODO Use useQuery to getFlaggedTokens, storing them as flaggedTokens  */
  }

  // const { data: { getUserById: user } = {} } = useQuery(GET_USER_BY_ID, {
  //   variables: { user&&user.id },
  //   client: userClient,
  // });

  return user ? (
    <View>
      <Text style={styles.titleText}>Manage Flagged Tokens</Text>
      <Text style={styles.baseText}>
        When these word or phrases are detected through interim recordings,
        event recordings will begin.
      </Text>
      {/* TODO The following just checks if the user is an admin, and if so, we can allow them to add keys
      from here (frontend). Don't work on this part yet, just an idea...*/}
      {user.email === "user1@gmail.com" ||
        (user.email === "user2@gmail.com" && (
          <Text style={styles.baseText}>
            Enter words or phrases in quotation marks (""), separated by spaces,
            that you'd like to be flagged.
          </Text>
        ))}

      {/* TODO Map each of policeTokens to another component, Token, passing in token=token, type="police", and styles. Make sure to import Token.jsx */}
      {/* TODO Map each of thiefTokens to another component, Token, passing in token=token, type="thief", and styles. Make sure to import Token.jsx */}
    </View>
  ) : (
    <View>
      <Text>Loading...</Text>
    </View>
  );
};

// TODO follow this for getPoliceTokens and getThiefTokens, and specify token and name after line 44
// export const GET_USER_BY_ID = gql`
//   query getUserById($userId: String!) {
//     getUserById(userId: $userId) {
//       id
//       email
//       startKey
//       stopKey
//       panicKey
//     }
//   }
// `;

export const GET_USER_BY_ID = gql`
  query getUserById($userId: String!) {
    getUserById(userId: $userId) {
      id
      email
      startKey
      stopKey
      panicKey
    }
  }
`;
export default FlaggedTokens;
