import { split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IP_ADDRESS } from "@env";

const backendURI = "http://" + IP_ADDRESS + ":5000/";
const wsURI = "ws://" + IP_ADDRESS + ":5000/subscriptions";

const httpLink = createUploadLink({
  uri: backendURI,
});

const wsLink = new WebSocketLink({
  uri: wsURI,
  options: {
    reconnect: true,
    lazy: true,
    onError: async (error) => {
      if (
        error.message.contains("authorization") &&
        !(await AsyncStorage.getItem("jwtToken"))
      ) {
        wsLink.subscriptionClient.close(false, false);
      }
    },
    connectionParams: async () => ({
      UserAuth: `Bearer ${await AsyncStorage.getItem("jwtToken")}`,
    }),
  },
});

const userAuthLink = setContext(async () => {
  const userToken = await AsyncStorage.getItem("jwtToken");

  return {
    headers: {
      Authorization: userToken ? `Bearer ${userToken}` : "",
    },
  };
});

const userLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  userAuthLink.concat(httpLink)
);
export const userClient = new ApolloClient({
  link: userLink,
  uri: backendURI,
  cache: new InMemoryCache(),
  defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },
});
