// Screen/CreateClassScreen.js

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

// Helper function to generate a random, easy-to-read code
// We place it outside the component so it doesn't get redefined on every render.
const generateClassCode = (length = 6) => {
  // Characters are chosen to avoid confusion (e.g., no 'I', 'O', '0', '1')
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const CreateClassScreen = ({ navigation }) => {
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);

  // Role Security Check: Ensure only admins can access this screen
  useFocusEffect(
    useCallback(() => {
      const checkRole = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && user.user_metadata?.role !== "admin") {
            Alert.alert("Access Denied", "This page is for admins only.", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          }
        } catch (error) {
           Alert.alert("Authentication Error", "Could not verify user role.");
           navigation.goBack();
        }
      };
      checkRole();
    }, [navigation])
  );

  const handleCreateClass = async () => {
    if (!className.trim()) {
      Alert.alert("Validation Error", "Please enter a name for your class.");
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to create a class.");

      const newClassCode = generateClassCode();

      // Insert the new class into the database with the unique code
      const { data, error: insertError } = await supabase
        .from("classes")
        .insert({
          class_name: className.trim(),
          admin_id: user.id,
          class_code: newClassCode,
        })
        .select();

      if (insertError) throw insertError;

      Alert.alert(
        "Success!",
        `Your class "${className.trim()}" has been created.\n\nThe unique class code is: ${newClassCode}`
      );
      navigation.goBack();
    } catch (error) {
      // This specifically checks if the generated code was a duplicate.
      if (error.message.includes('duplicate key value violates unique constraint "classes_class_code_key"')) {
         Alert.alert("Creation Error", "A unique code could not be generated. Please try creating the class again.");
      } else {
         Alert.alert("Error", error.message);
      }
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
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateClass}
        disabled={loading}
      >
        {loading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text style={styles.buttonText}>Create Class</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CreateClassScreen;