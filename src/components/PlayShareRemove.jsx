import { gql, useQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, View, Text, Pressable } from "react-native";
import { Audio } from "expo-av";
import { userClient } from "../../GraphqlApolloClients";
import styles from "../styles/recordStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import * as SMS from "expo-sms";
import { GET_EVENT_RECORDINGS_BY_USER } from "./RecordingPlayback";

const PlayShareRemove = ({ createdAt, eventRecording, userId }) => {
  const [soundToPlay, setSoundToPlay] = useState();

  const [playing, setPlaying] = useState(false);

  const [deleteEventRecording, loadingDeleteEventRecording] = useMutation(
    DELETE_EVENT_RECORDING,
    {
      update() {
        console.log("deleteEventRecording called");
      },
      onError(err) {
        console.log("Unsuccessful");
        console.log(err);
      },
      refetchQueries: [
        {
          query: GET_EVENT_RECORDINGS_BY_USER,
          variables: { userId: userId && userId },
        },
      ],
      variables: { eventRecordingId: eventRecording && eventRecording.id },
      client: userClient,
    }
  );

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

  async function sendMessage() {
    // Opens up message dialog box where user can manually enter contact + message, but the attachment is already added
    const { result } = await SMS.sendSMSAsync([], "", {
      attachments: {
        uri: eventRecording.eventRecordingUrls[eventRecording.eventRecordingUrls.length - 1], // CHANGE THIS
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
        {String(createdAt).substring(5, 10)}
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
            }
          }
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
