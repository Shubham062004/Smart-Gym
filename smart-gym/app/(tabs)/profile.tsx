import React from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { useDashboard } from '../../src/hooks/useDashboard';

export default function Profile() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { summary } = useDashboard();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-gray-50/80 dark:bg-slate-900/80 z-50">
        <TouchableOpacity className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
          <MaterialIcons name="arrow-back" size={24} color="#0f172a" className="dark:color-white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Profile</Text>
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center"
          onPress={() => router.push('/settings' as any)}
        >
          <MaterialIcons name="settings" size={24} color="#0f172a" className="dark:color-white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 gap-8" contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Profile Hero Section */}
        <View className="flex-col items-center pt-4">
          <View className="relative">
            <View className="w-32 h-32 rounded-full border-4 border-blue-600 p-1">
              <ImageBackground 
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRZcMjBAEU9n4ETXBaU6Mm1aBgyYpsBUtbQBdmeV8Zyo0g5Ouo42VlfALOTKRvWD4yI061ZrqAMifn5KRmqweyLR2fFiQXDYK7G7rxI90uoO9nAETHGEitHSmY2q73qzKcvSzfXLGTkyi0dT2DZbHtq1RNG6Alz_Z3flPVnpsAxli88z-ojRHkrt5Z0vEhHoFBZpaqUsl4a_cQeQCe6nSFERfe4SBZ8yp-yXWJmE_sKqV2nWSZFtMgbpy7QWikR_cR2UlzWzUl6Zw" }} 
                className="w-full h-full rounded-full overflow-hidden" 
              />
            </View>
            <TouchableOpacity className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full shadow-lg border-2 border-slate-900">
              <MaterialIcons name="edit" size={14} color="white" />
            </TouchableOpacity>
          </View>
          <View className="mt-4 items-center">
            <Text className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || 'User'}</Text>
            <Text className="text-slate-500 dark:text-slate-400 font-medium">Intermediate Athlete</Text>
            <View className="mt-2 flex-row items-center gap-1.5 bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full">
              <MaterialIcons name="verified" size={12} color="#2563eb" />
              <Text className="text-blue-600 text-xs font-bold uppercase tracking-wider">Pro Member</Text>
            </View>
          </View>
        </View>

        {/* Body Stats */}
        <View className="flex-row gap-3 my-4">
          <View className="flex-1 bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex-col items-center bg-white dark:bg-slate-800 shadow-sm">
            <Text className="text-slate-400 text-xs font-medium uppercase">Age</Text>
            <Text className="text-xl font-bold mt-1 text-slate-900 dark:text-white">{user?.age || '-'}</Text>
          </View>
          <View className="flex-1 bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex-col items-center bg-white dark:bg-slate-800 shadow-sm">
            <Text className="text-slate-400 text-xs font-medium uppercase">Height</Text>
            <Text className="text-xl font-bold mt-1 text-slate-900 dark:text-white">{user?.height || '-'}<Text className="text-xs ml-0.5">cm</Text></Text>
          </View>
          <View className="flex-1 bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex-col items-center bg-white dark:bg-slate-800 shadow-sm">
            <Text className="text-slate-400 text-xs font-medium uppercase">Weight</Text>
            <Text className="text-xl font-bold mt-1 text-slate-900 dark:text-white">{user?.weight || '-'}<Text className="text-xs ml-0.5">kg</Text></Text>
          </View>
        </View>

        {/* Fitness Statistics */}
        <View className="flex-col gap-3">
          <Text className="text-lg font-bold px-1 text-slate-900 dark:text-white">Fitness Statistics</Text>
          <View className="flex-row gap-4">
            <View className="flex-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-xl p-4">
              <View className="flex-row justify-between items-start mb-2">
                <MaterialIcons name="fitness-center" size={24} color="#2563eb" />
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs text-green-500 font-bold">+12%</Text>
                  <MaterialIcons name="trending-up" size={10} color="#22c55e" />
                </View>
              </View>
              <Text className="text-2xl font-bold text-slate-900 dark:text-white">{summary?.weeklyActivity ? summary.weeklyActivity.reduce((a:number, b:number) => a+b, 0) : 0}</Text>
              <Text className="text-slate-500 text-xs font-medium">Weekly Workouts</Text>
            </View>
            <View className="flex-1 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900 rounded-xl p-4">
              <View className="flex-row justify-between items-start mb-2">
                <MaterialIcons name="local-fire-department" size={24} color="#f97316" />
              </View>
              <Text className="text-2xl font-bold text-slate-900 dark:text-white">{summary?.caloriesBurned || 0}</Text>
              <Text className="text-slate-500 text-xs font-medium">Calories Burned</Text>
            </View>
          </View>
        </View>

        {/* Streak Section */}
        <View className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm mt-4 border border-slate-200 dark:border-slate-700">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="bolt" size={24} color="#f97316" />
              <Text className="font-bold text-slate-900 dark:text-white">{summary?.streak || 0} Day Streak</Text>
            </View>
            <Text className="text-blue-600 text-xs font-bold">{summary?.streak && summary.streak > 0 ? 'Keep it up!' : 'Start today!'}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            {['M','T','W','T','F','S','S'].map((day, i) => {
              const isActive = summary?.weeklyActivity && summary.weeklyActivity[i] > 0;
              return (
              <View key={i} className="flex-col items-center gap-2">
                <View className={`w-8 h-8 rounded-full ${isActive ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'} flex items-center justify-center`}>
                  <Text className={`text-xs ${isActive ? 'text-white' : 'text-slate-400'}`}>{day}</Text>
                </View>
              </View>
            )})}
          </View>
        </View>

        {/* Goal Settings */}
        <View className="flex-col gap-3 mt-4">
          <Text className="text-lg font-bold px-1 text-slate-900 dark:text-white">Goal Settings</Text>
          <View className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
            <View className="flex-row justify-between items-center p-4">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="emoji-events" size={20} color="#94a3b8" />
                <Text className="text-sm font-medium text-slate-900 dark:text-white">Primary Goal</Text>
              </View>
              <Text className="text-blue-600 text-sm font-bold">Muscle Gain</Text>
            </View>
            <View className="flex-row justify-between items-center p-4">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="calendar-month" size={20} color="#94a3b8" />
                <Text className="text-sm font-medium text-slate-900 dark:text-white">Weekly Commitment</Text>
              </View>
              <Text className="text-blue-600 text-sm font-bold">4 days/week</Text>
            </View>
            <View className="flex-row justify-between items-center p-4">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="favorite" size={20} color="#94a3b8" />
                <Text className="text-sm font-medium text-slate-900 dark:text-white">Target Heart Rate</Text>
              </View>
              <Text className="text-blue-600 text-sm font-bold">145 BPM</Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <View className="pt-4 pb-4">
          <TouchableOpacity className="w-full bg-blue-600 items-center justify-center py-4 rounded-xl shadow-lg" onPress={() => router.push('/edit-profile' as any)}>
            <Text className="text-white font-bold text-lg">Update Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
