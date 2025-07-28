import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const StudentMyClassScreen = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchMyClasses = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      if (user.user_metadata.role !== "student") {
        Alert.alert("Access Denied", "This page is for students only.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
        return;
      }

      const { data, error } = await supabase
        .from("class_members")
        .select(
          `status, classes (id, class_name, profiles!admin_id (username))`
        )
        .eq("student_id", user.id)
        .eq("status", "approved");

      if (error) throw error;

      const validClasses = data.filter((item) => item.classes);
      setClasses(validClasses);
    } catch (error) {
      Alert.alert("Error", "Could not fetch your classes: " + error.message);
      console.error("Error fetching classes:", error.message);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  // MODIFIED: This is the corrected pattern for useFocusEffect
  useFocusEffect(
    useCallback(() => {
      fetchMyClasses();
    }, [fetchMyClasses])
  );

  if (loading) {
    return (
      <View style={localStyles.loaderContainer}>
        <ActivityIndicator size="large" color="#4F74B8" />
      </View>
    );
  }

  const renderClassItem = ({ item }) => (
    <View style={styles.myClassCard}>
      <Text style={styles.myClassSectionTitle}>{item.classes.class_name}</Text>
      <Text style={styles.myClassLrn}>
        Admin: {item.classes.profiles.username}
      </Text>
    </View>
  );

  return (
    <View style={styles.myClassContainer}>
      <Text style={styles.myClassTitle}>My Classes</Text>
      {classes.length > 0 ? (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.classes.id.toString()}
          renderItem={renderClassItem}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        />
      ) : (
        <View style={[styles.myClassCard, { marginHorizontal: 15 }]}>
          <Text style={styles.myClassEmptyText}>
            You haven't joined any classes yet.
          </Text>
        </View>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
  },
});

export default StudentMyClassScreen;
