// Screen/AdminChatListScreen.js

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

const AdminChatListScreen = () => {
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

          const { data: classData, error: classError } = await supabase
            .from("classes")
            .select("id, class_name")
            .eq("admin_id", user.id);

          if (classError) throw classError;
          setClasses(classData || []);
        } catch (error) {
          Alert.alert("Error", `Could not load data: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const handleSelectClass = (classItem) => {
    if (!currentUser) {
      Alert.alert("Error", "User data is not ready, please wait.");
      return;
    }
    
    navigation.navigate("ChatMessage", {
      classInfo: classItem,
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
      <Text style={styles.myClassSectionTitle}>{item.class_name}</Text>
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
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 15 }}
        />
      ) : (
        <View style={[styles.myClassCard, { marginHorizontal: 15 }]}>
          <Text style={styles.myClassEmptyText}>
            You haven't created any classes yet.
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

export default AdminChatListScreen;