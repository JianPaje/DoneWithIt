import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import { supabase } from "../supabaseClient";
import styles from "../Style/Homestyle";

const PREDEFINED_AVATARS = [
  {
    id: "a1",
    url: "https://aytvmuytvgucsestsnut.supabase.co/storage/v1/object/public/avatars//10.png",
    local: require("../assets/AdminAvatar/1.png"),
    locked: false,
    unlock_criteria: "",
  },
  {
    id: "a2",
    url: "https://aytvmuytvgucsestsnut.supabase.co/storage/v1/object/public/avatars//11.png",
    local: require("../assets/AdminAvatar/2.png"),
    locked: false,
    unlock_criteria: "",
  },
  {
    id: "a3",
    url: "https://aytvmuytvgucsestsnut.supabase.co/storage/v1/object/public/avatars//12.png",
    local: require("../assets/AdminAvatar/3.png"),
    locked: false,
    unlock_criteria: "Complete all admin onboarding tasks.",
  },
  {
    id: "a4",
    url: "https://aytvmuytvgucsestsnut.supabase.co/storage/v1/object/public/avatars//13.png",
    local: require("../assets/AdminAvatar/4.png"),
    locked: false,
    unlock_criteria: "Complete all admin onboarding tasks.",
  },
  {
    id: "a5",
    url: "https://aytvmuytvgucsestsnut.supabase.co/storage/v1/object/public/avatars//14.png",
    local: require("../assets/AdminAvatar/5.png"),
    locked: false,
    unlock_criteria: "Complete all admin onboarding tasks.",
  },
];

const AdminProfileEditScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const [username, setUsername] = useState(user.username || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || null);
  const [loading, setLoading] = useState(false);
  const [isAvatarGridVisible, setIsAvatarGridVisible] = useState(false);

  const selectPredefinedAvatar = (predefinedAvatar) => {
    setAvatarUrl(predefinedAvatar.url);
  };

  const updateProfile = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ username: username, avatar_url: avatarUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error Updating Profile", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderAvatarItem = ({ item }) => {
    const isSelected = avatarUrl === item.url;
    const imageSource = item.local || item.image;

    return (
      <TouchableOpacity
        style={[
          localStyles.avatarItem,
          isSelected && localStyles.selectedAvatar,
        ]}
        onPress={() => {
          if (!item.locked) {
            selectPredefinedAvatar(item);
          } else {
            Alert.alert("Avatar Locked", item.unlock_criteria);
          }
        }}
        disabled={item.locked && item.unlock_criteria === "Coming Soon!"}
      >
        <Image source={imageSource} style={localStyles.avatarImage} />
        {item.locked && <View style={localStyles.lockedOverlay} />}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.ProfileEditScreencontainer}>
      <Image
        source={
          avatarUrl ? { uri: avatarUrl } : require("../assets/profile.png")
        }
        style={styles.ProfileEditScreenImage}
      />

      <TouchableOpacity
        onPress={() => setIsAvatarGridVisible(!isAvatarGridVisible)}
      >
        <Text style={styles.changeText}>Change Photo</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.ProfileEditScreeninput}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        placeholderTextColor="#888"
      />

      {/* --- ADDED: Admin USN Display --- */}
      <View style={localStyles.infoRow}>
        <Text style={localStyles.infoLabel}>Admin USN</Text>
        <Text style={localStyles.infoValue}>{user?.school_id || "N/A"}</Text>
      </View>

      <TouchableOpacity
        style={styles.ProfileEditScreenbutton}
        onPress={updateProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.ProfileEditScreenbuttonText}>Update Profile</Text>
        )}
      </TouchableOpacity>

      {isAvatarGridVisible && (
        <View style={localStyles.avatarSectionContainer}>
          <Text style={localStyles.chooseAvatarTitle}>Choose Your Avatar</Text>
          <FlatList
            data={PREDEFINED_AVATARS}
            renderItem={renderAvatarItem}
            keyExtractor={(item) => item.id}
            numColumns={4}
            contentContainerStyle={localStyles.avatarGridContainer}
            scrollEnabled={false}
          />
        </View>
      )}
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  avatarSectionContainer: {
    width: "100%",
    marginTop: 30,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chooseAvatarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  avatarGridContainer: {},
  avatarItem: {
    margin: 8,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "transparent",
    padding: 2,
  },
  selectedAvatar: {
    borderColor: "#4F74B8",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  // --- ADDED: Styles for the new Admin USN field ---
  infoRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#e9eef7",
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#d1d9f0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
});

export default AdminProfileEditScreen;
