// Screen/JoinClassScreen.js

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
  const [adminQuery, setAdminQuery] = useState("");
  const [foundClasses, setFoundClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearchAdmin = async () => {
    if (!adminQuery.trim()) {
      Alert.alert("Validation Error", "Please enter an Admin's USN.");
      return;
    }
    setLoading(true);
    setSearchPerformed(true);
    setFoundClasses([]);

    try {
      // --- FINAL MODIFIED QUERY ---
      // We explicitly name the foreign key relationship "admin_id" to resolve the ambiguity.
      // The syntax is foreign_table!foreign_key_column!join_type(...)
      const { data, error } = await supabase
        .from("classes")
        .select(`id, class_name, profiles!admin_id!inner(username, school_id)`)
        .eq("profiles.school_id", adminQuery.trim());

      if (error) throw error;

      if (!data || data.length === 0) {
        // This part is now more reliable because the query is stricter.
      }
      
      setFoundClasses(data);

    } catch (error) {
      Alert.alert("Search Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClass = async (classId, className) => {
    Alert.alert(
      "Confirm Join Request",
      `Do you want to send a request to join "${className}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setLoading(true);
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) throw new Error("You must be logged in.");

              const { data: existing } = await supabase
                .from("class_members")
                .select("id")
                .eq("class_id", classId)
                .eq("student_id", user.id)
                .maybeSingle();

              if (existing) {
                throw new Error("You are already in this class or have a pending request.");
              }

              const { error: insertError } = await supabase
                .from("class_members")
                .insert({ class_id: classId, student_id: user.id, status: "pending" });
              
              if (insertError) throw insertError;

              Alert.alert("Request Sent!", `Your request to join "${className}" has been sent.`);
              navigation.goBack();

            } catch (error) {
              Alert.alert("Error", error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderClassItem = ({ item }) => (
    <TouchableOpacity
      style={styles.myClassCard}
      onPress={() => handleSelectClass(item.id, item.class_name)}
      disabled={loading}
    >
      <Text style={styles.myClassSectionTitle}>{item.class_name}</Text>
      {item.profiles && (
        <Text style={styles.myClassLrn}>
          Taught by: {item.profiles.username}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join a Class</Text>
      <Text style={styles.subtitle}>
        Enter the USN of the admin you're looking for.
      </Text>

      <View style={localStyles.searchContainer}>
        <TextInput
          style={localStyles.input}
          placeholder="Admin USN"
          value={adminQuery}
          onChangeText={setAdminQuery}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={localStyles.button}
          onPress={handleSearchAdmin}
          disabled={loading}
        >
           <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#4F74B8" style={{ marginTop: 20 }} />}

      {!loading && searchPerformed && (
         <FlatList
          data={foundClasses}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id.toString()}
          style={{ width: '100%', marginTop: 20 }}
          ListEmptyComponent={
            <Text style={styles.myClassEmptyText}>No classes found for this Admin USN.</Text>
          }
        />
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  input: {
    ...styles.input,
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
  },
  button: {
    ...styles.button,
    width: 100,
    marginVertical: 0,
  }
});

export default JoinClassScreen;