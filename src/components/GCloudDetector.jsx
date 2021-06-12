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
import "react-native-get-random-values";

import { v4 as uuidv4 } from "uuid";

// TODO: put this in a .env
export const AWS_ACCESS_KEY = "AKIA5DUDAINMUDBJG5CG";
export const AWS_SECRET_KEY = "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";
export const AWS_REGION = "us-east-1";
export const S3_CS_BUCKET = "cs-12-images";

const GCloudDetector = ({ navigation, userId, enabled, setEnabled }) => {
  const context = useContext(UserAuthContext);

  const [values, setValues] = useState({
    userId: userId && userId,
    interimRecordingFileKey: "",
  });

  const [recording, setRecording] = useState();
  const [start, setStart] = useState(true);

  useEffect(() => {
    console.log("in prog useffect gcloud");
    console.log("value of inProgress");
    console.log(enabled.inProgress);
    if (enabled.inProgress) {
      console.log("now stopping recording");
      stopRecording();
    }
  }, [enabled.inProgress]);

  const [transcribeInterimRecording, loadingTranscribeAudioChunk] = useMutation(
    TRANSCRIBE_AUDIO_CHUNK,
    {
      update() {
        console.log("Submitted interim recording");
        setValues({ ...values, interimRecordingFileKey: "" });
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
      console.log("entered start in gcloud.jsx");

      await Audio.requestPermissionsAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const recording = new Audio.Recording();

      await recording.prepareToRecordAsync(
        RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      await recording.startAsync();
      console.log("******************** START RECORDING: " + Date());

      setRecording(recording);
    } catch (err) {
      console.log("err in gclouddetector.jsx start");

      // console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      console.log("entered stop in gcloud");

      setRecording(undefined);

      await recording.stopAndUnloadAsync();
      console.log("******************** STOP RECORDING: " + Date());

      const fileUri = recording.getURI();

      // Upload file to AWS S3 Bucket
      const file = {
        uri: fileUri,
        name: `${uuidv4()}.wav`,
        type: "audio/wav",
      };

      const options = {
        keyPrefix: "uploads/",
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
          interimRecordingFileKey: response.body.postResponse.key,
        });
        transcribeInterimRecording();
      });
    } catch (err) {
      console.log("err in gclouddetector.jsx stop");

      // console.error("Failed to stop recording", err);
    }
  }

  useEffect(() => {
    const interval = setInterval(
      async () => {
        if (enabled.allowed && !enabled.inProgress) {
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

    if (!enabled.allowed && !enabled.inProgress) {
      if (recording) {
        stopRecording();
      }
      setStart(true);
      // setRecording(undefined);
    }

    return () => clearInterval(interval);
  }, [enabled, start]);

  return (
    <View>
      <Text>DETECTING DANGERS</Text>
      <Button
        disabled={enabled.inProgress}
        title={
          enabled.allowed
            ? enabled.inProgress
              ? "In Progress"
              : "Disallow"
            : enabled.inProgress
            ? "In Progress"
            : "Allow"
        }
        onPress={() => {
          setEnabled({ ...enabled, allowed: !enabled.allowed });
        }}
      />
      {enabled.allowed ? (
        <Text>Your audio is currently being streamed to detect dangers.</Text>
      ) : (
        <Text>You can turn on audio streaming to detect dangers.</Text>
      )}
      <StatusBar style="light" />
    </View>
  );
};

export const TRANSCRIBE_AUDIO_CHUNK = gql`
  mutation transcribeInterimRecording(
    $interimRecordingFileKey: String!
    $userId: String!
  ) {
    transcribeInterimRecording(
      interimRecordingFileKey: $interimRecordingFileKey
      userId: $userId
    )
  }
`;

export const RECORDING_OPTIONS_PRESET_HIGH_QUALITY = {
  isMeteringEnabled: true,
  android: {
    extension: ".m4a",
    // outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    // audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    // numberOfChannels: 2,
    // bitRate: 128000,
  },
  ios: {
    // extension: '.caf',
    extension: ".wav",
    // audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
    sampleRate: 44100,
    // numberOfChannels: 2,
    // bitRate: 128000,
    // linearPCMBitDepth: 16,
    // linearPCMIsBigEndian: false,
    // linearPCMIsFloat: false,
  },
};

export default GCloudDetector;
