import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, StatusBar, Text, View } from "react-native";
import Record from "../components/Record";
import AllRecordings from "../components/AllRecordings";

const Home = ({ route, navigation }) => {
  const { userId } = route.params;

  const [soundToPlay, setSoundToPlay] = useState();

  return (
    <View style={styles.container}>
      <Text>
        User home page (where recordings are triggered, previous are shown,
        graphic/button to toggle "listening"/not)
      </Text>
      <Record setSoundToPlay={setSoundToPlay} userId={userId} />
      <AllRecordings userId={userId}/>
      {/*<Play soundToPlay={soundToPlay} />*/}

      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  button: {
    // flex: 1,
    backgroundColor: "#f50",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
});

export default Home;
