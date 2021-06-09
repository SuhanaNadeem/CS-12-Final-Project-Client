import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { Audio } from "expo-av";
import { RNS3 } from "react-native-aws3";
const Record = ({ userId, setSoundToPlay }) => {
  const [values, setValues] = useState({ userId, s3RecordingUrl: "" });

  const [toggleEventRecordingState, loadingEventRecordingState] = useMutation(
    TOGGLE_EVENT_RECORDING_STATE,
    {
      update() {
        console.log("toggled eventRecordingState");
      },
      onError(err) {
        console.log(err);
      },
      refetchQueries: [
        {
          query: GET_EVENT_RECORDING_STATE,
          variables: { userId },
        },
      ],
      variables: { userId },
      client: userClient,
    }
  );

  const [addS3RecordingUrl, loadingAddS3RecordingUrl] = useMutation(
    ADD_S3_RECORDING_URL,
    {
      update(_, { data: { addS3RecordingUrl: urlData } }) {
        console.log("Submitted s3");
        console.log(urlData);
      },
      onError(err) {
        console.log(err);
      },
      variables: values,
      client: userClient,
    }
  );

  const [recording, setRecording] = useState();

  async function startRecording() {
    try {
      toggleEventRecordingState();

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

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const fileUri = recording.getURI();
    console.log("Recording stopped and stored at", fileUri);

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

  return (
    <Button
      title={recording ? "Stop Recording" : "Start Recording"}
      onPress={recording ? stopRecording : startRecording}
    />
  );
};
export const ADD_S3_RECORDING_URL = gql`
  mutation addS3RecordingUrl($userId: String!, $s3RecordingUrl: String!) {
    addS3RecordingUrl(userId: $userId, s3RecordingUrl: $s3RecordingUrl)
  }
`;

export const TOGGLE_EVENT_RECORDING_STATE = gql`
  mutation toggleEventRecordingState($userId: String!) {
    toggleEventRecordingState(userId: $userId)
  }
`;

export const GET_EVENT_RECORDING_STATE = gql`
  query getEventRecordingState($userId: String!) {
    getEventRecordingState(userId: $userId)
  }
`;
export default Record;
