import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";
import { useFocusEffect } from "@react-navigation/native";

const CreateClassScreen = ({ navigation }) => {
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);

  // Role Security Check: Ensure only admins can access this screen
  useFocusEffect(
    useCallback(() => {
      const checkRole = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && user.user_metadata.role !== "admin") {
          Alert.alert("Access Denied", "This page is for admins only.", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        }
      };
      checkRole();
    }, [navigation])
  );

  const handleCreateClass = async () => {
    if (!className.trim()) {
      Alert.alert("Error", "Please enter a name for your class.");
      return;
    }
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in.");

      // --- THIS CHECK HAS BEEN REMOVED TO ALLOW MULTIPLE CLASSES ---

      // Insert the new class into the database
      const { error: insertError } = await supabase.from("classes").insert({
        class_name: className.trim(),
        admin_id: user.id,
      });

      if (insertError) throw insertError;

      Alert.alert("Success", "Your class has been created successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Class</Text>
      <Text style={styles.subtitle}>Give your classroom a name.</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g., Grade 10 - Section A"
        value={className}
        onChangeText={setClassName}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateClass}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Class"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateClassScreen;
