import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import PotentialFriend from "./PotentialFriend";

const PotentialFriends = ({ name, matchedUsers, user }) => {
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
