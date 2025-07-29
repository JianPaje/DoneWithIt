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
        // Keep fetching newest first for efficient query
        .order("created_at", { ascending: false });

      if (!error) {
        // Map messages and then REVERSE the array
        // So the newest fetched message is LAST in the state array
        const formattedMessages = data.map((msg) => ({
          _id: msg.id,
          text: msg.text,
          createdAt: new Date(msg.created_at),
          user: {
            _id: msg.user_id,
            name: msg.profiles?.username || "Unknown",
          },
        })).reverse(); // <-- REVERSE HERE
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
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", payload.new.user_id)
            .single();

          const newMessage = {
            _id: payload.new.id,
            text: payload.new.text,
            createdAt: new Date(payload.new.created_at),
            user: {
              _id: payload.new.user_id,
              name: profileError ? "Unknown" : profileData.username,
            },
          };

          // APPEND the new message to the END of the list
          setMessages((previousMessages) => [...previousMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [classInfo.id]);

  // Handle sending a new message
  const handleSend = useCallback(async () => {
    if (inputText.trim().length === 0) {
      return;
    }

    const textToSend = inputText.trim();
    setInputText("");

    const { error } = await supabase.from("messages").insert({
      text: textToSend,
      class_id: classInfo.id,
      user_id: currentUser.id,
    });

    if (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", `Error sending message: ${error.message}`);
      setInputText(textToSend);
    }
    // The real-time subscription handles adding the message to the state
  }, [inputText, classInfo.id, currentUser.id]);

  // --- Scroll to Bottom When Messages Update ---
  useEffect(() => {
    // Use requestAnimationFrame or setTimeout for better timing
    const scrollAction = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };
    // Option 1: Small delay
    const timerId = setTimeout(scrollAction, 100); // Adjust delay if needed (50ms, 150ms)

    // // Option 2: Use requestAnimationFrame (might be more reliable)
    // const frameId = requestAnimationFrame(scrollAction);

    // Cleanup: Clear timeout/requestAnimationFrame if component unmounts or effect re-runs
    return () => {
        clearTimeout(timerId);
        // cancelAnimationFrame(frameId); // If using requestAnimationFrame
    };
  }, [messages]); // Depend on messages array

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
      source={require("../assets/ImageBackground.png")}
      style={styles.container}
      imageStyle={[styles.backgroundImage, { opacity: 0.1 }]}
    >
      {/* Messages Display Area */}
      <View style={styles.messagesContainer}>
        {/* Ensure flex: 1 and contentContainerStyle handles padding if needed */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesScrollView}
          // Optional: Ensure content starts from the top
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
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

// --- Basic Styles (Keep your existing styles) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    // ...
  },
  messagesContainer: {
    flex: 1,
  },
  messagesScrollView: {
    // padding: 10, // Adjust if needed, consider contentContainerStyle
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
    backgroundColor: '#dcf8c6',
    borderBottomRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: '#ffffff',
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
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