import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import Icon from "react-native-vector-icons/FontAwesome";

const AddedFriend = ({ friend, user, styles }) => {
  const [values, setValues] = useState({
    userId: user && user.id,
    friendId: friend && friend.id,
  });
  const [removeFriend, loadingRemoveFriend] = useMutation(REMOVE_FRIEND, {
    update(_, { data: { removeFriend: removeFriendData } }) {
      console.log("Submitted removeFriend");
    },
    onError(err) {
      console.log(err);
    },
    refetchQueries: [
      {
        query: GET_FRIENDS,
        variables: { userId: user && user.id },
      },
    ],
    variables: values,
    client: userClient,
  });

  return user && friend ? (
    <View style={(styles.container, styles.iconAndText)}>
      {/* <MaterialCommunityIcons name="group" color="#fff8dc" size={26} /> */}
      {/* <Icon
        path={mdiAccount}
        size={1}
        horizontal
        vertical
        rotate={90}
        color="#fff8dc"
      /> */}
      {/* <MdPersonOutline size={30} /> */}
      {/* <FontAwesome5 name={"user-friends"} size={30} color={"#fff8dc"} /> */}
      <Text>{friend.name}</Text>
      <Icon
        onPress={() => {
          removeFriend();
        }}
        name="trash"
        size={30}
        color="#fff8dc"
      />

      {/* <Button
        onPress={() => {
          removeFriend();
        }}
        title="Title"
        style={styles.button}
      /> */}
    </View>
  ) : (
    <></>
  );
};
export const REMOVE_FRIEND = gql`
  mutation removeFriend($friendId: String!, $userId: String!) {
    removeFriend(friendId: $friendId, userId: $userId)
  }
`;
export const GET_FRIENDS = gql`
  query getFriends($userId: String!) {
    getFriends(userId: $userId) {
      id
      email
      startKey
      stopKey
      panicKey
      name
      requesterIds
      friendIds
    }
  }
`;

export default AddedFriend;
