import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const LoginScreen = ({ navigation, route }) => {
  const { userType } = route.params || {}; // This is 'admin' or 'student'
  const successMessage = route.params?.successMessage;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(successMessage);

  useEffect(() => {
    navigation.setOptions({ title: "" });
  }, [navigation]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // --- THIS IS THE CRUCIAL ROLE CHECK ---
      const userRole = data.user?.user_metadata?.role;

      if (userRole === userType) {
        // SUCCESS: Role matches, proceed to the correct home screen.
        if (userType === "admin") {
          navigation.replace("AdminHome");
        } else {
          navigation.replace("StudentHome");
        }
      } else {
        // FAILED: Role mismatch. Show an error and sign out immediately.
        Alert.alert(
          "Access Denied",
          `You do not have permission to log in as an ${userType}.`
        );
        await supabase.auth.signOut();
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {userType === "admin" ? "Admin Login" : "Student Login"}
      </Text>

      {message && (
        <Text style={{ color: "green", marginBottom: 10, textAlign: "center" }}>
          {message}
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter Your Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Enter Your Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text
          style={[
            styles.linkText,
            {
              marginVertical: 10,
              alignSelf: "flex-end",
              paddingHorizontal: "10%",
            },
          ]}
        >
          Forgot password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Log In"}
        </Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 20 }}>
        Don't have an account?{" "}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("Signup", { userType })}
        >
          Sign up here
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;
