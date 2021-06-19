import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { Audio } from "expo-av";
import MapView from "react-native-maps";

const Map = ({ user, styles }) => {
  return user && styles ? (
    <View>
      <Text style={styles.titleText}>Locations</Text>
      <Text style={styles.baseText}>
        Here are the locations of your friends, who've enabled location sharing.
      </Text>
      <MapView style={styles.map} />

      {/* TODO show this user's and friends-who've-enabled-location's location through markers on this map */}
    </View>
  ) : (
    <View></View>
  );
};

export default Map;
