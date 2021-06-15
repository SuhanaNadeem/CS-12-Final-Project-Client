import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";

import { Button, Text, View, TextInput } from "react-native";
import { userClient } from "../../GraphqlApolloClients";

const Keys = ({ userId, styles }) => {
  const { data: { getUserById: user } = {} } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
    client: userClient,
  });

  const [startKeyValues, setStartKeyValues] = useState({
    userId: userId,
    startKey: "",
  });
  const [setStartKey, loadingSetStartKey] = useMutation(SET_START_KEY, {
    update(_, { data: { setStartKey: startKey } }) {
      console.log(startKey);
      console.log("Start key set successful");
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
    variables: startKeyValues,
    client: userClient,
  });

  const [stopKeyValues, setStopKeyValues] = useState({
    userId: user.id,
    stopKey: "",
  });
  const [setStopKey, loadingSetStopKey] = useMutation(SET_STOP_KEY, {
    update(_, { data: { setStopKey: stopKey } }) {
      console.log(stopKey);
      console.log("Stop key set successful");
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
    variables: stopKeyValues,
    client: userClient,
  });

  const [panicKeyValues, setPanicKeyValues] = useState({
    userId: user.id,
    panicKey: "",
  });
  const [setPanicKey, loadingSetPanicKey] = useMutation(SET_PANIC_KEY, {
    update(_, { data: { setPanicKey: panicKey } }) {
      console.log(panicKey);

      console.log("Panic key set successful");
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
    variables: panicKeyValues,
    client: userClient,
  });

  return user ?(
    <View>
      <Text style={styles.titleText}>Manage Keys</Text>

      <TextInput
        onChangeText={(text) =>
          setStartKeyValues({ ...startKeyValues, startKey: text })
        }
        value={startKeyValues.startKey}
        placeholder={user.startKey ? user.startKey : "Your start key"}
      />
      <Button
        onPress={() => {
          setStartKey();
          setStartKeyValues({ ...startKeyValues, startKey: "" });
        }}
        title="Set start key"
      />
      <TextInput
        onChangeText={(text) =>
          setStopKeyValues({ ...stopKeyValues, stopKey: text })
        }
        value={stopKeyValues.stopKey}
        placeholder={user.stopKey ? user.stopKey : "Your stop key"}
      />
      <Button
        onPress={() => {
          setStopKey();
          setStopKeyValues({ ...stopKeyValues, stopKey: "" });
        }}
        title="Set stop key"
      />
      <TextInput
        onChangeText={(text) =>
          setPanicKeyValues({ ...panicKeyValues, panicKey: text })
        }
        value={panicKeyValues.panicKey}
        placeholder={user.panicKey ? user.panicKey : "Your panic key"}
      />
      <Button
        onPress={() => {
          setPanicKey();
          setPanicKeyValues({ ...panicKeyValues, panicKey: "" });
        }}
        title="Set panic key"
      />
    </View>
  ):(<View><Text>Loading keys...</Text></View>);
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
      email
      startKey
      stopKey
      panicKey
    }
  }
`;
export default Keys;