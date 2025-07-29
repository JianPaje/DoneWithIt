// Screen/MyClassScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";

const MyClassScreen = () => {
  const [loading, setLoading] = useState(true);
  const [lrn, setLrn] = useState("");
  const [classInfo, setClassInfo] = useState(null);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [classMembers, setClassMembers] = useState([]);
  const isFocused = useIsFocused();

  // Determine if the user is an admin or student
  const fetchClassData = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Check if the user is an admin
      const { data: adminClass, error: classError } = await supabase
        .from("classes")
        .select("id, name")
        .eq("admin_id", user.id)
        .single();

      if (adminClass) {
        // User is an admin
        setClassInfo(adminClass);

        const { data: members, error: membersError } = await supabase
          .from("profiles")
          .select("id, username, avatar_url, lrn")
          .eq("class_id", adminClass.id);
        if (membersError) throw membersError;
        setClassMembers(members);

        const { data: invites, error: invitesError } = await supabase
          .from("class_invitations")
          .select("id, student_lrn")
          .eq("class_id", adminClass.id)
          .eq("status", "pending");
        if (invitesError) throw invitesError;
        setPendingInvites(invites);
      } else {
        // User is a student
        const { data: studentClasses, error: studentError } = await supabase
          .from("profiles")
          .select("class_id, username, avatar_url, lrn")
          .eq("id", user.id)
          .single();

        if (studentClasses && studentClasses.class_id) {
          setClassInfo({ id: studentClasses.class_id });
        } else {
          Alert.alert(
            "Error",
            "You haven't joined any classes yet. Please join a class first."
          );
        }
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch class data. " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchClassData();
    }
  }, [isFocused, fetchClassData]);

  // Handles sending an invitation
  const handleInviteStudent = async () => {
    if (!lrn.trim()) {
      Alert.alert("Invalid Input", "Please enter a student's LRN.");
      return;
    }
    if (!classInfo) {
      Alert.alert(
        "No Class Found",
        "You must create a class before inviting students."
      );
      return;
    }
    try {
      const { data: existingStudent, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("lrn", lrn.trim())
        .eq("class_id", classInfo.id)
        .maybeSingle();
      if (checkError) throw checkError;
      if (existingStudent) {
        Alert.alert(
          "Already a Member",
          "This student is already in your class."
        );
        return;
      }
      const { error: inviteError } = await supabase
        .from("class_invitations")
        .insert({
          class_id: classInfo.id,
          student_lrn: lrn.trim(),
          status: "pending",
        });
      if (inviteError) throw inviteError;
      Alert.alert("Success", `Invitation sent to LRN: ${lrn.trim()}`);
      setLrn("");
      fetchClassData();
    } catch (error) {
      if (error.code === "23505") {
        Alert.alert(
          "Invitation Exists",
          "An invitation has already been sent to this student."
        );
      } else {
        Alert.alert("Error", "Could not send invitation. " + error.message);
      }
    }
  };

  // Renders a list item for either a pending invite or a class member
  const renderItem = ({ item, type }) => (
    <View style={styles.myClassListItem}>
      {type === "member" && (
        <Image
          source={
            item.avatar_url
              ? { uri: item.avatar_url }
              : require("../assets/profile.png")
          }
          style={styles.myClassAvatar}
        />
      )}
      <View style={styles.myClassUserInfo}>
        <Text style={styles.myClassUsername}>
          {type === "member" ? item.username : "Pending Invitation"}
        </Text>
        <Text style={styles.myClassLrn}>
          {type === "member" ? `LRN: ${item.lrn}` : `LRN: ${item.student_lrn}`}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#4F74B8" />
      </View>
    );
  }

  if (!classInfo) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={styles.title}>No Class Found</Text>
        <Text style={styles.subtitle}>Create a class to get started.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.myClassContainer}>
      <Text style={styles.myClassTitle}>Manage My Class 🏫</Text>

      {/* Invite Card */}
      <View style={styles.myClassCard}>
        <Text style={styles.myClassSectionTitle}>Invite a Student</Text>
        <TextInput
          style={styles.myClassInput}
          placeholder="Enter Student's LRN"
          placeholderTextColor="#888"
          value={lrn}
          onChangeText={setLrn}
          keyboardType="number-pad"
        />
        <TouchableOpacity
          style={styles.myClassButton}
          onPress={handleInviteStudent}
        >
          <Text style={styles.myClassButtonText}>Invite to Class</Text>
        </TouchableOpacity>
      </View>

      {/* Pending Requests Card */}
      <View style={styles.myClassCard}>
        <Text style={styles.myClassSectionTitle}>
          Pending Requests ({pendingInvites.length})
        </Text>
        <FlatList
          data={pendingInvites}
          renderItem={(props) => renderItem({ ...props, type: "invite" })}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.myClassEmptyText}>
              You have no pending student requests.
            </Text>
          }
        />
      </View>

      {/* Class Members Card */}
      <View style={styles.myClassCard}>
        <Text style={styles.myClassSectionTitle}>
          Class Members ({classMembers.length})
        </Text>
        <FlatList
          data={classMembers}
          renderItem={(props) => renderItem({ ...props, type: "member" })}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.myClassEmptyText}>
              Invite students to start building your class!
            </Text>
          }
        />
      </View>
    </ScrollView>
  );
};

export default MyClassScreen;