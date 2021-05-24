import React from "react";
import { AppRegistry } from "react-native";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import { userClient } from "./GraphqlApolloClients";

const App = () => (
  <ApolloProvider client={userClient}>
    <App />
  </ApolloProvider>
);

AppRegistry.registerComponent("MyApplication", () => App);
