import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import Login from "../components/Login";
import { UserAuthContext } from "../context/userAuth";
import styles from "../styles/landingStyles";

const Landing = ({ navigation }) => {
  const { context } = useContext(UserAuthContext);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
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
    </KeyboardAvoidingView>
  );
};

export default Landing;
