import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabaseClient';
import styles from '../Style/Homestyle';

const SettingsScreen = () => {
    const navigation = useNavigation();

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Error signing out', error.message);
        } else {
            // Replace the entire navigation stack with the Welcome screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            {/* We can put the sign out button here as well */}
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SettingsScreen;