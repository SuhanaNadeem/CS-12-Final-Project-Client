import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Pressable,
  Text,
  View,
  Image,
  ImageBackground,
} from "react-native";
import Login from "../components/Login";
import { UserAuthContext } from "../context/userAuth";
import styles from "../styles/landing";

const Landing = ({ navigation }) => {
  const { context } = useContext(UserAuthContext);

  return (
    // <View style={{ position: "absolute" }}>
    <ImageBackground
      source={require("../images/login.png")}
      style={styles.container}
    >
      <Login navigation={navigation} />
      <Pressable
        onPress={() => navigation.navigate("SignUp")}
        style={styles.end}
      >
        <Text style={styles.signupText}>New here? Sign up</Text>
      </Pressable>
    </ImageBackground>
  );
};

export default Landing;
