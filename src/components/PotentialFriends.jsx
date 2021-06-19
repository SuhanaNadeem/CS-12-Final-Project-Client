import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import PotentialFriend from "./PotentialFriend";

const PotentialFriends = ({ matchedUsers, user, styles }) => {
  // console.log("In users");
  // console.log("users in here:");
  // console.log(users);
  return matchedUsers && matchedUsers.length != 0 ? (
    <View>
      {matchedUsers.map(
        (matchedUser, index) =>
          matchedUser.id != user.id && (
            <PotentialFriend
              key={index}
              matchedUser={matchedUser}
              styles={styles}
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
