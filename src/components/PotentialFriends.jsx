import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import PotentialFriend from "./PotentialFriend";
import styles from "../styles/friendsStyles";

const PotentialFriends = ({ name, matchedUsers, user }) => {
  // console.log("In users");
  // console.log("users in here:");
  // console.log(users);
  return matchedUsers && matchedUsers.length != 0 ? (
    <View>
      {matchedUsers.map(
        (matchedUser, index) =>
          matchedUser.id != user.id && (
            <PotentialFriend
              name={name}
              key={index}
              matchedUser={matchedUser}
              user={user}
            />
          )
      )}
    </View>
  ) : (
    <View></View>
  );
};

export default PotentialFriends;
