// Screen/CreateTaskScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import styles from "../Style/Homestyle";

// --- Reusable Component for a Mission Card ---
const MissionCard = ({
  title,
  tasks,
  setTasks,
  newTask,
  setNewTask,
  editingTask,
  setEditingTask,
  pointOptions,
}) => {
  const { id: editingId, text: editingText } = editingTask;

  const handleAddTask = () => {
    if (newTask.trim() === "") {
      Alert.alert("Error", "Task description cannot be empty.");
      return;
    }
    const taskToAdd = {
      id: Date.now(),
      text: newTask.trim(),
      points: pointOptions ? pointOptions[0] : 100, // Default to the first option
    };
    setTasks([...tasks, taskToAdd]);
    setNewTask("");
  };

  const handleSaveEdit = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, text: editingText } : task
      )
    );
    setEditingTask({ id: null, text: "" });
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleSetPoints = (taskId, points) => {
    // Ensure points are numeric
    const numericPoints = parseInt(points, 10) || 0;
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, points: numericPoints } : task
      )
    );
  };

  return (
    <View style={styles.taskCard}>
      <View style={styles.taskSectionHeader}>
        <Text style={styles.taskSectionTitle}>{title}</Text>
      </View>

      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.addTaskInput}
          placeholder={`Add a new ${title.split(" ")[2].toLowerCase()}...`}
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity style={styles.addTaskButton} onPress={handleAddTask}>
          <Text style={styles.addTaskButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {tasks.map((task) => (
        <View key={task.id} style={styles.taskItem}>
          {editingId === task.id ? (
            <TextInput
              style={styles.taskEditTextInput}
              value={editingText}
              onChangeText={(text) => setEditingTask({ ...editingTask, text })}
              autoFocus
            />
          ) : (
            <Text style={styles.taskText}>{task.text}</Text>
          )}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {editingId === task.id ? (
              <TouchableOpacity onPress={() => handleSaveEdit(task.id)}>
                <Text style={styles.taskIcon}>💾</Text>
              </TouchableOpacity>
            ) : (
              <>
                {/* Points Selection */}
                {pointOptions ? (
                  pointOptions.map((points) => (
                    <TouchableOpacity
                      key={points}
                      style={[
                        styles.pointsButton,
                        task.points === points && styles.pointsButtonActive,
                      ]}
                      onPress={() => handleSetPoints(task.id, points)}
                    >
                      <Text style={styles.pointsButtonText}>{points}p</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.pointsInputContainer}>
                    <TextInput
                      style={styles.pointsInput}
                      value={String(task.points)}
                      onChangeText={(points) =>
                        handleSetPoints(task.id, points)
                      }
                      keyboardType="number-pad"
                    />
                    <Text style={styles.pointsInputLabel}>pts</Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() =>
                    setEditingTask({ id: task.id, text: task.text })
                  }
                >
                  <Text style={styles.taskIcon}>📎</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
                  <Text style={styles.taskIcon}>🗑️</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const CreateTaskScreen = ({ navigation }) => {
  // State for Daily Tasks
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, text: "Attend Class on time", points: 10 },
    { id: 2, text: "Submit an assignment on time", points: 20 },
  ]);
  const [newDailyTask, setNewDailyTask] = useState("");
  const [editingDailyTask, setEditingDailyTask] = useState({
    id: null,
    text: "",
  });

  // State for Weekly Tasks
  const [weeklyTasks, setWeeklyTasks] = useState([
    { id: 3, text: "Read a book from the library", points: 100 },
    { id: 4, text: "Lead a group discussion", points: 150 },
  ]);
  const [newWeeklyTask, setNewWeeklyTask] = useState("");
  const [editingWeeklyTask, setEditingWeeklyTask] = useState({
    id: null,
    text: "",
  });

  // State for Event Tasks
  const [eventTasks, setEventTasks] = useState([
    { id: 5, text: "Participate in the science fair", points: 500 },
  ]);
  const [newEventTask, setNewEventTask] = useState("");
  const [editingEventTask, setEditingEventTask] = useState({
    id: null,
    text: "",
  });

  const handleSaveAllTasks = () => {
    // Here you would implement the logic to save all tasks to your database (e.g., Supabase)
    console.log("Daily Tasks:", dailyTasks);
    console.log("Weekly Tasks:", weeklyTasks);
    console.log("Event Tasks:", eventTasks);
    Alert.alert(
      "Tasks Saved",
      "All mission updates have been saved to the database."
    );
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.createTaskContainer}>
      {/* --- Daily Tasks Section --- */}
      <MissionCard
        title="Generate New Daily Mission"
        tasks={dailyTasks}
        setTasks={setDailyTasks}
        newTask={newDailyTask}
        setNewTask={setNewDailyTask}
        editingTask={editingDailyTask}
        setEditingTask={setEditingDailyTask}
        pointOptions={[10, 20]} // Daily point options
      />

      {/* --- Weekly Tasks Section --- */}
      <MissionCard
        title="Generate New Weekly Mission"
        tasks={weeklyTasks}
        setTasks={setWeeklyTasks}
        newTask={newWeeklyTask}
        setNewTask={setNewWeeklyTask}
        editingTask={editingWeeklyTask}
        setEditingTask={setEditingWeeklyTask}
        pointOptions={[100, 150]} // Weekly point options
      />

      {/* --- Event Tasks Section --- */}
      <MissionCard
        title="Generate New Event Mission"
        tasks={eventTasks}
        setTasks={setEventTasks}
        newTask={newEventTask}
        setNewTask={setNewEventTask}
        editingTask={editingEventTask}
        setEditingTask={setEditingEventTask}
        pointOptions={[300, 500]} // Event point options
      />

      {/* --- Action Buttons --- */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSaveAllTasks}
        >
          <Text style={styles.actionButtonText}>Save All</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateTaskScreen;
