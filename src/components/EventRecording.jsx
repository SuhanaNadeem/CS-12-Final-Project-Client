import { gql, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import { userClient } from "../../GraphqlApolloClients";
import { Audio } from "expo-av";
import { RNS3 } from "react-native-aws3";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, S3_CS_BUCKET } from "@env";
import { RECORDING_OPTIONS_PRESET_HIGH_QUALITY } from "./InterimRecording";

const EventRecording = ({
  userId,
  setSoundToPlay,
  styles,
  detectedStatus,
  setDetectedStatus,
}) => {
  // const [values, setValues] = useState({ userId, eventRecordingUrl: "" });
  const [values, setValues] = useState({
    userId,
    eventRecordingFileKey: "",
    previousEventRecordingUrl: "",
    eventRecordingUrl: "",
  });
  const [start, setStart] = useState(true);

  const [handleDanger, loadingHandleDanger] = useMutation(HANDLE_DANGER, {
    update(_, { data: { handleDanger: detectedStatusData } }) {
      console.log("handled danger");
      setValues({
        ...values,
        previousEventRecordingUrl: values.eventRecordingUrl,
        eventRecordingUrl: "",
        eventRecordingFileKey: "",
      });
      console.log("event's update's detectedStatus:");
      setDetectedStatus(detectedStatusData);
      console.log(detectedStatus);
    },
    onError(err) {
      console.log(err);
    },
    variables: values,
    client: userClient,
  });

  const [recording, setRecording] = useState();

  async function startRecording() {
    try {
      console.log("event's startRecording is detectedStatus");
      console.log(detectedStatus);

      // console.log("entered start in record.jsx");

      // setEnabled({ ...enabled, inProgress: true });

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

      console.log("STARTED EVENT RECORDING at " + Date());

      setRecording(recording);
    } catch (err) {
      // console.log("err in record.jsx start");
      // console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      // console.log("entered stop in record.jsx");
      // setEnabled({ ...enabled, inProgress: false });

      await recording.stopAndUnloadAsync();
      console.log("STOPPED EVENT RECORDING at " + Date());
      setRecording(undefined);

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
          throw new Error("Failed to upload recording to S3");
        console.log("event's stopRecording is detectedStatus");
        console.log(detectedStatus);
        if (detectedStatus === "start") {
          setValues({
            ...values,
            eventRecordingFileKey: response.body.postResponse.key,
            eventRecordingUrl: response.body.postResponse.location,
          });

          console.log("handleDanger input:");
          console.log(values);
          handleDanger();
        }
        // }
      });

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
      const { sound } = await recording.createNewLoadedSoundAsync({});
      setSoundToPlay(sound);
    } catch (err) {
      // console.log("err in record.jsx stop");
    }
  }

  useEffect(() => {
    const interval = setInterval(
      async () => {
        if (detectedStatus === "start") {
          if (start) {
            await startRecording();
          } else {
            await stopRecording();
          }
          setStart(!start);
        }
      },
      start ? 50 : 30000
    );

    if (detectedStatus === "stop") {
      console.log("useeffect found detectedStatus is stop, without panic");
      // if (recording) {
      stopRecording();
      // }
      setStart(true);
      setValues({ ...values, previousEventRecordingUrl: "" });
    }

    return () => clearInterval(interval);
  }, [detectedStatus, start]);

  return (
    <View>
      <Text style={styles.titleText}>Event Recordings</Text>

      <Text style={styles.baseText}>
        Start, stop, and view your recordings here.
      </Text>

      <Button
        title={detectedStatus == "start" ? "Stop" : "Start"}
        onPress={() => {
          if (detectedStatus === "start") {
            setDetectedStatus("stop");
          } else if (detectedStatus === "stop") {
            setDetectedStatus("start");
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

export const HANDLE_DANGER = gql`
  mutation handleDanger(
    $userId: String!
    $eventRecordingFileKey: String!
    $eventRecordingUrl: String!
    $previousEventRecordingUrl: String!
  ) {
    handleDanger(
      userId: $userId
      eventRecordingFileKey: $eventRecordingFileKey
      eventRecordingUrl: $eventRecordingUrl
      previousEventRecordingUrl: $previousEventRecordingUrl
    )
  }
`;

export const GET_EVENT_RECORDING_STATE = gql`
  query getEventRecordingTriggered($userId: String!) {
    getEventRecordingTriggered(userId: $userId)
  }
`;

export default EventRecording;
