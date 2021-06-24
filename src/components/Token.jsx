import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";

import { Button, Text, View, TextInput } from "react-native";

import styles from "../styles/accountStyles";

// Token component is responsible for displaying a valid token to the user, and is intended to be used
// in the FlaggedTokens.jsx component when enumerating all police and thief tokens in a list

const Token = ({ token }) => {
  // Ternary operator - Only attempt to display token if a valid one is passed
  return token ? (
    <View>
      {/* Display token with a bullet list character */}
      <Text style={styles.listText}>{`\u2022 ${token}`}</Text>
    </View>
  ) : (
    <View style={styles.loadingContainer}>
      <Text>Loading...</Text>
    </View>
  );
};

export default Token;
