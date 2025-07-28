import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";

// This data is correct, no changes needed here.
const RANKS_DATA = [
  {
    name: "S-Rank",
    note: "Master",
    points: "1000+",
    icon: require("../assets/s-rank.png"),
  },
  {
    name: "A-Rank",
    note: "Expert",
    points: "800-999",
    icon: require("../assets/a-rank.png"),
  },
  {
    name: "B-Rank",
    note: "Adept",
    points: "600-799",
    icon: require("../assets/b-rank.png"),
  },
  {
    name: "C-Rank",
    note: "Skilled",
    points: "400-599",
    icon: require("../assets/c-rank.png"),
  },
  {
    name: "D-Rank",
    note: "Apprentice",
    points: "200-399",
    icon: require("../assets/d-rank.png"),
  },
  {
    name: "E-Rank",
    note: "Newcomer",
    points: "0-199",
    icon: require("../assets/e-rank.png"),
  },
];

const RankModal = ({ isVisible, onClose }) => {
  const renderRankItem = ({ item }) => (
    <View style={styles.rankItem}>
      <Image source={item.icon} style={styles.rankIcon} />
      <View style={styles.rankInfo}>
        <Text style={styles.rankName}>
          {item.name} <Text style={styles.rankNote}>({item.note})</Text>
        </Text>
        <Text style={styles.rankPoints}>Requires: {item.points} Points</Text>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>🏆 Rank Tiers</Text>

          {/* MODIFIED: Added a style prop to the FlatList */}
          <FlatList
            style={styles.listContainer}
            data={RANKS_DATA}
            renderItem={renderRankItem}
            keyExtractor={(item) => item.name}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// --- STYLE CHANGES ARE HERE ---
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    width: "85%",
    maxHeight: "80%", // Added to ensure modal fits on screen
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    // REMOVED: alignItems: "center" from here.
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center", // ADDED: to center the title text specifically
  },
  // NEW STYLE: For the FlatList component
  listContainer: {
    width: "100%",
  },
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    width: "100%",
  },
  rankIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4F74B8",
  },
  rankNote: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#555",
  },
  rankPoints: {
    fontSize: 14,
    color: "#666",
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#e0e0e0",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#4F74B8",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    alignSelf: "center", // ADDED: To center the button
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default RankModal;
