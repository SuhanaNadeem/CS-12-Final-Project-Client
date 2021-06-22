import { gql, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Button, View, Text } from "react-native";
import { Audio } from "expo-av";
import MapView from "react-native-maps";
import * as Location from 'expo-location';


const Map = ({ user, styles }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const coords = {latitude: 37.78825, longitude: -122.4324};
  return user && styles ? (
    <View>
      <Text style={styles.titleText}>Locations</Text>
      <Text style={styles.baseText}>
        Here are the locations of your friends, who've enabled location sharing.
      </Text>
      <Text>{text}</Text>
      <MapView style={styles.map}>
        <MapView.Marker
        coordinate={coords}
        title="Some Californian place idk"
        description="Sample description"
        />
        {location && <MapView.Marker coordinate={location.coords} title={"Current location"} description={"You are here."}/>}
      </MapView>

      {/* TODO show this user's and friends-who've-enabled-location's location through markers on this map */}
    </View>
  ) : (
    <View></View>
  );
};

export default Map;
