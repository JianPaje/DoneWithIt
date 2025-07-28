// Screen/MilestonesScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import styles from "../Style/Homestyle";

// Mock data for the milestones.
// You'll replace this with real data later.
const milestonesData = [
  {
    id: "1",
    name: "Early Bird",
    icon: require("../assets/early-bird.png"),
    unlocked: true,
  },
  {
    id: "2",
    name: "Quiz Whiz",
    icon: require("../assets/quiz-whiz.png"),
    unlocked: true,
  },
  {
    id: "3",
    name: "7-Day Streak",
    icon: require("../assets/7-day-streak.png"),
    unlocked: true,
  },
  {
    id: "4",
    name: "Assignment Ace",
    icon: require("../assets/assignment-ace.png"),
    unlocked: true,
  },
  {
    id: "5",
    name: "Deadline Hero",
    icon: require("../assets/DeadlineHero.png"),
    unlocked: true,
  },
  {
    id: "6",
    name: "Team Leader",
    icon: require("../assets/TeamLeader.png"),
    unlocked: true,
  },
  {
    id: "7",
    name: "Subject Master",
    icon: require("../assets/SubjectMaster.png"),
    unlocked: true,
  },
  {
    id: "8",
    name: "Helper Bee",
    icon: require("../assets/HelperBee.png"),
    unlocked: true,
  },
  {
    id: "9",
    name: "Top Submitter",
    icon: require("../assets/TopSubmitter.png"),
    unlocked: true,
  },
  {
    id: "10",
    name: "Power User",
    icon: require("../assets/PowerUser.png"),
    unlocked: true,
  },
  {
    id: "11",
    name: "Perfect Streak",
    icon: require("../assets/PerfectStreak.png"),
    unlocked: true,
  },
  {
    id: "12",
    name: "Top Tracker",
    icon: require("../assets/TopTracker.png"),
    unlocked: true,
  },
  {
    id: "13",
    name: "Homework Champion",
    icon: require("../assets/HomeworkChampion.png"),
    unlocked: true,
  },
  {
    id: "14",
    name: "No Miss King/Queen",
    icon: require("../assets/NoMissKQ.png"),
    unlocked: true,
  },
  {
    id: "15",
    name: "Milestone Collector",
    icon: require("../assets/MilestoneCollector.png"),
    unlocked: true,
  },
  { id: "16", name: "Locked", icon: null, unlocked: false },
  { id: "17", name: "Locked", icon: null, unlocked: false },
  { id: "18", name: "Locked", icon: null, unlocked: false },
  { id: "19", name: "Locked", icon: null, unlocked: false },
  { id: "20", name: "Locked", icon: null, unlocked: false },
  { id: "21", name: "Locked", icon: null, unlocked: false },
];

const MilestonesScreen = () => {
  // This function renders each individual milestone card.
  const renderMilestone = ({ item }) => {
    return (
      <TouchableOpacity style={styles.milestoneCard}>
        {item.unlocked ? (
          // Render this if the milestone is unlocked
          <>
            <Image source={item.icon} style={styles.milestoneIcon} />
            <Text style={styles.milestoneName}>{item.name}</Text>
          </>
        ) : (
          // Render this for locked milestones
          <Text style={styles.lockedMilestoneQuestionMark}>?</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.milestonesContainer}>
      <FlatList
        data={milestonesData}
        renderItem={renderMilestone}
        keyExtractor={(item) => item.id}
        numColumns={3} // This creates the 3-column grid
        contentContainerStyle={styles.milestonesGrid}
      />
    </View>
  );
};

export default MilestonesScreen;
