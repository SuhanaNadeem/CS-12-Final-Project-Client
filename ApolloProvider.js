import React from "react";
import { AppRegistry } from "react-native";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import { userClient } from "./GraphqlApolloClients";

const App = () => (
  // Wrap app in userClient to access back-end
  <ApolloProvider client={userClient}>
    <App />
  </ApolloProvider>
);

AppRegistry.registerComponent("MyApplication", () => App);
