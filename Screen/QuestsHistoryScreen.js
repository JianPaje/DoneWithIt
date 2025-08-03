// Screen/QuestsHistoryScreen.js
import React, { useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";
import { useFocusEffect } from "@react-navigation/native";

const QuestsHistoryScreen = () => {
    const [completedTasks, setCompletedTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FIX: Corrected useFocusEffect pattern ---
    useFocusEffect(
        useCallback(() => {
            const fetchHistory = async () => {
                setLoading(true);
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error("User not found");

                    const { data, error } = await supabase
                        .from("student_tasks")
                        .select(`id, status, completed_at, tasks (*)`)
                        .eq('student_id', user.id)
                        .in('status', ['approved', 'rejected'])
                        .order('completed_at', { ascending: false, nullsFirst: false });
                    
                    if (error) throw error;

                    const mappedTasks = data
                        .map(st => ({ 
                            student_task_id: st.id, 
                            status: st.status, 
                            completed_at: st.completed_at, 
                            ...st.tasks
                        }))
                        .filter(task => task.id);

                    setCompletedTasks(mappedTasks);

                } catch (error) {
                    Alert.alert("Error", `Could not fetch history: ${error.message}`);
                } finally {
                    setLoading(false);
                }
            };
            
            fetchHistory();
        }, [])
    );

    const renderItem = ({ item }) => (
        <View style={[styles.myClassCard, item.status === 'rejected' && localStyles.rejectedItem]}>
            <View style={localStyles.itemHeader}>
                <Text style={styles.myClassSectionTitle}>{item.name}</Text>
                <Text style={[localStyles.statusText, item.status === 'approved' ? localStyles.approvedText : localStyles.rejectedText]}>
                    {item.status.toUpperCase()}
                </Text>
            </View>
            {item.status === 'approved' && (
                 <Text style={localStyles.pointsText}>{item.points_value} Points Awarded</Text>
            )}
            {item.completed_at && (
                <Text style={localStyles.dateText}>
                    Processed on: {new Date(item.completed_at).toLocaleDateString()}
                </Text>
            )}
        </View>
    );

    return (
        <View style={styles.myClassContainer}>
            {loading ? (
                <ActivityIndicator size="large" color="#4F74B8" style={{ flex: 1 }}/>
            ) : (
                <FlatList
                    data={completedTasks}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.student_task_id.toString()}
                    contentContainerStyle={{ padding: 15 }}
                    ListHeaderComponent={<Text style={styles.myClassTitle}>Quests History</Text>}
                    ListEmptyComponent={
                         <View style={styles.myClassCard}>
                            <Text style={styles.myClassEmptyText}>You have no completed quests.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const localStyles = StyleSheet.create({
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusText: { fontWeight: 'bold', fontSize: 14 },
    approvedText: { color: '#27ae60' },
    rejectedText: { color: '#e74c3c' },
    pointsText: { fontSize: 14, color: '#27ae60', marginVertical: 5, fontWeight: 'bold' },
    dateText: { fontSize: 12, color: '#888' },
    rejectedItem: { borderColor: '#e74c3c', borderWidth: 1, backgroundColor: '#fdecea' },
});

export default QuestsHistoryScreen;