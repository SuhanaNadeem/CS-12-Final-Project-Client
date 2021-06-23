import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";

import { Button, Text, View, TextInput } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import styles from "../styles/accountStyles";

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
    <View>
      <Text style={styles.titleText}>Manage Message Info</Text>

      <TextInput
        onChangeText={(text) => {
          setValues({ ...values, newPanicPhone: text.toString() });
        }}
        keyboardType={"phone-pad"}
        value={values.newPanicPhone}
        placeholder={user.panicPhone ? user.panicPhone : "Your panic phone"}
      />
      <TextInput
        onChangeText={(text) => setValues({ ...values, newPanicMessage: text })}
        value={values.newPanicMessage}
        placeholder={
          user.panicMessage ? user.panicMessage : "Your panic message"
        }
      />

      <Button
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
        title="Set message info"
      />
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
      email
      startKey
      stopKey
      panicKey
      name
      requesterIds
      friendIds
      panicMessage
      panicPhone
    }
  }
`;
export default MessageInfo;
