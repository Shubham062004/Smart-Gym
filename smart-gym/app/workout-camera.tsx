import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useWorkout } from '../src/hooks/useWorkout';
import { useWorkoutStore } from '../src/store/workoutStore';

export default function WorkoutCameraScreen() {
  const router = useRouter();
  const { completeWorkout, isCompleting } = useWorkout();
  const { currentWorkout } = useWorkoutStore();

  const handleComplete = async () => {
    try {
      if (currentWorkout) {
        // Assume completing it updates backend
        await completeWorkout(currentWorkout.id);
        Alert.alert('Workout Completed', 'Great job!', [
          { text: 'OK', onPress: () => router.replace('/history') }
        ]);
      } else {
         router.back();
      }
    } catch (e) {
      console.warn("Could not complete workout", e);
      Alert.alert('Error', 'Failed to complete workout');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>AI Tracking Active</Text>
      </View>
      <View style={styles.cameraPlaceholder}>
         <MaterialIcons name="videocam" size={80} color="#94a3b8" />
         <Text style={{color: '#94a3b8', marginTop: 10}}>Camera view would be here...</Text>
      </View>

      <View style={styles.footer}>
         <TouchableOpacity 
           style={styles.completeButton}
           onPress={handleComplete}
           disabled={isCompleting}
         >
            <Text style={styles.completeText}>{isCompleting ? 'Saving...' : 'Finish Workout'}</Text>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backButton: { marginRight: 16 },
  title: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cameraPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b', margin: 16, borderRadius: 16 },
  footer: { padding: 24, paddingBottom: 40 },
  completeButton: { backgroundColor: '#22c55e', padding: 16, borderRadius: 12, alignItems: 'center' },
  completeText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
