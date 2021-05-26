import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext } from "react";
import { Button, StyleSheet, StatusBar, Text, View } from "react-native";
import { adminClient } from "../../../GraphqlApolloClients";
import { AdminAuthContext } from "../../context/adminAuth";

const Home = () => {
  const context = useContext(AdminAuthContext);

  const [loginAdmin] = useMutation(LOGIN_ADMIN, {
    update(_, { data: { loginAdmin: adminData } }) {
      console.log("Submit successful");
      context.loginAdmin(adminData);
    },
    onError(err) {
      console.log(err);
    },
  });

  const submit = () => {
    loginAdmin({
      variables: { email: "test1@gmail.com", password: "1" },
    });
  };

  const { data: { getAdminById: admin } = {} } = useQuery(GET_ADMIN_BY_ID, {
    variables: { adminId: "T7C4HZ7BOK" },
    client: adminClient,
  });

  return (
    <View style={styles.container}>
      <Text>Hi there</Text>
      <Button style={styles.button} onPress={submit} title="Submit"></Button>
      <Text>Should be my name: {admin && admin.name}</Text>
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  button: {
    // flex: 1,
    backgroundColor: "#f50",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
});

const LOGIN_ADMIN = gql`
  mutation loginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      id
      email
      name
      createdAt
      token
    }
  }
`;

export const GET_ADMIN_BY_ID = gql`
  query getAdminById($adminId: String!) {
    getAdminById(adminId: $adminId) {
      id
      name
      password
      email
      token
      createdAt
    }
  }
`;

export default Home;
