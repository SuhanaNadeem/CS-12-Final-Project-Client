import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";

import { Button, Text, View, TextInput } from "react-native";

import styles from "../styles/accountStyles";

// token is a string, passed as FlaggedToken.token

const Token = ({ token }) => {
  return token ? (
    <View>
      <Text style={styles.listText}>{`\u2022 ${token}`}</Text>
    </View>
  ) : (
    <View style={styles.loadingContainer}>
      <Text>Loading...</Text>
    </View>
  );
};

export default Token;
