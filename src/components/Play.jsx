import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View } from "react-native";
import { Audio } from "expo-av";

const Play = ({ soundToPlay }) => {
  const [playing, setPlaying] = useState(false);
  async function startPlaying() {
    if (soundToPlay) {
      console.log("Starting to play sound..");
      await soundToPlay.playAsync();
      setPlaying(true);
      console.log("Status");
    } else {
      console.log("No sound to play");
    }

    //   TODO: make it so it changes to "start" again after playing once
    // const status = await soundToPlay.getStatusAsync();
    // console.log(status.isPlaying);
    // if (!status.isPlaying) {
    //   setPlaying(false);
    // }
  }

  async function stopPlaying() {
    if (soundToPlay) {
      console.log("Stopping sound..");
      soundToPlay.stopAsync();
      setPlaying(false);
      console.log("Playing stopped");
      //   setSoundToPlay();
    }
  }

  return soundToPlay ? (
    <Button
      title={playing ? "Stop Playing" : "Start Playing"}
      onPress={playing ? stopPlaying : startPlaying}
    />
  ) : (
    <View></View>
  );
};

export default Play;
