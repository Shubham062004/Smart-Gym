import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, ImageBackground, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useWorkout } from '../../src/hooks/useWorkout';
import { LinearGradient } from 'expo-linear-gradient';

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
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-6 bg-black border-b border-white/5">
        <TouchableOpacity 
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold tracking-tight">Workouts</Text>
        <View className="w-10" />
      </View>

      {/* Search Bar */}
      <View className="px-6 py-4 bg-black">
        <View className="flex-row w-full h-14 items-center bg-white/5 border border-white/10 rounded-2xl px-4 shadow-sm">
          <MaterialIcons name="search" size={22} color="#64748b" />
          <TextInput 
            className="flex-1 ml-3 text-base text-white font-medium"
            placeholder="Search exercises..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {(isSearching || isLoadingToday) && (
            <ActivityIndicator style={{ marginTop: 12 }} color="#0df20d" />
        )}
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Featured Section */}
        {!searchQuery && (
          <View className="mb-10">
            <Text className="text-white/40 text-[10px] uppercase font-bold tracking-[2px] mb-4">Recommended for you</Text>
            <TouchableOpacity 
              className="w-full h-64 rounded-[40px] overflow-hidden shadow-2xl shadow-primary/20"
              onPress={() => handleStartWorkout('featured_id')}
            >
              <ImageBackground 
                source={{ uri: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800" }} 
                className="w-full h-full"
                resizeMode="cover"
              >
                <View className="absolute inset-0 bg-black/40" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} className="absolute inset-0 p-8 justify-end">
                    <View className="flex-row items-center gap-2 mb-3">
                        <View className="bg-primary/20 p-2 rounded-lg border border-primary/30">
                            <MaterialIcons name="bolt" size={16} color="#0df20d" />
                        </View>
                        <Text className="text-primary font-bold text-xs uppercase tracking-widest">Master Class</Text>
                    </View>
                    <Text className="text-white text-3xl font-black">Full Body Intensity</Text>
                    <View className="flex-row items-center gap-4 mt-2">
                        <Text className="text-white/60 text-sm font-bold">Hard • 45 MIN</Text>
                    </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        )}

        <View className="flex-row items-center justify-between mb-6">
            <Text className="text-lg font-bold text-white">
                {searchQuery ? 'Search Results' : "Full Library"}
            </Text>
            <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center border border-white/10">
                <MaterialIcons name="filter-list" size={16} color="white" />
            </View>
        </View>

        {Array.isArray(workoutsToDisplay) && workoutsToDisplay.length > 0 ? workoutsToDisplay.map((item: any) => (
          <TouchableOpacity 
            key={item.id || item._id} 
            className="bg-white/5 rounded-[32px] p-2 mb-4 border border-white/10 shadow-sm"
            onPress={() => item.isLocked ? null : handleStartWorkout(item.id || item._id)}
          >
            <View className="flex-row items-center gap-4">
                <View className="w-24 h-24 rounded-[24px] overflow-hidden bg-white/5 border border-white/10">
                    <ImageBackground 
                        source={{ uri: item.image || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300" }}
                        className="w-full h-full"
                    >
                        {item.isLocked && (
                            <View className="absolute inset-0 bg-black/60 items-center justify-center">
                                <MaterialIcons name="lock" size={24} color="#64748b" />
                            </View>
                        )}
                    </ImageBackground>
                </View>
                <View className="flex-1 pr-2">
                    <Text className={`text-base font-bold mb-1 ${item.isLocked ? 'text-white/30' : 'text-white'}`}>{item.name}</Text>
                    <View className="flex-row items-center gap-2">
                        <Text className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{item.difficulty}</Text>
                        <Text className="text-white/20">•</Text>
                        <Text className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{item.duration} MIN</Text>
                    </View>
                    <View className="mt-3 flex-row items-center gap-1.5 self-start bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                         <MaterialIcons name="center-focus-weak" size={10} color="#0df20d" />
                         <Text className="text-[9px] font-bold text-primary uppercase">AI Tracked</Text>
                    </View>
                </View>
                <View className="pr-4">
                    <View className={`w-10 h-10 rounded-full items-center justify-center ${item.isLocked ? 'bg-white/5' : 'bg-primary shadow-lg shadow-primary/20'}`}>
                        <MaterialIcons name={item.isLocked ? "lock" : "play-arrow"} size={24} color={item.isLocked ? "#334155" : "black"} />
                    </View>
                </View>
            </View>
          </TouchableOpacity>
        )) : (
            <View className="py-20 items-center opacity-40">
                <MaterialIcons name="search-off" size={48} color="white" />
                <Text className="text-white mt-4 font-bold text-xs uppercase tracking-widest">No matching workouts</Text>
            </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
