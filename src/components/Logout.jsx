import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  StatusBar,
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";
import { UserAuthContext } from "../context/userAuth";
import styles from "../styles/accountStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Logout = ({ navigation }) => {
  const { logoutUser } = useContext(UserAuthContext);
  return (
    <Pressable
      onPress={() => {
        logoutUser();
        navigation.navigate("Landing");
      }}
      style={styles.centered}
    >
      <Text style={styles.submitText}>Log Out</Text>
      <View>
        <Icon
          name="logout"
          size={30}
          color="#2f4f4f"
          style={{ paddingTop: 8, paddingLeft: 10 }}
        />
      </View>
    </Pressable>
  );
};

export default Logout;
