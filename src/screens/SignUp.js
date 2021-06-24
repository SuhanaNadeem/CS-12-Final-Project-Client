import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  ImageBackground,
} from "react-native";
import { UserAuthContext } from "../context/userAuth";
import styles from "../styles/landingStyles";

const SignUp = ({ navigation }) => {
  // TODO look at the rest of the app's (especially login's) *finished UI to fix the UI of this page so it's consistent
  // - *note, it's not finished yet but will be by the time you finish the features

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
      navigation.navigate("Home", { userId: userData.id, newUser: true });
    },
    onError(err) {
      console.log(err);
    },
    variables: values,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={require("../images/signup.png")}
        style={styles.container}
      >
        <View style={styles.loginContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.formText}>Name</Text>
            <TextInput
              onChangeText={(text) => setValues({ ...values, name: text })}
              value={values.name}
              placeholder="Your name"
              style={styles.input}
            />
            <Text style={styles.formText}>Email</Text>

            <TextInput
              onChangeText={(text) => setValues({ ...values, email: text })}
              value={values.email}
              placeholder="Your email"
              style={styles.input}
            />
            <Text style={styles.formText}>Password</Text>

            <TextInput
              onChangeText={(text) => setValues({ ...values, password: text })}
              value={values.password}
              secureTextEntry={true}
              placeholder="Your password"
              style={styles.input}
            />
            <Text style={styles.formText}>Confirm Password</Text>

            <TextInput
              onChangeText={(text) =>
                setValues({ ...values, confirmPassword: text })
              }
              value={values.confirmPassword}
              secureTextEntry={true}
              placeholder="Confirm password"
              style={styles.input}
            />
          </View>
        </View>

        <Pressable
          onPress={() => {
            signupUser();
            setValues({ email: "", password: "" });
          }}
          style={styles.end}
        >
          <Text style={styles.loginText}>Sign Up</Text>
        </Pressable>
      </ImageBackground>
    </KeyboardAvoidingView>
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
