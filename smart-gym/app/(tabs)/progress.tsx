import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axiosClient from '../../src/api/axiosClient';

const { width } = Dimensions.get('window');

export default function Progress() {
  const router = useRouter();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axiosClient.get('/progress/weekly');
        setWeeklyData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View className="flex-row items-center justify-between p-4 pt-6 pb-2 bg-gray-50/95 dark:bg-slate-900/95">
        <TouchableOpacity 
          className="w-10 h-10 flex items-center justify-center rounded-full"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#0f172a" className="dark:color-white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900 dark:text-white flex-1 text-center">Your Progress</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 py-2" contentContainerStyle={{ paddingBottom: 100 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0df20d" className="mt-20" />
        ) : (
          <>
            <View className="mb-6">
              <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">Performance</Text>
              <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                <Text className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">Weekly Reps Volume</Text>
                
                <View className="h-48 flex-row items-end justify-between px-2">
                    {weeklyData.length > 0 ? weeklyData.map((day, i) => (
                        <View key={i} className="items-center flex-1">
                            <View 
                                className="w-8 bg-blue-500 rounded-t-lg" 
                                style={{ height: `${Math.min(day.reps, 150)}%` }} 
                            />
                            <Text className="text-[10px] text-slate-400 mt-2">{day._id.split('-').pop()}</Text>
                        </View>
                    )) : (
                        <Text className="text-slate-500 text-center w-full">No data for this week yet.</Text>
                    )}
                </View>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-4 mb-6">
              <View className="flex-1 min-w-[45%] bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="fitness-center" size={20} color="#2563eb" />
                  <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Sessions</Text>
                </View>
                <Text className="text-3xl font-bold text-slate-900 dark:text-white">
                  {weeklyData.reduce((acc, curr) => acc + curr.count, 0)}
                </Text>
              </View>

              <View className="flex-1 min-w-[45%] bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="local-fire-department" size={20} color="#f97316" />
                  <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Reps</Text>
                </View>
                <Text className="text-3xl font-bold text-slate-900 dark:text-white">
                  {weeklyData.reduce((acc, curr) => acc + curr.reps, 0)}
                </Text>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-lg font-bold text-slate-900 dark:text-white mb-3">Daily Breakdown</Text>
              {weeklyData.map((day, i) => (
                <View key={i} className="flex-row items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl mb-3 border border-slate-200 dark:border-slate-700">
                  <View>
                    <Text className="text-sm font-bold text-slate-900 dark:text-white">{day._id}</Text>
                    <Text className="text-xs text-slate-500">{day.count} Workouts</Text>
                  </View>
                  <Text className="text-sm font-bold text-blue-500">{day.reps} Reps</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
