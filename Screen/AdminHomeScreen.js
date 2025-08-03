// Screen/AdminHomeScreen.js
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
  StyleSheet,
} from "react-native";
import { Calendar } from "react-native-calendars";
import styles from "../Style/Homestyle";
import { supabase } from "../supabaseClient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const AdminHomeScreen = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const [pendingTaskCount, setPendingTaskCount] = useState(0);
    const [classStats, setClassStats] = useState({ studentCount: 0, activeQuests: 0, overallProgress: 0 });
    const [questStats, setQuestStats] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            const fetchDashboardData = async () => {
                setLoading(true);
                try {
                    const { data: { user: authUser } } = await supabase.auth.getUser();
                    if (!authUser) throw new Error("No user found.");

                    const { data: profile } = await supabase.from("profiles").select("username, avatar_url, school_id").eq("id", authUser.id).single();
                    setUser({ id: authUser.id, ...profile });
                    const adminId = authUser.id;

                    // --- Fetch pending task count for notification bell ---
                    const { data: adminClasses, error: classesError } = await supabase.from('classes').select('id').eq('admin_id', adminId);
                    if (classesError) throw classesError;
                    
                    const adminClassIds = adminClasses.map(c => c.id);
                    let pendingCount = 0;

                    if (adminClassIds.length > 0) {
                        const { data: tasksInAdminClasses, error: tasksInClassError } = await supabase.from('tasks').select('id').in('class_id', adminClassIds);
                        if (tasksInClassError) throw tasksInClassError;

                        const taskIds = tasksInAdminClasses.map(t => t.id);
                        if (taskIds.length > 0) {
                            const { count, error: countError } = await supabase
                                .from('student_tasks')
                                .select('*', { count: 'exact', head: true })
                                .eq('status', 'pending_approval')
                                .in('task_id', taskIds);
                            
                            if (!countError) {
                                pendingCount = count || 0;
                            }
                        }
                    }
                    setPendingTaskCount(pendingCount);

                    // --- FIX: Logic below now uses `status` column ---
                    const { data: members, error: membersError } = await supabase.from('class_members').select('student_id').in('class_id', adminClassIds).eq('status', 'approved');
                    if(membersError) throw membersError;

                    const studentIds = members.map(m => m.student_id);
                    const studentCount = new Set(studentIds).size;
                    
                    const { data: tasks, error: tasksError } = await supabase.from("tasks").select("id, name, due_date").in("class_id", adminClassIds);
                    if (tasksError) throw tasksError;

                    const today = new Date().toISOString().split("T")[0];
                    const activeQuests = tasks.filter((t) => !t.due_date || t.due_date >= today).length;

                    const datesToMark = {};
                    tasks.forEach((task) => { if (task.due_date) datesToMark[task.due_date] = { marked: true, dotColor: "#e74c3c" }; });
                    setMarkedDates(datesToMark);

                    let overallProgress = 0;
                    if (studentIds.length > 0 && tasks.length > 0) {
                        const { data: studentTasks, error: stError } = await supabase.from("student_tasks").select("task_id, status").in("student_id", studentIds);
                        if (stError) throw stError;
                        
                        const approvedCount = studentTasks.filter(st => st.status === 'approved').length;
                        const totalAssignments = tasks.length * studentCount;
                        overallProgress = totalAssignments > 0 ? Math.round((approvedCount / totalAssignments) * 100) : 0;
                    }

                    setClassStats({ studentCount, activeQuests, overallProgress });

                } catch (error) {
                    console.error("Error fetching dashboard data:", error.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchDashboardData();
        }, [])
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
        return <ActivityIndicator size="large" color="#4F74B8" style={{ flex: 1, justifyContent: "center" }} />;
    }

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={require("../assets/ImageBackground.png")} style={styles.backgroundImage} imageStyle={{ opacity: 0.08, resizeMode: "contain" }}>
                <View style={styles.adminHeader}>
                    <Text style={styles.adminAppTitle}>ProActive</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("TaskApproval")}>
                        <Image source={require("../assets/notification.png")} style={styles.adminNotificationIcon} />
                        {pendingTaskCount > 0 && <View style={localStyles.notificationDot} />}
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.adminScrollContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("AdminProfileEdit", { user })}>
                        <View style={styles.adminProfileCard}>
                            <Image source={user?.avatar_url ? { uri: user.avatar_url } : require("../assets/admin-profile.png")} style={styles.adminProfileImage} />
                            <View style={styles.adminProfileInfo}>
                                <Text style={styles.adminRank}>Admin ✨🧠🔋</Text>
                                <Text style={styles.adminUsername}>{user?.username || "Admin User"}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setMenuVisible(true)}>
                                <Image source={require("../assets/menu-icon.png")} style={styles.adminMenuIcon} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.adminWelcomeText}>
                        Welcome Back! Here is an overview of your class today.
                    </Text>

                    <View style={styles.adminContentContainer}>
                        <View style={styles.adminSearchRow}>
                            <View style={styles.adminSearchWrapper}>
                                <Image source={require("../assets/search-icon.png")} style={styles.adminSearchIcon} />
                                <TextInput placeholder="Search" style={styles.adminSearchInput} placeholderTextColor="#888" />
                            </View>
                            <TouchableOpacity style={styles.adminActionIconBtn} onPress={() => navigateToScreen("CreateTask")}>
                                <Image source={require("../assets/add-icon.png")} style={styles.adminActionIcon} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.adminCard}>
                            <Text style={styles.adminCardTitle}>Quest Completion Rates</Text>
                            {questStats.length > 0 ? (
                                <View style={styles.adminQuestBarContainer}>{/* Quest stats mapping */}</View>
                            ) : (
                                <Text style={{ textAlign: "center", color: "gray" }}>No quests assigned yet. Create a task to see stats.</Text>
                            )}
                        </View>

                        <View style={styles.adminCard}>
                            <Text style={styles.adminCardTitle}>Class Overview</Text>
                            <View style={styles.adminClassCirclesRow}>
                                <View style={styles.adminCircleContainer}>
                                    <AnimatedCircularProgress size={60} width={6} fill={100} tintColor="#3498db" backgroundColor="#e0e0e0">
                                        {() => (<Text style={{ fontSize: 16, fontWeight: "bold" }}>{classStats.studentCount}</Text>)}
                                    </AnimatedCircularProgress>
                                    <Text style={styles.adminCircleLabel}>Students</Text>
                                </View>
                                <View style={styles.adminCircleContainer}>
                                    <AnimatedCircularProgress size={60} width={6} fill={100} tintColor="#f39c12" backgroundColor="#e0e0e0">
                                        {() => (<Text style={{ fontSize: 16, fontWeight: "bold" }}>{classStats.activeQuests}</Text>)}
                                    </AnimatedCircularProgress>
                                    <Text style={styles.adminCircleLabel}>Active Quests</Text>
                                </View>
                                <View style={styles.adminCircleContainer}>
                                    <AnimatedCircularProgress size={60} width={6} fill={classStats.overallProgress} tintColor="#2ecc71" backgroundColor="#e0e0e0">
                                        {() => (<Text style={{ fontSize: 14 }}>{`${classStats.overallProgress}%`}</Text>)}
                                    </AnimatedCircularProgress>
                                    <Text style={styles.adminCircleLabel}>Completion</Text>
                                </View>
                            </View>
                        </View>

                        <Calendar style={styles.adminCalendar} theme={{ backgroundColor: "transparent", calendarBackground: "#fff", textSectionTitleColor: "#b6c1cd", selectedDayBackgroundColor: "#4F74B8", todayTextColor: "#4F74B8", dayTextColor: "#2d4150", arrowColor: "#4F74B8", monthTextColor: "#4F74B8", textMonthFontWeight: "bold" }} markedDates={markedDates} />
                    </View>
                </ScrollView>
            </ImageBackground>

            {menuVisible && (
                <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                    <View style={styles.adminMenuOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.adminMenuContainer}>
                                <TouchableOpacity style={styles.adminMenuItem} onPress={() => navigateToScreen("CreateClass")}>
                                    <Text style={styles.adminMenuItemIcon}>➕</Text>
                                    <Text style={styles.adminMenuItemText}>Create Class</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.adminMenuItem} onPress={() => navigateToScreen("CreateTask")}>
                                    <Text style={styles.adminMenuItemIcon}>📝</Text>
                                    <Text style={styles.adminMenuItemText}>Create Task</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.adminMenuItem} onPress={() => navigateToScreen("AdminMyClass")}>
                                    <Text style={styles.adminMenuItemIcon}>🏫</Text>
                                    <Text style={styles.adminMenuItemText}>My Class</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.adminMenuItem} onPress={() => navigateToScreen("AdminChatList")}>
                                    <Text style={styles.adminMenuItemIcon}>💬</Text>
                                    <Text style={styles.adminMenuItemText}>Class Chat</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.adminMenuItem} onPress={() => navigateToScreen("StudentProgress")}>
                                    <Text style={styles.adminMenuItemIcon}>📈</Text>
                                    <Text style={styles.adminMenuItemText}>Student Progress</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.adminMenuItem} onPress={() => navigateToScreen("ActivityLogs")}>
                                    <Text style={styles.adminMenuItemIcon}>📜</Text>
                                    <Text style={styles.adminMenuItemText}>Activity Logs</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.adminMenuItem} onPress={() => navigateToScreen("Settings")}>
                                    <Text style={styles.adminMenuItemIcon}>⚙️</Text>
                                    <Text style={styles.adminMenuItemText}>Settings</Text>
                                </TouchableOpacity>
                                <View style={styles.adminMenuSeparator} />
                                <TouchableOpacity style={styles.adminMenuItem} onPress={handleSignOut}>
                                    <Text style={styles.adminMenuItemIcon}>🚪</Text>
                                    <Text style={[styles.adminMenuItemText, { color: "#c0392b" }]}>Sign Out</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            )}
        </View>
    );
};

const localStyles = StyleSheet.create({
    notificationDot: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#e74c3c',
        borderWidth: 1.5,
        borderColor: '#f0f4ff', // Match the header background
    }
});

export default AdminHomeScreen;