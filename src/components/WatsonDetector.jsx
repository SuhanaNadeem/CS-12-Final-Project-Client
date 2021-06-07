import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View } from "react-native";

// import LiveAudioStream from "react-native-live-audio-stream";
// import SpeechToTextV1 from "ibm-watson/speech-to-text/v1";
const SpeechToTextV1 = require("ibm-watson/language-translator/v3");
const LineIn = require("line-in");

const WatsonDetector = () => {
  const [enabled, setEnabled] = useState(false);

  async function handleStreaming() {
    setEnabled(!enabled);
    if (enabled) {
      // Run the stream
      console.log("enters, is enabled");

      const speechToText = new SpeechToTextV1({
        iam_apikey: "xYtA_aQ2JZkEPb4Dna_u1ZLiXzE3qIn3_JzKyxTVSY9t",
        url:
          "https://api.us-east.speech-to-text.watson.cloud.ibm.com/instances/d74557ff-2090-433a-83b9-28c4e23f5030",
      });
      const lineIn = new LineIn();

      // const options = {
      //   sampleRate: 44100, // default is 44100 but 32000 is adequate for accurate voice recognition
      //   channels: 2, // 1 or 2, default 1
      //   bitsPerSample: 16, // 8 or 16, default 16
      //   audioSource: 6, // android only (see below)
      //   bufferSize: 4096, // default is 2048
      // };

      // const liveAudioStream = LiveAudioStream.init(options);

      // liveAudioStream.on("data", (data) => {
      //   // base64-encoded audio data chunks
      // });

      // liveAudioStream.start();

      const recognizeStream = speechToText.recognizeUsingWebSocket({
        content_type: "audio/l16; rate=44100; channels=2",
        interim_results: true,
      });

      // liveAudioStream.pipe(recognizeStream).pipe(process.stdout);
      lineIn.pipe(recognizeStream).pipe(process.stdout);
    } else {
      // Stop the stream
    }
  }
  return (
    <View>
      <Button
        title={enabled ? "Disable Detector" : "Enable Detector"}
        onPress={handleStreaming}
      />
      {enabled ? (
        <Text>Your audio is currently being streamed to detect dangers.</Text>
      ) : (
        <Text>You can turn on streaming to detect dangers.</Text>
      )}
    </View>
  );
};

export default WatsonDetector;
