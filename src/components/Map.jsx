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

  const [setUserLocation, loadingSetUserLocation] = useMutation(SET_USER_LOCATION, {
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
        variables: { userId: user && user.id }
      },
    ],
    variables: values,
    client: userClient,
  });

  const [toggleLocationOn, loadingToggleLocationOn] = useMutation(TOGGLE_LOCATION_ON, {
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
        variables: { userId: user && user.id }
      },
    ],
    variables: {userId: user && user.id},
    client: userClient,
  });

  const { data: { getFriends: friends } = {} } = useQuery(
    GET_FRIENDS,
    {
      variables: {userId: user && user.id},
      client: userClient,
    }
  );

  // TODO get and store the user's current location, using the setUserLocation mutation.. It should send a push notification to ask once,
  // but we'll always get the user's location and store it, and just allow them to toggle whether or not anyone (including them) can see a marker for it on their map
  // IMPORTANT - a major thing to consider is the type of the currLocation arg to setUserLocation - will your front end stuff work if you're dealing with strings?
  // TypeDefs should be updated accordingly
  useEffect(() => {
    if (location) {
      var stringedLocation = JSON.stringify(location);
      setValues({...values, location: stringedLocation});
      setUserLocation();
    }
    const interval = setInterval(
    async () => {
      console.log("interval function entered");
      updateLocation();
    }, 7000);

    return () => clearInterval(interval);
  }, [location]);

  // TODO Create a useState for a button, enabled. Then make a Button component (imported from react-native) which
  // sets enabled to the opposite value when pressed. The onPress, before calling setEnabled, should pass in
  // the current value of it to a mutation call for toggleLocationOn -- if false is passed, user's locationOn will be set to true...
  // IMPORTANT: in that mutation's useMutation here, you need to use refetchQueries to refetch getUser
  // const [enabled, setEnabled] = useState();

  // TODO call query getFriendLocations

  // TODO CTRL+f refetchQueries, onPress (there's an enabled button in InterimRecordings) in Client

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
    console.log("location.coords:");
    console.log(location.coords);
  }
  console.log("Friends:");
  console.log(friends);
  async function toggleLocation() {
    toggleLocationOn();
    // Privacy feature, set location to empty string in case it is sent to a friend's app
    if (user && !user.locationOn) {
      setValues({...values, location: ""});
      setUserLocation();
    }
    else {
      updateLocation();
    }
  }

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  // const coords = { latitude: 37.78825, longitude: -122.4324 };
  return user && styles ? (
    <View>
      <Text style={styles.titleText}>Locations</Text>
      <Text style={styles.baseText}>
        Here are the locations of your friends, who've enabled location sharing.
      </Text>
      <Text>{text}</Text>
      {/* TODO add a button with an onPress as outlined above */}

      {/* TODO if user.location exists, add its marker */}
      <MapView style={styles.map}>
        {location && (
          <MapView.Marker
            pinColor={'rgb(255, 0, 255)'}
            coordinate={location.coords}
            title={"Current location"}
            description={"You are here."}
          />
        )}
        {friends && friends.map((friend, index) => (friend.locationOn && <MapView.Marker coordinate={JSON.parse(friend.location).coords} title={friend.name} description={"Your friend."}/>))}
      </MapView>
      <Button onPress={toggleLocation} title={user.locationOn ? "Stop sharing location" : "Start sharing location"} />
      {/* Replace following button with setInterval implementation */}
      <Button onPress={updateLocation} title={"Refresh my location"} />

      {/* TODO if friendLocations exists and has length > 0, map each one to put a marker for each location */}
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
