import { split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const backendURI = "http://192.168.0.27:5000/";
// const wsURI = "ws://192.168.0.27:5000/subscriptions";

const backendURI = "http://192.168.2.84:5000/";
const wsURI = "ws://192.168.2.84:5000/subscriptions";

// const backendURI =
//   process.env.NODE_ENV === "production"
//     ? "https://cs-12-final-project.herokuapp.com/"
//     : "https://192.168.137.1/";

// const wsURI =
//   process.env.NODE_ENV === "production"
//     ? `wss://cs-12-final-project.herokuapp.com/subscriptions`
//     : "ws://192.168.137.1/subscriptions";

const httpLink = createUploadLink({
  uri: backendURI,
  // credentials: "include",
});
// const initState = async () => {
//   var userAuthToken = await AsyncStorage.getItem("adminJwtToken");
//   var adminAuthToken = await AsyncStorage.getItem("jwtToken");
// };
// initState();
const wsLink = new WebSocketLink({
  uri: wsURI,
  options: {
    reconnect: true,
    lazy: true,
    // timeout: 30000,
    onError: async (error) => {
      // error.message has to match what the server returns.
      if (
        error.message.contains("authorization") &&
        // (adminAuthToken || userAuthToken)
        !(await AsyncStorage.getItem("jwtToken")) &&
        !(await AsyncStorage.getItem("adminJwtToken"))
      ) {
        // Reset the WS connection for it to carry the new JWT.
        wsLink.subscriptionClient.close(false, false);
      }
    },
    connectionParams: async () => ({
      AdminAuth: `Bearer ${await AsyncStorage.getItem("adminJwtToken")}`,
      UserAuth: `Bearer ${await AsyncStorage.getItem("jwtToken")}`,
    }),
  },
});

const adminAuthLink = setContext(async () => {
  const adminToken = await AsyncStorage.getItem("adminJwtToken");
  return {
    headers: {
      Authorization: adminToken ? `Bearer ${adminToken}` : "",
    },
  };
});
const adminLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  adminAuthLink.concat(httpLink)
);

export const adminClient = new ApolloClient({
  link: adminLink,
  uri: backendURI,
  cache: new InMemoryCache(),
  defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },
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
