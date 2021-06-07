import { gql, useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";
import { useState } from "react";
import { UserAuthContext } from "../context/userAuth";
import React, { Button, View, Text } from "react-native";

//  Need to pass in a recording stream or chunks from client
//  To a server function that translates it

const GCloudDetector = () => {
  const context = useContext(UserAuthContext);

  const [values, setValues] = useState({
    s3AudioChunkUrl:
      "C:/Users/16475/Documents/CS 12 Final Project/CS-12-Final-Project-Server/util/audio.raw.wav",
    // "https://cs-12-images.s3.amazonaws.com/uploads%2FABJY94416T_Wed+Jun+02+2021+15%3A27%3A00+GMT-0400+%28EDT%29",
  });

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

  // async function handleEnabled() {
  //   setEnabled(!enabled);
  //   transcribeAudioChunk();
  // }
  // const [enabled, setEnabled] = useState(false);
  return (
    <View>
      <Button
        // title={enabled ? "Disable Detector" : "Enable Detector"}
        title="Enabled"
        // onPress={handleEnabled}
        onPress={() => {
          transcribeAudioChunk();
        }}
      />
      <Text>GCloudDetector</Text>
      {/* {enabled ? ( */}
      <Text>Your audio is currently being streamed to detect dangers.</Text>
      {/* ) : (
        <Text>You can turn on streaming to detect dangers.</Text>
      )} */}
    </View>
  );
};
export const TRANSCRIBE_AUDIO_CHUNK = gql`
  mutation transcribeAudioChunk($s3AudioChunkUrl: String!) {
    transcribeAudioChunk(s3AudioChunkUrl: $s3AudioChunkUrl)
  }
`;

export default GCloudDetector;
