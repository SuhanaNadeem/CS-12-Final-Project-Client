import React from 'react'
import {
    Button,
    StyleSheet,
    StatusBar,
    Text,
    View,
    TextInput,
  } from "react-native";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const STT = () => {
  const { transcript, resetTranscript } = useSpeechRecognition()

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }

  return (
    <View>
      <Button onClick={SpeechRecognition.startListening} title="Start" />
      <Button onClick={SpeechRecognition.stopListening} title="Stop" />
      <Button onClick={resetTranscript}title="Reset" />
      <Text>{transcript}</Text>
    </View>
  )
}
export default STT;