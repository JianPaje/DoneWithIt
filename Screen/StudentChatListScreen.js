// Screen/StudentChatListScreen.js

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const StudentChatListScreen = () => {
  const [classes, setClasses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // --- CORRECTED useFocusEffect ---
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error("User not found.");

          setCurrentUser(user);

          const { data, error } = await supabase
            .from("class_members")
            .select(`
              classes (
                id,
                class_name,
                profiles!admin_id (
                  username
                )
              )
            `)
            .eq("student_id", user.id)
            .eq("status", "approved");

          if (error) throw error;

          const validClasses = data.filter(item => item.classes);
          setClasses(validClasses);

        } catch (error) {
          Alert.alert("Error", `Could not load data: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const handleSelectClass = (classMembership) => {
    if (!currentUser) {
      Alert.alert("Error", "User data is not ready, please wait.");
      return;
    }
    const classInfo = classMembership.classes;
    
    navigation.navigate("ChatMessage", {
      classInfo: classInfo,
      currentUser: currentUser,
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#4F74B8" />
      </View>
    );
  }

  const renderClassItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.myClassCard, localStyles.cardContainer]}
      onPress={() => handleSelectClass(item)}
    >
      <View>
        <Text style={styles.myClassSectionTitle}>{item.classes.class_name}</Text>
        <Text style={styles.myClassLrn}>
          Admin: {item.classes.profiles?.username || 'Unknown'}
        </Text>
      </View>
      <Image
        source={require('../assets/chat-icon.png')}
        style={localStyles.chatIcon}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.myClassContainer}>
      {/* This title is controlled by navigator options, see Part 2 */}
      {classes.length > 0 ? (
        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.classes.id.toString()}
          contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 15 }}
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
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatIcon: {
    width: 28,
    height: 28,
    tintColor: '#4F74B8',
  },
});

export default StudentChatListScreen;