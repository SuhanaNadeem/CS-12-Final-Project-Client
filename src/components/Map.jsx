import { gql, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Button, View, Text } from "react-native";
import { Audio } from "expo-av";
import MapView from "react-native-maps";
import * as Location from "expo-location";

const Map = ({ user, styles }) => {
  // TODO get and store the user's current location, using the setUserLocation mutation.. It should send a push notification to ask once,
  // but we'll always get the user's location and store it, and just allow them to toggle whether or not anyone (including them) can see a marker for it on their map

  // TODO Create a useState for a button, enabled. Then make a Button component (imported from react-native) which
  // sets enabled to the opposite value when pressed. The onPress, before calling setEnabled, should pass in
  // the current value of it to a mutation call for toggleLocationOn -- if false is passed, user's locationOn will be set to true...
  // IMPORTANT: in that mutation's useMutation here, you need to use refetchQueries to refetch getUser

  // TODO call query getFriendLocations

  // TODO CTRL+f refetchQueries, onPress (there's an enabled button in InterimRecordings) in Client

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const coords = { latitude: 37.78825, longitude: -122.4324 };
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
        <MapView.Marker
          coordinate={coords}
          title="Some Californian place idk"
          description="Sample description"
        />
        {location && (
          <MapView.Marker
            coordinate={location.coords}
            title={"Current location"}
            description={"You are here."}
          />
        )}
      </MapView>

      {/* TODO if friendLocations exists and has length > 0, map each one to put a marker for each location */}
    </View>
  ) : (
    <View></View>
  );
};

export default Map;
