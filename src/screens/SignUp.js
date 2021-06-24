import { gql, useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  ImageBackground,
} from "react-native";
import { UserAuthContext } from "../context/userAuth";
import styles from "../styles/landingStyles";

/* This page allows the user to sign up for Street Guard, pushing them to login if successful. 
  See comments in `src/components` for details. */

const SignUp = ({ navigation }) => {
  const context = useContext(UserAuthContext);
  const [values, setValues] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [signupUser] = useMutation(SIGNUP_USER, {
    update(_, { data: { signupUser: userData } }) {
      context.loginUser(userData); // Log in the user if signup is successful
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
