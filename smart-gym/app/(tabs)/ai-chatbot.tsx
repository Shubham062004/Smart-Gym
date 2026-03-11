import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function AIChatbotScreen() {
    return (
        <SafeAreaView className="flex-1 bg-slate-900 border-t border-slate-800">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                {/* Header */}
                <View className="flex-row items-center px-4 py-3 bg-slate-900 border-b border-slate-800">
                    <TouchableOpacity className="p-2 -ml-2">
                        <MaterialIcons name="arrow-back" size={24} color="#94a3b8" />
                    </TouchableOpacity>
                    <View className="flex-1 flex-row items-center ml-2">
                        <View className="relative">
                            <View className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <Text className="text-white font-bold text-lg">AI</Text>
                            </View>
                            <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></View>
                        </View>
                        <View className="ml-3">
                            <Text className="text-sm font-semibold text-white">AI Coach</Text>
                            <Text className="text-xs text-slate-400">Online AI Trainer</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                {/* Chat Area */}
                <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 20 }}>
                    {/* AI Welcome */}
                    <View className="flex-row items-end space-x-2 mb-6">
                        <View className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                            <Text className="text-[10px] font-bold text-white">AI</Text>
                        </View>
                        <View className="bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-none max-w-[80%]">
                            <Text className="text-sm text-white leading-relaxed">
                                Hello! I'm your OnlyFitness AI Coach. How can I help you reach your goals today? I can create workouts, track macros, or analyze your progress.
                            </Text>
                        </View>
                    </View>

                    {/* User Msg */}
                    <View className="flex-row justify-end mb-6">
                        <View className="bg-blue-500 px-4 py-3 rounded-2xl rounded-br-none max-w-[80%]">
                            <Text className="text-sm text-white leading-relaxed">
                                I want a quick 20-minute bodyweight workout for upper body.
                            </Text>
                        </View>
                    </View>

                    {/* AI Resp */}
                    <View className="flex-row items-start space-x-2 mb-6">
                        <View className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2 mt-1">
                            <Text className="text-[10px] font-bold text-white">AI</Text>
                        </View>
                        <View className="flex-col w-full flex-1">
                            <View className="bg-slate-700 px-4 py-3 rounded-2xl rounded-tl-none self-start mb-3 max-w-[90%]">
                                <Text className="text-sm text-white leading-relaxed">
                                    Great choice! Here is a high-intensity upper body routine you can do anywhere.
                                </Text>
                            </View>

                            {/* Workout Card */}
                            <View className="w-full max-w-[280px] bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
                                <View className="bg-slate-700/50 p-3 border-b border-slate-700">
                                    <View className="flex-row items-center mb-1">
                                        <Text className="mr-2 text-blue-500">⚡</Text>
                                        <Text className="font-semibold text-sm text-white">Upper Body Blitz</Text>
                                    </View>
                                    <Text className="text-xs text-slate-400">20 Mins • Bodyweight • Beginner</Text>
                                </View>
                                <View className="p-3">
                                    <View className="flex-row justify-between items-center mb-2">
                                        <Text className="text-xs text-slate-300">Push-ups</Text>
                                        <Text className="text-xs font-mono text-blue-500">3 x 15</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center mb-2">
                                        <Text className="text-xs text-slate-300">Tricep Dips</Text>
                                        <Text className="text-xs font-mono text-blue-500">3 x 12</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center mb-3">
                                        <Text className="text-xs text-slate-300">Plank Shoulder Taps</Text>
                                        <Text className="text-xs font-mono text-blue-500">3 x 20</Text>
                                    </View>
                                    <TouchableOpacity className="w-full py-2 bg-blue-500 rounded-lg items-center mt-2">
                                        <Text className="text-xs font-bold text-white">START WORKOUT</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer Input */}
                <View className="p-4 bg-slate-900 border-t border-slate-800">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                        <TouchableOpacity className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full mr-2">
                            <Text className="text-xs font-medium text-slate-300">Create workout plan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full mr-2">
                            <Text className="text-xs font-medium text-slate-300">Generate diet plan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full mr-2">
                            <Text className="text-xs font-medium text-slate-300">Log Calories</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <View className="flex-row items-center pt-2">
                        <View className="flex-1 flex-row items-center bg-slate-800 rounded-full px-4 py-2 border border-slate-700">
                            <TouchableOpacity className="mr-2">
                                <MaterialIcons name="attach-file" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                            <TextInput 
                                className="flex-1 text-sm text-white pt-2 pb-2 h-10 w-full"
                                placeholder="Type a message..."
                                placeholderTextColor="#64748b"
                            />
                            <TouchableOpacity className="ml-2">
                                <MaterialIcons name="mic" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center ml-3 shadow-lg shadow-blue-500/20">
                            <MaterialIcons name="send" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
