import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";

import { Button, Text, View, TextInput } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { useRoute } from "@react-navigation/core";

const Token = ({ styles, token, type }) => {
  return token ? (
    <View>
      <Text style={styles.titleText}>Temporary Text</Text>
      {/* TODO Use dot notation to access properties of token like so: { token.token } in 
      order to display each flagged token here, in a Text component. Change the colour or something based on type */}
    </View>
  ) : (
    <View>
      <Text>Loading...</Text>
    </View>
  );
};

export default Token;
