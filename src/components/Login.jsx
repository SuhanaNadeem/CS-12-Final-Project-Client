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

// TODO For me - implement auto-login

const Login = ({ navigation }) => {
  const context = useContext(UserAuthContext);

  const [values, setValues] = useState({ email: "", password: "" });
  const [loginUser, loadingUser] = useMutation(LOGIN_USER, {
    update(_, { data: { loginUser: userData } }) {
      console.log("Login successful");
      context.loginUser(userData);
      navigation.navigate("Home", { userId: userData.id });
    },
    onError(err) {
      console.log(err);
    },
    variables: values,
  });

  return (
    <View>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setValues({ ...values, email: text })}
        value={values.email}
        placeholder="Your email"
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => setValues({ ...values, password: text })}
        value={values.password}
        secureTextEntry={true}
        placeholder="Your password"
      />

      <Button
        onPress={() => {
          loginUser();
          setValues({ email: "", password: "" });
        }}
        title="Log in"
      />
    </View>
  );
};

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      id
      email
      name
      createdAt
      token
    }
  }
`;

const styles = StyleSheet.create({
  container: {
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
    paddingVertical: 6,
    backgroundColor: "#fff8dc",
    paddingHorizontal: 8,
    marginVertical: 12,
  },
});

export default Login;
