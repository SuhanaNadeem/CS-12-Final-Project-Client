import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  StatusBar,
  Text,
  View,
  TextInput,
} from "react-native";
import { Audio, Video } from 'expo-av';

const RecordingPlayback = ({ s3RecordingUrl }) => {
    console.log("Url: " + s3RecordingUrl);
    // const { sound: playbackObject } = Audio.Sound.createAsync(
    //   { uri: s3RecordingUrl },
    //   { shouldPlay: true }
    // );
    const [sound, setSound] = React.useState();

    async function playSound() {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(
        { uri: s3RecordingUrl },
        { shouldPlay: true }
      );
      setSound(sound);

      console.log('Playing Sound');
      await sound.playAsync(); }

    React.useEffect(() => {
      return sound
        ? () => {
            console.log('Unloading Sound');
            sound.unloadAsync(); }
        : undefined;
    }, [sound]);

    return (
      <Button
        title={"startPlaying"}
        onPress={playSound}
      />
    );
};

export default RecordingPlayback;