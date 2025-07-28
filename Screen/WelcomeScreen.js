import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import styles from '../Style/Homestyle'; // Assuming this has basic styles like container, title

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/logo.png')} style={styles.welcomeLogo} />

      {/* Title */}
      <Text style={styles.title}>ProActive</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Please select your role to begin</Text>

      {/* Role Selection Buttons */}
      <TouchableOpacity 
        style={[styles.button, localStyles.roleButton]} // Use an array for multiple styles
        onPress={() => navigation.navigate('Login', { userType: 'admin' })}
      >
        <Text style={styles.buttonText}>I am an Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, localStyles.roleButton]} 
        onPress={() => navigation.navigate('Login', { userType: 'student' })}
      >
        <Text style={styles.buttonText}>I am a Student</Text>
      </TouchableOpacity>
    </View>
  );
};

// You can add these specific styles to your Homestyle.js or keep them here
const localStyles = StyleSheet.create({
  roleButton: {
    width: '80%',
    paddingVertical: 15,
    marginVertical: 15,
  }
});

export default WelcomeScreen;