import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import styles from "../Style/Homestyle";
import { supabase } from "../supabaseClient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import RankModal from "../components/RankModal";
import BadgeIcon from "../assets/e-rank.png";

const StudentHomeScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [rankModalVisible, setRankModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, avatar_url, school_id")
          .eq("id", session.user.id)
          .single();
        setUser({ id: session.user.id, ...profile });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile])
  );

  const handleSignOut = async () => {
    setMenuVisible(false);
    await supabase.auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
  };

  const navigateToScreen = (screenName) => {
    setMenuVisible(false);
    navigation.navigate(screenName);
  };

  const navigateToChat = async () => {
    if (!user) {
      Alert.alert("Error", "User data not loaded yet. Please wait a moment.");
      return;
    }
    try {
      const { data: memberData, error: memberError } = await supabase
        .from("class_members")
        .select("classes (id, class_name)")
        .eq("student_id", user.id)
        .eq("status", "approved")
        .limit(1)
        .single();

      if (memberError || !memberData || !memberData.classes) {
        Alert.alert(
          "No Classes Joined",
          "You must join a class to use the chat."
        );
        return;
      }

      navigation.navigate("ChatMessage", {
        classInfo: memberData.classes,
        currentUser: user,
      });
    } catch (error) {
      Alert.alert("Error", "Could not open chat. " + error.message);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f4ff",
        }}
      >
        <ActivityIndicator size="large" color="#4F74B8" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/ImageBackground.png")}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.1, resizeMode: "contain" }}
      >
        <View style={styles.studentScreenContainer}>
          <ScrollView contentContainerStyle={styles.studentScrollContainer}>
            <View style={styles.header}>
              <Text style={styles.appTitle}>ProActive</Text>
              <TouchableOpacity>
                <Image
                  source={require("../assets/notification.png")}
                  style={styles.notificationIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.profileCard}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ProfileEdit", { user })}
              >
                <Image
                  source={
                    user?.avatar_url
                      ? { uri: user.avatar_url }
                      : require("../assets/profile.png")
                  }
                  style={styles.profileImage}
                />
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                <TouchableOpacity
                  onPress={() => setRankModalVisible(true)}
                  style={localStyles.rankContainer}
                >
                  <Text style={styles.rank}>E-Rank</Text>
                  <Image source={BadgeIcon} style={localStyles.badgeIcon} />
                </TouchableOpacity>
                <Text style={styles.rankNote}>(Newcomer)</Text>
                <Text style={styles.username}>
                  {user?.username || "Student User"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <Image
                  source={require("../assets/menu-icon.png")}
                  style={styles.menuIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.progressWrapper}>
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Weekly Completion Quests</Text>
            <View style={styles.questCard}>
              <Text style={styles.questCategory}>Daily Quests</Text>
              <Text style={styles.questItem}>⭐ Attend Class on time</Text>
              <Text style={styles.questItem}>
                ⭐ Complete a set of practice questions
              </Text>
              <Text style={styles.questItem}>⭐ Participate on recitation</Text>
              <Text style={styles.questCategory}>Weekly Quests 📜</Text>
              <View style={styles.placeholder} />
              <Text style={styles.questCategory}>Class Quests 📜</Text>
              <View style={styles.placeholder} />
            </View>
          </ScrollView>

          <View style={[styles.scoreContainer, { bottom: 85 + insets.bottom }]}>
            <Text style={styles.scoreText}>SP : 0 Points</Text>
            <Text style={styles.scoreText}>To rank up: 199 Points</Text>
          </View>

          <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
            <TouchableOpacity
              style={styles.navIconContainer}
              onPress={() => navigation.navigate("StudentHome")}
            >
              <Image
                source={require("../assets/home-icon.png")}
                style={styles.navIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navIconContainer}
              onPress={navigateToChat}
            >
              <Image
                source={require("../assets/chat-icon.png")}
                style={styles.navIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navIconContainer}
              onPress={() => navigation.navigate("Leaderboards")}
            >
              <Image
                source={require("../assets/leaderboard-icon.png")}
                style={styles.navIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navIconContainer}
              onPress={() => navigation.navigate("ProfileEdit", { user })}
            >
              <Image
                source={require("../assets/profile-icon.png")}
                style={styles.navIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {menuVisible && (
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.adminMenuOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.adminMenuContainer}>
                <TouchableOpacity
                  style={styles.adminMenuItem}
                  onPress={() => navigateToScreen("JoinClass")}
                >
                  <Text style={styles.adminMenuItemIcon}>🤝</Text>
                  <Text style={styles.adminMenuItemText}>Join Class</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.adminMenuItem}
                  onPress={() => navigateToScreen("StudentMyClass")}
                >
                  <Text style={styles.adminMenuItemIcon}>🏫</Text>
                  <Text style={styles.adminMenuItemText}>My Class</Text>
                </TouchableOpacity>
                {/* ADDED NEW ITEM HERE */}
                <TouchableOpacity
                  style={styles.adminMenuItem}
                  onPress={() => navigateToScreen("StudentTasks")}
                >
                  <Text style={styles.adminMenuItemIcon}>✅</Text>
                  <Text style={styles.adminMenuItemText}>My Tasks</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.adminMenuItem}
                  onPress={() => navigateToScreen("QuestsHistory")}
                >
                  <Text style={styles.adminMenuItemIcon}>📖</Text>
                  <Text style={styles.adminMenuItemText}>Quests History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.adminMenuItem}
                  onPress={() => navigateToScreen("Leaderboards")}
                >
                  <Text style={styles.adminMenuItemIcon}>🏆</Text>
                  <Text style={styles.adminMenuItemText}>Leaderboards</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.adminMenuItem}
                  onPress={() => navigateToScreen("Milestones")}
                >
                  <Text style={styles.adminMenuItemIcon}>🎯</Text>
                  <Text style={styles.adminMenuItemText}>Milestones</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.adminMenuItem}
                  onPress={() => navigateToScreen("ActivityLogs")}
                >
                  <Text style={styles.adminMenuItemIcon}>📜</Text>
                  <Text style={styles.adminMenuItemText}>Activity Logs</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.adminMenuItem}
                  onPress={() => navigateToScreen("Settings")}
                >
                  <Text style={styles.adminMenuItemIcon}>⚙️</Text>
                  <Text style={styles.adminMenuItemText}>Settings</Text>
                </TouchableOpacity>
                <View style={styles.adminMenuSeparator} />
                <TouchableOpacity
                  style={styles.adminMenuItem}
                  onPress={handleSignOut}
                >
                  <Text style={styles.adminMenuItemIcon}>🚪</Text>
                  <Text
                    style={[styles.adminMenuItemText, { color: "#c0392b" }]}
                  >
                    Sign Out
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      <RankModal
        isVisible={rankModalVisible}
        onClose={() => setRankModalVisible(false)}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  rankContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
  badgeIcon: {
    width: 24,
    height: 24,
    marginLeft: 5,
  },
});

export default StudentHomeScreen;
