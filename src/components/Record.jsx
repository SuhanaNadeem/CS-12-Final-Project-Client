import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { Audio } from "expo-av";
import { RNS3 } from "react-native-aws3";
import "react-native-get-random-values";

import { v4 as uuidv4 } from "uuid";
import {
  AWS_ACCESS_KEY,
  AWS_REGION,
  AWS_SECRET_KEY,
  S3_CS_BUCKET,
} from "./GCloudDetector";

const Record = ({ userId, setSoundToPlay, enabled, setEnabled }) => {
  const [values, setValues] = useState({ userId, eventRecordingUrl: "" });

  const [addEventRecordingUrl, loadingAddEventRecordingUrl] = useMutation(
    ADD_S3_RECORDING_URL,
    {
      update(_, { data: { addEventRecordingUrl: urlData } }) {
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
      await stopRecording();
      console.log("entered start in record.jsx");

      setEnabled({ ...enabled, inProgress: true });

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

      console.log("STARTED EVENT RECORDING");

      setRecording(recording);
    } catch (err) {
      console.log("err in record.jsx start");

      // console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      console.log("entered stop in record.jsx");
      setEnabled({ ...enabled, inProgress: false });

      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      console.log("STOPPED EVENT RECORDING");

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
        if (response.status !== 201)
          throw new Error("Failed to upload image to S3");
        setValues({
          ...values,
          eventRecordingUrl: response.body.postResponse.location,
        });
      });

      if (
        values.userId &&
        values.eventRecordingUrl &&
        values.userId != "" &&
        values.eventRecordingUrl != ""
      ) {
        addEventRecordingUrl();
      }

      setValues({ ...values, eventRecordingUrl: "" });

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
      const { sound } = await recording.createNewLoadedSoundAsync({});
      setSoundToPlay(sound);
    } catch (err) {
      console.log("err in record.jsx stop");
      // console.error("Failed to stop recording", err);
    }
  }

  return (
    <View>
      <Text>RECORDINGS</Text>

      <Text>Start, stop, and view your recordings here.</Text>

      <Button
        title={enabled.inProgress ? "Stop" : "Start"}
        onPress={() => {
          if (enabled.inProgress) {
            stopRecording();
          } else {
            startRecording();
          }
        }}
      />
    </View>
  );
};
export const ADD_S3_RECORDING_URL = gql`
  mutation addEventRecordingUrl($userId: String!, $eventRecordingUrl: String!) {
    addEventRecordingUrl(userId: $userId, eventRecordingUrl: $eventRecordingUrl)
  }
`;

export const GET_EVENT_RECORDING_STATE = gql`
  query getEventRecordingState($userId: String!) {
    getEventRecordingState(userId: $userId)
  }
`;
export default Record;
