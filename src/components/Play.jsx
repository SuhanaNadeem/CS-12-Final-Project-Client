import { gql, useQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, View } from "react-native";
import { Audio } from "expo-av";
import { userClient } from "../../GraphqlApolloClients";

const Play = ({ eventRecording, userId }) => {
  const [soundToPlay, setSoundToPlay] = useState();

  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);

  const [eventRecordingIndex, setEventRecordingIndex] = useState(0);

  // useEffect(() => {
  //   async function fun() {
  //     if (eventRecording) {
  //       console.log("useEffect eventRecording true");
  //       console.log(eventRecording && eventRecording.eventRecordingUrls[0]);
  //       console.log(" ");
  //       var sound = await Audio.Sound.createAsync(
  //         { uri: eventRecording && eventRecording.eventRecordingUrls[0] },
  //         { shouldPlay: true }
  //       );
  //       setSoundToPlay(sound);
  //       // startPlaying(); // testing, not needed
  //     }
  //   }
  //   fun();
  // }, [eventRecording]);

  // useEffect(() => {
  //   console.log("enter soundToPlay useEffect");
  //   console.log(soundToPlay);
  //   if (soundToPlay) {
  //     console.log("soundToPlay object:");
  //     console.log(soundToPlay);
  //     console.log("Before .setOnePlaybackStatusUpdate");
  //     // soundToPlay.setOnPlaybackStatusUpdate(async (status) => {
  //     //   if (status.didJustFinish === true) {
  //     //     queueNextRecording();
  //     //     await soundToPlay.unloadAsync();
  //     //   }
  //     // });
  //     // soundToPlay.setOnPlaybackStatusUpdate(async (status) => {
  //     //   console.log("status update function called");
  //     //   console.log(status);
  //     // });
  //     console.log("After .setOnePlaybackStatusUpdate");
  //     // startPlaying(); // testing, not needed
  //   }
  // }, [soundToPlay]);

  // Check if playing is true, and if the audio has stopped, set soundToPlay to the next recording in the event recording group
  // async function queueNextRecording() { // Called when playback status of soundToPlay has just finished
  //   console.log("Entered queueNextRecording");
  //   // console.log(eventRecording);
  //   if (eventRecording && playing && soundToPlay) {
  //     console.log("Passed queueNextRecording condition");
  //     if (eventRecordingIndex < eventRecording.eventRecordingUrls.length - 1) {
  //       setEventRecordingIndex(eventRecordingIndex + 1);
  //       // Stop soundToPlay, change the recording, then play the next recording in the group
  //       soundToPlay.stopAsync();

  //       // set soundToPlay to next recording (eventRecordingIndex)
  //       var sound = await Audio.Sound.createAsync(
  //         {
  //           uri: eventRecording.eventRecordingUrls[eventRecordingIndex],
  //         },
  //         { shouldPlay: true }
  //       );

  //       console.log("before set sound to play");
  //       setSoundToPlay(sound);
  //       console.log("after set sound to play");

  //       startPlaying();
  //     } else {
  //       // Set playing to false and bring eventRecordingIndex to 0
  //       stopPlaying();
  //       setEventRecordingIndex(0);
  //     }
  //   }
  // }

  // https://forums.expo.io/t/is-it-possible-to-check-when-sound-has-finished-playing/27679/5
  // Register an update function:
  // console.log("soundToPlay1:");
  // console.log(soundToPlay);
  // if (soundToPlay) {
  //   console.log("soundToPlay2:");
  //   console.log(soundToPlay);
  //   soundToPlay.setOnPlaybackStatusUpdate(async (status) => {
  //     if (status.didJustFinish === true) {
  //       queueNextRecording();
  //       await soundToPlay.unloadAsync();
  //     }
  //   });
  // }

  useEffect(() => {}, []);

  useEffect(() => {
    async function changeSound() {
      console.log("changeSound");
      if (finished) {
        console.log("Entered this if statement");
        var newIndex = (eventRecordingIndex += 1);
        setEventRecordingIndex(newIndex);
        var sound = await Audio.Sound.createAsync(
          {
            uri:
              eventRecording &&
              eventRecording.eventRecordingUrls[eventRecordingIndex],
          },
          { shouldPlay: true }
        );
        setSoundToPlay(sound);
        setFinished(false);
      }
    }
    changeSound();
  }, [finished]);

  async function startPlaying() {
    console.log("Index: " + eventRecordingIndex);
    console.log(eventRecordingIndex);
    var sound = await Audio.Sound.createAsync(
      {
        uri:
          eventRecording &&
          eventRecording.eventRecordingUrls[eventRecordingIndex],
      },
      { shouldPlay: true }
    );
    setSoundToPlay(sound);
    setPlaying(true);

    if (soundToPlay && !finished) {
      console.log(
        "*********************************Starting to play soundToPlay"
      );
      // await soundToPlay.loadAsync();
      await Audio.Sound.createAsync(
        {
          uri:
            eventRecording &&
            eventRecording.eventRecordingUrls[eventRecordingIndex],
        },
        { shouldPlay: true }
      ).playAsync();
      console.log("Finished ");
      // soundToPlay.unloadAsync();
    }
    console.log("`````````````````````````````````````````````````finished");
    setFinished(true);
  }

  //   // TODO: make it so it changes to "start" again after playing once
  //   // const status = await soundToPlay.getStatusAsync();
  //   // console.log(status.isPlaying);
  //   // if (!status.isPlaying) {
  //   //   setPlaying(false);
  //   // }
  // }

  async function stopPlaying() {
    setPlaying(false);

    soundToPlay.stopAsync();
    // if (soundToPlay) {

    console.log("Stopping sound..");
    //   soundToPlay.stopAndUnloadAsync();
    //   console.log("Playing stopped");
    // }
  }

  return (
    <View>
      {/* <Button title={"Queue next recording"} onPress={queueNextRecording} /> */}
      <Button
        title={playing ? "Stop playing" : "Start playing"}
        onPress={playing ? stopPlaying : startPlaying}
      />
    </View>
  );
};

export default Play;
