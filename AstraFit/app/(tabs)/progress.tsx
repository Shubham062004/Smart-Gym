import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axiosClient from '../../src/api/axiosClient';

const { width } = Dimensions.get('window');

export default function Progress() {
  const router = useRouter();
  const [progressData, setProgressData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axiosClient.get('progress/weekly');
        setProgressData(response.data.data || response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View className="flex-row items-center justify-between p-6 bg-black border-b border-white/5">
        <TouchableOpacity 
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white tracking-tight">Performance Analytics</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        {isLoading ? (
          <View className="mt-20">
            <ActivityIndicator size="large" color="#0df20d" />
            <Text className="text-white/40 text-center mt-4 uppercase tracking-widest text-[10px] font-bold">Fetching Analytics...</Text>
          </View>
        ) : (
          <>
            <View className="flex-row gap-4 mb-8">
              <View className="flex-1 bg-white/5 border border-white/10 p-5 rounded-[32px]">
                 <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Avg Score</Text>
                 <Text className="text-4xl font-black text-primary">{progressData?.averageScore || 0}%</Text>
              </View>
              <View className="flex-1 bg-white/5 border border-white/10 p-5 rounded-[32px]">
                 <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Streak</Text>
                 <View className="flex-row items-center gap-1">
                    <Text className="text-4xl font-black text-orange-500">{progressData?.streak || 0}</Text>
                    <MaterialIcons name="bolt" size={20} color="#f97316" />
                 </View>
              </View>
            </View>

            <View className="mb-10">
              <Text className="text-lg font-bold text-white mb-6 px-1">Weekly Intensity</Text>
              <View className="bg-white/5 border border-white/10 rounded-[40px] p-8">
                <View className="h-44 flex-row items-end justify-between gap-3">
                    {Array.isArray(progressData?.chartData) && progressData.chartData.length > 0 ? progressData.chartData.map((day: any, i: number) => {
                        const maxVal = Math.max(...progressData.chartData.map((d: any) => d.value), 1);
                        const height = (day.value / maxVal) * 100;

                        return (
                            <View key={i} className="items-center flex-1 h-full gap-4">
                                <View className="w-full bg-white/5 rounded-full flex-1 justify-end overflow-hidden">
                                    <View 
                                        className="w-full bg-primary rounded-full shadow-lg shadow-primary/20" 
                                        style={{ height: `${Math.max(10, height)}%` }} 
                                    />
                                </View>
                                <Text className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{day.label}</Text>
                            </View>
                        )
                    }) : (
                        <View className="w-full h-full items-center justify-center">
                             <Text className="text-white/20 uppercase font-bold text-[10px] tracking-widest">No activity recorded</Text>
                        </View>
                    )}
                </View>
              </View>
            </View>

            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-6 px-1">
                <Text className="text-lg font-bold text-white">Recent Sessions</Text>
                <TouchableOpacity>
                   <Text className="text-xs font-bold text-primary uppercase">Export</Text>
                </TouchableOpacity>
              </View>

              {Array.isArray(progressData?.workoutHistory) && progressData.workoutHistory.length > 0 ? progressData.workoutHistory.map((session: any, i: number) => (
                <View key={i || session.id} className="flex-row items-center justify-between p-5 bg-white/5 rounded-3xl mb-4 border border-white/10">
                  <View className="flex-row items-center gap-4">
                    <View className="w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center border border-primary/20">
                       <MaterialIcons name="fitness-center" size={20} color="#0df20d" />
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-white">{session.exercise}</Text>
                      <Text className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                          {new Date(session.date).toLocaleDateString()} • {session.accuracy}% ACCURACY
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-black text-white">{session.reps}</Text>
                    <Text className="text-[10px] font-bold text-white/30 uppercase">Reps</Text>
                  </View>
                </View>
              )) : (
                 <View className="bg-white/5 border border-white/5 border-dashed p-10 rounded-3xl items-center">
                    <Text className="text-white/20 font-bold uppercase text-[10px] tracking-widest">No history yet</Text>
                 </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
