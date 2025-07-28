import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";
import { useFocusEffect } from "@react-navigation/native";

const StudentTasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const today = new Date().toISOString().split("T")[0]; // Get today's date as YYYY-MM-DD

      // Fetch tasks assigned to the current student
      // Include points_value and due_date from the joined tasks table
      const { data, error } = await supabase
        .from("student_tasks")
        .select(
          "id, is_completed, tasks (id, name, type, points_value, due_date)"
        ) // Fetch task type, points, and due_date
        .eq("student_id", user.id)
        .eq("is_completed", false); // Only show uncompleted tasks
      // We'll filter daily tasks by date on the client-side for simplicity here
      // For other task types, due_date might be null or further in the future
      if (error) throw error;

      // Client-side filtering for daily tasks with due_date
      const filteredTasks = (data || []).filter((assignment) => {
        const task = assignment.tasks;
        if (!task) return false; // In case task relation fails

        if (task.type === "daily") {
          // Only show daily tasks if their due_date is today or in the future
          return task.due_date && task.due_date >= today;
        }
        // For weekly/event or other types, always show if uncompleted
        return true;
      });

      setTasks(filteredTasks);
    } catch (error) {
      Alert.alert("Error", "Could not fetch tasks: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const handleToggleTask = async (studentTaskId, currentStatus) => {
    // You would likely add points earning logic here later
    try {
      const { error } = await supabase
        .from("student_tasks")
        .update({ is_completed: !currentStatus })
        .eq("id", studentTaskId);

      if (error) throw error;
      fetchTasks(); // Refresh list to show the change
      // TODO: Add logic here to award points if task is marked complete
    } catch (error) {
      Alert.alert("Error", "Could not update task: " + error.message);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#4F74B8" />
    );
  }

  const renderTaskItem = ({ item }) => (
    <View style={localStyles.taskItem}>
      <Text
        style={[
          localStyles.taskName,
          item.is_completed && localStyles.completedTaskName,
        ]}
      >
        {item.tasks.name}
      </Text>
      <View style={localStyles.taskActions}>
        {/* Display points */}
        {item.tasks.points_value > 0 && (
          <View style={localStyles.pointDisplay}>
            <Text style={localStyles.pointText}>
              {item.tasks.points_value}p
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => handleToggleTask(item.id, item.is_completed)}
        >
          <View
            style={[
              localStyles.checkbox,
              item.is_completed && localStyles.checkedbox,
            ]}
          >
            {item.is_completed && <Text style={localStyles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.myClassContainer}>
      <Text style={styles.myClassTitle}>My Tasks</Text>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        ListEmptyComponent={
          <Text style={styles.myClassEmptyText}>No tasks assigned yet.</Text>
        }
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  taskItem: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  taskName: {
    fontSize: 16,
    flexShrink: 1, // Allow text to wrap
    marginRight: 10,
  },
  completedTaskName: {
    textDecorationLine: "line-through",
    color: "grey",
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointDisplay: {
    // Style for the displayed points on student side
    backgroundColor: "#e0e0e0", // Match admin side for consistency
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10, // Space between points and checkbox
  },
  pointText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "bold",
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#4F74B8",
    justifyContent: "center",
    alignItems: "center",
  },
  checkedbox: {
    backgroundColor: "#4F74B8",
  },
  checkmark: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StudentTasksScreen;
