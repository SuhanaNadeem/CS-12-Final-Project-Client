import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  Pressable,
  ImageBackground,
  TextInput,
} from "react-native";
import { UserAuthContext } from "../context/userAuth";
import styles from "../styles/landingStyles";
import Icon from "react-native-vector-icons/FontAwesome";

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
    <View style={styles.loginContainer}>
      {/* <ImageBackground source={pageBg} style={styles.image}> */}
      <View style={styles.formContainer}>
        <View style={styles.centered}>
          <Image
            source={require("../images/logo.png")}
            style={{ width: 100, height: 100 }}
          ></Image>
          {/* <Icon name="binoculars" size={50} color="white" /> */}
        </View>
        <Text style={styles.formText}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setValues({ ...values, email: text })}
          value={values.email}
          placeholder="Your email"
        />
        <Text style={styles.formText}>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setValues({ ...values, password: text })}
          value={values.password}
          secureTextEntry={true}
          placeholder="Your password"
        />
      </View>
      <Pressable
        onPress={() => {
          loginUser();
          setValues({ email: "", password: "" });
        }}
        style={styles.centered}
      >
        <Text style={styles.loginText}> Log In</Text>
      </Pressable>

      {/* </ImageBackground> */}
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
