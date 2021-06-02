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

const SignUp = ({ navigation }) => {
  const context = useContext(UserAuthContext);

  const [values, setValues] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [signupUser, loadingUser] = useMutation(SIGNUP_USER, {
    update(_, { data: { signupUser: userData } }) {
      console.log("Sign up successful");
      context.loginUser(userData);
      console.log(userData);
      navigation.navigate("Home", { userId: userData.id });
    },
    onError(err) {
      console.log(err);
    },
    variables: values,
  });

  return (
    <View>
      <Text>Enter your name, email, and password</Text>
      <TextInput
        onChangeText={(text) => setValues({ ...values, name: text })}
        value={values.name}
        placeholder="Your name"
      />
      <TextInput
        onChangeText={(text) => setValues({ ...values, email: text })}
        value={values.email}
        placeholder="Your email"
      />

      <TextInput
        onChangeText={(text) => setValues({ ...values, password: text })}
        value={values.password}
        placeholder="Your password"
      />
      <TextInput
        onChangeText={(text) => setValues({ ...values, confirmPassword: text })}
        value={values.confirmPassword}
        placeholder="Confirm password"
      />

      <Button
        onPress={() => {
          signupUser();
          setValues({ email: "", password: "" });
        }}
        title="Sign up"
      />
    </View>
  );
};

export const SIGNUP_USER = gql`
  mutation signupUser(
    $email: String!
    $password: String!
    $confirmPassword: String!
    $name: String!
  ) {
    signupUser(
      email: $email
      password: $password
      confirmPassword: $confirmPassword
      name: $name
    ) {
      id
      email
      name
      createdAt
      token
    }
  }
`;

export default SignUp;
