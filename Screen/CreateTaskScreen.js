// Screen/CreateTaskScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const CreateTaskScreen = ({ route }) => {
  const { classInfo } = route.params || {};
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskPoints, setNewTaskPoints] = useState("100");
  const [selectedClassId, setSelectedClassId] = useState(classInfo?.id || null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [studentsInClass, setStudentsInClass] = useState([]);
  const [taskType, setTaskType] = useState("daily"); // Default task type

  // Fetch admin's classes
  useFocusEffect(
    useCallback(() => {
      const fetchClasses = async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("No user found");

          const { data: classes, error: classesError } = await supabase
            .from("classes")
            .select("id, class_name")
            .eq("admin_id", user.id);

          if (classesError) throw classesError;
          setAvailableClasses(classes || []);

          // If a class was passed in, select it
          if (classInfo?.id) {
            setSelectedClassId(classInfo.id);
          } else if (classes && classes.length > 0) {
            // Default to the first class if none was passed
            setSelectedClassId(classes[0].id);
          }
        } catch (error) {
          Alert.alert("Error", "Could not fetch classes: " + error.message);
        }
      };

      fetchClasses();
    }, [classInfo?.id])
  );

  // Fetch students when class is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClassId) {
        setStudentsInClass([]);
        return;
      }
      try {
        const { data: students, error: studentsError } = await supabase
          .from("profiles")
          .select("id, username")
          .eq("class_id", selectedClassId)
          .eq("role", "student");

        if (studentsError) throw studentsError;
        setStudentsInClass(students || []);
      } catch (error) {
        Alert.alert("Error", "Could not fetch students: " + error.message);
      }
    };

    fetchStudents();
  }, [selectedClassId]);

  const handleCreateTask = async () => {
    if (!selectedClassId) {
      Alert.alert("Error", "Please select a class.");
      return;
    }
    if (!newTaskName.trim()) {
      Alert.alert("Error", "Please enter a task name.");
      return;
    }
    const points = parseInt(newTaskPoints, 10);
    if (isNaN(points) || points <= 0) {
      Alert.alert("Error", "Please enter valid points (positive number).");
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in.");

      // 1. Insert the new "master" task
      const { data: newTaskData, error: taskError } = await supabase
        .from("tasks")
        .insert({
          name: newTaskName.trim(),
          points_value: points,
          type: taskType, // Use the selected task type
          created_by: user.id,
          class_id: selectedClassId, // Associate task with the class
        })
        .select()
        .single();

      if (taskError) throw taskError;

      // 2. Create an assignment in 'student_tasks' for each student in the class
      if (studentsInClass.length > 0) {
        const assignments = studentsInClass.map((student) => ({
          task_id: newTaskData.id,
          student_id: student.id,
          is_completed: false,
          // Add assigned_at timestamp
          assigned_at: new Date().toISOString(),
        }));

        const { error: assignmentError } = await supabase
          .from("student_tasks")
          .insert(assignments);

        if (assignmentError) throw assignmentError;
      }

      Alert.alert("Success", "Task created and assigned to students!");
      // Reset form
      setNewTaskName("");
      setNewTaskPoints("100");
      setTaskType("daily"); // Reset to default type if desired
      // Optionally navigate back or stay on screen
      // navigation.goBack();
    } catch (error) {
      Alert.alert("Error Creating Task", error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- MODIFIED: This is the corrected pattern for useFocusEffect ---
  useFocusEffect(
    useCallback(() => {
      // Any logic you want to run when the screen comes into focus
      // For example, you might want to refresh class lists or student lists
      // fetchAdminClasses(); // If you had a function like this
    }, []) // Add dependencies if needed
  );

  // --- ADDED: Function to render class picker buttons ---
  const renderClassPickerItem = ({ item }) => (
    <TouchableOpacity
      style={[
        localStyles.classPickerButton,
        selectedClassId === item.id && localStyles.classPickerButtonSelected,
      ]}
      onPress={() => setSelectedClassId(item.id)}
    >
      <Text
        style={[
          localStyles.classPickerButtonText,
          selectedClassId === item.id &&
            localStyles.classPickerButtonTextSelected,
        ]}
      >
        {item.class_name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.createTaskContainer}>
      <Text style={styles.title}>Create New Task</Text>

      {/* Class Selection */}
      <View style={styles.myClassCard}>
        <Text style={styles.myClassSectionTitle}>Select Class</Text>
        {availableClasses.length > 0 ? (
          <FlatList
            data={availableClasses}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderClassPickerItem}
            contentContainerStyle={localStyles.classPickerContainer}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.myClassEmptyText}>No classes found.</Text>
        )}
        {selectedClassId && (
          <Text style={styles.myClassEmptyText}>
            Selected:{" "}
            {
              availableClasses.find((c) => c.id === selectedClassId)?.class_name
            }
          </Text>
        )}
      </View>

      {/* Task Type Selection */}
      <View style={styles.myClassCard}>
        <Text style={styles.myClassSectionTitle}>Task Type</Text>
        <View style={localStyles.taskTypeContainer}>
          {["daily", "weekly", "event"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                localStyles.taskTypeButton,
                taskType === type && localStyles.taskTypeButtonSelected,
              ]}
              onPress={() => setTaskType(type)}
            >
              <Text
                style={[
                  localStyles.taskTypeButtonText,
                  taskType === type && localStyles.taskTypeButtonTextSelected,
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Task Details */}
      <View style={styles.myClassCard}>
        <Text style={styles.myClassSectionTitle}>Task Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task name"
          value={newTaskName}
          onChangeText={setNewTaskName}
        />
        <TextInput
          style={styles.input}
          placeholder="Points (e.g., 100)"
          value={newTaskPoints}
          onChangeText={setNewTaskPoints}
          keyboardType="numeric"
        />
      </View>

      {/* Assigned Students Preview */}
      {studentsInClass.length > 0 && (
        <View style={styles.myClassCard}>
          <Text style={styles.myClassSectionTitle}>
            Students to Assign ({studentsInClass.length})
          </Text>
          <Text style={styles.myClassEmptyText}>
            This task will be assigned to all {studentsInClass.length} students
            in the selected class.
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.myClassButton, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.myClassButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.myClassButton}
          onPress={handleCreateTask}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.myClassButtonText}>Create & Assign Task</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// --- ADDED: Local Styles specific to CreateTaskScreen ---
const localStyles = StyleSheet.create({
  classPickerContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  classPickerButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  classPickerButtonSelected: {
    backgroundColor: "#4F74B8",
  },
  classPickerButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  classPickerButtonTextSelected: {
    color: "#fff",
  },
  taskTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  taskTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  taskTypeButtonSelected: {
    backgroundColor: "#4F74B8",
  },
  taskTypeButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  taskTypeButtonTextSelected: {
    color: "#fff",
  },
});

export default CreateTaskScreen;