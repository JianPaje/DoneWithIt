import React from "react";
import { View, Text, StyleSheet } from "react-native";

const QuestsHistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quests History</Text>
      {/* You can build out the quest history list here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
});

export default QuestsHistoryScreen;
