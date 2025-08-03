// Screen/TaskApprovalScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../supabaseClient';
import styles from '../Style/Homestyle';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const TaskApprovalScreen = () => {
    const [pendingTasks, setPendingTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const navigation = useNavigation();

    // --- FIX: Corrected useFocusEffect pattern ---
    useFocusEffect(
        useCallback(() => {
            const fetchPendingTasks = async () => {
                setLoading(true);
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error("User not found");

                    const { data: adminClasses, error: classesError } = await supabase
                        .from('classes')
                        .select('id')
                        .eq('admin_id', user.id);

                    if (classesError) throw classesError;
                    const adminClassIds = adminClasses.map(c => c.id);
                    
                    if (adminClassIds.length === 0) {
                        setPendingTasks([]);
                        return;
                    }

                    const { data: tasksInClasses, error: tasksError } = await supabase
                        .from('tasks')
                        .select('id')
                        .in('class_id', adminClassIds);

                    if (tasksError) throw tasksError;
                    const taskIds = tasksInClasses.map(t => t.id);

                    if (taskIds.length === 0) {
                        setPendingTasks([]);
                        return;
                    }

                    const { data, error } = await supabase
                        .from('student_tasks')
                        .select(`id, tasks ( id, name, points_value ), profiles ( id, username )`)
                        .eq('status', 'pending_approval')
                        .in('task_id', taskIds);
                    
                    if (error) throw error;
                    
                    setPendingTasks(data || []);

                } catch (error) {
                    Alert.alert("Error", `Could not fetch pending tasks: ${error.message}`);
                } finally {
                    setLoading(false);
                }
            };
            
            fetchPendingTasks();
        }, [])
    );

    const handleApproval = async (studentTaskId, studentId, points, action) => {
        setUpdatingId(studentTaskId);
        const newStatus = action === 'approve' ? 'approved' : 'rejected';
        const isApproving = newStatus === 'approved';

        try {
            const { error: updateError } = await supabase
                .from('student_tasks')
                .update({ status: newStatus, completed_at: isApproving ? new Date().toISOString() : null })
                .eq('id', studentTaskId);

            if (updateError) throw updateError;
            
            if (isApproving && points > 0) {
                // This assumes you have an RPC function to increment the score safely.
                // If not, you would need to fetch, update, and save the profile score.
                const { error: rpcError } = await supabase.rpc('increment_score', {
                    user_id: studentId,
                    score_to_add: points,
                });
                if (rpcError) throw rpcError;
            }

            // Refresh the list by removing the item that was just processed
            setPendingTasks(currentTasks => currentTasks.filter(task => task.id !== studentTaskId));

        } catch (error) {
            Alert.alert(`Error`, `Could not ${action} task: ${error.message}`);
        } finally {
            setUpdatingId(null);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.myClassCard}>
            <Text style={styles.myClassSectionTitle}>{item.tasks.name}</Text>
            <Text style={localStyles.subText}>
                Submitted by: <Text style={{ fontWeight: 'bold' }}>{item.profiles.username}</Text>
            </Text>
            <Text style={localStyles.subText}>
                Points: <Text style={{ fontWeight: 'bold', color: '#27ae60' }}>{item.tasks.points_value}p</Text>
            </Text>
            <View style={localStyles.buttonContainer}>
                {updatingId === item.id ? (
                    <ActivityIndicator color="#4F74B8" />
                ) : (
                    <>
                        <TouchableOpacity 
                            style={[localStyles.actionButton, localStyles.rejectButton]}
                            onPress={() => handleApproval(item.id, item.profiles.id, item.tasks.points_value, 'reject')}>
                            <Text style={localStyles.actionButtonText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[localStyles.actionButton, localStyles.approveButton]}
                            onPress={() => handleApproval(item.id, item.profiles.id, item.tasks.points_value, 'approve')}>
                            <Text style={localStyles.actionButtonText}>Approve</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.myClassContainer}>
            {loading ? (
                <ActivityIndicator size="large" color="#4F74B8" style={{ flex: 1 }} />
            ) : (
                <FlatList
                    data={pendingTasks}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 15 }}
                    ListHeaderComponent={<Text style={styles.myClassTitle}>Pending Approvals</Text>}
                    ListEmptyComponent={
                        <View style={styles.myClassCard}>
                            <Text style={styles.myClassEmptyText}>No pending task approvals.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const localStyles = StyleSheet.create({
    subText: { fontSize: 14, color: '#666', marginTop: 4 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15 },
    actionButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginLeft: 10 },
    approveButton: { backgroundColor: '#27ae60' },
    rejectButton: { backgroundColor: '#e74c3c' },
    actionButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default TaskApprovalScreen;