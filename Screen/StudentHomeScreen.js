// Screen/StudentHomeScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RankModal from "../components/RankModal";
import BadgeIcon from "../assets/e-rank.png";

const StudentHomeScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [user, setUser] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [rankModalVisible, setRankModalVisible] = useState(false);
    const [allTasks, setAllTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [selectedTaskType, setSelectedTaskType] = useState("daily");
    const [loadingTasks, setLoadingTasks] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchProfile = async () => {
                try {
                    const { data: { user: authUser } } = await supabase.auth.getUser();
                    if (!authUser) throw new Error("No user found");
                    const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
                    if (error) throw error;
                    setUser({ ...authUser, ...profileData });
                } catch (error) {
                    console.error("Error fetching user:", error.message);
                }
            };
            fetchProfile();
        }, [])
    );

    const fetchTasks = useCallback(async () => {
        if (!user) return;
        setLoadingTasks(true);
        try {
            const { data: studentTasks, error: tasksError } = await supabase
                .from("student_tasks")
                .select(`id, status, assigned_at, tasks (id, name, points_value, type, created_at)`)
                .eq("student_id", user.id)
                .neq("status", "approved")
                .order("assigned_at", { ascending: false });

            if (tasksError) throw tasksError;
            const mappedTasks = (studentTasks || []).map((st) => ({ student_task_id: st.id, status: st.status, ...st.tasks })).filter(task => task.id);
            setAllTasks(mappedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error.message);
            Alert.alert("Error", "Could not load tasks.");
        } finally {
            setLoadingTasks(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            if (user) {
                fetchTasks();
            }
        }, [user, fetchTasks])
    );

    useEffect(() => {
        const filtered = allTasks.filter(task => task.type === selectedTaskType);
        setFilteredTasks(filtered);
    }, [selectedTaskType, allTasks]);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
        } catch (error) {
            Alert.alert("Error", "Could not sign out: " + error.message);
        }
    };

    const navigateToScreen = (screenName, params = {}) => {
        setMenuVisible(false);
        navigation.navigate(screenName, params);
    };

    const navigateToChat = () => {
        setMenuVisible(false);
        navigation.navigate("StudentChatList");
    };

    const renderTaskItem = ({ item }) => (
        <View style={styles.questItem}>
            <Text style={styles.questName}>{item.name}</Text>
            <View style={styles.questDetails}>
                <Text style={styles.questPoints}>{item.points_value}p</Text>
                <Text style={styles.questType}>{item.type}</Text>
            </View>
        </View>
    );

    const TaskFilter = () => (
        <View style={localStyles.filterContainer}>
            {['daily', 'weekly', 'event'].map((type) => (
                <TouchableOpacity key={type} style={[localStyles.filterButton, selectedTaskType === type && localStyles.filterButtonActive]} onPress={() => setSelectedTaskType(type)}>
                    <Text style={[localStyles.filterButtonText, selectedTaskType === type && localStyles.filterButtonTextActive]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <ImageBackground source={require("../assets/ImageBackground.png")} style={styles.backgroundImage} imageStyle={styles.backgroundImageStyle}>
            <View style={[styles.overlay, localStyles.studentScreenContainer]}>
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <Text style={styles.appTitle}>ProActive</Text>
                    <TouchableOpacity onPress={() => setMenuVisible(true)}>
                        <Image source={require("../assets/menu-icon.png")} style={styles.menuIcon} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={localStyles.scrollContentContainer}>
                    <View style={styles.profileCard}>
                        <TouchableOpacity onPress={() => navigation.navigate("ProfileEdit", { user })}>
                            <Image source={user?.avatar_url ? { uri: user.avatar_url } : require("../assets/profile.png")} style={styles.profileImage} />
                        </TouchableOpacity>
                        <View style={styles.profileInfo}>
                            <TouchableOpacity onPress={() => setRankModalVisible(true)} style={localStyles.rankContainer}>
                                <Text style={styles.rank}>E-Rank</Text>
                                <Image source={BadgeIcon} style={localStyles.badgeIcon} />
                            </TouchableOpacity>
                            <Text style={styles.rankNote}>(Newcomer)</Text>
                            <Text style={styles.username}>{user?.username || "Student User"}</Text>
                        </View>
                    </View>
                    <View style={styles.progressWrapper}><View style={styles.progressTrack}><View style={styles.progressFill} /></View></View>
                    <View style={[styles.section, { flex: 1 }]}>
                        <Text style={styles.sectionTitle}>Weekly Completion Quests</Text>
                        <TaskFilter />
                        {loadingTasks ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="#4F74B8" />
                                <Text style={styles.loadingText}>Loading quests...</Text>
                            </View>
                        ) : filteredTasks.length > 0 ? (
                            <FlatList data={filteredTasks} renderItem={renderTaskItem} keyExtractor={(item) => item.student_task_id.toString()} style={styles.questList} scrollEnabled={false} contentContainerStyle={localStyles.flatListContent} />
                        ) : (
                            <Text style={styles.noQuestText}>No active '{selectedTaskType}' quests assigned.</Text>
                        )}
                    </View>
                    <View style={{ height: 100 + insets.bottom }} />
                </ScrollView>

                <View style={[styles.scoreContainer, { bottom: 85 + insets.bottom }]}>
                    <Text style={styles.scoreText}>SP : 0 Points</Text>
                    <Text style={styles.scoreText}>To rank up: 199 Points</Text>
                </View>
                <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
                    <TouchableOpacity style={styles.navIconContainer} onPress={() => navigation.navigate("StudentHome")}><Image source={require("../assets/home-icon.png")} style={styles.navIcon} /></TouchableOpacity>
                    <TouchableOpacity style={styles.navIconContainer} onPress={navigateToChat}><Image source={require("../assets/chat-icon.png")} style={styles.navIcon} /></TouchableOpacity>
                    <TouchableOpacity style={styles.navIconContainer} onPress={() => navigation.navigate("Leaderboards")}><Image source={require("../assets/leaderboard-icon.png")} style={styles.navIcon} /></TouchableOpacity>
                </View>

                {menuVisible && (
                    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                        <View style={styles.menuOverlay}>
                            <TouchableWithoutFeedback>
                                <View style={[styles.menuContainer, { paddingBottom: 20 + insets.bottom }]}>
                                    {/* --- FIX IS HERE --- */}
                                    <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("ProfileEdit", { user: user })}>
                                        <Text style={styles.menuItemIcon}>👤</Text>
                                        <Text style={styles.menuItemText}>Edit Profile</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("JoinClass")}><Text style={styles.menuItemIcon}>🤝</Text><Text style={styles.menuItemText}>Join Class</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("StudentMyClass")}><Text style={styles.menuItemIcon}>🏫</Text><Text style={styles.menuItemText}>My Class</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("StudentTasks")}><Text style={styles.menuItemIcon}>✅</Text><Text style={styles.menuItemText}>My Tasks</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("QuestsHistory")}><Text style={styles.menuItemIcon}>📖</Text><Text style={styles.menuItemText}>Quests History</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.menuItem} onPress={navigateToChat}><Text style={styles.menuItemIcon}>💬</Text><Text style={styles.menuItemText}>Class Chat</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen("Leaderboards")}><Text style={styles.menuItemIcon}>🏆</Text><Text style={styles.menuItemText}>Leaderboards</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}><Text style={styles.menuItemIcon}>🚪</Text><Text style={[styles.menuItemText, { color: "#c0392b" }]}>Sign Out</Text></TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                )}

                <RankModal isVisible={rankModalVisible} onClose={() => setRankModalVisible(false)} />
            </View>
        </ImageBackground>
    );
};

const localStyles = StyleSheet.create({
    studentScreenContainer: { flex: 1 },
    scrollContentContainer: { flexGrow: 1, paddingHorizontal: 15, paddingBottom: 20 },
    rankContainer: { flexDirection: "row", alignItems: "center", paddingVertical: 2, paddingHorizontal: 5, borderRadius: 8 },
    badgeIcon: { width: 24, height: 24, marginLeft: 5 },
    flatListContent: { paddingBottom: 20 },
    filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
    filterButton: { paddingVertical: 8, paddingHorizontal: 25, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#e0e0e0' },
    filterButtonActive: { backgroundColor: '#4F74B8', borderColor: '#4F74B8' },
    filterButtonText: { color: '#333', fontWeight: '600' },
    filterButtonTextActive: { color: '#fff' },
});

export default StudentHomeScreen;