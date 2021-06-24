import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Audio } from "expo-av";
import { userClient } from "../../GraphqlApolloClients";
import styles from "../styles/recordStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import * as SMS from "expo-sms";

/* Allow the user to play/stop, share (via Expo SMS), or remove an entire event recording. Note that these are composed of 
several event recording components, and so are played recursively in queue. */

const PlayShareRemove = ({ createdAt, eventRecording, userId }) => {
  // States to track playing status and sound object
  const [soundToPlay, setSoundToPlay] = useState();
  const [playing, setPlaying] = useState(false);

  const [deleteEventRecording] = useMutation(DELETE_EVENT_RECORDING, {
    // update() {
    //   console.log("deleteEventRecording called");
    // },
    onError(err) {
      console.log(err);
    },
    // Refetch after, to remove from display
    refetchQueries: [
      {
        query: GET_EVENT_RECORDINGS_BY_USER,
        variables: { userId: userId && userId },
      },
    ],
    variables: { eventRecordingId: eventRecording && eventRecording.id },
    client: userClient,
  });

  // Sound must be unloaded from memory on changes
  useEffect(() => {
    return soundToPlay
      ? () => {
          soundToPlay.unloadAsync();
        }
      : undefined;
  }, [soundToPlay]);

  var count = 0;

  async function startPlaying() {
    // Play till the last event recording component in this group...

    if (count < eventRecording.eventRecordingUrls.length) {
      // Prepare Audio recording by configuring device audio mdode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true,
      });

      // Play the current event recording component in this group
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: eventRecording && eventRecording.eventRecordingUrls[count],
        },
        { shouldPlay: true }
      );
      setSoundToPlay(sound);
      setPlaying(true);

      sound.setOnPlaybackStatusUpdate(async (status) => {
        // Once the current recording component finishes playing, play the next one (https://forums.expo.io/t/is-it-possible-to-check-when-sound-has-finished-playing/27679)
        if (status.didJustFinish === true) {
          count += 1;
          startPlaying();
        }
      });
    } else {
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
        // console.log(e);
      }
    }
  }

  async function sendMessage() {
    // Opens up message dialog box where user can manually enter contact + message, but the attachment is already added
    const { result } = await SMS.sendSMSAsync([], "", {
      attachments: {
        uri:
          eventRecording.eventRecordingUrls[
            eventRecording.eventRecordingUrls.length - 1
          ],
        mimeType: "audio/wav",
        filename: "alert.wav",
      },
    });
    console.log(result);
  }

  return (
    <Pressable style={styles.card}>
      {/* Format createdAt nicely to label the event recording */}
      <Text
        style={{
          fontSize: 16,
          color: "#2f4f4f",
        }}
      >
        {String(createdAt).substring(2, 10)}
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
          onPress={async () => {
            await stopPlaying();
            deleteEventRecording();
          }}
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

export const GET_EVENT_RECORDINGS_BY_USER = gql`
  query getEventRecordingsByUser($userId: String!) {
    getEventRecordingsByUser(userId: $userId) {
      eventRecordingUrls
      userId
      createdAt
      id
    }
  }
`;

export default PlayShareRemove;
