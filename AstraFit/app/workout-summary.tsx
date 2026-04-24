import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function WorkoutSummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const exerciseName = (params.exerciseName as string) || "Workout";
  const totalReps = (params.totalReps as string) || "0";
  const duration = (params.duration as string) || "0";
  const caloriesBurned = (params.caloriesBurned as string) || "0";
  const formAccuracy = (params.formAccuracy as string) || "0";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0f0a" }}>
      <ScrollView className="flex-1 px-6 pt-10">
        <View className="items-center mb-10">
            <View className="w-20 h-20 bg-primary/20 rounded-full items-center justify-center mb-4">
                <MaterialIcons name="emoji-events" size={48} color="#0df20d" />
            </View>
            <Text className="text-white text-3xl font-bold">Workout Complete!</Text>
            <Text className="text-gray-400 text-lg mt-1">Excellent work on your {exerciseName}</Text>
        </View>

        <View className="flex-row flex-wrap gap-4 mb-10">
            <SummaryCard icon="fitness-center" label="Total Reps" value={totalReps} color="#0df20d" />
            <SummaryCard icon="timer" label="Duration" value={`${duration}s`} color="#0ea5e9" />
            <SummaryCard icon="local-fire-department" label="Calories" value={caloriesBurned} color="#f97316" />
            <SummaryCard icon="bolt" label="Avg Accuracy" value={`${formAccuracy}%`} color="#fbbf24" />
        </View>

        <View className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-10">
            <Text className="text-white font-bold mb-4">Coach Insights</Text>
            <Text className="text-gray-400 text-sm leading-relaxed">
                You maintained a consistency of {formAccuracy}%. Your power output was highest during the second half of the session. Keep focusing on your eccentric phase for better muscle growth.
            </Text>
        </View>

        <TouchableOpacity 
            className="bg-primary w-full py-4 rounded-2xl items-center shadow-lg shadow-primary/30 mb-8"
            onPress={() => router.push('/(tabs)')}
        >
            <Text className="text-black font-bold text-lg">BACK TO DASHBOARD</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryCard({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
    return (
        <View className="flex-1 min-w-[45%] bg-white/5 border border-white/10 p-5 rounded-3xl items-center">
            <MaterialIcons name={icon} size={24} color={color} className="mb-2" />
            <Text className="text-[10px] text-gray-500 uppercase font-bold">{label}</Text>
            <Text className="text-2xl font-bold text-white mt-1">{value}</Text>
        </View>
    );
}
