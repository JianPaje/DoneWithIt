import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";

// MODIFIED: Added `route` to check which mode the screen should be in
const ForgotPasswordScreen = ({ navigation, route }) => {
  // This checks if we came from the password reset link
  const isUpdateMode = route.params?.updateMode || false;

  // State for both modes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // This function is for the initial view: requesting the link
  const handlePasswordResetRequest = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      Alert.alert(
        "Check your email",
        "A password reset link has been sent to your email address."
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ADDED: This new function is for the update view: setting the new password
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

  // --- MODIFIED: We now render conditionally based on the mode ---
  if (isUpdateMode) {
    // RENDER THE "UPDATE PASSWORD" VIEW
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Please enter your new password below.
        </Text>
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
  }

  // RENDER THE DEFAULT "REQUEST LINK" VIEW
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email to receive a reset link.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handlePasswordResetRequest}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={[styles.linkText, { marginTop: 15 }]}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
