import { gql, useQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, View, Text, Pressable } from "react-native";
import { Audio } from "expo-av";
import { userClient } from "../../GraphqlApolloClients";
import styles from "../styles/recordStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import * as SMS from "expo-sms";

const PlayShareRemove = ({ createdAt, eventRecording, userId }) => {
  // TODO rn when you hit pause and then hit play again, it starts from the beginning. It should start where you left off

  //  TODO use ternaries in the return() to check the value of playing to do the following:
  //  - show play/pause icons appropriately (replace the text),
  //  - 'remove' icon that deletes this entire group on press using the appropriate (already-made) mutation...
  //     needs to have getEventRecordingsByUser in refetchQueries
  //  - if you have time -- allow replay (show a replay icon) - make another function for replay

  // I think each of these PlayShareRemove should look like the cards in the right screen here: https://cdn.dribbble.com/users/481951/screenshots/7710920/media/943884515fe15857846abf4e0cf11d02.png?compress=1&resize=400x300
  // (except with the three icons we need instead of just the one) -- you'll have to Google styling stuff

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

  // TODO as mentioned below, this needs to be moved...
  async function sendMessage() {
    // Opens up message dialog box where user can manually enter contact + message, but the attachment is already added
    const { result } = await SMS.sendSMSAsync([], "", {
      // TODO put the current EventRecording chunk's first url
      attachments: {
        uri: eventRecording.eventRecordingUrls[eventRecordingUrls.length - 1], // CHANGE THIS
        mimeType: "audio/wav",
        filename: "myfile.wav",
      },
    });
    console.log(result);
  }

  return (
    <Pressable style={styles.card}>
      <Text
        style={{
          fontSize: 16,
          color: "#2f4f4f",
        }}
      >
        {String(createdAt).substring(0, 10)}
        {", "}
        {String(createdAt).substring(11, 16)}
      </Text>
      <View style={styles.iconContainer}>
        <Icon
          onPress={playing ? stopPlaying : startPlaying}
          name={playing ? "stop-circle" : "play-circle"}
          size={40}
          color="#2f4f4f"
        />
        <Icon
          onPress={sendMessage}
          style={{ paddingLeft: 14 }}
          name="share"
          size={30}
          color="#2f4f4f"
        />
        <Icon
          // onPress={}
          style={{ paddingLeft: 14 }}
          name="trash"
          size={30}
          color="#2f4f4f"
        />
      </View>
    </Pressable>
  );
};

export const DELETE_EVENT_RECORDING = gql`
  mutation deleteEventRecording($eventRecordingId: String!) {
    deleteEventRecording(eventRecordingId: $eventRecordingId)
  }
`;
export default PlayShareRemove;
