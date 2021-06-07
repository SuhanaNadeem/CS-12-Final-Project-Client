import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View } from "react-native";
const speech = require("@google-cloud/speech");
const recorder = require("node-record-lpcm16");
const GoogleDetector = () => {
  const [enabled, setEnabled] = useState(false);

  async function handleStreaming() {
    setEnabled(!enabled);
    if (enabled) {
      // Run the stream
      // Creates a client

      const client = new speech.SpeechClient();

      /**
       * TODO(developer): Uncomment the following lines before running the sample.
       */
      const encoding = "LINEAR16";
      const sampleRateHertz = 16000;
      const languageCode = "en-US";

      const request = {
        config: {
          encoding: encoding,
          sampleRateHertz: sampleRateHertz,
          languageCode: languageCode,
        },
        interimResults: true, // If you want interim results, set this to true
      };

      // Create a recognize stream
      const recognizeStream = client
        .streamingRecognize(request)
        .on("error", console.error)
        .on("data", (data) =>
          process.stdout.write(
            data.results[0] && data.results[0].alternatives[0]
              ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
              : "\n\nReached transcription time limit, press Ctrl+C\n"
          )
        );

      // Start recording and send the microphone input to the Speech API.
      // Ensure SoX is installed, see https://www.npmjs.com/package/node-record-lpcm16#dependencies
      recorder
        .record({
          sampleRateHertz: sampleRateHertz,
          threshold: 0,
          // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
          verbose: false,
          recordProgram: "sox", // Try also "arecord" or "sox"
          silence: "10.0",
        })
        .stream()
        .on("error", console.error)
        .pipe(recognizeStream);

      console.log("Listening, press Ctrl+C to stop.");
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

export default GoogleDetector;
