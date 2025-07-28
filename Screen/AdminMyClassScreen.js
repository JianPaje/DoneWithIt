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

const AdminMyClassScreen = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchAdminClasses = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || user.user_metadata?.role !== "admin") {
        Alert.alert("Access Denied", "This page is for admins only.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
        return;
      }

      const { data: classData, error: classError } = await supabase
        .from("classes")
        .select("id, class_name")
        .eq("admin_id", user.id);

      if (classError) throw classError;
      setClasses(classData || []);
    } catch (error) {
      Alert.alert("Error", "Could not fetch class data: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  // --- MODIFIED: This is the corrected pattern for useFocusEffect ---
  useFocusEffect(
    useCallback(() => {
      fetchAdminClasses();
    }, [fetchAdminClasses])
  );

  const handleDeleteClass = async (classId, className) => {
    Alert.alert(
      "Delete Class",
      `Are you sure you want to permanently delete "${className}"? All student data associated with it will be lost.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("classes")
                .delete()
                .eq("id", classId);

              if (error) throw error;

              fetchAdminClasses(); // Refresh the list
            } catch (error) {
              Alert.alert("Error", "Could not delete class: " + error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ActivityIndicator
        style={{ flex: 1, alignSelf: "center" }}
        size="large"
        color="#4F74B8"
      />
    );
  }

  const renderClassItem = ({ item }) => (
    <View style={[styles.myClassCard, localStyles.cardContainer]}>
      <TouchableOpacity
        style={localStyles.cardContent}
        onPress={() =>
          navigation.navigate("AdminClassDetail", {
            classId: item.id,
            className: item.class_name,
          })
        }
      >
        <Text style={styles.myClassSectionTitle}>{item.class_name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={localStyles.deleteButton}
        onPress={() => handleDeleteClass(item.id, item.class_name)}
      >
        <Text style={localStyles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.myClassContainer}>
      <Text style={styles.myClassTitle}>My Classes</Text>
      {classes.length > 0 ? (
        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        />
      ) : (
        <View style={[styles.myClassCard, { marginHorizontal: 15 }]}>
          <Text style={styles.myClassEmptyText}>
            You haven't created any classes yet. Go to the menu to create one.
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
  cardContent: {
    flex: 1,
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
  },
  deleteButtonText: {
    fontSize: 24,
  },
});

export default AdminMyClassScreen;
