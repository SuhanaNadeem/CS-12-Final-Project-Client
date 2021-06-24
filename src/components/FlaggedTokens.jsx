import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { Text, View } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import Token from "./Token";
import styles from "../styles/accountStyles";
import Icon from "react-native-vector-icons/FontAwesome5";

/* Map all the flagged tokens stored in MongoDB by category. */

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
    // Set limitedThiefTokens to the entire list
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
    // Set limitedThiefTokens to the entire list/limited list (toggled)
    if (thiefTokens) {
      if (tOpen) {
        setLimitedThiefTokens(thiefTokens);
      } else {
        setLimitedThiefTokens(thiefTokens.slice(0, 5));
      }
    }
  }, [tOpen]);

  useEffect(() => {
    // Set limitedPoliceTokens to the entire list/limited list (toggled)
    if (policeTokens) {
      if (pOpen) {
        setLimitedPoliceTokens(policeTokens);
      } else {
        setLimitedPoliceTokens(policeTokens.slice(0, 5));
      }
    }
  }, [pOpen]);

  return limitedPoliceTokens && limitedThiefTokens && user ? (
    <View style={{ paddingHorizontal: 25 }}>
      <Text style={styles.titleText}>View Flagged Tokens</Text>
      <Text style={styles.baseText}>
        When these phrases or your voice keys are detected through background
        recordings, event recordings will be triggered.
      </Text>

      {/* Map each thief token to a Police component */}
      <Text style={styles.subTitleText}>Police Tokens</Text>
      {limitedPoliceTokens &&
        limitedPoliceTokens.map((policeToken, index) => (
          <Token key={index} token={policeToken} />
        ))}
      {policeTokens && policeTokens.length > 5 && (
        <View
          style={{
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 25,
          }}
        >
          <Icon
            onPress={() => {
              setPOpen(!pOpen);
            }}
            size={35}
            color="#2f4f4f"
            name={pOpen ? "times" : "expand-alt"}
          />
        </View>
      )}
      {/* Map each thief token to a Token component */}
      <Text style={styles.subTitleText}>Thief Tokens</Text>
      {limitedThiefTokens &&
        limitedThiefTokens.map((thiefToken, index) => (
          <Token key={index} token={thiefToken} />
        ))}
      {thiefTokens && thiefTokens.length > 5 && (
        <View
          style={{
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 25,
          }}
        >
          <Icon
            onPress={() => {
              setTOpen(!tOpen);
            }}
            size={35}
            color="#2f4f4f"
            name={tOpen ? "times" : "expand-alt"}
          />
        </View>
      )}
    </View>
  ) : (
    <View style={styles.loadingContainer}>
      <Text>Loading...</Text>
    </View>
  );
};

export const GET_USER_BY_ID = gql`
  query getUserById($userId: String!) {
    getUserById(userId: $userId) {
      id
      name
      password
      email
      startKey
      panicKey
      stopKey
      createdAt
      token
      location
      locationOn
      friendIds
      requesterIds
      panicMessage
      panicPhone
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
