import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, StatusBar, Text, View } from "react-native";
import { adminClient } from "../../../GraphqlApolloClients";
import { AdminAuthContext } from "../../context/adminAuth";
import { Audio } from "expo-av";
// import Amplify, { Storage } from "aws-amplify";
import * as FileSystem from "expo-file-system";

// Amplify.configure({
//   Auth: {
//     identityPoolId: "us-east-1:bbf6acea-9fd6-4823-9569-30a835d5db2a", //REQUIRED - Amazon Cognito Identity Pool ID
//     region: "us-east-1", // REQUIRED - Amazon Cognito Region
//   },
//   Storage: {
//     AWSS3: {
//       bucket: "cs-12-images", //REQUIRED -  Amazon S3 bucket name
//       region: "us-east-1", //OPTIONAL -  Amazon service region
//     },
//   },
// });

const Home = () => {
  const context = useContext(AdminAuthContext);

  const [loginAdmin, loading] = useMutation(LOGIN_ADMIN, {
    update(_, { data: { loginAdmin: adminData } }) {
      console.log("Submit successful");
      context.loginAdmin(adminData);
    },
    onError(err) {
      console.log(err);
    },
  });

  const submit = () => {
    loginAdmin({
      variables: { email: "test1@gmail.com", password: "1" },
    });
  };

  const { data: { getAdminById: admin } = {} } = useQuery(GET_ADMIN_BY_ID, {
    variables: { adminId: "T7C4HZ7BOK" },
    client: adminClient,
  });

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
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);

    // const info = await FileSystem.getInfoAsync(uri);
    // console.log(`FILE INFO: ${JSON.stringify(info)}`);

    // const response = await fetch(uri);
    // const blob = await response.blob();
    // console.log("blob:");
    // console.log(blob);

    // Storage.put("my_audio_file.caf", blob)
    //   .then((result) => {
    //     console.log(result);
    //     alert("Recording succesfully uploaded!");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     alert("Recording upload failed. :(");
    //   });

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
      <Text>Hi there</Text>
      <Button style={styles.button} onPress={submit} title="Submit"></Button>
      <Text>Should be my name: {admin && admin.name}</Text>
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

const LOGIN_ADMIN = gql`
  mutation loginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      id
      email
      name
      createdAt
      token
    }
  }
`;

export const GET_ADMIN_BY_ID = gql`
  query getAdminById($adminId: String!) {
    getAdminById(adminId: $adminId) {
      id
      name
      password
      email
      token
      createdAt
    }
  }
`;

export default Home;
