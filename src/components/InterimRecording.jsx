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
import * as FileSystem from "expo-file-system";

const InterimRecording = ({
  navigation,
  userId,
  styles,
  detectedStatus,
  setDetectedStatus,
}) => {
  const [values, setValues] = useState({
    userId: userId && userId,
    recordingBytes: "",
  });

  const [recording, setRecording] = useState();
  const [start, setStart] = useState(true);
  const [enabled, setEnabled] = useState(false);

  const [detectDanger, loadingDetectDanger] = useMutation(DETECT_DANGER, {
    update(_, { data: { detectDanger: detectedStatusData } }) {
      console.log("Submitted interim recording");
      setValues({ ...values, recordingBytes: "" });
      setDetectedStatus(detectedStatusData);
      console.log("detectDanger returned:");
      console.log(detectedStatusData);
      console.log("detectedStatus value:");
      console.log(detectedStatus);
    },
    onError(err) {
      console.log("Unsuccessful");
      console.log(err);
    },
    variables: values,
    client: userClient,
  });

  async function startRecording() {
    try {
      // console.log("entered start in gcloud.jsx");

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
      // console.log("err in gclouddetector.jsx start");
      // console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      // console.log("entered stop in gcloud");

      setRecording(undefined);

      await recording.stopAndUnloadAsync();
      console.log("******************** STOP RECORDING: " + Date());

      const fileUri = recording.getURI();

      await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      }).then((bytes) => {
        if (detectedStatus === "stop") {
          setValues({
            ...values,
            recordingBytes: bytes,
          });
          // console.log("detectDanger input:");
          // console.log(values);
          detectDanger();
        }
        // detectDanger();
      });

      // // Upload file to AWS S3 Bucket
      // const file = {
      //   uri: fileUri,
      //   name: `${uuidv4()}.wav`,
      //   type: "audio/wav",
      // };

      // const options = {
      //   keyPrefix: "uploads/",
      //   bucket: S3_CS_BUCKET,
      //   region: AWS_REGION,
      //   accessKey: AWS_ACCESS_KEY,
      //   secretKey: AWS_SECRET_KEY,
      //   successActionStatus: 201,
      // };

      // await RNS3.put(file, options).then((response) => {
      //   if (response.status !== 201) {
      //     throw new Error("Failed to upload recording to S3");
      //   }
      //   if (detectedStatus === "stop") {
      //     setValues({
      //       ...values,
      //       interimRecordingFileKey: response.body.postResponse.key,
      //     });
      //     console.log("detectDanger input:");
      //     console.log(values);
      //     detectDanger();
      //   }
      // });
    } catch (err) {
      // console.log("err in gclouddetector.jsx stop");
      // console.error("Failed to stop recording", err);
    }
  }

  useEffect(() => {
    const interval = setInterval(
      async () => {
        if (
          enabled &&
          // !enabled.inProgress &&
          detectedStatus === "stop"
        ) {
          if (start) {
            await startRecording();
          } else {
            await stopRecording();
          }
          setStart(!start);
        }
      },
      start ? 50 : 10000
    );

    // if (!enabled.allowed && !enabled.inProgress && detectedStatus === "stop") {
    if (detectedStatus === "start" || !enabled) {
      // if (recording) {
      stopRecording();
      // }
      setStart(true);
      // setRecording(undefined);
    }

    return () => clearInterval(interval);
  }, [enabled, start, detectedStatus]);

  return (
    <View>
      <Text style={styles.titleText}>Interim Recordings</Text>
      <Text style={styles.baseText}>
        Interim recordings are only checked and discarded. If verbal harassment
        or misconduct is detected, an event recording is triggered and stored
        for future reference.
      </Text>
      {enabled ? (
        <Text style={styles.baseText}>
          Your audio is being recorded to detect danger.
        </Text>
      ) : (
        <Text style={styles.baseText}>
          Allow interim recordings to detect danger.
        </Text>
      )}

      <Button
        disabled={detectedStatus === "start"}
        title={
          enabled
            ? detectedStatus == "start"
              ? "In Progress"
              : "Disallow"
            : detectedStatus == "start"
            ? "In Progress"
            : "Allow"
        }
        onPress={() => {
          setEnabled(!enabled);
        }}
      />

      <StatusBar style="light" />
    </View>
  );
};

export const DETECT_DANGER = gql`
  mutation detectDanger($recordingBytes: String!, $userId: String!) {
    detectDanger(recordingBytes: $recordingBytes, userId: $userId)
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

export default InterimRecording;
