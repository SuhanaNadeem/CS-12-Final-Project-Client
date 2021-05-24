import { split } from "@apollo/client";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
// import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";

const backendURI =
  process.env.NODE_ENV === "production"
    ? "https://cs-12-final-project.herokuapp.com/"
    : "http://localhost:5000/";

const wsURI =
  process.env.NODE_ENV === "production"
    ? `wss://cs-12-final-project.herokuapp.com/subscriptions`
    : "ws://localhost:5000/subscriptions";

const httpLink = createUploadLink({
  uri: backendURI,
  // credentials: "include",
});

const wsLink = new HttpLink({
  uri: wsURI,
  options: {
    reconnect: true,
    lazy: true,
    // timeout: 30000,
    onError: (error) => {
      // error.message has to match what the server returns.
      if (
        error.message.contains("authorization") &&
        (asyncStorage.getItem("adminJwtToken") ||
          asyncStorage.getItem("mentorJwtToken") ||
          asyncStorage.getItem("jwtToken"))
      ) {
        // Reset the WS connection for it to carry the new JWT.
        wsLink.subscriptionClient.close(false, false);
      }
    },
    connectionParams: () => ({
      AdminAuth: `Bearer ${asyncStorage.getItem("adminJwtToken")}`,
      DonorAuth: `Bearer ${asyncStorage.getItem("mentorJwtToken")}`,
      UserAuth: `Bearer ${asyncStorage.getItem("jwtToken")}`,
    }),
  },
});

const adminAuthLink = setContext(() => {
  const adminToken = asyncStorage.getItem("adminJwtToken");
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
  // link: authLink.concat(httpLink),
  link: adminLink,
  // link: adminAuthLink.concat(httpLink),
  uri: backendURI,

  cache: new InMemoryCache(),
});

const userAuthLink = setContext(() => {
  const userToken = asyncStorage.getItem("jwtToken");

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
  // link: authLink.concat(httpLink),
  link: userLink,
  // link: userAuthLink.concat(httpLink),
  uri: backendURI,

  cache: new InMemoryCache(),
  resolvers: {},
});

// userClient.cache.writeQuery({
//   query: gql`
//     query GET_NEW_USER_ADDRESS {
//       newUserAddress
//     }
//   `,
//   data: {
//     newUserAddress: asyncStorage.getItem("newUserAddress"),
//   },
// });

const mentorAuthLink = setContext(() => {
  const mentorToken = asyncStorage.getItem("mentorJwtToken");
  return {
    headers: {
      Authorization: mentorToken ? `Bearer ${mentorToken}` : "",
    },
  };
});

const mentorLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  mentorAuthLink.concat(httpLink)
);
export const mentorClient = new ApolloClient({
  // link: authLink.concat(httpLink),
  link: mentorLink,
  // link: mentorAuthLink.concat(httpLink),
  uri: backendURI,

  cache: new InMemoryCache(),
});
