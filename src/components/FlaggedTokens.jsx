import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";

import { Button, Text, View, TextInput } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { useRoute } from "@react-navigation/core";
import Token from "./Token";

const FlaggedTokens = ({ userId, styles }) => {
  const { data: { getUserById: user } = {} } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
    client: userClient,
  });
  const { data: { getPoliceTokens: policeTokens } = {} } = useQuery(
    GET_POLICE_TOKENS,
    {
      client: userClient,
    }
  );

  const { data: { getThiefTokens: thiefTokens } = {} } = useQuery(
    GET_THIEF_TOKENS,
    {
      client: userClient,
    }
  );
  // TODO: const [open, setOpen] = useState(false)
  // TODO: create new arrays limitedThiefTokens and same for police with the first 10 of each

  // if(thiefTokens){
  // set limitedThiefTokens here...
  // }

  // TODO useEffect to change tokens
  // useEffect(() => {
  // set limitedThiefTokens to the entire list
  // }, [open])

  console.log(user);
  return policeTokens && thiefTokens && user ? (
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

      {/*  Map each of policeTokens to another component, Token, passing in token=token, type="police", and styles. Make sure to import Token.jsx */}
      <Text style={styles.subTitleText}>Police tokens:</Text>
      {policeTokens && // Replace this with limitedPoliceTokens
        policeTokens.map((policeToken, index) => (
          <Token
            key={index}
            style={styles}
            token={policeToken}
            type={"Police"}
          />
        ))}
      {/*  Map each of thiefTokens to another component, Token, passing in token=token, type="thief", and styles. Make sure to import Token.jsx */}
      <Text style={styles.subTitleText}>Thief tokens:</Text>
      {thiefTokens &&
        thiefTokens.map((thiefToken, index) => (
          <Token key={index} style={styles} token={thiefToken} type={"Thief"} />
        ))}

      {/* TODO with onPress={setOpen(!open)} (see ex) - <Button> </Button> */}
    </View>
  ) : (
    <View>
      <Text>Loading...</Text>
    </View>
  );
};

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

export const GET_POLICE_TOKENS = gql`
  query getPoliceTokens {
    getPoliceTokens
  }
`;

export const GET_THIEF_TOKENS = gql`
  query getThiefTokens {
    getThiefTokens
  }
`;

export default FlaggedTokens;
