import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const AdminClassDetailScreen = ({ route }) => {
  const { classId, className } = route.params;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const [studentIdQuery, setStudentIdQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const fetchData = useCallback(async () => {
    setStudentIdQuery("");
    setLoading(true);
    try {
      const { data: memberData, error: memberError } = await supabase
        .from("class_members")
        .select("id, status, profiles:student_id (id, username, avatar_url)")
        .eq("class_id", classId);

      if (memberError) throw memberError;
      setMembers(memberData?.filter((m) => m.profiles) || []);
    } catch (error) {
      Alert.alert("Error", "Could not fetch class data: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleRequest = async (memberId, newStatus) => {
    const actionText = newStatus === "approve" ? "approve" : "decline";
    Alert.alert(
      `Confirm Action`,
      `Are you sure you want to ${actionText} this student's request?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: actionText === "decline" ? "destructive" : "default",
          onPress: async () => {
            try {
              if (actionText === "approve") {
                const { error } = await supabase
                  .from("class_members")
                  .update({ status: "approved" })
                  .eq("id", memberId);
                if (error) throw error;
              } else if (actionText === "decline") {
                const { error } = await supabase
                  .from("class_members")
                  .delete()
                  .eq("id", memberId);
                if (error) throw error;
              }
              fetchData();
            } catch (error) {
              Alert.alert(
                "Error",
                `Could not ${actionText} request: ${error.message}`
              );
            }
          },
        },
      ]
    );
  };

  const handleRemoveStudent = async (memberId, studentName) => {
    Alert.alert(
      "Remove Student",
      `Are you sure you want to remove "${studentName}" from the class?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("class_members")
                .delete()
                .eq("id", memberId);
              if (error) throw error;
              Alert.alert(
                "Success",
                `${studentName} has been removed from the class.`
              );
              fetchData();
            } catch (error) {
              Alert.alert(
                "Error",
                `Could not remove student: ${error.message}`
              );
            }
          },
        },
      ]
    );
  };

  const handleAddStudent = async () => {
    if (!studentIdQuery.trim()) {
      Alert.alert("Error", "Please enter a student's ID.");
      return;
    }
    setIsAdding(true);
    try {
      const { data: studentProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("school_id", studentIdQuery.trim())
        .eq("role", "student")
        .single();

      if (profileError || !studentProfile)
        throw new Error("No student found with that ID.");

      const studentId = studentProfile.id;

      const { data: existingMember, error: checkError } = await supabase
        .from("class_members")
        .select("id")
        .eq("class_id", classId)
        .eq("student_id", studentId)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existingMember)
        throw new Error(
          "This student is already in the class or has a pending request."
        );

      const { error: insertError } = await supabase
        .from("class_members")
        .insert({
          class_id: classId,
          student_id: studentId,
          status: "approved",
        });

      if (insertError) throw insertError;

      Alert.alert(
        "Success",
        `'${studentProfile.username}' has been added to the class.`
      );
      fetchData();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        style={{ flex: 1, alignSelf: "center" }}
        size="large"
        color="#4F74B8"
      />
    );
  }

  const pendingRequests = members.filter((m) => m.status === "pending");
  const approvedStudents = members.filter((m) => m.status === "approved");

  const renderMemberItem = (item, isRequest) => (
    <View key={item.id} style={styles.myClassListItem}>
      <Image
        source={
          item.profiles.avatar_url
            ? { uri: item.profiles.avatar_url }
            : require("../assets/profile.png")
        }
        style={styles.myClassAvatar}
      />
      <View style={styles.myClassUserInfo}>
        <Text style={styles.myClassUsername}>{item.profiles.username}</Text>
      </View>

      {isRequest ? (
        <View style={styles.myClassActionButtons}>
          <TouchableOpacity
            style={styles.myClassAcceptButton}
            onPress={() => handleRequest(item.id, "approve")}
          >
            <Text style={styles.myClassButtonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.myClassDeclineButton}
            onPress={() => handleRequest(item.id, "decline")}
          >
            <Text style={styles.myClassButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.myClassActionButtons}>
          <TouchableOpacity
            style={styles.myClassDeclineButton}
            onPress={() => handleRemoveStudent(item.id, item.profiles.username)}
          >
            <Text style={styles.myClassButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView
      style={styles.myClassContainer}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.myClassTitle}>{className}</Text>

      <View style={[styles.myClassCard, { marginHorizontal: 15 }]}>
        <Text style={styles.myClassSectionTitle}>
          Pending Requests ({pendingRequests.length})
        </Text>
        {pendingRequests.length > 0 ? (
          pendingRequests.map((item) => renderMemberItem(item, true))
        ) : (
          <Text style={styles.myClassEmptyText}>No pending requests.</Text>
        )}
      </View>

      <View style={[styles.myClassCard, { marginHorizontal: 15 }]}>
        <Text style={styles.myClassSectionTitle}>
          Approved Students ({approvedStudents.length})
        </Text>

        <View style={localStyles.addStudentContainer}>
          <TextInput
            style={[styles.input, localStyles.addStudentInput]}
            placeholder="Enter student ID to add"
            value={studentIdQuery}
            onChangeText={setStudentIdQuery}
            autoCapitalize="none"
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.myClassButton, localStyles.addStudentButton]}
            onPress={handleAddStudent}
            disabled={isAdding}
          >
            <Text style={styles.myClassButtonText}>
              {isAdding ? "Adding..." : "Add"}
            </Text>
          </TouchableOpacity>
        </View>

        {approvedStudents.length > 0 ? (
          approvedStudents.map((item) => renderMemberItem(item, false))
        ) : (
          <Text style={styles.myClassEmptyText}>
            No students have been approved yet.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  addStudentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addStudentInput: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
  },
  addStudentButton: {
    paddingVertical: 14,
    marginVertical: 0,
    width: 80,
  },
});

export default AdminClassDetailScreen;
