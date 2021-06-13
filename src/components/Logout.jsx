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

// TODO implement auto-login

const Logout = ({ navigation, styles }) => {
  const { logoutUser } = useContext(UserAuthContext);
  return <Button onPress={logoutUser} title="Log Out" />;
};

export default Logout;
