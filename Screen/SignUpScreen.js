import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SignupScreen = ({ navigation, route }) => {
  const { userType } = route.params || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "", // The header title is now empty
    });
  }, [navigation]);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: userType },
          // This line directs desktop users to your success page
          emailRedirectTo:
            "https://proactive-success-page-qwbutg13m-naij-jians-projects.vercel.app",
        },
      });

      if (error) throw error;

      Alert.alert(
        "Signup Successful",
        "Please check your email for a verification link."
      );

      navigation.navigate("Login", {
        userType,
        successMessage:
          "Signup successful! Please verify your email and log in.",
      });
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {userType === "admin"
          ? "Create Admin Account"
          : "Create Student Account"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Enter Your Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 20 }}>
        Already have an account?{" "}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("Login", { userType })}
        >
          Log in here
        </Text>
      </Text>
    </View>
  );
};

export default SignupScreen;
