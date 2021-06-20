// import { gql, useMutation } from "@apollo/client";
// import React, { useState } from "react";
// import { Button, View } from "react-native";
// import { Audio } from "expo-av";

// const Play = ({ soundToPlay }) => {
//   const [playing, setPlaying] = useState(false);
//   async function startPlaying() {
//     if (soundToPlay) {
//       console.log("Starting to play sound..");
//       await soundToPlay.playAsync();
//       setPlaying(true);
//       console.log("Status");
//     } else {
//       console.log("No sound to play");
//     }

//     // TODO: make it so it changes to "start" again after playing once
//     // const status = await soundToPlay.getStatusAsync();
//     // console.log(status.isPlaying);
//     // if (!status.isPlaying) {
//     //   setPlaying(false);
//     // }
//   }

//   async function stopPlaying() {
//     if (soundToPlay) {
//       console.log("Stopping sound..");
//       soundToPlay.stopAsync();
//       setPlaying(false);
//       console.log("Playing stopped");
//       //   setSoundToPlay();
//     }
//   }

//   return soundToPlay ? (
//     <Button
//       title={playing ? "Stop Playing" : "Start Playing"}
//       onPress={playing ? stopPlaying : startPlaying}
//     />
//   ) : (
//     <View></View>
//   );
// };

// export default Play;

import { gql, useQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, View } from "react-native";
import { Audio } from "expo-av";
import { userClient } from "../../GraphqlApolloClients";

const Play = ({ eventRecording, userId }) => {
  const [soundToPlay, setSoundToPlay] = useState();

  console.log("Event recording");
  console.log(eventRecording);

  var currentEventRecording;
  const [playing, setPlaying] = useState(false);
  var eventRecordingIndex = 0;

  useEffect(() => {
    if (eventRecording) {
      currentEventRecording = eventRecording;
      var sound = Audio.Sound.createAsync(
        { uri: currentEventRecording.eventRecordingUrls[0] },
        { shouldPlay: true }
      );
      setSoundToPlay(sound);
    }
  }, [eventRecording]);

  // Check if playing is true, and if the audio has stopped, set soundToPlay to the next recording in the event recording group
  async function queueNextRecording() {
    console.log("Entered queueNextRecording");
    setPlaying(true);
    console.log(eventRecordingsByUser);
    if (eventRecordingsByUser && playing) {
      console.log("Passed queueNextRecording condition");
      if (eventRecordingIndex < eventRecordingsByUser - 1) {
        eventRecordingIndex++;
        // Stop soundToPlay, change the recording, then play the next recording in the group
        soundToPlay.stopAsync();

        // set soundToPlay to next recording (eventRecordingIndex)
        var sound = Audio.Sound.createAsync(
          {
            uri: currentEventRecording.eventRecordingUrls[eventRecordingIndex],
          },
          { shouldPlay: true }
        );

        setSoundToPlay(sound);

        startPlaying();
      } else {
        // Set playing to false and bring eventRecordingIndex to 0
        stopPlaying();
        eventRecordingIndex = 0;
      }
    }
  }

  // https://forums.expo.io/t/is-it-possible-to-check-when-sound-has-finished-playing/27679/5
  // Register an update function:
  if (soundToPlay) {
    soundToPlay.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish === true) {
        queueNextRecording();
        await soundToPlay.unloadAsync();
      }
    });
  }

  async function startPlaying() {
    if (soundToPlay) {
      console.log("Starting to play sound..");
      await soundToPlay.playAsync();
      setPlaying(true);
      console.log("Status");
    } else {
      console.log("No sound to play");
    }

    // TODO: make it so it changes to "start" again after playing once
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

  //   return soundToPlay ? (
  //     <View>
  //       <Button
  //         title={playing ? "Stop Playing" : "Start Playing"}
  //         onPress={playing ? stopPlaying : startPlaying}
  //       />

  //       <Button
  //         title={"Delete recording"}
  //         onPress={deleteRecordingEvent}
  //       />
  //     </View>
  //   ) : (
  //     <View></View>
  //   );
  // };

  return (
    <View>
      <Button title={"Queue next recording"} onPress={queueNextRecording} />
    </View>
  );
};

export default Play;
