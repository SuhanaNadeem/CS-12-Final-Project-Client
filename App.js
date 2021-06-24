import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserAuthProvider } from "./src/context/userAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistCache } from "apollo3-cache-persist";
import { InMemoryCache } from "@apollo/client/cache";
import { ApolloProvider } from "@apollo/client";
import { userClient } from "./GraphqlApolloClients";
import Landing from "./src/screens/Landing";
import SignUp from "./src/screens/SignUp";
import Tabs from "./src/components/Tabs";

const Stack = createStackNavigator();
const cache = new InMemoryCache();

/* This file routes the screens in Street Guard, under a custom user Apollo provider, userClient. */

export default function App() {
  const [loadingCache, setLoadingCache] = useState(true);

  useEffect(() => {
    persistCache({
      cache,
      storage: AsyncStorage,
    }).then(() => setLoadingCache(false));
  }, []); // Reset AsyncStorage (cache)

  return loadingCache ? (
    <View style={styles.container}>
      <Text>Loading cache...</Text>
    </View>
  ) : (
    <ApolloProvider client={userClient}>
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
              name="Home"
              component={Tabs}
              options={{
                title: "Street Guard",
                headerLeft: null,
              }}
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
