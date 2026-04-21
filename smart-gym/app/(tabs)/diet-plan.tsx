import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { aiService } from '../../src/services/aiService';
import { useAuthStore } from '../../src/store/authStore';

import { useDiet } from '../../src/hooks/useDiet';

export default function DietPlanScreen() {
    const { diet, isLoading, generatePlan, isGenerating, updatePreferences } = useDiet();
    const [intermittentFasting, setIntermittentFasting] = useState(false);

    const handleRegenerate = () => {
        generatePlan();
    };

    const handleUpdatePrefs = () => {
        updatePreferences({ intermittentFasting });
    };

    if (isLoading && !diet) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "black", alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#0df20d" />
                <Text className="text-white/50 mt-4">Cooking your plan...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <View className="flex-row items-center justify-between p-6 pt-4">
                <Text className="text-2xl font-bold text-white tracking-tight">Diet Plan</Text>
                <TouchableOpacity 
                    className="bg-primary/20 p-2 rounded-full border border-primary/30"
                    onPress={handleRegenerate}
                    disabled={isGenerating}
                >
                    <MaterialIcons name="refresh" size={24} color="#0df20d" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6 pb-20">
                <View className="bg-slate-900/50 rounded-3xl p-6 border border-white/5 mb-8">
                    <View className="flex-row items-center gap-2 mb-6">
                        <MaterialIcons name="analytics" size={20} color="#0df20d" />
                        <Text className="text-white font-bold opacity-80">Daily Targets</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-white">{diet?.dailyCalories || 1850}</Text>
                            <Text className="text-[10px] text-white/40 uppercase font-bold mt-1">Calories</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-white">{diet?.protein || 160}g</Text>
                            <Text className="text-[10px] text-white/40 uppercase font-bold mt-1">Protein</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-white">{diet?.carbs || 210}g</Text>
                            <Text className="text-[10px] text-white/40 uppercase font-bold mt-1">Carbs</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-white">{diet?.fats || 55}g</Text>
                            <Text className="text-[10px] text-white/40 uppercase font-bold mt-1">Fats</Text>
                        </View>
                    </View>
                </View>

                <Text className="text-lg font-bold text-white mb-6 px-1">Today&apos;s Meals</Text>

                {(diet?.meals || []).map((meal: any, idx: number) => (
                    <View key={idx} className="bg-slate-900/40 rounded-3xl border border-white/5 mb-4 overflow-hidden">
                        <View className="flex-row p-4 items-center">
                            <View className="w-16 h-16 bg-slate-800 rounded-2xl items-center justify-center mr-4">
                                <MaterialIcons name="restaurant" size={28} color="#0df20d" />
                            </View>
                            <View className="flex-1">
                                <View className="mb-1">
                                    <Text className="text-white font-bold text-base pr-2" numberOfLines={2}>{meal.name}</Text>
                                </View>
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-white/40 text-xs flex-1 pr-2" numberOfLines={1}>{meal.description}</Text>
                                    <Text className="text-primary font-bold text-xs">{meal.calories} kcal</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}

                <View className="bg-slate-900/50 rounded-3xl p-6 border border-white/5 mt-8 mb-10">
                    <Text className="text-white font-bold mb-6">Preferences</Text>
                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-white font-medium">Intermittent Fasting</Text>
                            <Text className="text-white/40 text-[10px]">Adjust calorie windows automatically</Text>
                        </View>
                        <Switch 
                            value={intermittentFasting}
                            onValueChange={setIntermittentFasting}
                            trackColor={{ false: '#334155', true: '#0df20d' }}
                            thumbColor="white"
                        />
                    </View>
                    <TouchableOpacity 
                        className="bg-primary py-4 rounded-2xl items-center"
                        onPress={handleUpdatePrefs}
                    >
                        <Text className="text-black font-bold">Update Preferences</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
