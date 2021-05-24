import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
// import { gql, useQuery } from "@apollo/client";
import { adminClient } from "./GraphqlApolloClients";

export default function App() {
  // const { data: { getAdmin: admin } = {} } = useQuery(GET_ADMIN, {
  //   client: adminClient,
  // });
  // console.log("entered");
  return (
    <View style={styles.container}>
      {/* <Text>New change: {admin.name}</Text> */}
      <Text>Something here...</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

// export const GET_ADMIN = gql`
//   {
//     getAdmin {
//       id
//       name
//       email
//     }
//   }
// `;
