import { gql, useQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, View } from "react-native";
import { Audio } from "expo-av";
import { userClient } from "../../GraphqlApolloClients";

const Play = ({ eventRecording, userId }) => {
  // TODO rn when you hit pause and then hit play again, it starts from the beginning. It should start where you left off

  //  TODO use ternaries in the return() to check the value of playing to do the following:
  //  - show play/pause icons appropriately (replace the text),
  //  - show 'share' icon that opens up the message dialogue box, passing the first eventRecordingUrl of this current group as an attachment
  //    (phone # and message will be manually filled by the user) -- SEE RECORD FOR SMS CODE
  //  - if you have time -- allow replay (show a replay icon) - make another function for replay

  // TODO ctrl+f Awesome to see how to use icons. You'll have to google the icon lib to see what's available, and make the icons pressable

  const [soundToPlay, setSoundToPlay] = useState();

  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return soundToPlay
      ? () => {
          console.log("Unloading Sound");
          soundToPlay.unloadAsync();
        }
      : undefined;
  }, [soundToPlay]);

  var count = 0;

  async function startPlaying() {
    if (count < eventRecording.eventRecordingUrls.length) {
      console.log("Enters this if");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true,
      });
      console.log("Current index: " + count);

      const { sound } = await Audio.Sound.createAsync(
        {
          uri: eventRecording && eventRecording.eventRecordingUrls[count],
        },
        { shouldPlay: true }
      );
      setSoundToPlay(sound);
      setPlaying(true);
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish === true) {
          count += 1;
          startPlaying();
        }
      });
      console.log("reaching here");
    } else {
      console.log("No more left");
      await stopPlaying();
    }
  }

  async function stopPlaying() {
    setPlaying(false);
    if (soundToPlay) {
      try {
        await soundToPlay.pauseAsync();
        await soundToPlay.unloadAsync();
      } catch (e) {
        console.log("error in stop...");
        console.log(e);
      }

      console.log("Stopping sound..");
    }
  }

  return (
    <View>
      <Button
        title={playing ? "Pause" : "Play"}
        onPress={playing ? stopPlaying : startPlaying}
      />
    </View>
  );
};

export default Play;
