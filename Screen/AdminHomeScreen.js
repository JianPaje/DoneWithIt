import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ImageBackground,
} from "react-native";
import { Calendar } from "react-native-calendars";
import styles from "../Style/Homestyle";
import { supabase } from "../supabaseClient";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // MODIFIED IMPORT
import { AnimatedCircularProgress } from "react-native-circular-progress";

const AdminHomeScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [classStats, setClassStats] = useState({
    studentCount: 0,
    activeQuests: 0,
    overallProgress: 0,
  });
  const [questStats, setQuestStats] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const navigation = useNavigation();

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("No user session found.");

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url, school_id")
        .eq("id", session.user.id)
        .single();
      setUser({ id: session.user.id, ...profile });
      const adminId = session.user.id;

      const { data: students, error: studentsError } = await supabase
        .from("profiles")
        .select("id")
        .eq("admin_id", adminId);
      if (studentsError) throw studentsError;
      const studentCount = students.length;
      const studentIds = students.map((s) => s.id);

      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("id, name, due_date")
        .eq("created_by", adminId);
      if (tasksError) throw tasksError;

      const today = new Date().toISOString().split("T")[0];
      const activeQuests = tasks.filter((t) => t.due_date >= today).length;

      const datesToMark = {};
      tasks.forEach((task) => {
        datesToMark[task.due_date] = {
          marked: true,
          dotColor: "#e74c3c",
          activeOpacity: 0.5,
        };
      });
      setMarkedDates(datesToMark);

      let overallProgress = 0;
      let newQuestStats = [];

      if (studentIds.length > 0 && tasks.length > 0) {
        const { data: studentTasks, error: stError } = await supabase
          .from("student_tasks")
          .select("task_id, is_completed")
          .in("student_id", studentIds);
        if (stError) throw stError;

        const completedCount = studentTasks.filter(
          (st) => st.is_completed
        ).length;
        const totalAssignments = tasks.length * studentIds.length;
        overallProgress =
          totalAssignments > 0
            ? Math.round((completedCount / totalAssignments) * 100)
            : 0;

        const recentTasks = tasks.slice(-4);
        newQuestStats = recentTasks.map((task) => {
          const completions = studentTasks.filter(
            (st) => st.task_id === task.id && st.is_completed
          ).length;
          const completionRate =
            studentCount > 0
              ? Math.round((completions / studentCount) * 100)
              : 0;
          return {
            name: task.name,
            rate: completionRate,
            color: ["#3498db", "#9b59b6", "#f39c12", "#e74c3c"][
              recentTasks.indexOf(task) % 4
            ],
          };
        });
      }

      setQuestStats(newQuestStats);
      setClassStats({ studentCount, activeQuests, overallProgress });
    } catch (error) {
      console.error("Error fetching dashboard data:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // CORRECTED: Replaced useEffect with useFocusEffect using the correct pattern
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
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
        imageStyle={{ opacity: 0.08, resizeMode: "contain" }}
      >
        <View style={styles.adminHeader}>
          <Text style={styles.adminAppTitle}>ProActive</Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Image
              source={require("../assets/notification.png")}
              style={styles.adminNotificationIcon}
            />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.adminScrollContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("AdminProfileEdit", { user })}
          >
            <View style={styles.adminProfileCard}>
              <Image
                source={
                  user?.avatar_url
                    ? { uri: user.avatar_url }
                    : require("../assets/admin-profile.png")
                }
                style={styles.adminProfileImage}
              />
              <View style={styles.adminProfileInfo}>
                <Text style={styles.adminRank}>Admin ✨🧠🔋</Text>
                <Text style={styles.adminUsername}>
                  {user?.username || "Admin User"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <Image
                  source={require("../assets/menu-icon.png")}
                  style={styles.adminMenuIcon}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <Text style={styles.adminWelcomeText}>
            Welcome Back! Here is an overview of your class today.
          </Text>

          <View style={styles.adminContentContainer}>
            <View style={styles.adminSearchRow}>
              <View style={styles.adminSearchWrapper}>
                <Image
                  source={require("../assets/search-icon.png")}
                  style={styles.adminSearchIcon}
                />
                <TextInput
                  placeholder="Search"
                  style={styles.adminSearchInput}
                  placeholderTextColor="#888"
                />
              </View>
              <TouchableOpacity
                style={styles.adminActionIconBtn}
                onPress={() => navigateToScreen("CreateTask")}
              >
                <Image
                  source={require("../assets/add-icon.png")}
                  style={styles.adminActionIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.adminCard}>
              <Text style={styles.adminCardTitle}>Quest Completion Rates</Text>
              {questStats.length > 0 ? (
                <View style={styles.adminQuestBarContainer}>
                  {questStats.map((quest, index) => (
                    <View key={index} style={styles.adminCircleContainer}>
                      <View style={styles.adminQuestBarWrapper}>
                        <View
                          style={[
                            styles.adminQuestBar,
                            {
                              height: `${quest.rate}%`,
                              backgroundColor: quest.color,
                            },
                          ]}
                        />
                      </View>
                      <Text numberOfLines={2} style={styles.adminCircleLabel}>
                        {quest.name}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={{ textAlign: "center", color: "gray" }}>
                  No quests assigned yet. Create a task to see stats.
                </Text>
              )}
            </View>

            <View style={styles.adminCard}>
              <Text style={styles.adminCardTitle}>Class Overview</Text>
              <View style={styles.adminClassCirclesRow}>
                <View style={styles.adminCircleContainer}>
                  <AnimatedCircularProgress
                    size={60}
                    width={6}
                    fill={100}
                    tintColor="#3498db"
                    backgroundColor="#e0e0e0"
                  >
                    {() => (
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        {classStats.studentCount}
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                  <Text style={styles.adminCircleLabel}>Students</Text>
                </View>
                <View style={styles.adminCircleContainer}>
                  <AnimatedCircularProgress
                    size={60}
                    width={6}
                    fill={100}
                    tintColor="#f39c12"
                    backgroundColor="#e0e0e0"
                  >
                    {() => (
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        {classStats.activeQuests}
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                  <Text style={styles.adminCircleLabel}>Active Quests</Text>
                </View>
                <View style={styles.adminCircleContainer}>
                  <AnimatedCircularProgress
                    size={60}
                    width={6}
                    fill={classStats.overallProgress}
                    tintColor="#2ecc71"
                    backgroundColor="#e0e0e0"
                  >
                    {() => (
                      <Text
                        style={{ fontSize: 14 }}
                      >{`${classStats.overallProgress}%`}</Text>
                    )}
                  </AnimatedCircularProgress>
                  <Text style={styles.adminCircleLabel}>Completion</Text>
                </View>
              </View>
            </View>

            <Calendar
              style={styles.adminCalendar}
              theme={{
                backgroundColor: "transparent",
                calendarBackground: "#fff",
                textSectionTitleColor: "#b6c1cd",
                selectedDayBackgroundColor: "#4F74B8",
                todayTextColor: "#4F74B8",
                dayTextColor: "#2d4150",
                arrowColor: "#4F74B8",
                monthTextColor: "#4F74B8",
                textMonthFontWeight: "bold",
              }}
              markedDates={markedDates}
            />
          </View>
        </ScrollView>
      </ImageBackground>

      {menuVisible && (
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.adminMenuOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.adminMenuContainer}>
                <TouchableOpacity
                  style={styles.adminMenuItem}
                  onPress={() => navigateToScreen("CreateClass")}
                >
                  <Text style={styles.adminMenuItemIcon}>➕</Text>
                  <Text style={styles.adminMenuItemText}>Create Class</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.adminMenuItem}
                  onPress={() => navigateToScreen("CreateTask")}
                >
                  <Text style={styles.adminMenuItemIcon}>📝</Text>
                  <Text style={styles.adminMenuItemText}>Create Task</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.adminMenuItem}
                  onPress={() => navigateToScreen("AdminMyClass")}
                >
                  <Text style={styles.adminMenuItemIcon}>🏫</Text>
                  <Text style={styles.adminMenuItemText}>My Class</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.adminMenuItem}
                  onPress={() => navigateToScreen("StudentProgress")}
                >
                  <Text style={styles.adminMenuItemIcon}>📈</Text>
                  <Text style={styles.adminMenuItemText}>Student Progress</Text>
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
    </View>
  );
};

export default AdminHomeScreen;
