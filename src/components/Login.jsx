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

const Login = ({ navigation }) => {
  const context = useContext(UserAuthContext);

  const [values, setValues] = useState({ email: "", password: "" });
  const [loginUser, loadingUser] = useMutation(LOGIN_USER, {
    update(_, { data: { loginUser: userData } }) {
      console.log("Submit successful");
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
      <Text>Enter your email and password</Text>

      <TextInput
        onChangeText={(text) => setValues({ ...values, email: text })}
        value={values.email}
        placeholder="Your email"
      />

      <TextInput
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

export default Login;
