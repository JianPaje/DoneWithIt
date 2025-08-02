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
  const [taskType, setTaskType] = useState("daily");

  // Fetch admin's classes when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchClasses = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error("No user found");

          const { data: classes, error: classesError } = await supabase
            .from("classes")
            .select("id, class_name")
            .eq("admin_id", user.id);

          if (classesError) throw classesError;
          setAvailableClasses(classes || []);

          if (classInfo?.id) {
            setSelectedClassId(classInfo.id);
          } else if (classes && classes.length > 0 && !selectedClassId) {
            setSelectedClassId(classes[0].id);
          }
        } catch (error) {
          Alert.alert("Error", "Could not fetch classes: " + error.message);
        }
      };

      fetchClasses();
    }, [classInfo?.id])
  );

  // --- THIS IS THE CORRECTED LOGIC ---
  // Fetch students from the selected class using the class_members table
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClassId) {
        setStudentsInClass([]);
        return;
      }
      try {
        // Query through the class_members table to find approved students
        const { data, error } = await supabase
          .from("class_members")
          .select(`
            profiles (
              id,
              username
            )
          `)
          .eq("class_id", selectedClassId)
          .eq("status", "approved");

        if (error) throw error;
        
        // The result is nested, so we extract the profile data
        const studentProfiles = data
          ? data.map(item => item.profiles).filter(Boolean)
          : [];
        setStudentsInClass(studentProfiles);

      } catch (error) {
        Alert.alert("Error", "Could not fetch students: " + error.message);
      }
    };

    fetchStudents();
  }, [selectedClassId]);
  // --- END OF CORRECTION ---

  const handleCreateTask = async () => {
    if (!selectedClassId) {
      Alert.alert("Error", "Please select a class.");
      return;
    }
    if (!newTaskName.trim()) {
      Alert.alert("Error", "Please enter a task name.");
      return;
    }
    if (studentsInClass.length === 0) {
        Alert.alert("No Students", "There are no approved students in this class to assign the task to.");
        return;
    }
    const points = parseInt(newTaskPoints, 10);
    if (isNaN(points) || points <= 0) {
      Alert.alert("Error", "Please enter valid points (positive number).");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in.");

      const { data: newTaskData, error: taskError } = await supabase
        .from("tasks")
        .insert({
          name: newTaskName.trim(),
          points_value: points,
          type: taskType,
          created_by: user.id,
          class_id: selectedClassId,
        })
        .select()
        .single();

      if (taskError) throw taskError;

      const assignments = studentsInClass.map((student) => ({
        task_id: newTaskData.id,
        student_id: student.id,
        is_completed: false,
        assigned_at: new Date().toISOString(),
      }));

      const { error: assignmentError } = await supabase
        .from("student_tasks")
        .insert(assignments);

      if (assignmentError) throw assignmentError;

      Alert.alert("Success", `Task created and assigned to ${studentsInClass.length} student(s)!`);
      setNewTaskName("");
      setNewTaskPoints("100");
      setTaskType("daily");
    } catch (error) {
      Alert.alert("Error Creating Task", error.message);
    } finally {
      setLoading(false);
    }
  };
  
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
    <ScrollView 
        style={styles.createTaskContainer}
        contentContainerStyle={{ paddingBottom: 50 }}
    >
      <Text style={styles.title}>Create New Task</Text>

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
      </View>

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

      {studentsInClass.length > 0 && (
        <View style={styles.myClassCard}>
          <Text style={styles.myClassSectionTitle}>
            Will be Assigned to ({studentsInClass.length})
          </Text>
          <Text style={styles.myClassEmptyText}>
            This task will be assigned to all {studentsInClass.length} approved students in the selected class.
          </Text>
        </View>
      )}

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

const localStyles = StyleSheet.create({
  classPickerContainer: {
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