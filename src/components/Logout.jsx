import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  StatusBar,
  Text,
  View,
  TextInput,
} from "react-native";
import { UserAuthContext } from "../context/userAuth";

const Logout = ({ navigation, styles }) => {
  const { logoutUser } = useContext(UserAuthContext);
  return (
    <Button onPress={logoutUser} title="Log Out" style={{ marginLeft: 25 }} />
  );
};

export default Logout;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    paddingHorizontal: 25,
  },
  button: {
    // flex: 1,
    backgroundColor: "#f50",
    alignItems: "center",
    // justifyContent: "center",
    marginLeft: 25,
  },
  baseText: {
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 30,
    paddingBottom: 10,
  },
  input: {
    paddingVertical: 4,
  },
});
