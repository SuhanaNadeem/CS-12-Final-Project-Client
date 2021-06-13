import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";

import { Button, Text, View, TextInput } from "react-native";
import { userClient } from "../../GraphqlApolloClients";

const FlaggedTokens = ({ user, styles }) => {
  // const [startKeyValues, setStartKeyValues] = useState({
  //   userId: user && user.id,
  //   startKey: "",
  // });
  // const [setStartKey, loadingSetStartKey] = useMutation(SET_START_KEY, {
  //   update(_, { data: { setStartKey: startKey } }) {
  //     console.log(startKey);
  //     console.log("Start key set successful");
  //   },
  //   onError(err) {
  //     console.log(err);
  //   },
  //   variables: startKeyValues,
  //   client: userClient,
  // });

  return (
    <View>
      <Text style={styles.titleText}>Manage Flagged Tokens</Text>
      <Text style={styles.baseText}>
        Enter words or phrases in quotation marks (""), separated by spaces,
        that you'd like to be flagged. When these are detected through interim
        recordings, event recordings will begin.
      </Text>
      {/* <TextInput
        onChangeText={(text) =>
          setStartKeyValues({ ...startKeyValues, startKey: text })
        }
        value={startKeyValues.startKey}
        placeholder={user.startKey ? user.startKey : "Your start key"}
      /> */}
      {/* <Button
        onPress={() => {
          setStartKey();
          setStartKeyValues({ ...startKeyValues, startKey: "" });
        }}
        title="Set start key"
      /> */}
    </View>
  );
};

export const SET_START_KEY = gql`
  mutation setStartKey($userId: String!, $startKey: String!) {
    setStartKey(userId: $userId, startKey: $startKey)
  }
`;

export default FlaggedTokens;
