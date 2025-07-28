import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";

const UpdatePasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please enter and confirm your new password.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      Alert.alert(
        "Success",
        "Your password has been updated successfully. Please log in.",
        [{ text: "OK", onPress: () => navigation.navigate("Welcome") }]
      );
    } catch (error) {
      Alert.alert("Password Update Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Password</Text>
      <Text style={styles.subtitle}>Please enter your new password below.</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Enter new password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handlePasswordUpdate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Updating..." : "Update Password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdatePasswordScreen;
