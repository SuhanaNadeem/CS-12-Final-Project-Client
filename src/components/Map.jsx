import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Button, View, Text, Pressable } from "react-native";
import { Audio } from "expo-av";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { userClient } from "../../GraphqlApolloClients";
import FriendMapMarker from "./FriendMapMarker";
import styles from "../styles/trackStyles";
import Icon from "react-native-vector-icons/MaterialIcons";

/* Display a map with the current location of the user and their friends, if they're friends have enabled location sharing through
`locationOn`. Toggle this property through this component. */

const Map = ({ user }) => {
  const [location, setLocation] = useState(null);

  const [values, setValues] = useState({
    userId: user && user.id,
    location: "", // Before location is refreshed, it should be empty
  });

  const [setUserLocation] = useMutation(SET_USER_LOCATION, {
    // update() {
    //   console.log("setUserLocation called");
    // },
    onError(err) {
      console.log(err);
    },
    // Make sure the friends update, since they contain location attribute needed
    refetchQueries: [
      {
        query: GET_FRIENDS,
        variables: { userId: user && user.id },
      },
    ],
    variables: values,
    client: userClient,
  });

  const [toggleLocationOn] = useMutation(TOGGLE_LOCATION_ON, {
    // update() {
    //   console.log("toggleLocationOn called");
    // },
    onError(err) {
      console.log(err);
    },
    // Refetch user with updated location attribute
    refetchQueries: [
      {
        query: GET_USER_BY_ID,
        variables: { userId: user && user.id },
      },
    ],
    variables: { userId: user && user.id },
    client: userClient,
  });

  const { data: { getFriends: friends } = {} } = useQuery(GET_FRIENDS, {
    variables: { userId: user && user.id },
    client: userClient,
  });

  // This useEffect periodically updates the user's location, by getting it from Expo and calling `setUserLocation`
  useEffect(() => {
    if (location) {
      var stringedLocation = JSON.stringify(location);
      setValues({ ...values, location: stringedLocation });
      setUserLocation();
    }
    const interval = setInterval(async () => {
      updateLocation();
    }, 60000);

    return () => clearInterval(interval);
  }, [location]);

  useEffect(() => {
    if (user && user.locationOn) {
      updateLocation();
    }
  }, []);

  async function updateLocation() {
    if (user && user.locationOn) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
  }

  async function toggleLocation() {
    toggleLocationOn();
    // Privacy feature, set location to empty string in case it is sent to a friend's app
    if (user && !user.locationOn) {
      setValues({ ...values, location: "" });
      setUserLocation();
    } else {
      updateLocation();
    }
  }

  return user ? (
    <View style={{ paddingHorizontal: 25 }}>
      <Text style={styles.titleText}>Locations</Text>
      <Text style={styles.baseText}>
        Here are the locations of your friends who've enabled location sharing.
      </Text>
      <MapView style={styles.map}>
        {/* Show the user's last location */}
        {location && (
          <MapView.Marker
            pinColor={"rgb(127, 0, 255)"}
            coordinate={location.coords}
            title={"Current location"}
            description={"You are here."}
          />
        )}
        {/* Show the user's friends' locations, if enabled */}
        {friends &&
          friends.map((friend, index) =>
            friend.locationOn && friend.location && friend.location != "" ? (
              <FriendMapMarker key={index} friend={friend} />
            ) : (
              <Text key={index}></Text>
            )
          )}
      </MapView>

      <Pressable onPress={toggleLocation} style={styles.centered}>
        <Text style={styles.submitText}>
          {user.locationOn ? "Stop Sharing Location" : "Share Location"}
        </Text>
        <View>
          <Icon
            name={user.locationOn ? "location-on" : "location-off"}
            size={30}
            color="#2f4f4f"
            style={{ paddingTop: 8, paddingLeft: 10 }}
          />
        </View>
      </Pressable>

      <Pressable onPress={updateLocation} style={styles.centeredEnd}>
        <Text style={styles.submitText}>Refresh Location</Text>
        <View>
          <Icon
            name="refresh"
            size={30}
            color="#2f4f4f"
            style={{ paddingTop: 8, paddingLeft: 10 }}
          />
        </View>
      </Pressable>
    </View>
  ) : (
    <View></View>
  );
};

export const SET_USER_LOCATION = gql`
  mutation setUserLocation($location: String!, $userId: String!) {
    setUserLocation(location: $location, userId: $userId)
  }
`;

export const TOGGLE_LOCATION_ON = gql`
  mutation toggleLocationOn($userId: String!) {
    toggleLocationOn(userId: $userId)
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

export const GET_FRIENDS = gql`
  query getFriends($userId: String!) {
    getFriends(userId: $userId) {
      id
      email
      startKey
      stopKey
      panicKey
      friendIds
      requesterIds
      location
      locationOn
      name
    }
  }
`;

export default Map;
