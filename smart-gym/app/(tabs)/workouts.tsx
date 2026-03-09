import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, ImageBackground, TouchableOpacity, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useWorkout } from '../../src/hooks/useWorkout';

export default function Workouts() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { searchExercises, startWorkout } = useWorkout();
  
  const { data: searchResults, isLoading: isSearching } = searchExercises(searchQuery);

  const handleStartWorkout = async (workoutId: string) => {
    try {
      await startWorkout(workoutId);
      // Navigate to workout camera
      router.push('/workout-camera' as any);
    } catch (e) {
      console.warn("Could not start workout", e);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 sticky top-0 z-10 bg-gray-50 dark:bg-slate-900">
        <TouchableOpacity className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
          <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-slate-900 dark:text-white text-lg font-bold flex-1 text-center">Workouts</Text>
        <TouchableOpacity className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
          <MaterialIcons name="filter-list" size={24} color="#9da6b9" />
        </TouchableOpacity>
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
        {isSearching && <ActivityIndicator style={{ marginTop: 8 }} />}
      </View>

      {/* Scrollable Content */}
      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Featured Workout (Hero) */}
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

        <View className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
        <Text className="text-slate-900 dark:text-white text-base font-bold px-1 mb-4">Today's Plan</Text>

        {/* Card 1: Pushups */}
        <TouchableOpacity className="flex-row items-stretch gap-4 rounded-xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-slate-100 dark:border-slate-700 mb-4">
          <ImageBackground 
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiJ7CD95YwRVabTp4Z-8hYYVm-WZPYq-PkeUGK3yT7Mqez_k0rqRhjq2Q5F3MczC4aOQOsNCLJdc3KmRic0tmcR7iYQJ0SMq46ANn_x0BSOgazjXtPl8fGcFSB0VagmhZ0VGXjTORbOoEz32_rqoE4AblOIEiDSpEXa25MT2OEEYzzoSJ4a61Qu7Tgs9anNOOXKnvi7DcM9CpQVy8pECKuB4FGNeC43bivUyf4o-jna7ZEoiQq1mBs30Usn7wUlb8hysEgsHAIbSs" }} 
            className="w-24 h-32 rounded-lg overflow-hidden shrink-0"
            resizeMode="cover"
          >
            <View className="absolute inset-0 bg-black/20" />
          </ImageBackground>
          <View className="flex-1 justify-between py-1">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-slate-900 dark:text-white text-lg font-bold">Pushups</Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Text className="text-slate-500 text-sm">Beginner</Text>
                  <Text className="text-slate-500 text-xs">•</Text>
                  <Text className="text-slate-500 text-sm">5 mins</Text>
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
                onPress={() => handleStartWorkout('pushups')}
              >
                <MaterialIcons name="play-arrow" size={18} color="white" />
                <Text className="text-white text-sm font-medium">Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        {/* Card 2: Squats */}
        <TouchableOpacity className="flex-row items-stretch gap-4 rounded-xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-slate-100 dark:border-slate-700 mb-4">
          <ImageBackground 
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuANtir1XsX_fl5X4u5DpB0RxPDKMf772MXl-y7k7G6198Kmru9oLZtoNE8ii6eJjhhnN3AdKUgTjc945XNRpX54VvGqDsz8PEXTg9Y2mkLsGL7vGNsSOb9qJHcx7qGzYJTBq0BpF2cmSORlAyYSPYjVTw_KLAI4U8J-Yzu9RrJfs0m74LT5GBq4lpIcUGot2LRixPg7zEU2-Ww18xzHAODf9WDmrqJEuXPYJ3FM4IgODP5APowlMsnX3twpDsWwNBz_fLuVBB0-xtg" }} 
            className="w-24 h-32 rounded-lg overflow-hidden shrink-0"
            resizeMode="cover"
          >
            <View className="absolute inset-0 bg-black/20" />
          </ImageBackground>
          <View className="flex-1 justify-between py-1">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-slate-900 dark:text-white text-lg font-bold">Squats</Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Text className="text-slate-500 text-sm">Intermediate</Text>
                  <Text className="text-slate-500 text-xs">•</Text>
                  <Text className="text-slate-500 text-sm">8 mins</Text>
                </View>
              </View>
              <View className="bg-indigo-100 dark:bg-indigo-500/20 px-2 py-1 rounded border border-indigo-200 dark:border-indigo-500/20 flex-row items-center gap-1">
                <MaterialIcons name="smart-toy" size={12} color="#4f46e5" />
                <Text className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">AI Tracked</Text>
              </View>
            </View>
            <View className="flex-row items-end justify-between mt-3">
              <View className="flex-row"></View>
              <TouchableOpacity 
                className="flex-row items-center justify-center rounded-full h-9 px-5 bg-blue-600 text-white gap-2 shadow-lg"
                onPress={() => handleStartWorkout('squats')}
              >
                <MaterialIcons name="play-arrow" size={18} color="white" />
                <Text className="text-white text-sm font-medium">Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Planks */}
        <TouchableOpacity className="flex-row items-stretch gap-4 rounded-xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-slate-100 dark:border-slate-700 mb-4">
          <ImageBackground 
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCXk7RoVIT4sAgLzxeUVkbJ2TzL3Y_JOvphgn9FZxwlSf59uE4kstaoeD3F8geZ-bE6rY-h8Iq49KgikBOJsGG5MkyMVewJZpueGuabwfkdTebNcgTZauQjo1gi5U4nr2MMn-gmwD7gd6CUGMsD8HJu0-SgDLeeBvWLaHPDOu0Plf5sHLTQFgaHzQOgUzThGW2BBJDBkmfnksyJ-UXIHZR2qFM2jgCWPVtexZh74WJIg_9nDxOCMDiHIh6gIJKgf3w8RnZJfg-L5A" }} 
            className="w-24 h-32 rounded-lg overflow-hidden shrink-0"
            resizeMode="cover"
          >
            <View className="absolute inset-0 bg-black/20" />
          </ImageBackground>
          <View className="flex-1 justify-between py-1">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-slate-900 dark:text-white text-lg font-bold">Planks</Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Text className="text-slate-500 text-sm">Beginner</Text>
                  <Text className="text-slate-500 text-xs">•</Text>
                  <Text className="text-slate-500 text-sm">3 mins</Text>
                </View>
              </View>
              <View className="bg-indigo-100 dark:bg-indigo-500/20 px-2 py-1 rounded border border-indigo-200 dark:border-indigo-500/20 flex-row items-center gap-1">
                <MaterialIcons name="smart-toy" size={12} color="#4f46e5" />
                <Text className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">AI Tracked</Text>
              </View>
            </View>
            <View className="flex-row items-end justify-between mt-3">
              <View className="flex-row"></View>
              <TouchableOpacity 
                className="flex-row items-center justify-center rounded-full h-9 px-5 bg-blue-600 text-white gap-2 shadow-lg"
                onPress={() => handleStartWorkout('planks')}
              >
                <MaterialIcons name="play-arrow" size={18} color="white" />
                <Text className="text-white text-sm font-medium">Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
