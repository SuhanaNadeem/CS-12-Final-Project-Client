import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";

import { Button, Text, View, TextInput } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { useRoute } from "@react-navigation/core";
import Token from "./Token";
import { ScrollView } from "react-native";
import styles from "../styles/accountStyles";

const FlaggedTokens = ({ user }) => {
  const { data: { getPoliceTokens: policeTokens } = {} } = useQuery(
    GET_POLICE_TOKENS,
    {
      variables: {},
      client: userClient,
    }
  );

  const { data: { getThiefTokens: thiefTokens } = {} } = useQuery(
    GET_THIEF_TOKENS,
    {
      variables: {},
      client: userClient,
    }
  );

  const [limitedPoliceTokens, setLimitedPoliceTokens] = useState([]);
  const [limitedThiefTokens, setLimitedThiefTokens] = useState([]);
  useEffect(() => {
    //set limitedThiefTokens to the entire list
    if (policeTokens) {
      setLimitedPoliceTokens(policeTokens.slice(0, 5));
    }
    if (thiefTokens) {
      setLimitedThiefTokens(thiefTokens.slice(0, 5));
    }
  }, [thiefTokens, policeTokens]);

  const [pOpen, setPOpen] = useState(false);
  const [tOpen, setTOpen] = useState(false);

  useEffect(() => {
    //set limitedThiefTokens to the entire list/limited list (toggled)
    if (thiefTokens) {
      if (tOpen) {
        setLimitedThiefTokens(thiefTokens);
      }
      else {
        setLimitedThiefTokens(thiefTokens.slice(0, 5));
      }
    }
  }, [tOpen]);

  useEffect(() => {
    //set limitedPoliceTokens to the entire list/limited list (toggled)
    if (policeTokens) {
      if (pOpen) {
        setLimitedPoliceTokens(policeTokens);
      }
      else {
        setLimitedPoliceTokens(policeTokens.slice(0, 5));
      }
    }
  }, [pOpen]);

  return limitedPoliceTokens && limitedThiefTokens && user ? (
    <View>
      <Text style={styles.titleText}>Manage Flagged Tokens</Text>
      <Text style={styles.baseText}>
        When these word or phrases are detected through interim recordings,
        event recordings will begin.
      </Text>

      {/* Map each of policeTokens to another component, Token, passing in token=token, type="police", and styles. Make sure to import Token.jsx */}
      <Text style={styles.subTitleText}>Police tokens:</Text>
      {limitedPoliceTokens && // Replace this with limitedPoliceTokens
        limitedPoliceTokens.map((policeToken, index) => (
          <Token
            key={index}
            style={styles}
            token={policeToken}
            type={"Police"}
          />
        ))}
      {policeTokens && policeTokens.length > 5 && (
        <Button
          onPress={() => {
            setPOpen(!pOpen);
          }}
          title={pOpen ? "Collapse" : "View more"}
        ></Button>
      )}
      {/*  Map each of thiefTokens to another component, Token, passing in token=token, type="thief", and styles. Make sure to import Token.jsx */}
      <Text style={styles.subTitleText}>Thief tokens:</Text>
      {limitedThiefTokens &&
        limitedThiefTokens.map((thiefToken, index) => (
          <Token key={index} style={styles} token={thiefToken} type={"Thief"} />
        ))}
      {thiefTokens && thiefTokens.length > 5 && (
        <Button
          onPress={() => {
            setTOpen(!tOpen);
          }}
          title={tOpen ? "Collapse" : "View more"}
        ></Button>
      )}
    </View>
  ) : (
    <View>
      <Text>Loading...</Text>
    </View>
  );
};

// follow this for getPoliceTokens and getThiefTokens, and specify token and name after line 44
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
