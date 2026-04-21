import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AIChatbotScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>AI Chatbot</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>Welcome to the AI Chatbot Screen. This feature is coming soon!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backButton: { marginRight: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 16, color: '#64748b', textAlign: 'center' }
});
