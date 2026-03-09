import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Progress() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 pt-6 pb-2 sticky top-0 z-10 bg-gray-50/95 dark:bg-slate-900/95">
        <TouchableOpacity 
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#0f172a" className="dark:color-white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white flex-1 text-center">Your Progress</Text>
        <TouchableOpacity className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
          <MaterialIcons name="share" size={24} color="#0f172a" className="dark:color-white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-2" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Filters */}
        <View className="mb-4">
          <Text className="text-base font-medium text-slate-500 dark:text-slate-400 mb-2">Exercise Type</Text>
          <View className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 flex-row justify-between items-center shadow-sm">
            <Text className="text-slate-900 dark:text-white font-medium">Full Body Workout</Text>
            <MaterialIcons name="expand-more" size={20} color="#64748b" />
          </View>
        </View>

        {/* Performance Graph Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-slate-900 dark:text-white">Performance</Text>
            <View className="flex-row bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
              <TouchableOpacity className="px-3 py-1 bg-transparent rounded"><Text className="text-xs font-bold text-slate-600 dark:text-slate-400">W</Text></TouchableOpacity>
              <TouchableOpacity className="px-3 py-1 bg-white dark:bg-blue-600 rounded shadow-sm"><Text className="text-xs font-bold text-blue-600 dark:text-white">M</Text></TouchableOpacity>
              <TouchableOpacity className="px-3 py-1 bg-transparent rounded"><Text className="text-xs font-bold text-slate-600 dark:text-slate-400">Y</Text></TouchableOpacity>
            </View>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <View className="flex-row items-end gap-3 mb-6">
              <View>
                <Text className="text-sm text-slate-500 dark:text-slate-400 font-medium">Average Score</Text>
                <Text className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">85%</Text>
              </View>
              <View className="flex-row items-center gap-1 mb-1.5 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/10">
                <MaterialIcons name="trending-up" size={14} color="#22c55e" />
                <Text className="text-xs font-bold text-green-500">+5%</Text>
              </View>
            </View>

            {/* Simulated Graph */}
            <View className="relative h-48 w-full justify-between pb-6">
                {/* Lines */}
                <View className="absolute w-full h-full justify-between pb-6 opacity-30">
                  <View className="border-b border-dashed border-slate-300 dark:border-slate-600 h-0" />
                  <View className="border-b border-dashed border-slate-300 dark:border-slate-600 h-0" />
                  <View className="border-b border-dashed border-slate-300 dark:border-slate-600 h-0" />
                  <View className="border-b border-dashed border-slate-300 dark:border-slate-600 h-0" />
                  <View className="border-b border-slate-300 dark:border-slate-600 h-0" />
                </View>

                {/* Simulated Path Overlay using points */}
                <View className="absolute w-full top-6 h-32 flex-row justify-between items-end px-2">
                    <View className="w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 translate-y-[-10px] z-10" />
                    <View className="w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 translate-y-[-25px] z-10" />
                    <View className="w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 translate-y-[-40px] z-10" />
                    <View className="w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 translate-y-[-20px] z-10" />
                    <View className="w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 translate-y-[-50px] z-10" />
                    <View className="w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 translate-y-[-90px] z-10" />
                    <View className="w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 translate-y-[-60px] z-10" />
                </View>
                <View className="absolute bottom-0 w-full flex-row justify-between pt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <Text key={day} className="text-xs font-medium text-slate-400 dark:text-slate-500">{day}</Text>
                    ))}
                </View>
            </View>
          </View>
        </View>

        {/* Stats Cards Grid */}
        <View className="flex-row flex-wrap gap-4 mb-6">
          <View className="flex-1 min-w-[45%] bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <View className="absolute right-0 top-0 p-3 opacity-10"><MaterialIcons name="fitness-center" size={64} color="#258cf4" /></View>
            <View className="flex-row items-center gap-2 mb-2">
              <View className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-500">
                <MaterialIcons name="fitness-center" size={20} color="#2563eb" />
              </View>
              <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Workouts</Text>
            </View>
            <View>
              <Text className="text-3xl font-bold text-slate-900 dark:text-white">24</Text>
              <Text className="text-xs text-slate-400 mt-1">Sessions completed</Text>
            </View>
          </View>

          <View className="flex-1 min-w-[45%] bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <View className="absolute right-0 top-0 p-3 opacity-10"><MaterialIcons name="local-fire-department" size={64} color="#f97316" /></View>
            <View className="flex-row items-center gap-2 mb-2">
              <View className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-500">
                <MaterialIcons name="local-fire-department" size={20} color="#f97316" />
              </View>
              <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Streak</Text>
            </View>
            <View>
              <Text className="text-3xl font-bold text-slate-900 dark:text-white">5</Text>
              <Text className="text-xs text-slate-400 mt-1">Days in a row</Text>
            </View>
          </View>

          <View className="w-full bg-blue-600 p-5 rounded-2xl shadow-lg flex-row items-center justify-between relative overflow-hidden">
            <View className="absolute right-[-20] bottom-[-20] opacity-30"><MaterialIcons name="emoji-events" size={150} color="white" /></View>
            <View className="z-10">
              <View className="flex-row items-center gap-2 mb-2">
                <MaterialIcons name="emoji-events" size={20} color="#bfdbfe" />
                <Text className="text-sm font-medium text-blue-100">Best Performance</Text>
              </View>
              <Text className="text-4xl font-bold text-white">98%</Text>
              <Text className="text-xs text-blue-100 mt-1">Squat accuracy achieved on Oct 24</Text>
            </View>
            <View className="z-10 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
              <MaterialIcons name="emoji-events" size={32} color="white" />
            </View>
          </View>
        </View>

        {/* Recent History */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-slate-900 dark:text-white mb-3">Recent History</Text>
          <View className="flex-col gap-3">
            <View className="flex-row items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <MaterialIcons name="directions-run" size={20} color="#64748b" />
                </View>
                <View>
                  <Text className="text-sm font-bold text-slate-900 dark:text-white">Morning Cardio</Text>
                  <Text className="text-xs text-slate-500">Today, 8:00 AM</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-sm font-bold text-green-500">92%</Text>
                <Text className="text-xs text-slate-500">Score</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <MaterialIcons name="fitness-center" size={20} color="#64748b" />
                </View>
                <View>
                  <Text className="text-sm font-bold text-slate-900 dark:text-white">Upper Body</Text>
                  <Text className="text-xs text-slate-500">Yesterday, 6:30 PM</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-sm font-bold text-blue-500">88%</Text>
                <Text className="text-xs text-slate-500">Score</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
