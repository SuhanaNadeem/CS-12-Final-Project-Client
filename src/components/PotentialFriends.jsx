import React from "react";
import PotentialFriend from "./PotentialFriend";
import { View } from "react-native";

/* A component used by Search.jsx to display a group of users from a list of search results. Maps all matches to
the PotentialFriend.jsx component, where the user can send a friend request. */

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
    <></>
  );
};

export default PotentialFriends;
