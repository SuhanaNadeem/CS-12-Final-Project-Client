import Friends from "../screens/Friends";
import Track from "../screens/Track";
import Account from "../screens/Account";
import Record from "../screens/Record";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";

const Tab = createMaterialBottomTabNavigator();

/* Tabs handles navigation between screens visible to the user when they are signed in. */

export default function Tabs({ route }) {
  const { userId } = route.params;
  const { newUser } = route.params;

  return (
    <Tab.Navigator
      initialRouteName="Record"
      activeColor="white"
      barStyle={{ backgroundColor: "#2f4f4f" }}
    >
      <Tab.Screen
        name="Record"
        component={Record}
        initialParams={{ userId, newUser }}
        options={{
          tabBarLabel: "Record",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="microphone" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Track"
        component={Track}
        initialParams={{ userId }}
        options={{
          tabBarLabel: "Track",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="compass" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={Friends}
        initialParams={{ userId }}
        options={{
          tabBarLabel: "Friends",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        initialParams={{ userId }}
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
