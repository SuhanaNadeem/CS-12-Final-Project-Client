import * as React from "react";
import { StyleSheet, View, Text, Button, SafeAreaView } from "react-native";
import GoogleCloudSpeechToText from "react-native-google-cloud-speech-to-text";
import { useEffect } from "react";

export default function Detector() {
  const [transcript, setResult] = React.useState("");

  useEffect(() => {
    GoogleCloudSpeechToText.setApiKey(
      "336db5b5c1a9bd28ba51e10657896d44336c0647"
    );
    GoogleCloudSpeechToText.onVoice(onVoice);
    GoogleCloudSpeechToText.onVoiceStart(onVoiceStart);
    GoogleCloudSpeechToText.onVoiceEnd(onVoiceEnd);
    GoogleCloudSpeechToText.onSpeechError(onSpeechError);
    GoogleCloudSpeechToText.onSpeechRecognized(onSpeechRecognized);
    GoogleCloudSpeechToText.onSpeechRecognizing(onSpeechRecognizing);
    return () => {
      GoogleCloudSpeechToText.removeListeners();
    };
  }, []);

  const onSpeechError = (_error) => {
    console.log("onSpeechError: ", _error);
  };

  const onSpeechRecognized = (result) => {
    console.log("onSpeechRecognized: ", result);
    setResult(result.transcript);
  };

  const onSpeechRecognizing = (result) => {
    console.log("onSpeechRecognizing: ", result);
    setResult(result.transcript);
  };

  const onVoiceStart = (_event) => {
    console.log("onVoiceStart", _event);
  };

  const onVoice = (_event) => {
    console.log("onVoice", _event);
  };

  const onVoiceEnd = () => {
    console.log("onVoiceEnd: ");
  };

  const startRecognizing = async () => {
    const result = await GoogleCloudSpeechToText.start({
      speechToFile: true,
    });
    console.log("startRecognizing", result);
  };

  const stopRecognizing = async () => {
    await GoogleCloudSpeechToText.stop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>{transcript}</Text>
        <Button title="Start me" onPress={startRecognizing} />
      </View>
      <View>
        <Text style={styles.title}>This is the detector with npm </Text>
        <Button title="Stop me" color="#f194ff" onPress={stopRecognizing} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 16,
  },
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
