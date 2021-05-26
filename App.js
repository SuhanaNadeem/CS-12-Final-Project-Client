import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./src/screens/Admin/Home";
import { AdminAuthProvider } from "./src/context/adminAuth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistCache } from "apollo3-cache-persist";
import { InMemoryCache } from "@apollo/client/cache";
import { ApolloProvider } from "@apollo/client";
import { adminClient } from "./GraphqlApolloClients";

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

  if (loadingCache) {
    return (
      <View style={styles.centered}>
        <Text>Loading cache...</Text>
      </View>
    );
  }

  return (
    <ApolloProvider client={adminClient}>
      <AdminAuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ title: "Test New Page" }}
            />
          </Stack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </AdminAuthProvider>
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
