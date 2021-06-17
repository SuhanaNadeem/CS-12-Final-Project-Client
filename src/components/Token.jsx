import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";

import { Button, Text, View, TextInput } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { useRoute } from "@react-navigation/core";

// token is a string, passed as FlaggedToken.token

const Token = ({ styles, token, type }) => {
  return token ? (
    <View>
      {/* <Text style={styles.titleText}>Temporary Text</Text> */}
      {/* <Text>Temporary Text</Text> */}
      <Text style={type == "Police" ? {color: "blue"} : {color: "red"}}>
      {`\u2022 ${token}`}
      </Text>
    </View>
  ) : (
    <View>
      <Text>Loading...</Text>
    </View>
  );
};

export default Token;
