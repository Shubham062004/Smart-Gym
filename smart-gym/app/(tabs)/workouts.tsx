import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, ImageBackground, TouchableOpacity, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useWorkout } from '../../src/hooks/useWorkout';

export default function Workouts() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { searchResults, isSearching, startWorkout, todayWorkout, isLoadingToday } = useWorkout(searchQuery);

  const handleStartWorkout = async (workoutId: string) => {
    try {
      await startWorkout(workoutId);
      router.push('/workout-camera' as any);
    } catch (e) {
      console.warn("Could not start workout", e);
    }
  };

  const workoutsToDisplay = searchQuery ? searchResults : todayWorkout;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 sticky top-0 z-10 bg-gray-50 dark:bg-slate-900">
        <TouchableOpacity className="w-12 h-12 flex items-center justify-center rounded-full" onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-slate-900 dark:text-white text-lg font-bold flex-1 text-center">Workouts</Text>
        <View className="w-12" />
      </View>

      {/* Search Bar */}
      <View className="px-4 py-2 bg-gray-50 dark:bg-slate-900 z-10">
        <View className="flex-row w-full h-12 items-center bg-white dark:bg-slate-800 rounded-xl shadow-sm px-4">
          <MaterialIcons name="search" size={24} color="#9da6b9" />
          <TextInput 
            className="flex-1 ml-2 text-base text-slate-900 dark:text-white h-full"
            placeholder="Search exercises"
            placeholderTextColor="#9da6b9"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {(isSearching || isLoadingToday) && <ActivityIndicator style={{ marginTop: 8 }} />}
      </View>

      {/* Scrollable Content */}
      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Featured Workout (Hero) */}
        {!searchQuery && (
          <TouchableOpacity className="w-full h-48 rounded-xl overflow-hidden mb-4">
            <ImageBackground 
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkspqenVL7k2eDqEgd5QgXFH4BG-f6VlrWVfW_P8J7HDIT9-h4i4Q9Sx73dQpq-aQI-u92jbuyuQy67ow1-Ebtb1vMaiXCihet3Tu2u2O1EmTnokiQ-2BO27BGQtIdtZeMtVZJmPDHcrEWuML4fiv1KiA_PJDMD_iSs73M9ZTWteaWkvPGkkjzHHjbKtVicEZjDaidcN6I_ZYpe7SIQH-LgJywvwv4W91yARCLWjQ945r4Ipl_sEOS4oBY0awIZjoUIsFROkmziEg" }} 
              className="w-full h-full"
              resizeMode="cover"
            >
              <View className="absolute inset-0 bg-black/40" />
              <View className="absolute bottom-0 left-0 p-4 w-full flex-row justify-between items-end">
                <View>
                  <View className="bg-white/20 px-2 py-1 mb-2 rounded-md self-start">
                    <Text className="text-xs font-semibold tracking-wide text-blue-400 uppercase">Trending</Text>
                  </View>
                  <Text className="text-white text-xl font-bold">Full Body Crush</Text>
                  <Text className="text-gray-300 text-sm mt-1">Advanced • 45 mins</Text>
                </View>
                <View className="bg-blue-600 rounded-full p-3 shadow-lg">
                  <MaterialIcons name="play-arrow" size={24} color="white" />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}

        <View className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
        <Text className="text-slate-900 dark:text-white text-base font-bold px-1 mb-4">
          {searchQuery ? 'Search Results' : "Today's Plan"}
        </Text>

        {(workoutsToDisplay || []).map((item: any) => (
          <TouchableOpacity key={item.id || item._id} className="flex-row items-stretch gap-4 rounded-xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-slate-100 dark:border-slate-700 mb-4">
            <ImageBackground 
              source={{ uri: item.image || item.imageUrl || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop" }} 
              className="w-24 h-32 rounded-lg overflow-hidden shrink-0"
              resizeMode="cover"
            >
              <View className="absolute inset-0 bg-black/20" />
            </ImageBackground>
            <View className="flex-1 justify-between py-1">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-slate-900 dark:text-white text-lg font-bold">{item.name}</Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <Text className="text-slate-500 text-sm">{item.difficulty}</Text>
                    <Text className="text-slate-500 text-xs">•</Text>
                    <Text className="text-slate-500 text-sm">{item.duration}{typeof item.duration === 'number' ? ' mins' : ''}</Text>
                  </View>
                </View>
                <View className="bg-indigo-100 dark:bg-indigo-500/20 px-2 py-1 rounded border border-indigo-200 dark:border-indigo-500/20 flex-row items-center gap-1">
                  <MaterialIcons name="smart-toy" size={12} color="#4f46e5" />
                  <Text className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">AI Tracked</Text>
                </View>
              </View>
              <View className="flex-row items-end justify-between mt-3">
                <View className="flex-row -space-x-2">
                  <View className="w-6 h-6 rounded-full bg-slate-700 border-2 border-white flex items-center justify-center"><Text className="text-[8px] text-white">JD</Text></View>
                  <View className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center"><Text className="text-[8px] text-white">+3</Text></View>
                </View>
                <TouchableOpacity 
                  className="flex-row items-center justify-center rounded-full h-9 px-5 bg-blue-600 text-white gap-2 shadow-lg"
                  onPress={() => handleStartWorkout(item.id || item._id)}
                >
                  <MaterialIcons name="play-arrow" size={18} color="white" />
                  <Text className="text-white text-sm font-medium">Start</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {!workoutsToDisplay?.length && !isSearching && !isLoadingToday && (
          <Text className="text-slate-500 text-center py-10">No workouts found.</Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
