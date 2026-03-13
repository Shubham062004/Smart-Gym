import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../src/store/authStore';
import { useWorkout } from '../../src/hooks/useWorkout';
import { useDashboard } from '../../src/hooks/useDashboard';

export default function Homepage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { todayWorkout, isLoadingToday, startWorkout } = useWorkout();
  const { summary, quickWorkouts, isLoadingSummary } = useDashboard();

  const handleStartWorkout = async (workoutId: string) => {
    try {
      await startWorkout(workoutId);
      router.push('/workout-camera' as any);
    } catch (e) {
      console.warn("Could not start workout", e);
    }
  };

  if (isLoadingSummary) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <ScrollView className="flex-1 pb-20">
        {/* Header Section */}
        <View className="flex-row items-center justify-between p-6 pt-4">
          <TouchableOpacity className="flex-row items-center gap-3" onPress={() => router.push('/profile')}>
            <View className="relative">
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC9UnceYa6FTFVwFTia-jGG_CwQkFNcydm0WV-sE4r1Qs1KV9KWA2D3Bh8RYOY7NIrw0YjlzZFNgWyeGF4IVFyrxVm0NpNn6_lnUQpVELI4k924BS2On2vlENe09aYz1h1xvcHlM2MB5FVFEulBD79msj0Zl4YBPnpNrgI1OUsTHglSY5lnAFlRlYvday4rDlL16SPWxreYzclZ4RrZRK4TxT-g94j7W_nR42bk_-7UU-NPsnvB2Z2U0F3nxZiemhX8-BVXp2lXO0' }} 
                className="w-12 h-12 rounded-full border-2 border-primary" 
              />
              <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" />
            </View>
            <View>
              <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">Welcome back,</Text>
              <Text className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{user?.fullName || 'User'}</Text>
            </View>
          </TouchableOpacity>
          <View className="flex-row items-center gap-1.5 bg-orange-100 dark:bg-orange-500/20 px-3 py-1.5 rounded-full border border-orange-500/20">
            <MaterialIcons name="local-fire-department" size={20} color="#f97316" />
            <Text className="text-sm font-bold text-orange-600 dark:text-orange-400">12</Text>
          </View>
        </View>

        {/* Today's Summary */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-lg font-bold text-slate-900 dark:text-white">Today's Summary</Text>
            <View className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                <Text className="text-xs font-normal text-slate-500">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
            </View>
          </View>
          
          <View className="flex-col gap-4">
            {/* Main Stat Card */}
            <View className="bg-primary rounded-xl p-5 shadow-lg relative overflow-hidden shadow-primary/20">
              <View className="absolute top-0 right-0 p-3 opacity-10">
                <MaterialIcons name="fitness-center" size={100} color="black" />
              </View>
              <View className="relative z-10">
                <Text className="text-black/60 font-medium mb-1 uppercase tracking-widest text-[10px]">Total Reps</Text>
                <View className="flex-row items-end gap-2">
                  <Text className="text-5xl font-black tracking-tighter text-black">{summary?.totalReps || 0}</Text>
                  <Text className="text-sm font-bold text-black/60 mb-2">
                    {summary?.totalReps > 0 ? 'KEEP IT UP!' : 'READY?'}
                  </Text>
                </View>
                <View className="mt-4 w-full bg-black/10 rounded-full h-2">
                  <View className="bg-black h-2 rounded-full" style={{ width: `${Math.min((summary?.totalReps || 0) / 100 * 100, 100)}%` }} />
                </View>
              </View>
            </View>
            
            <View className="flex-row gap-4">
              {/* Secondary Stats */}
              <View className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="p-2 bg-primary/10 rounded-lg">
                    <MaterialIcons name="timer" size={20} color="#0df20d" />
                  </View>
                </View>
                <View>
                  <Text className="text-2xl font-bold text-slate-900 dark:text-white">{summary?.durationMinutes || 0} <Text className="text-xs font-normal text-slate-400">min</Text></Text>
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Duration</Text>
                </View>
              </View>
              
              <View className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="p-2 bg-orange-500/10 rounded-lg">
                    <MaterialIcons name="local-fire-department" size={20} color="#f97316" />
                  </View>
                </View>
                <View>
                  <Text className="text-2xl font-bold text-slate-900 dark:text-white">{summary?.caloriesBurned || 0} <Text className="text-xs font-normal text-slate-400">kcal</Text></Text>
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Burned</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Start */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <Text className="text-lg font-bold text-slate-900 dark:text-white">Quick Start</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/workouts')}>
                <Text className="text-sm font-bold text-primary">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
            {Array.isArray(quickWorkouts) && quickWorkouts.map((workout: any) => (
              <TouchableOpacity 
                key={workout.id || workout._id} 
                className="w-40 bg-white dark:bg-slate-800 rounded-2xl p-2 border border-slate-200 dark:border-slate-700 shadow-sm"
                onPress={() => handleStartWorkout(workout.id || workout._id)}
              >
                <View className="h-28 w-full bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden relative">
                  <Image source={{ uri: workout.image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500' }} className="w-full h-full absolute" />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} className="absolute inset-0 justify-end p-2">
                     <View className="w-8 h-8 bg-primary rounded-full items-center justify-center">
                        <MaterialIcons name="play-arrow" size={20} color="black" />
                     </View>
                  </LinearGradient>
                </View>
                <View className="p-2">
                  <Text className="font-bold text-sm text-slate-900 dark:text-white mb-1" numberOfLines={1}>{workout.name}</Text>
                  <View className="flex-row items-center gap-1">
                    <Text className="text-[10px] font-bold text-slate-400 uppercase">{workout.difficulty || 'Beginner'}</Text>
                    <Text className="text-[10px] text-slate-400">•</Text>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase">{workout.duration || 5} MIN</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Weekly Progress */}
        <View className="px-6 mb-10">
          <Text className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Weekly Activity</Text>
          <View className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <View className="flex-row items-center justify-between mb-8">
              <View>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sessions</Text>
                <Text className="text-2xl font-black text-slate-900 dark:text-white">
                    {Array.isArray(summary?.weeklyActivity) ? summary.weeklyActivity.reduce((a: number, b: number) => a + b, 0) : 0}
                </Text>
              </View>
              <View className="bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                <Text className="text-primary text-[10px] font-bold uppercase tracking-widest">Active Week</Text>
              </View>
            </View>
            
            <View className="flex-row items-end justify-between h-32 gap-3">
              {['M','T','W','T','F','S','S'].map((day, idx) => {
                const val = Array.isArray(summary?.weeklyActivity) ? summary.weeklyActivity[idx] : 0;
                const maxVal = Math.max(...(Array.isArray(summary?.weeklyActivity) ? summary.weeklyActivity : [1]), 1);
                const heightPercent = (val / maxVal) * 100;
                
                return (
                    <View key={idx} className="flex-1 items-center gap-3 h-full">
                        <View className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-full justify-end overflow-hidden">
                            <View 
                                className={`w-full rounded-full ${val > 0 ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} 
                                style={{ height: `${val > 0 ? heightPercent : 0}%`, minHeight: val > 0 ? 10 : 0 }} 
                            />
                        </View>
                        <Text className={`text-[10px] font-black ${val > 0 ? 'text-primary' : 'text-slate-400'}`}>{day}</Text>
                    </View>
                )
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
