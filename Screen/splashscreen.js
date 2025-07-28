import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import styles from '../Style/Homestyle';


const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Welcome'); // Navigate after 3 seconds
    }, 3000);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
    </View>
  );
};


export default SplashScreen;