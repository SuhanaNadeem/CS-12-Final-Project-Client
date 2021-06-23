import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Button, View, Text } from "react-native";
import { Audio } from "expo-av";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { userClient } from "../../GraphqlApolloClients";
// import FriendMapMarker from "./FriendMapMarker";

const Map = ({ user, styles }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [values, setValues] = useState({
    userId: user && user.id,
    location: "", // Before location is refreshed,
  });

  const [setUserLocation, loadingSetUserLocation] = useMutation(
    SET_USER_LOCATION,
    {
      update() {
        console.log("setUserLocation called");
      },
      onError(err) {
        console.log("Unsuccessful");
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
    }
  );

  const [toggleLocationOn, loadingToggleLocationOn] = useMutation(
    TOGGLE_LOCATION_ON,
    {
      update() {
        console.log("toggleLocationOn called");
      },
      onError(err) {
        console.log("Unsuccessful");
        console.log(err);
      },
      refetchQueries: [
        {
          query: GET_USER_BY_ID,
          variables: { userId: user && user.id },
        },
      ],
      variables: { userId: user && user.id },
      client: userClient,
    }
  );

  const { data: { getFriends: friends } = {} } = useQuery(GET_FRIENDS, {
    variables: { userId: user && user.id },
    client: userClient,
  });

  useEffect(() => {
    if (location) {
      var stringedLocation = JSON.stringify(location);
      setValues({ ...values, location: stringedLocation });
      setUserLocation();
    }
    const interval = setInterval(async () => {
      console.log("interval function entered");
      updateLocation();
    }, 7000);

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
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
  }
  console.log("Friends:");
  console.log(friends);
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

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return user && styles ? (
    <View>
      <Text style={styles.titleText}>Locations</Text>
      <Text style={styles.baseText}>
        Here are the locations of your friends who've enabled location sharing.
      </Text>
      <Text>{text}</Text>
      <MapView style={styles.map}>
        {location && (
          <MapView.Marker
            pinColor={"rgb(127, 0, 255)"}
            coordinate={location.coords}
            title={"Current location"}
            description={"You are here."}
          />
        )}
        {/* {friends && friends.map((friend, index) => (friend.locationOn && friend.location && friend.location != "" && <MapView.Marker coordinate={JSON.parse(friend.location).coords} title={friend.name} description={"Your friend."}/>))} */}
        {friends &&
          friends.map((friend, index) =>
            friend.locationOn && friend.location && friend.location != "" ? (
              <MapView.Marker
                key={index}
                coordinate={JSON.parse(friend.location).coords}
                title={friend.name}
                description={"Your friend."}
              />
            ) : (
              <></>
            )
          )}
      </MapView>
      <Button
        onPress={toggleLocation}
        title={
          user.locationOn ? "Stop sharing location" : "Start sharing location"
        }
      />
      <Button onPress={updateLocation} title={"Refresh my location"} />
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
