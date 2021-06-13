import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, StatusBar, Text, View } from "react-native";
import Login from "../components/Login";
import { UserAuthContext } from "../context/userAuth";

const Landing = ({ navigation }) => {
  const { context } = useContext(UserAuthContext);

  return (
    <View style={styles.container}>
      {/* Logo Here */}

      <Login navigation={navigation} styles={styles} />

      <Button
        style={styles.button}
        title={"New here? Sign up"}
        onPress={() => navigation.navigate("SignUp")}
      />
    </View>
  );
};

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
    justifyContent: "center",
    marginTop: 50,
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
export default Landing;
