// Screen/StudentTasksScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const StudentTasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null); // Track which task is being updated
  const navigation = useNavigation();

  // Fetch tasks assigned to the student
  const fetchStudentTasks = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Fetch tasks assigned to the student, including completion status and task details
      const { data: studentTasks, error: tasksError } = await supabase
        .from("student_tasks")
        .select(
          `
          id,
          is_completed,
          assigned_at,
          tasks (
            id,
            name,
            points_value,
            type,
            created_at
          )
        `
        )
        .eq("student_id", user.id)
        .order("assigned_at", { ascending: false }); // Show newest assigned first

      if (tasksError) throw tasksError;

      // Map and filter valid tasks
      const mappedTasks = (studentTasks || [])
        .map((st) => ({
          student_task_id: st.id, // ID in student_tasks table
          is_completed: st.is_completed,
          assigned_at: st.assigned_at,
          ...(st.tasks || {}), // Spread task details
        }))
        .filter((task) => task.id); // Filter out tasks where the relation failed

      setTasks(mappedTasks);
    } catch (error) {
      Alert.alert("Error", "Could not fetch tasks: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh tasks when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchStudentTasks();
    }, [fetchStudentTasks])
  );

  // Toggle task completion status
  const handleToggleTaskCompletion = async (studentTaskId, currentStatus) => {
    setUpdatingTaskId(studentTaskId);
    try {
      const { error } = await supabase
        .from("student_tasks")
        .update({ is_completed: !currentStatus, completed_at: new Date() }) // Set completion timestamp
        .eq("id", studentTaskId);

      if (error) throw error;

      // Refresh the task list to reflect the change
      fetchStudentTasks();
    } catch (error) {
      Alert.alert(
        "Error",
        `Could not update task status: ${error.message}`
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Render a single task item
  const renderTaskItem = ({ item }) => {
    const isUpdating = updatingTaskId === item.student_task_id;
    return (
      <View
        style={[
          styles.myClassCard,
          localStyles.taskItem,
          item.is_completed && localStyles.completedTaskItem,
        ]}
      >
        <View style={localStyles.taskInfo}>
          <Text
            style={[
              styles.myClassSectionTitle,
              item.is_completed && localStyles.completedTaskText,
            ]}
          >
            {item.name}
          </Text>
          <View style={localStyles.taskMeta}>
            <Text style={localStyles.taskType}>{item.type}</Text>
            <Text style={localStyles.taskPoints}>{item.points_value}p</Text>
          </View>
          <Text style={localStyles.taskDate}>
            Assigned: {new Date(item.assigned_at).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            localStyles.checkbox,
            item.is_completed && localStyles.checkedBox,
          ]}
          onPress={() =>
            handleToggleTaskCompletion(
              item.student_task_id,
              item.is_completed
            )
          }
          disabled={isUpdating || item.is_completed} // Disable if updating or already completed
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : item.is_completed ? (
            <Text style={localStyles.checkmark}>✓</Text>
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.myClassContainer}>
      <Text style={styles.myClassTitle}>My Tasks</Text>

      {loading ? (
        <View style={localStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F74B8" />
          <Text style={localStyles.loadingText}>Loading your tasks...</Text>
        </View>
      ) : tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.student_task_id.toString()}
          contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
        />
      ) : (
        <View style={[styles.myClassCard, { marginHorizontal: 15 }]}>
          <Text style={styles.myClassEmptyText}>
            You haven't been assigned any tasks yet. Check back later or contact
            your admin.
          </Text>
        </View>
      )}
    </View>
  );
};

// Local Styles specific to this component
const localStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedTaskItem: {
    opacity: 0.7,
  },
  taskInfo: {
    flex: 1,
    marginRight: 10,
  },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  taskType: {
    fontSize: 12,
    color: "#4F74B8",
    fontStyle: "italic",
  },
  taskPoints: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#27ae60",
  },
  taskDate: {
    fontSize: 10,
    color: "#999",
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#4F74B8",
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    backgroundColor: "#4F74B8",
  },
  checkmark: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default StudentTasksScreen;