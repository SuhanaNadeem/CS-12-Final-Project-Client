import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuthContext } from "../context/userAuth";
import React, { useContext, useEffect, useState } from "react";
import { Audio } from "expo-av";
import { RNS3 } from "react-native-aws3";
import {
  Button,
  StyleSheet,
  StatusBar,
  Text,
  View,
  TextInput,
} from "react-native";

// TODO: put this in a .env
const AWS_ACCESS_KEY = "AKIA5DUDAINMUDBJG5CG";
const AWS_SECRET_KEY = "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";
const AWS_REGION = "us-east-1";
const S3_CS_BUCKET = "cs-12-images";

const GCloudDetector = ({ userId }) => {
  const context = useContext(UserAuthContext);

  const [values, setValues] = useState({
    userId: userId && userId,
    s3AudioChunkUrl: "",
    // "C:/Users/16475/Documents/CS 12 Final Project/CS-12-Final-Project-Server/util/audio.raw.wav",
    // "https://cs-12-images.s3.amazonaws.com/uploads%2FABJY94416T_Wed+Jun+02+2021+15%3A27%3A00+GMT-0400+%28EDT%29",
  });

  const [enabled, setEnabled] = useState(false);

  const [test, setTest] = useState(3);

  const [recording, setRecording] = useState();

  // const [started, setStarted] = useState(false);

  const [transcribeAudioChunk, loadingTranscribeAudioChunk] = useMutation(
    TRANSCRIBE_AUDIO_CHUNK,
    {
      update(
        _,
        { data: { transcribeAudioChunk: loadingTranscribeAudioChunk } }
      ) {
        console.log("Submitted audio file");
      },
      onError(err) {
        console.log(err);
      },
      variables: values,
      client: context,
    }
  );

  async function startRecording() {
    try {
      console.log("entered start recording at: " + Date());
      console.log(5);
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
      console.log(recording);
      await setRecording(recording);
      setTest(5);

      console.log("recording in start: ");
      console.log(recording);
      console.log(test);

      console.log("Recording started");
      console.log(6);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log(9);

    console.log("Stopping recording..");
    console.log("recording in stop: ");
    console.log(recording);
    console.log(test);
    console.log("trying to stop recording at: " + Date());

    await recording.stopAndUnloadAsync();

    const fileUri = recording.getURI();

    setRecording(undefined);
    console.log("Recording stopped and stored at", fileUri);

    setTest(7);
    // Upload file to AWS S3 Bucket
    const file = {
      uri: fileUri,
      name: `${userId && userId}_${new Date()}`,
      type: "audio/x-caf",
    };

    const options = {
      keyPrefix: "uploads/",
      bucket: S3_CS_BUCKET,
      region: AWS_REGION,
      accessKey: AWS_ACCESS_KEY,
      secretKey: AWS_SECRET_KEY,
      successActionStatus: 201,
    };

    RNS3.put(file, options).then((response) => {
      if (response.status !== 201)
        throw new Error("Failed to upload image to S3");
      console.log("sending this to aws " + response.body.postResponse.location);
      setValues({
        ...values,
        s3AudioChunkUrl: response.body.postResponse.location,
      });
    });

    if (
      values.userId &&
      values.s3RecordingUrl &&
      values.userId != "" &&
      values.s3RecordingUrl != ""
    ) {
      transcribeAudioChunk();
      setValues({ s3AudioChunkUrl: "", userId: "" });
    }
    console.log(11);
  }

  // useEffect(() => {
  //   console.log("entered use effect");

  //   async function recordAudioChunk() {
  //     console.log(3);

  //     setTimeout(async () => {
  //       console.log(4);
  //       await startRecording();
  //       console.log(7);
  //       // setStarted(false);
  //     }, 6000);
  //     console.log(8);
  //     await stopRecording();
  //     console.log(11);
  //   }

  //   console.log("enabled now: " + enabled);

  //   if (enabled) {
  //     console.log("calling use effect function");
  //     console.log(1);
  //     setInterval(async () => {
  //       // setStarted(true);
  //       console.log(2);
  //       await recordAudioChunk();
  //     }, 9000);
  //   }
  // }, [enabled]);

  useEffect(() => {
    if (enabled) {
      console.log("came into if at: " + Date());

      setInterval(() => {
        if (!recording) {
          startRecording();
          console.log("came out of start recording at: " + Date());

          setTimeout(() => {
            stopRecording();
            console.log("came out of stop recording at: " + Date());
          }, 10000);
        }
      }, 12000);
    }
  }, [enabled]);

  return (
    <View>
      <Text>GCloudDetector</Text>
      <Button
        title={enabled ? "Disable Detector" : "Enable Detector"}
        title="Enable"
        // onPress={handleEnabled}
        onPress={() => {
          setEnabled(!enabled);
        }}
      />
      {enabled ? (
        <Text>Your audio is currently being streamed to detect dangers.</Text>
      ) : (
        <Text>You can turn on streaming to detect dangers.</Text>
      )}
    </View>
  );
};

export const TRANSCRIBE_AUDIO_CHUNK = gql`
  mutation transcribeAudioChunk($s3AudioChunkUrl: String!, $userId: String!) {
    transcribeAudioChunk(s3AudioChunkUrl: $s3AudioChunkUrl, userId: $userId)
  }
`;

export default GCloudDetector;
