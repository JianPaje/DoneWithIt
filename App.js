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
import StudentTasksScreen from "./Screen/StudentTasksScreen"; // NEW IMPORT

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
            headerShown: false,
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
          {/* Main Screens */}
          <Stack.Screen name="Splash" component={SplashScreenComponent} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
          <Stack.Screen name="StudentHome" component={StudentHomeScreen} />

          {/* Auth Screens */}
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: true, title: "" }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: true, title: "" }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: true, title: "Reset Password" }}
          />

          {/* Profile Edit Screens */}
          <Stack.Screen
            name="ProfileEdit"
            component={ProfileEditScreen}
            options={{ headerShown: true, title: "Edit Profile" }}
          />
          <Stack.Screen
            name="AdminProfileEdit"
            component={AdminProfileEditScreen}
            options={{ headerShown: true, title: "Edit Admin Profile" }}
          />

          {/* Feature Screens */}
          <Stack.Screen
            name="ChatMessage"
            component={ChatMessageScreen}
            options={{ headerShown: true, title: "Messages" }}
          />
          <Stack.Screen
            name="Leaderboards"
            component={LeaderboardsScreen}
            options={{ headerShown: true, title: "Leaderboards" }}
          />
          <Stack.Screen
            name="CreateTask"
            component={CreateTaskScreen}
            options={{ headerShown: true, title: "Create Task" }}
          />
          <Stack.Screen
            name="StudentProgress"
            component={StudentProgressScreen}
            options={{ headerShown: true, title: "Student Progress" }}
          />
          <Stack.Screen
            name="ActivityLogs"
            component={ActivityLogsScreen}
            options={{ headerShown: true, title: "Activity Logs" }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: true, title: "Settings" }}
          />
          <Stack.Screen
            name="QuestsHistory"
            component={QuestsHistoryScreen}
            options={{ headerShown: true, title: "Quests History" }}
          />
          <Stack.Screen
            name="Milestones"
            component={MilestonesScreen}
            options={{ headerShown: true, title: "Milestones" }}
          />
          <Stack.Screen
            name="CreateClass"
            component={CreateClassScreen}
            options={{ headerShown: true, title: "Create a Class" }}
          />
          <Stack.Screen
            name="JoinClass"
            component={JoinClassScreen}
            options={{ headerShown: true, title: "Join Class" }}
          />
          <Stack.Screen
            name="StudentMyClass"
            component={StudentMyClassScreen}
            options={{ headerShown: true, title: "My Class" }}
          />
          <Stack.Screen
            name="AdminMyClass"
            component={AdminMyClassScreen}
            options={{ headerShown: true, title: "My Class" }}
          />
          <Stack.Screen
            name="AdminClassDetail"
            component={AdminClassDetailScreen}
            options={({ route }) => ({
              headerShown: true,
              title: route.params?.className || "Class Details",
            })}
          />
          {/* NEW STUDENT TASK SCREEN */}
          <Stack.Screen
            name="StudentTasks"
            component={StudentTasksScreen}
            options={{ headerShown: true, title: "My Tasks" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
