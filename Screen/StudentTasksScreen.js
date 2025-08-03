// Screen/StudentTasksScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SectionList,
} from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";
import { useFocusEffect } from "@react-navigation/native";

const StudentTasksScreen = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submittingTaskId, setSubmittingTaskId] = useState(null);

    // --- FIX: Corrected useFocusEffect pattern ---
    useFocusEffect(
        useCallback(() => {
            const fetchStudentTasks = async () => {
                setLoading(true);
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error("No user found");

                    // --- FIX: Query uses `status` and not `is_completed` ---
                    const { data: studentTasks, error: tasksError } = await supabase
                        .from("student_tasks")
                        .select(`id, status, assigned_at, tasks (id, name, points_value, type, created_at)`)
                        .eq("student_id", user.id)
                        .neq("status", "approved")
                        .order("assigned_at", { ascending: false });

                    if (tasksError) throw tasksError;

                    const mappedTasks = (studentTasks || [])
                        .map((st) => ({
                            student_task_id: st.id,
                            status: st.status,
                            assigned_at: st.assigned_at,
                            ...(st.tasks || {}),
                        }))
                        .filter((task) => task.id);

                    const groupedTasks = [
                        { title: 'Daily Tasks', data: mappedTasks.filter(t => t.type === 'daily') },
                        { title: 'Weekly Tasks', data: mappedTasks.filter(t => t.type === 'weekly') },
                        { title: 'Event Tasks', data: mappedTasks.filter(t => t.type === 'event') },
                    ];
                    
                    setTasks(groupedTasks.filter(section => section.data.length > 0));

                } catch (error) {
                    Alert.alert("Error", "Could not fetch tasks: " + error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchStudentTasks();
        }, [])
    );

    const handleSubmitForApproval = (studentTaskId, taskName) => {
        Alert.alert(
            "Submit Task",
            `Are you sure you have completed the task "${taskName}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes, Submit",
                    onPress: async () => {
                        setSubmittingTaskId(studentTaskId);
                        try {
                            const { error } = await supabase
                                .from("student_tasks")
                                .update({ status: 'pending_approval' })
                                .eq("id", studentTaskId);

                            if (error) {
                                throw error;
                            } else {
                                // Manually update the state for an instant UI change
                                setTasks(currentSections => {
                                    return currentSections.map(section => ({
                                        ...section,
                                        data: section.data.map(task => 
                                            task.student_task_id === studentTaskId 
                                            ? { ...task, status: 'pending_approval' } 
                                            : task
                                        ),
                                    }));
                                });
                            }
                        } catch (error) {
                            Alert.alert("Error", `Could not submit task: ${error.message}`);
                        } finally {
                            setSubmittingTaskId(null);
                        }
                    },
                },
            ]
        );
    };

    const renderTaskItem = ({ item }) => {
        const isSubmitting = submittingTaskId === item.student_task_id;
        let statusComponent;

        switch (item.status) {
            case 'pending_approval':
                statusComponent = <Text style={localStyles.statusTextPending}>Pending Approval</Text>;
                break;
            case 'rejected':
                // Allowing resubmission for rejected tasks
                statusComponent = (
                    <TouchableOpacity
                        style={localStyles.submitButton}
                        onPress={() => handleSubmitForApproval(item.student_task_id, item.name)}
                        disabled={isSubmitting}
                    >
                        {isSubmitting 
                            ? <ActivityIndicator color="#fff" size="small" /> 
                            : <Text style={localStyles.submitButtonText}>Resubmit</Text>
                        }
                    </TouchableOpacity>
                );
                break;
            case 'incomplete':
            default:
                statusComponent = (
                    <TouchableOpacity
                        style={localStyles.submitButton}
                        onPress={() => handleSubmitForApproval(item.student_task_id, item.name)}
                        disabled={isSubmitting}
                    >
                        {isSubmitting 
                            ? <ActivityIndicator color="#fff" size="small" /> 
                            : <Text style={localStyles.submitButtonText}>Submit</Text>
                        }
                    </TouchableOpacity>
                );
        }

        return (
            <View style={[styles.myClassCard, localStyles.taskItem, item.status === 'rejected' && localStyles.rejectedItem]}>
                <View style={localStyles.taskInfo}>
                    <Text style={styles.myClassSectionTitle}>{item.name}</Text>
                    <View style={localStyles.taskMeta}>
                        <Text style={localStyles.taskType}>{item.type}</Text>
                        <Text style={localStyles.taskPoints}>{item.points_value}p</Text>
                    </View>
                    <Text style={localStyles.taskDate}>
                        Assigned: {new Date(item.assigned_at).toLocaleDateString()}
                    </Text>
                    {item.status === 'rejected' && <Text style={localStyles.statusTextRejected}>Status: Rejected</Text>}
                </View>
                {statusComponent}
            </View>
        );
    };

    const renderSectionHeader = ({ section: { title } }) => (
        <Text style={localStyles.sectionHeader}>{title}</Text>
    );

    return (
        <View style={styles.myClassContainer}>
            <Text style={styles.myClassTitle}>My Tasks</Text>
            {loading ? (
                <View style={localStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4F74B8" />
                    <Text style={localStyles.loadingText}>Loading your tasks...</Text>
                </View>
            ) : tasks.length > 0 ? (
                <SectionList
                    sections={tasks}
                    keyExtractor={(item) => item.student_task_id.toString()}
                    renderItem={renderTaskItem}
                    renderSectionHeader={renderSectionHeader}
                    contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
                    stickySectionHeadersEnabled={false}
                />
            ) : (
                <View style={[styles.myClassCard, { marginHorizontal: 15 }]}>
                    <Text style={styles.myClassEmptyText}>You have no active tasks.</Text>
                </View>
            )}
        </View>
    );
};

const localStyles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
    sectionHeader: { fontSize: 22, fontFamily: 'Righteous', color: '#333', marginTop: 25, marginBottom: 10, paddingLeft: 5 },
    taskItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    rejectedItem: { borderColor: '#e74c3c', borderWidth: 1 },
    taskInfo: { flex: 1, marginRight: 10 },
    taskMeta: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
    taskType: { fontSize: 12, color: '#4F74B8', fontStyle: 'italic' },
    taskPoints: { fontSize: 12, fontWeight: 'bold', color: '#27ae60' },
    taskDate: { fontSize: 10, color: '#999' },
    submitButton: { backgroundColor: '#4F74B8', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20 },
    submitButtonText: { color: '#fff', fontWeight: 'bold' },
    statusTextPending: { color: '#f39c12', fontWeight: 'bold' },
    statusTextRejected: { color: '#e74c3c', fontWeight: 'bold', marginTop: 5 },
});

export default StudentTasksScreen;