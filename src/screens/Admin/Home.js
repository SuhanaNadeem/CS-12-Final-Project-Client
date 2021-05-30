import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, StatusBar, Text, View } from "react-native";
import { adminClient } from "../../../GraphqlApolloClients";
import { AdminAuthContext } from "../../context/adminAuth";
import { Audio } from "expo-av";
// import Amplify, { Storage } from "@aws-amplify/cli";
// import Amplify, { Storage } from "aws-amplify";
// import * as FileSystem from 'expo-file-system';

// https://github.com/benjreinhart/react-native-aws3
import { RNS3 } from 'react-native-aws3';

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

  function urlToBlob(url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onerror = reject;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                resolve(xhr.response);
            }
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob'; // convert type
        xhr.send();
    })
  }

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
      name: "recording.caf",
      type: "audio/x-caf"
    }

    const options = {
      keyPrefix: "uploads/",
      bucket: "cs-12-images",
      region: "us-east-1",
      accessKey: "AKIA5DUDAINMUDBJG5CG",
      secretKey: "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",
      successActionStatus: 201
    }

    RNS3.put(file, options).then(response => {
      if (response.status !== 201)
        throw new Error("Failed to upload image to S3");
      console.log(response.body);
      /**
       * {
       *   postResponse: {
       *     bucket: "your-bucket",
       *     etag : "9f620878e06d28774406017480a59fd4",
       *     key: "uploads/image.png",
       *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
       *   }
       * }
       */
    });

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
