// Screen/StudentHomeScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView, // Keep ScrollView for the main content if not using FlatList for everything
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle"; // Ensure this path is correct
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RankModal from "../components/RankModal";
import BadgeIcon from "../assets/e-rank.png"; // Ensure this path is correct

const StudentHomeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [rankModalVisible, setRankModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) throw new Error("No user found");

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (error) throw error;

        setUser({ ...authUser, ...profileData });
      } catch (error) {
        console.error("Error fetching user:", error.message);
        Alert.alert("Error", "Could not load user profile.");
      }
    };

    fetchProfile();
  }, []);

  // Fetch tasks assigned to the student
  const fetchTasks = useCallback(async () => {
    if (!user) return;

    setLoadingTasks(true);
    try {
      const { data: studentTasks, error: tasksError } = await supabase
        .from("student_tasks")
        .select(`id, is_completed, assigned_at, tasks (id, name, points_value, type, created_at)`)
        .eq("student_id", user.id)
        .eq("is_completed", false)
        .order("assigned_at", { ascending: false });

      if (tasksError) throw tasksError;

      const mappedTasks = (studentTasks || []).map((st) => ({
        student_task_id: st.id,
        ...st.tasks,
        is_completed: st.is_completed,
      })).filter(task => task !== null);

      setTasks(mappedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      Alert.alert("Error", "Could not load tasks.");
    } finally {
      setLoadingTasks(false);
    }
  }, [user]);

  // Refetch tasks when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } catch (error) {
      Alert.alert("Error", "Could not sign out: " + error.message);
    }
  };

  // Navigate to screen and close menu
  const navigateToScreen = (screenName, params = {}) => {
    setMenuVisible(false);
    navigation.navigate(screenName, params);
  };

  // Navigate to Chat with proper class membership check
  const navigateToChat = async () => {
    setMenuVisible(false);

    if (!user) {
      Alert.alert("Error", "User not loaded. Please try again.");
      return;
    }

    try {
      // Step 1: Check if user is in any approved class
      const { data: memberData, error: memberError } = await supabase
        .from("class_members")
        .select("class_id")
        .eq("student_id", user.id)
        .eq("status", "approved")
        .limit(1)
        .single();

      if (memberError || !memberData) {
        Alert.alert(
          "Join a Class",
          "You need to join a class before accessing the chat.",
          [{ text: "OK", onPress: () => navigation.navigate("JoinClass") }]
        );
        return;
      }

      // Step 2: Get class details
      const { data: classData, error: classError } = await supabase
        .from("classes")
        .select("id, class_name")
        .eq("id", memberData.class_id)
        .single();

      if (classError || !classData) {
        Alert.alert("Error", "Could not load class details.");
        return;
      }

      // Step 3: Navigate to chat
      navigation.navigate("ChatMessage", {
        classInfo: classData,
        currentUser: user,
      });
    } catch (error) {
      console.error("Chat navigation error:", error);
      Alert.alert("Error", "Could not open chat: " + error.message);
    }
  };

  // Render a single task item
  const renderTaskItem = ({ item }) => (
    <View style={styles.questItem}>
      <Text style={styles.questName}>{item.name}</Text>
      <View style={styles.questDetails}>
        <Text style={styles.questPoints}>{item.points_value}p</Text>
        <Text style={styles.questType}>{item.type}</Text>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/ImageBackground.png")}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      {/* The main content container that allows vertical layout */}
      <View style={[styles.overlay, localStyles.studentScreenContainer]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={styles.appTitle}>ProActive</Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Image
              source={require("../assets/menu-icon.png")}
              style={styles.menuIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Use ScrollView for the main content to allow scrolling if tasks overflow */}
        <ScrollView contentContainerStyle={localStyles.scrollContentContainer}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <TouchableOpacity onPress={() => navigation.navigate("ProfileEdit", { user })}>
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
          </View>

          {/* Progress Bar */}
          <View style={styles.progressWrapper}>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </View>

          {/* Weekly Completion Quests Section */}
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionTitle}>Weekly Completion Quests</Text>
            {loadingTasks ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#4F74B8" />
                <Text style={styles.loadingText}>Loading quests...</Text>
              </View>
            ) : tasks.length > 0 ? (
              <FlatList
                data={tasks}
                renderItem={renderTaskItem}
                keyExtractor={(item) => item.student_task_id.toString()}
                style={styles.questList}
                scrollEnabled={false} // Nested FlatList should ideally not scroll
                contentContainerStyle={localStyles.flatListContent}
              />
            ) : (
              <Text style={styles.noQuestText}>No active quests assigned.</Text>
            )}
          </View>

          {/* Spacer to push content up and make space for score container and bottom nav */}
          <View style={{ height: 100 + insets.bottom }} /> 

        </ScrollView>

        {/* Score Display - Fixed position */}
        <View style={[styles.scoreContainer, { bottom: 85 + insets.bottom }]}>
          <Text style={styles.scoreText}>SP : 0 Points</Text>
          <Text style={styles.scoreText}>To rank up: 199 Points</Text>
        </View>

        {/* Bottom Navigation - Fixed position */}
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
        </View>

        {/* Menu Overlay */}
        {menuVisible && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.menuOverlay}
            onPress={() => setMenuVisible(false)} // Close menu when tapping outside
          >
            <TouchableOpacity
              activeOpacity={1} // Prevents closing menu when tapping on the menu content
              style={[styles.menuContainer, { paddingBottom: 20 + insets.bottom }]} // Adjust padding based on insets
              onPress={() => {}} // This prevents the touch from bubbling up to menuOverlay
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateToScreen("ProfileEdit")}
              >
                <Text style={styles.menuItemIcon}>👤</Text>
                <Text style={styles.menuItemText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateToScreen("JoinClass")}
              >
                <Text style={styles.menuItemIcon}>🤝</Text>
                <Text style={styles.menuItemText}>Join Class</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateToScreen("StudentMyClass")}
              >
                <Text style={styles.menuItemIcon}>🏫</Text>
                <Text style={styles.menuItemText}>My Class</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateToScreen("StudentTasks")}
              >
                <Text style={styles.menuItemIcon}>✅</Text>
                <Text style={styles.menuItemText}>My Tasks</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={navigateToChat}
              >
                <Text style={styles.menuItemIcon}>💬</Text>
                <Text style={styles.menuItemText}>Class Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateToScreen("Leaderboards")}
              >
                <Text style={styles.menuItemIcon}>🏆</Text>
                <Text style={styles.menuItemText}>Leaderboards</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateToScreen("Milestones")}
              >
                <Text style={styles.menuItemIcon}>🎯</Text>
                <Text style={styles.menuItemText}>Milestones</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateToScreen("QuestsHistory")}
              >
                <Text style={styles.menuItemIcon}>📖</Text>
                <Text style={styles.menuItemText}>Quests History</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateToScreen("Settings")}
              >
                <Text style={styles.menuItemIcon}>⚙️</Text>
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
                <Text style={styles.menuItemIcon}>🚪</Text>
                <Text style={[styles.menuItemText, { color: "#c0392b" }]}>
                  Sign Out
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {/* Rank Modal */}
        <RankModal
          isVisible={rankModalVisible}
          onClose={() => setRankModalVisible(false)}
        />
      </View>
    </ImageBackground>
  );
};

// Local Styles specific to this component
const localStyles = StyleSheet.create({
  studentScreenContainer: {
    flex: 1,
    // backgroundColor: "#f0f4ff", // Already handled by overlay with transparency
  },
  scrollContentContainer: {
    flexGrow: 1, // Ensures content can grow and scroll
    paddingHorizontal: 15, // Apply horizontal padding to the scrollable content
    paddingBottom: 20, // Add some padding to the bottom of the scroll view
  },
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
  flatListContent: {
    paddingBottom: 20, // Add some padding to the bottom of the FlatList content
  }
});

export default StudentHomeScreen;