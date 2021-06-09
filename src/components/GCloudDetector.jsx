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
import { userClient } from "../../GraphqlApolloClients";

// TODO: put this in a .env
const AWS_ACCESS_KEY = "AKIA5DUDAINMUDBJG5CG";
const AWS_SECRET_KEY = "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";
const AWS_REGION = "us-east-1";
const S3_CS_BUCKET = "cs-12-images";

const GCloudDetector = ({ navigation, userId }) => {
  const context = useContext(UserAuthContext);

  const [values, setValues] = useState({
    userId: userId && userId,
    s3AudioChunkUrl: "",
  });

  const [enabled, setEnabled] = useState(false);
  const [recording, setRecording] = useState();
  const [start, setStart] = useState(true);

  const [transcribeAudioChunk, loadingTranscribeAudioChunk] = useMutation(
    TRANSCRIBE_AUDIO_CHUNK,
    {
      update() {
        console.log("Submitted audio file");
        setValues({ ...values, s3AudioChunkUrl: "" });
      },
      onError(err) {
        console.log("Unsuccessful");
        console.log(err);
      },
      variables: values,
      client: userClient,
    }
  );

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const recording = new Audio.Recording();

      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      await recording.startAsync();
      console.log("******************** START RECORDING: " + Date());

      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      setRecording(undefined);

      await recording.stopAndUnloadAsync();
      console.log("******************** STOP RECORDING: " + Date());

      const fileUri = recording.getURI();

      // Upload file to AWS S3 Bucket
      const file = {
        uri: fileUri,
        name: `${userId && userId}/${new Date()}.caf`,
        type: "audio/x-caf",
      };

      const options = {
        // keyPrefix: "uploads/",
        bucket: S3_CS_BUCKET,
        region: AWS_REGION,
        accessKey: AWS_ACCESS_KEY,
        secretKey: AWS_SECRET_KEY,
        successActionStatus: 201,
      };

      await RNS3.put(file, options).then((response) => {
        if (response.status !== 201) {
          throw new Error("Failed to upload image to S3");
        }

        setValues({
          ...values,
          s3AudioChunkUrl: response.body.postResponse.location,
        });
        transcribeAudioChunk();
      });
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  }

  // TODO create new pages in app
  // TODO set keys page
  // TODO aws reading of file
  // TODO allow streaming after clicking disable - enable

  useEffect(() => {
    const interval = setInterval(
      async () => {
        if (enabled) {
          if (start) {
            await startRecording();
          } else {
            await stopRecording();
          }
          setStart(!start);
        }
      },
      start ? 1000 : 10000
    );

    if (!enabled) {
      setStart(true);
      setRecording(undefined);
    }

    return () => clearInterval(interval);
  }, [enabled, start]);

  return (
    <View>
      <Button
        title={enabled ? "Disable" : "Enable"}
        onPress={() => {
          setEnabled(!enabled);
        }}
      />
      {enabled ? (
        <Text>Your audio is currently being streamed to detect dangers.</Text>
      ) : (
        <Text>You can turn on audio streaming to detect dangers.</Text>
      )}
      <StatusBar style="light" />
    </View>
  );
};

export const TRANSCRIBE_AUDIO_CHUNK = gql`
  mutation transcribeAudioChunk($s3AudioChunkUrl: String!, $userId: String!) {
    transcribeAudioChunk(s3AudioChunkUrl: $s3AudioChunkUrl, userId: $userId)
  }
`;

export default GCloudDetector;
