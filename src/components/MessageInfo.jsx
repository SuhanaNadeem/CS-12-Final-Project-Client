import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";

import { Button, Text, View, TextInput, Pressable } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import styles from "../styles/accountStyles";
import Icon from "react-native-vector-icons/Ionicons";

const MessageInfo = ({ user }) => {
  const [values, setValues] = useState({
    userId: user && user.id,
    newPanicPhone: "",
    newPanicMessage: "",
  });
  console.log("user;");
  console.log(user);
  console.log(user.panicMessage);
  const [setMessageInfo, loadingSetMessageInfo] = useMutation(
    SET_MESSAGE_INFO,
    {
      update(_, { data: { setMessageInfo: updatedUser } }) {
        console.log(updatedUser);
        console.log("setMessageInfo successful");
      },
      onError(err) {
        console.log(err);
      },
      refetchQueries: [
        {
          query: GET_USER_BY_ID,
          variables: { userId: user && user.id },
        },
      ],
      variables: values,
      client: userClient,
    }
  );

  return user ? (
    <View
      style={{
        paddingHorizontal: 25,
        backgroundColor: "#2f4f4f",
        height: 300,
        marginVertical: 20,
      }}
    >
      <Text style={styles.altTitleText}>Configure Message Info</Text>

      <TextInput
        onChangeText={(text) => {
          setValues({ ...values, newPanicPhone: text.toString() });
        }}
        style={styles.input}
        // keyboardType={"phone-pad"}
        value={values.newPanicPhone}
        placeholder={user.panicPhone ? user.panicPhone : "Your panic phone"}
        placeholderTextColor="#2f4f4f"
      />
      <TextInput
        onChangeText={(text) => setValues({ ...values, newPanicMessage: text })}
        value={values.newPanicMessage}
        placeholder={
          user.panicMessage ? user.panicMessage : "Your panic message"
        }
        style={styles.input}
        placeholderTextColor="#2f4f4f"
      />

      <Pressable
        onPress={() => {
          console.log("passing:");
          console.log(values);
          setMessageInfo();
          setValues({
            ...values,
            newPanicPhone: undefined,
            newPanicMessage: undefined,
          });
        }}
        style={styles.centered}
      >
        <Text style={styles.altSubmitText}>Submit</Text>
        <View style={styles.iconContainer}>
          <Icon
            name="ios-checkmark-done-circle-outline"
            size={30}
            color="white"
            style={{ paddingTop: 8, paddingLeft: 10 }}
          />
        </View>
      </Pressable>
    </View>
  ) : (
    <View>
      <Text>Loading panic info...</Text>
    </View>
  );
};

export const SET_MESSAGE_INFO = gql`
  mutation setMessageInfo(
    $userId: String!
    $newPanicPhone: String
    $newPanicMessage: String
  ) {
    setMessageInfo(
      userId: $userId
      newPanicPhone: $newPanicPhone
      newPanicMessage: $newPanicMessage
    ) {
      id
      name
      panicMessage
      panicPhone
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query getUserById($userId: String!) {
    getUserById(userId: $userId) {
      id

      name
      password
      email

      startKey
      panicKey
      stopKey

      createdAt
      token

      location
      locationOn

      friendIds
      requesterIds

      panicMessage
      panicPhone
    }
  }
`;
export default MessageInfo;
