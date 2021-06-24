import React from "react";
import {
  Pressable,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import Login from "../components/Login";
import styles from "../styles/landingStyles";

/* This page allows the user to log in to our app or navigate to the SignUp screen instead. 
  See comments in `src/components` for details. */

const Landing = ({ navigation }) => {
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
