import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import { Button, StyleSheet, StatusBar, Text, View } from "react-native";
import { adminClient } from "../../../GraphqlApolloClients";
import { AdminAuthContext } from "../../context/adminAuth";
import { Buffer } from "buffer";
import Permissions from "react-native-permissions";
import { AudioPlayer } from "react-native-audio-player-recorder";
import AudioRecord from "react-native-audio-record";

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

  var initialState = {
    audioFile: "",
    recording: false,
    loaded: false,
    paused: true,
  };

  const [audioState, setAudioState] = useState(initialState);

  initAudioRecord = () => {
    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: "test.wav",
    };

    AudioRecord.init(options);

    AudioRecord.on("data", (data) => {
      const chunk = Buffer.from(data, "base64");
      console.log("chunk size", chunk.byteLength);
      // do something with audio chunk
    });
  };

  initAudioPlayer = () => {
    AudioPlayer.onFinished = () => {
      console.log("finished playback");
      setAudioState({ paused: true, loaded: false });
    };
    AudioPlayer.setFinishedSubscription();

    AudioPlayer.onProgress = (data) => {
      console.log("progress", data);
    };
    AudioPlayer.setProgressSubscription();
  };

  start = () => {
    console.log("start record");
    setAudioState({ audioFile: "", recording: true, loaded: false });
    AudioRecord.start();
  };

  stop = async () => {
    if (!audioState.recording) return;
    console.log("stop record");
    let audioFile = await AudioRecord.stop();
    console.log("audioFile", audioFile);
    setAudioState({ audioFile, recording: false });
  };

  play = () => {
    if (audioState.loaded) {
      AudioPlayer.unpause();
      setAudioState({ paused: false });
    } else {
      AudioPlayer.play(audioState.audioFile);
      setAudioState({ paused: false, loaded: true });
    }
  };

  pause = () => {
    AudioPlayer.pause();
    setAudioState({ paused: true });
  };

  checkPermission = async () => {
    const p = await Permissions.check("microphone");
    console.log("permission check", p);
    if (p === "authorized") return;
    return requestPermission();
  };

  requestPermission = async () => {
    const p = await Permissions.request("microphone");
    console.log("permission request", p);
  };

  initRecorder = async () => {
    await checkPermission();
    initAudioRecord();
    initAudioPlayer();
  };
  initRecorder();
  const { recording, paused, audioFile } = audioState;

  return (
    <View style={styles.container}>
      {/* <Text>Hi there</Text>
      <Button style={styles.button} onPress={submit} title="Submit"></Button>
      <Text>Should be my name: {admin && admin.name}</Text>
      <StatusBar style="light" /> */}

      <View style={styles.row}>
        <Button onPress={start} title="Record" disabled={recording} />
        <Button onPress={stop} title="Stop" disabled={!recording} />
        {paused ? (
          <Button onPress={play} title="Play" disabled={!audioFile} />
        ) : (
          <Button onPress={pause} title="Pause" disabled={!audioFile} />
        )}
      </View>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
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
