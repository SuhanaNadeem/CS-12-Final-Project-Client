import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";

import { Button, Text, View, TextInput } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { useRoute } from "@react-navigation/core";
import Token from "./Token";
import { ScrollView } from "react-native";

const FlaggedTokens = ({ user, styles }) => {
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
  // TODO: const [open, setOpen] = useState(false)
  // TODO: create new arrays limitedThiefTokens and same for police with the first 10 of each

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

  // if(thiefTokens){
  // set limitedThiefTokens here...
  // }

  // if (policeTokens) {
  //   limitedPoliceTokens = policeTokens.slice(0, 5);
  // }

  // if (thiefTokens) {
  //   limitedThiefTokens = thiefTokens.slice(0, 5);
  // }

  // TODO useEffect to change tokens
  useEffect(() => {
    //set limitedThiefTokens to the entire list
    if (thiefTokens) {
      if (tOpen) {
        setLimitedThiefTokens(thiefTokens);
      } else {
        setLimitedThiefTokens(thiefTokens);
      }
    }
  }, [tOpen]);

  useEffect(() => {
    //set limitedPoliceTokens to the entire list
    if (pOpen && policeTokens) {
      setLimitedPoliceTokens(policeTokens);
    }
  }, [pOpen]);

  // Following log gets called many times, indicating an infinite loop
  //console.log(user);

  console.log("tokens in here:");
  console.log(limitedThiefTokens);

  return limitedPoliceTokens && limitedThiefTokens && user ? (
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
      <Button
        onPress={() => {
          setPOpen(!pOpen);
        }}
        title="View more"
      ></Button>
      {/*  Map each of thiefTokens to another component, Token, passing in token=token, type="thief", and styles. Make sure to import Token.jsx */}
      <Text style={styles.subTitleText}>Thief tokens:</Text>
      {limitedThiefTokens &&
        limitedThiefTokens.map((thiefToken, index) => (
          <Token key={index} style={styles} token={thiefToken} type={"Thief"} />
        ))}
      <Button
        onPress={() => {
          setTOpen(!tOpen);
        }}
        title="View more"
      ></Button>
      {/* TODO with onPress={setOpen(!open)} (see ex) - <Button> </Button> */}
    </View>
  ) : (
    <View>
      <Text>Loading...</Text>
    </View>
  );
};

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
