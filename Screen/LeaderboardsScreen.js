import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import styles from "../Style/Homestyle";

// Mock data for populating the UI
const leaderboardData = [
  {
    rank: 1,
    name: "Near",
    avatar: require("../assets/profile.png"),
    score: 1200,
  },
  {
    rank: 2,
    name: "Dave",
    avatar: require("../assets/profile.png"),
    score: 1025,
  },
  {
    rank: 3,
    name: "Allen",
    avatar: require("../assets/profile.png"),
    score: 950,
  },
  {
    rank: 4,
    name: "Albie Darforyu",
    avatar: require("../assets/profile.png"),
    score: 945,
  },
  {
    rank: 5,
    name: "Raul Calimot",
    avatar: require("../assets/profile.png"),
    score: 925,
  },
  {
    rank: 6,
    name: "Manny No",
    avatar: require("../assets/profile.png"),
    score: 890,
  },
  {
    rank: 7,
    name: "Robert Sinampalok",
    avatar: require("../assets/profile.png"),
    score: 875,
  },
  {
    rank: 8,
    name: "Itsuki Nakano",
    avatar: require("../assets/profile.png"),
    score: 870,
  },
];

const LeaderboardsScreen = ({ navigation }) => {
  const [activeClassTab, setActiveClassTab] = useState("Class C");
  const [activeTimeTab, setActiveTimeTab] = useState("Weekly");

  const topThree = leaderboardData.slice(0, 3);
  const restOfLeaderboard = leaderboardData.slice(3);

  const renderPodium = () => {
    const [first, second, third] = topThree;
    return (
      <View style={styles.podiumContainer}>
        {/* 2nd Place */}
        <View style={styles.podiumItem}>
          <Image source={second.avatar} style={styles.podiumAvatar2} />
          <Text style={styles.podiumName}>{second.name}</Text>
          <Text style={styles.podiumScore}>{second.score} points</Text>
        </View>
        {/* 1st Place */}
        <View style={[styles.podiumItem, styles.podiumItem1]}>
          <Image
            source={require("../assets/crown-icon.png")}
            style={styles.crownIcon}
          />
          <Image source={first.avatar} style={styles.podiumAvatar1} />
          <Text style={styles.podiumName}>{first.name}</Text>
          <Text style={styles.podiumScore}>{first.score} points</Text>
        </View>
        {/* 3rd Place */}
        <View style={styles.podiumItem}>
          <Image source={third.avatar} style={styles.podiumAvatar3} />
          <Text style={styles.podiumName}>{third.name}</Text>
          <Text style={styles.podiumScore}>{third.score} points</Text>
        </View>
      </View>
    );
  };

  return (
    // The ScrollView now uses a different style for top padding
    <ScrollView style={styles.leaderboardContainer}>
      {/* The custom header and title have been REMOVED from here */}

      {/* Class/Overall Tabs */}
      <View style={styles.leaderboardTabRow}>
        <TouchableOpacity
          style={[
            styles.leaderboardTab,
            activeClassTab === "Class C" && styles.leaderboardTabActive,
          ]}
          onPress={() => setActiveClassTab("Class C")}
        >
          <Text
            style={[
              styles.leaderboardTabText,
              activeClassTab === "Class C" && styles.leaderboardTabTextActive,
            ]}
          >
            Class C
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.leaderboardTab,
            activeClassTab === "Overall" && styles.leaderboardTabActive,
          ]}
          onPress={() => setActiveClassTab("Overall")}
        >
          <Text
            style={[
              styles.leaderboardTabText,
              activeClassTab === "Overall" && styles.leaderboardTabTextActive,
            ]}
          >
            Overall
          </Text>
        </TouchableOpacity>
      </View>

      {/* Podium Card */}
      <View style={styles.podiumCard}>{renderPodium()}</View>

      {/* Time-based Tabs */}
      <View style={styles.timeTabRow}>
        {["Daily", "Weekly", "Monthly"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.timeTab,
              activeTimeTab === tab && styles.timeTabActive,
            ]}
            onPress={() => setActiveTimeTab(tab)}
          >
            <Text
              style={[
                styles.timeTabText,
                activeTimeTab === tab && styles.timeTabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Rankings List */}
      <View style={styles.rankListContainer}>
        <View style={styles.rankListHeader}>
          <Text style={styles.rankListHeaderText}>Rank</Text>
          <Text style={[styles.rankListHeaderText, { flex: 1 }]}>Student</Text>
          <Text style={styles.rankListHeaderText}>Score</Text>
        </View>
        {/* ^ THIS WAS THE LINE WITH THE TYPO. Corrected to </View> */}

        {restOfLeaderboard.map((player) => (
          <View key={player.rank} style={styles.rankItem}>
            <Text style={styles.rankPosition}>{player.rank}</Text>
            <View style={styles.rankStudentInfo}>
              <Image source={player.avatar} style={styles.rankAvatar} />
              <Text style={styles.rankName}>{player.name}</Text>
            </View>
            <View style={styles.rankScoreContainer}>
              <Text style={styles.rankScoreText}>{player.score} points</Text>
            </View>
          </View>
        ))}
      </View>
      <Image
        source={require("../assets/down-arrow.png")}
        style={styles.scrollChevron}
      />
    </ScrollView>
  );
};

export default LeaderboardsScreen;
