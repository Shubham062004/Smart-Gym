import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useWorkout } from '../../src/hooks/useWorkout';

export default function History() {
  const { workoutHistory, isLoadingHistory } = useWorkout();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-gray-50/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 z-20">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
            <MaterialIcons name="arrow-back" size={24} color="#0f172a" className="dark:color-white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Workout History</Text>
        </View>
        <TouchableOpacity className="p-2 -mr-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
          <MaterialIcons name="tune" size={24} color="#0f172a" className="dark:color-white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Search & Filter */}
        <View className="flex-col gap-4 mb-6">
          <View className="flex-row w-full h-12 items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 shadow-sm">
            <MaterialIcons name="search" size={24} color="#9da6b9" />
            <TextInput 
              className="flex-1 ml-2 text-base text-slate-900 dark:text-white h-full"
              placeholder="Search workouts..."
              placeholderTextColor="#9da6b9"
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
            <TouchableOpacity className="px-4 h-10 bg-blue-600 rounded-full flex-row items-center justify-center mr-3 shadow-lg">
              <Text className="text-white text-sm font-medium">All Types</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex-row items-center justify-center mr-3">
              <Text className="text-slate-600 dark:text-slate-300 text-sm font-medium">Strength</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex-row items-center justify-center mr-3">
              <Text className="text-slate-600 dark:text-slate-300 text-sm font-medium">Cardio</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex-row items-center justify-center mr-3">
              <Text className="text-slate-600 dark:text-slate-300 text-sm font-medium">Flexibility</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Date Range Picker / Calendar Strip */}
        <View className="flex-col gap-3 mb-6">
          <View className="flex-row items-center justify-between px-1">
            <Text className="text-base font-semibold text-slate-900 dark:text-white">October 2023</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity className="p-1 rounded-full text-slate-500 dark:text-slate-400">
                <MaterialIcons name="chevron-left" size={24} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity className="p-1 rounded-full text-slate-500 dark:text-slate-400">
                <MaterialIcons name="chevron-right" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <View className="flex-row justify-between mb-2">
              {['S','M','T','W','T','F','S'].map((day, i) => (
                <Text key={i} className="text-xs font-medium text-slate-400 w-9 text-center">{day}</Text>
              ))}
            </View>
            <View className="flex-row justify-between">
              {[22,23,24,25,26,27,28].map((date, i) => (
                <TouchableOpacity key={i} className={`h-9 w-9 rounded-full flex items-center justify-center ${date === 24 ? 'bg-blue-600 shadow-md' : 'bg-transparent'}`}>
                  <Text className={`text-sm font-medium ${date === 24 ? 'text-white font-bold' : 'text-slate-500 dark:text-slate-300'}`}>{date}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Stats Summary */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-2xl p-4">
            <Text className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">Total Workouts</Text>
            <Text className="text-2xl font-bold text-slate-900 dark:text-white">12</Text>
            <Text className="text-xs text-slate-500 mt-1">+2 from last week</Text>
          </View>
          <View className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
            <Text className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Total Calories</Text>
            <Text className="text-2xl font-bold text-slate-900 dark:text-white">4,250</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <MaterialIcons name="trending-up" size={14} color="#22c55e" />
              <Text className="text-xs text-green-500">12%</Text>
            </View>
          </View>
        </View>

        {/* Session List */}
        <View className="flex-col gap-4">
          <Text className="text-lg font-bold text-slate-900 dark:text-white mb-2">Recent Sessions</Text>
          
          {isLoadingHistory ? (
            <ActivityIndicator />
          ) : (workoutHistory && workoutHistory.length > 0) ? (
            workoutHistory.map((workout: any, idx: number) => (
              <TouchableOpacity key={idx} className="rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 mb-4 p-5">
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-row gap-4 items-center">
                    <View className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <MaterialIcons name="fitness-center" size={24} color="#2563eb" />
                    </View>
                    <View>
                      <Text className="text-base font-bold text-slate-900 dark:text-white">{workout.exerciseName || 'Workout'}</Text>
                      <Text className="text-xs text-slate-500">
                        {workout.completedAt ? new Date(workout.completedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Unknown Date'}
                      </Text>
                    </View>
                  </View>
                  <View className="bg-green-100 dark:bg-green-500/10 px-3 py-1 rounded-lg">
                    <Text className="text-green-500 text-xs font-bold">{workout.formAccuracy}% Accuracy</Text>
                  </View>
                </View>
                <View className="flex-row justify-between py-3 border-t border-slate-100 dark:border-slate-700/50 mb-4">
                  <View className="flex-col items-center flex-1">
                    <Text className="text-[10px] text-slate-400 uppercase font-medium">Duration</Text>
                    <Text className="text-sm font-semibold text-slate-900 dark:text-white">{Math.round(workout.duration)}s</Text>
                  </View>
                  <View className="flex-col items-center flex-1 border-l border-slate-100 dark:border-slate-700/50">
                    <Text className="text-[10px] text-slate-400 uppercase font-medium">Calories</Text>
                    <Text className="text-sm font-semibold text-slate-900 dark:text-white">{workout.caloriesBurned} kcal</Text>
                  </View>
                  <View className="flex-col items-center flex-1 border-l border-slate-100 dark:border-slate-700/50">
                    <Text className="text-[10px] text-slate-400 uppercase font-medium">Total Reps</Text>
                    <Text className="text-sm font-semibold text-slate-900 dark:text-white">{workout.totalReps || 0}</Text>
                  </View>
                </View>
                <View className="w-full h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex-row items-center justify-center gap-2">
                  <Text className="text-slate-900 dark:text-white text-sm font-medium">View Details</Text>
                  <MaterialIcons name="arrow-forward" size={16} color="#0f172a" className="dark:color-white" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-slate-500 dark:text-slate-400 text-center py-4">No recent workouts found.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
