import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserAuthProvider } from "./src/context/userAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistCache } from "apollo3-cache-persist";
import { InMemoryCache } from "@apollo/client/cache";
import { ApolloProvider } from "@apollo/client";
import { adminClient } from "./GraphqlApolloClients";

import Record from "./src/screens/Record";
import Landing from "./src/screens/Landing";
import SignUp from "./src/screens/SignUp";
import Account from "./src/screens/Account";

const Stack = createStackNavigator();

const cache = new InMemoryCache();

export default function App() {
  const [loadingCache, setLoadingCache] = useState(true);
  useEffect(() => {
    persistCache({
      cache,
      storage: AsyncStorage,
    }).then(() => setLoadingCache(false));
  }, []);

  return loadingCache ? (
    <View style={styles.container}>
      <Text>Loading cache...</Text>
    </View>
  ) : (
    <ApolloProvider client={adminClient}>
      <UserAuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={Landing}
              options={{ title: "Log In" }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ title: "Sign Up" }}
            />
            <Stack.Screen
              name="Record"
              component={Record}
              options={{ title: "Record", headerLeft: null }}
            />
            <Stack.Screen
              name="Account"
              component={Account}
              options={{ title: "Account" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserAuthProvider>
    </ApolloProvider>
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
