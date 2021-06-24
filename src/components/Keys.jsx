import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Text, View, TextInput } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import styles from "../styles/accountStyles";
import Icon from "react-native-vector-icons/Ionicons";

/* Set each of the users voice keys, used to indicate 'start', 'stop', or 'panic' with reference to event recordings. */

const Keys = ({ user }) => {
  // Call setStartKey with the entered values, stored in a state to allow updates
  const [startKeyValues, setStartKeyValues] = useState({
    userId: user && user.id,
    startKey: "",
  });
  const [setStartKey] = useMutation(SET_START_KEY, {
    // update(_, { data: { setStartKey: startKey } }) {
    //   console.log(startKey);
    //   console.log("Start key set successful");
    // },
    onError(err) {
      console.log(err);
    },
    // Need to update the key display
    refetchQueries: [
      {
        query: GET_USER_BY_ID,
        variables: { userId: user && user.id },
      },
    ],
    variables: startKeyValues,
    client: userClient,
  });

  // Call setStopKey with the entered values, stored in a state to allow updates
  const [stopKeyValues, setStopKeyValues] = useState({
    userId: user && user.id,
    stopKey: "",
  });
  const [setStopKey] = useMutation(SET_STOP_KEY, {
    // update(_, { data: { setStopKey: stopKey } }) {
    //   console.log(stopKey);
    //   console.log("Stop key set successful");
    // },
    onError(err) {
      console.log(err);
    },
    // Need to update the key display
    refetchQueries: [
      {
        query: GET_USER_BY_ID,
        variables: { userId: user && user.id },
      },
    ],
    variables: stopKeyValues,
    client: userClient,
  });

  // Call setPanicKey with the entered values, stored in a state to allow updates
  const [panicKeyValues, setPanicKeyValues] = useState({
    userId: user && user.id,
    panicKey: "",
  });
  const [setPanicKey] = useMutation(SET_PANIC_KEY, {
    // update(_, { data: { setPanicKey: panicKey } }) {
    //   console.log(panicKey);
    //   console.log("Panic key set successful");
    // },
    onError(err) {
      console.log(err);
    },
    // Need to update the key display
    refetchQueries: [
      {
        query: GET_USER_BY_ID,
        variables: { userId: user && user.id },
      },
    ],
    variables: panicKeyValues,
    client: userClient,
  });

  return user ? (
    <View style={{ paddingHorizontal: 25 }}>
      <Text style={styles.bodyTitleText}>Set Voice Keys</Text>

      <View style={styles.keyBar}>
        <TextInput
          onChangeText={(text) =>
            setStartKeyValues({ ...startKeyValues, startKey: text })
          }
          value={startKeyValues.startKey}
          placeholder={user.startKey ? user.startKey : "Your start key"}
          style={{ color: "#2f4f4f", fontSize: 16, overflow: "hidden" }}
          placeholderTextColor="rgba(47, 79, 79, 0.7)"
        />

        <View style={styles.iconContainer}>
          <Icon
            name="enter"
            size={40}
            color="#2f4f4f"
            onPress={() => {
              setStartKey();
              setStartKeyValues({ ...startKeyValues, startKey: "" });
            }}
          />
        </View>
      </View>

      <View style={styles.keyBar}>
        <TextInput
          onChangeText={(text) =>
            setStopKeyValues({ ...stopKeyValues, stopKey: text })
          }
          value={stopKeyValues.stopKey}
          placeholder={user.stopKey ? user.stopKey : "Your stop key"}
          style={{ color: "#2f4f4f", fontSize: 16, overflow: "hidden" }}
          placeholderTextColor="rgba(47, 79, 79, 0.7)"
        />

        <View style={styles.iconContainer}>
          <Icon
            name="enter"
            size={40}
            color="#2f4f4f"
            onPress={() => {
              setStopKey();
              setStopKeyValues({ ...stopKeyValues, stopKey: "" });
            }}
          />
        </View>
      </View>
      <View style={styles.keyBar}>
        <TextInput
          onChangeText={(text) =>
            setPanicKeyValues({ ...panicKeyValues, panicKey: text })
          }
          value={panicKeyValues.panicKey}
          placeholder={user.panicKey ? user.panicKey : "Your panic key"}
          style={{ color: "#2f4f4f", fontSize: 16, overflow: "hidden" }}
          placeholderTextColor="rgba(47, 79, 79, 0.7)"
        />

        <View style={styles.iconContainer}>
          <Icon
            name="enter"
            size={40}
            color="#2f4f4f"
            onPress={() => {
              setPanicKey();
              setPanicKeyValues({ ...panicKeyValues, panicKey: "" });
            }}
          />
        </View>
      </View>
    </View>
  ) : (
    <View>
      <Text>Loading keys...</Text>
    </View>
  );
};

export const SET_START_KEY = gql`
  mutation setStartKey($userId: String!, $startKey: String!) {
    setStartKey(userId: $userId, startKey: $startKey)
  }
`;

export const SET_STOP_KEY = gql`
  mutation setStopKey($userId: String!, $stopKey: String!) {
    setStopKey(userId: $userId, stopKey: $stopKey)
  }
`;

export const SET_PANIC_KEY = gql`
  mutation setPanicKey($userId: String!, $panicKey: String!) {
    setPanicKey(userId: $userId, panicKey: $panicKey)
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
export default Keys;
