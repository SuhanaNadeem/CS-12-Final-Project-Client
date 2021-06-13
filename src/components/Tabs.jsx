import Account from "../screens/Account";
import Record from "../screens/Record";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import Friends from "../screens/Friends";

const Tab = createMaterialBottomTabNavigator();

export default function Tabs({ route }) {
  const { userId } = route.params;

  return (
    <Tab.Navigator
      initialRouteName="Record"
      activeColor="#fff8dc"
      barStyle={{ backgroundColor: "#2f4f4f" }}
    >
      <Tab.Screen
        name="Record"
        component={Record}
        initialParams={{ userId }}
        options={{
          tabBarLabel: "Record",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="microphone" color={color} size={26} />
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
            <MaterialCommunityIcons name="compass" color={color} size={26} />
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
