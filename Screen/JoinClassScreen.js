import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";

const JoinClassScreen = ({ navigation }) => {
  const [adminIdQuery, setAdminIdQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(null); // Will store the ID of the class being requested

  const handleSearch = async () => {
    if (!adminIdQuery.trim()) {
      Alert.alert("Error", "Please enter an Admin USN.");
      return;
    }
    setLoading(true);
    setSearchResult(null);
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("school_id", adminIdQuery.trim())
        .eq("role", "admin")
        .single();

      if (profileError || !profile) {
        throw new Error("Admin not found with that USN.");
      }

      // MODIFIED: Fetch a LIST of classes, not a single one. Removed .maybeSingle()
      const { data: adminClasses, error: classError } = await supabase
        .from("classes")
        .select("id, class_name")
        .eq("admin_id", profile.id);

      if (classError) throw classError;

      setSearchResult({ admin: profile, classesList: adminClasses || [] });
    } catch (error) {
      Alert.alert("Search Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  // MODIFIED: Function now accepts the classId to join
  const handleJoinRequest = async (classId) => {
    setRequestLoading(classId); // Set loading for this specific button
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to join a class.");

      const { error } = await supabase.from("class_members").insert({
        class_id: classId,
        student_id: user.id,
        status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          throw new Error(
            "You have already sent a request to join this class."
          );
        }
        throw error;
      }

      Alert.alert("Success", "Your request to join the class has been sent!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Request Failed", error.message);
    } finally {
      setRequestLoading(null);
    }
  };

  // ADDED: A new component to render each class in the list
  const renderClassItem = ({ item }) => (
    <View style={localStyles.classRow}>
      <Text style={localStyles.className}>{item.class_name}</Text>
      <TouchableOpacity
        style={styles.myClassButton}
        onPress={() => handleJoinRequest(item.id)}
        disabled={requestLoading === item.id}
      >
        <Text style={styles.myClassButtonText}>
          {requestLoading === item.id ? "Sending..." : "Request to Join"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join a Class</Text>
      <Text style={styles.subtitle}>
        Enter the USN of the Admin whose class you want to join.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Admin's USN"
        value={adminIdQuery}
        onChangeText={setAdminIdQuery}
        autoCapitalize="none"
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSearch}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Searching..." : "Search"}
        </Text>
      </TouchableOpacity>

      {searchResult && (
        <View style={[styles.myClassCard, localStyles.resultCard]}>
          <Text style={styles.myClassSectionTitle}>Search Result</Text>
          <Text style={styles.myClassUsername}>
            Admin: {searchResult.admin.username}
          </Text>

          {/* MODIFIED: Display a list of classes if found */}
          {searchResult.classesList.length > 0 ? (
            <FlatList
              data={searchResult.classesList}
              renderItem={renderClassItem}
              keyExtractor={(item) => item.id}
              style={{ marginTop: 15 }}
            />
          ) : (
            <Text style={[styles.myClassEmptyText, { marginTop: 15 }]}>
              This admin has not created a class yet.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  resultCard: {
    width: "100%",
    marginTop: 20,
  },
  classRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  className: {
    fontSize: 16,
    color: "#333",
  },
});

export default JoinClassScreen;
