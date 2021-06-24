import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, View, Text, Modal, Pressable } from "react-native";
import { userClient } from "../../GraphqlApolloClients";

// Welcome component to be displayed to the user
const Welcome = ({ userId, welcomeOpen, setWelcomeOpen, styles }) => {
  console.log("In Welcome");
  console.log(userId);
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
