// App.js
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { supabase } from "./supabaseClient";

// --- Component Imports ---
import SplashScreenComponent from "./Screen/splashscreen";
import WelcomeScreen from "./Screen/WelcomeScreen";
import SignupScreen from "./Screen/SignUpScreen";
import LoginScreen from "./Screen/LoginScreen";
import ForgotPasswordScreen from "./Screen/ForgotPasswordScreen";
import AdminHomeScreen from "./Screen/AdminHomeScreen";
import StudentHomeScreen from "./Screen/StudentHomeScreen";
import ProfileEditScreen from "./Screen/ProfileEditScreen";
import AdminProfileEditScreen from "./Screen/AdminProfileEditScreen";
import ChatMessageScreen from "./Screen/ChatMessageScreen";
import LeaderboardsScreen from "./Screen/LeaderboardsScreen";
import CreateTaskScreen from "./Screen/CreateTaskScreen";
import StudentProgressScreen from "./Screen/StudentProgressScreen";
import ActivityLogsScreen from "./Screen/ActivityLogsScreen";
import SettingsScreen from "./Screen/SettingsScreen";
import QuestsHistoryScreen from "./Screen/QuestsHistoryScreen";
import MilestonesScreen from "./Screen/MilestonesScreen";
import CreateClassScreen from "./Screen/CreateClassScreen";
import JoinClassScreen from "./Screen/JoinClassScreen";
import StudentMyClassScreen from "./Screen/StudentMyClassScreen";
import AdminMyClassScreen from "./Screen/AdminMyClassScreen";
import AdminClassDetailScreen from "./Screen/AdminClassDetailScreen";
import StudentTasksScreen from "./Screen/StudentTasksScreen";
import StudentChatListScreen from './Screen/StudentChatListScreen';
import AdminChatListScreen from './Screen/AdminChatListScreen';

const linking = {
  prefixes: ["proactive://"],
  config: {
    screens: {
      Login: "login",
      ForgotPassword: "forgot-password",
    },
  },
};

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Righteous: require("./assets/fonts/Righteous-Regular.ttf"),
  });

  const navigationRef = useRef(null);
  const [initialAuthHandled, setInitialAuthHandled] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session && !initialAuthHandled) {
        setInitialAuthHandled(true);
        Alert.alert(
          "Verification Successful",
          "Your email has been verified. You can now log in.",
          [{ text: "OK" }]
        );
      } else if (event === "PASSWORD_RECOVERY") {
        navigationRef.current?.navigate("ForgotPassword", { updateMode: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [initialAuthHandled]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        onReady={onLayoutRootView}
      >
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#f0f4ff",
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: "#4F74B8",
            headerTitleStyle: { fontWeight: "bold" },
            headerBackTitleVisible: false,
          }}
        >
          {/* Screens with hidden headers */}
          <Stack.Screen name="Splash" component={SplashScreenComponent} options={{ headerShown: false }} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="StudentHome" component={StudentHomeScreen} options={{ headerShown: false }} />

          {/* Auth Screens */}
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ title: "" }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "" }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ title: "Reset Password" }}
          />

          {/* Profile Edit Screens */}
          <Stack.Screen
            name="ProfileEdit"
            component={ProfileEditScreen}
            options={{ title: "Edit Profile" }}
          />
          <Stack.Screen
            name="AdminProfileEdit"
            component={AdminProfileEditScreen}
            options={{ title: "Edit Admin Profile" }}
          />

          {/* Feature Screens */}
          {/* --- CHANGE IS HERE --- */}
          <Stack.Screen
            name="ChatMessage"
            component={ChatMessageScreen}
            // We change the options to be a function that gets the title from the route parameters
            options={({ route }) => ({
              title: route.params?.classInfo?.class_name || 'Chat',
            })}
          />
          {/* --- END OF CHANGE --- */}
          <Stack.Screen
            name="Leaderboards"
            component={LeaderboardsScreen}
            options={{ title: "Leaderboards" }}
          />
          <Stack.Screen
            name="CreateTask"
            component={CreateTaskScreen}
            options={{ title: "Create Task" }}
          />
          <Stack.Screen
            name="StudentProgress"
            component={StudentProgressScreen}
            options={{ title: "Student Progress" }}
          />
          <Stack.Screen
            name="ActivityLogs"
            component={ActivityLogsScreen}
            options={{ title: "Activity Logs" }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: "Settings" }}
          />
          <Stack.Screen
            name="QuestsHistory"
            component={QuestsHistoryScreen}
            options={{ title: "Quests History" }}
          />
          <Stack.Screen
            name="Milestones"
            component={MilestonesScreen}
            options={{ title: "Milestones" }}
          />
          <Stack.Screen
            name="CreateClass"
            component={CreateClassScreen}
            options={{ title: "Create a Class" }}
          />
          <Stack.Screen
            name="JoinClass"
            component={JoinClassScreen}
            options={{ title: "Join Class" }}
          />
          <Stack.Screen
            name="StudentMyClass"
            component={StudentMyClassScreen}
            options={{ title: "My Class" }}
          />
          <Stack.Screen
            name="AdminMyClass"
            component={AdminMyClassScreen}
            options={{ title: "My Class" }}
          />
          <Stack.Screen
            name="AdminClassDetail"
            component={AdminClassDetailScreen}
            options={({ route }) => ({
              title: route.params?.className || "Class Details",
            })}
          />
          <Stack.Screen
            name="StudentTasks"
            component={StudentTasksScreen}
            options={{ title: "My Tasks" }}
          />
          <Stack.Screen 
            name="StudentChatList" 
            component={StudentChatListScreen} 
            options={{ 
                title: 'Select a Class Chat' 
            }} 
          />
          <Stack.Screen 
            name="AdminChatList" 
            component={AdminChatListScreen} 
            options={{ 
                title: 'Select a Class Chat' 
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}