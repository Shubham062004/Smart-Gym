import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useWorkout } from '../../src/hooks/useWorkout';
import { useRouter } from 'expo-router';

export default function History() {
  const { workoutHistory, isLoadingHistory } = useWorkout();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      {/* Header */}
      <View className="flex-row items-center justify-between p-6 bg-black border-b border-white/5">
        <TouchableOpacity 
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white tracking-tight">Workout History</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        {isLoadingHistory ? (
          <View className="mt-20">
            <ActivityIndicator size="large" color="#0df20d" />
            <Text className="text-white/40 text-center mt-4 uppercase tracking-widest text-[10px] font-bold">Loading History...</Text>
          </View>
        ) : Array.isArray(workoutHistory) && workoutHistory.length > 0 ? (
          workoutHistory.map((workout: any, idx: number) => (
            <TouchableOpacity 
              key={idx || workout.id} 
              className="rounded-[32px] bg-white/5 border border-white/10 mb-6 overflow-hidden"
            >
              <View className="p-6">
                <View className="flex-row justify-between items-start mb-6">
                  <View className="flex-row gap-4 items-center">
                    <View className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <MaterialIcons name="fitness-center" size={24} color="#0df20d" />
                    </View>
                    <View>
                      <Text className="text-base font-bold text-white">{workout.exerciseName || 'Workout'}</Text>
                      <Text className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                        {workout.completedAt ? new Date(workout.completedAt).toLocaleDateString() : 'Unknown Date'}
                      </Text>
                    </View>
                  </View>
                  <View className="bg-primary/20 px-3 py-1.5 rounded-full border border-primary/30">
                    <Text className="text-primary text-[10px] font-black uppercase tracking-tighter">{workout.formAccuracy}% ACCURACY</Text>
                  </View>
                </View>

                <View className="flex-row justify-between py-6 border-y border-white/5">
                  <View className="items-center flex-1">
                    <Text className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Duration</Text>
                    <Text className="text-lg font-bold text-white">{Math.round(workout.duration)}s</Text>
                  </View>
                  <View className="items-center flex-1 border-x border-white/5">
                    <Text className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Burned</Text>
                    <Text className="text-lg font-bold text-white">{workout.caloriesBurned} kcal</Text>
                  </View>
                  <View className="items-center flex-1">
                    <Text className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Reps</Text>
                    <Text className="text-lg font-bold text-white">{workout.totalReps || 0}</Text>
                  </View>
                </View>

                <TouchableOpacity className="w-full mt-6 h-12 rounded-2xl bg-white/5 flex-row items-center justify-center gap-2 border border-white/10">
                  <Text className="text-white text-xs font-bold uppercase tracking-widest">Analysis Report</Text>
                  <MaterialIcons name="chevron-right" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="mt-20 items-center opacity-40">
            <MaterialIcons name="history" size={64} color="white" />
            <Text className="text-white mt-4 font-bold text-xs uppercase tracking-widest text-center">Your performance journey starts here</Text>
            <TouchableOpacity 
                className="mt-8 bg-primary/20 px-8 py-4 rounded-2xl border border-primary/30"
                onPress={() => router.push('/workouts' as any)}
            >
                <Text className="text-primary font-black uppercase tracking-widest text-xs">Start Workout</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
