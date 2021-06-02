import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, StatusBar, Text, View } from "react-native";
import { Audio } from "expo-av";
import { userClient } from "../../GraphqlApolloClients";

import { RNS3 } from "react-native-aws3";

const Home = ({ route, navigation }) => {
  const { userId } = route.params;

  const [values, setValues] = useState({ userId, s3RecordingUrl: "" });

  const [addS3RecordingUrl, loadingAddS3RecordingUrl] = useMutation(
    ADD_S3_RECORDING_URL,
    {
      update(_, { data: { addS3RecordingUrl: urlData } }) {
        console.log("Submit s3");
        console.log(urlData);
      },
      onError(err) {
        console.log("jhi");
        console.log(err);
      },
      variables: values,
      client: userClient,
    }
  );

  const [recording, setRecording] = useState();

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
      console.log("Starting recording..");
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }
  const [soundToPlay, setSoundToPlay] = useState();

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const fileUri = recording.getURI();
    console.log("Recording stopped and stored at", fileUri);

    // const info = await FileSystem.getInfoAsync(uri);
    // console.log(`FILE INFO: ${JSON.stringify(info)}`);

    // Upload file to AWS S3 Bucket
    const file = {
      // `uri` can also be a file system path (i.e. file://)
      uri: fileUri,
      name: `${userId && userId}_${new Date()}`,
      type: "audio/x-caf",
    };

    const options = {
      keyPrefix: "uploads/",
      bucket: "cs-12-images",
      region: "us-east-1",
      accessKey: "AKIA5DUDAINMUDBJG5CG",
      secretKey: "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",
      successActionStatus: 201,
    };

    RNS3.put(file, options).then((response) => {
      if (response.status !== 201)
        throw new Error("Failed to upload image to S3");
      console.log(response.body.postResponse.location);
      setValues({
        ...values,
        s3RecordingUrl: response.body.postResponse.location,
      });
    });

    console.log("before");
    console.log(values.userId);
    console.log(values.s3RecordingUrl);
    if (
      values.userId &&
      values.s3RecordingUrl &&
      values.userId != "" &&
      values.s3RecordingUrl != ""
    ) {
      console.log("Enters");
      addS3RecordingUrl();
    }
    console.log("after");
    setValues({ userId: "", s3RecordingUrl: "" });

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const { sound } = await recording.createNewLoadedSoundAsync({});
    setSoundToPlay(sound);
  }

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

  return (
    <View style={styles.container}>
      <Text>
        User home page (where recordings are triggered, previous are shown,
        graphic/button to toggle "listening"/not)
      </Text>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {soundToPlay && (
        <Button
          title={playing ? "Stop Playing" : "Start Playing"}
          onPress={playing ? stopPlaying : startPlaying}
        />
      )}

      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  button: {
    // flex: 1,
    backgroundColor: "#f50",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
});

export const ADD_S3_RECORDING_URL = gql`
  mutation addS3RecordingUrl($userId: String!, $s3RecordingUrl: String!) {
    addS3RecordingUrl(userId: $userId, s3RecordingUrl: $s3RecordingUrl)
  }
`;

export default Home;
