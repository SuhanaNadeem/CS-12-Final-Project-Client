import React from "react";
import { View, Text, Modal, Pressable } from "react-native";

// Welcome component to be displayed to the user when they first sign up
const Welcome = ({ userId, welcomeOpen, setWelcomeOpen, styles }) => {
  return userId ? (
    <Modal
      animationType="fade"
      transparent={true}
      visible={welcomeOpen}
      onRequestClose={() => {
        setWelcomeOpen(!welcomeOpen);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Welcome to Street Guard!</Text>
          <Text style={(styles.modalText, { fontSize: 12 })}>
            Here are your detailed instructions. Here are your detailed
            instructions. Here are your detailed instructions. Here are your
            detailed instructions.
          </Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setWelcomeOpen(!welcomeOpen)}
          >
            <Text style={styles.textStyle}>Get Started</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  ) : (
    <></>
  );
};

export default Welcome;
