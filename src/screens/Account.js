import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Button, Text, View, TextInput } from "react-native";
import { UserAuthContext } from "../context/userAuth";
// Manage keys and other account info
const Account = ({ navigation }) => {
  const context = useContext(UserAuthContext);

  return (
    <View>
      <Text>Manage your account</Text>
      {/* <TextInput
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
        secureTextEntry={true}
        placeholder="Your password"
      />
      <TextInput
        onChangeText={(text) => setValues({ ...values, confirmPassword: text })}
        value={values.confirmPassword}
        secureTextEntry={true}
        placeholder="Confirm password"
      /> */}

      {/* <Button
        onPress={() => {
          signUpUser();
          setValues({ email: "", password: "" });
        }}
        title="Sign up"
      /> */}
    </View>
  );
};

export default Account;
