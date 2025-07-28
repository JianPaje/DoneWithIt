// Screen/ChatMessageScreen.js
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { supabase } from "../supabaseClient";

const ChatMessageScreen = ({ route }) => {
  const { classInfo, currentUser } = route.params;

  // --- Basic Validation ---
  if (!classInfo || !currentUser) {
    Alert.alert("Error", "Missing user or class information.", [{ text: "OK" }]);
    return <View style={styles.container} />;
  }

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef();

  // Fetch initial messages from Supabase
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          id,
          text,
          created_at,
          user_id,
          profiles (
            username,
            avatar_url
          )
        `
        )
        .eq("class_id", classInfo.id)
        .order("created_at", { ascending: false });

      if (!error) {
        const formattedMessages = data.map((msg) => ({
          _id: msg.id,
          text: msg.text,
          createdAt: new Date(msg.created_at),
          user: {
            _id: msg.user_id,
            name: msg.profiles?.username || "Unknown",
            // avatar: msg.profiles?.avatar_url, // Handle if needed
          },
        }));
        setMessages(formattedMessages);
      } else {
        console.error("Error fetching messages:", error);
        Alert.alert("Error", `Failed to load messages: ${error.message}`);
      }
    };

    fetchMessages();
  }, [classInfo.id]);

  // Set up Supabase real-time subscription
  useEffect(() => {
    // Ensure classInfo.id is valid before subscribing
    if (!classInfo.id) return;

    const channel = supabase
      .channel(`chat_room:${classInfo.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `class_id=eq.${classInfo.id}`,
        },
        async (payload) => {
          // Fetch sender profile details
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", payload.new.user_id)
            .single();

          // Prepare new message object
          const newMessage = {
            _id: payload.new.id,
            text: payload.new.text,
            createdAt: new Date(payload.new.created_at),
            user: {
              _id: payload.new.user_id,
              name: profileError ? "Unknown" : profileData.username,
              // avatar: profileError ? null : profileData.avatar_url,
            },
          };

          // Update state with the new message (prepend to list)
          setMessages((previousMessages) => [newMessage, ...previousMessages]);
        }
      )
      .subscribe();

    // Cleanup function to remove the subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [classInfo.id]); // Re-subscribe if classInfo.id changes

  // Handle sending a new message
  const handleSend = useCallback(async () => {
    if (inputText.trim().length === 0) {
      return; // Don't send empty messages
    }

    const textToSend = inputText.trim();
    setInputText(""); // Clear input field immediately

    const { error } = await supabase.from("messages").insert({
      text: textToSend,
      class_id: classInfo.id,
      user_id: currentUser.id,
    });

    if (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", `Error sending message: ${error.message}`);
      // Optionally, re-add the message to the input field or local state if sending failed
      setInputText(textToSend);
    }
    // Note: The real-time subscription will add the message to the list once it's confirmed by the database.
  }, [inputText, classInfo.id, currentUser.id]); // Dependencies for useCallback

  // --- Basic UI Rendering ---
  const renderMessage = (message) => {
    const isCurrentUser = message.user._id === currentUser.id;
    return (
      <View
        key={message._id}
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.ownMessageContainer : styles.otherMessageContainer,
        ]}
      >
        {!isCurrentUser && (
          <Text style={styles.senderName}>{message.user.name}</Text>
        )}
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.ownBubble : styles.otherBubble,
          ]}
        >
          <Text style={styles.messageText}>{message.text}</Text>
          <Text style={styles.messageTime}>
            {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/ImageBackground.png")} // Ensure this path is correct
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      {/* Messages Display Area */}
      <View style={styles.messagesContainer}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          style={styles.messagesScrollView}
        >
          {messages.map(renderMessage)}
        </ScrollView>
      </View>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          onPress={handleSend}
          style={styles.sendButton}
          disabled={inputText.trim().length === 0}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

// --- Basic Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10, // Adjust padding if needed
  },
  backgroundImage: {
    // Add styles for the background image if needed
  },
  messagesContainer: {
    flex: 1,
    // padding: 10, // Adjust padding if needed
  },
  messagesScrollView: {
    // padding: 10, // Adjust padding if needed
  },
  messageContainer: {
    marginBottom: 10,
    flexDirection: 'column',
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    marginLeft: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
  },
  ownBubble: {
    backgroundColor: '#dcf8c6', // Light green for own messages
    borderBottomRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: '#ffffff', // White for other messages
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100, // Limit height for multiline input
  },
  sendButton: {
    backgroundColor: '#007AFF', // Blue color, adjust as needed
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatMessageScreen;