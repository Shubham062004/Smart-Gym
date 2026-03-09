import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Svg, Path, Circle } from 'react-native-svg';

export default function WorkoutCameraScreen() {
    const router = useRouter();

    const handleFinish = () => {
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0a0f0a]">
            {/* Camera View Area */}
            <View className="flex-1 relative">
                <ImageBackground 
                    source={{uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEWd02uNOl2roZUKE6Dum_h0m5jtb8FY4LvQRDAcLRwrG5OPeAQlfE1raWED8cO5IA2yWdtFzlIxuKnt5NA6cxIZV5sICxdPyn1UuP-KTu_SUh724obUW4is00wcHvzANHaLg_S0Zy_7hF5o3TFsVgMkecu4ZZ8uHDWghxQGA9vLRaXy9Ge1no15Y6tLE2m9X5dW_M1HHVx-VtgZF1HIi9SQ8xrhoQLNfwVe5bbNMi7lbwBtPdAACrg298ZwPW7osB3Y1SXwWE__8'}}
                    className="absolute inset-0 w-full h-full justify-start z-0"
                    resizeMode="cover"
                >
                    <View className="absolute inset-0 bg-black/40" />

                    {/* SVG Skeleton Overlay - Simplified version of what's possible in pure RN SVG */}
                    <View className="absolute inset-0 items-center justify-center opacity-70 pointer-events-none mt-20">
                        <Svg width="375" height="400" viewBox="0 0 375 812" style={{ position: 'absolute' }}>
                            <Path d="M187 200 L187 350 M187 350 L140 350 L120 450 L130 550 M187 350 L234 350 L254 450 L244 550" fill="none" stroke="#0df20d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                            <Circle cx="187" cy="180" r="25" fill="none" stroke="#0df20d" strokeWidth="4" />
                            <Circle cx="187" cy="350" r="5" fill="#0df20d" />
                            <Circle cx="140" cy="350" r="5" fill="#0df20d" />
                            <Circle cx="234" cy="350" r="5" fill="#0df20d" />
                            <Circle cx="120" cy="450" r="5" fill="#0df20d" />
                            <Circle cx="254" cy="450" r="5" fill="#0df20d" />
                        </Svg>
                    </View>
                </ImageBackground>

                {/* Header Controls */}
                <View className="flex-row justify-between items-start pt-4 px-6 z-20">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/10 backdrop-blur-xl border border-white/10 p-2.5 rounded-full">
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <View className="items-center">
                        <View className="bg-[#0df20d]/20 px-4 py-1.5 rounded-full border border-[#0df20d]/30 flex-row items-center gap-2 mb-1">
                            <View className="w-2 h-2 rounded-full bg-[#0df20d]"></View>
                            <Text className="text-[#0df20d] font-bold text-[10px] uppercase tracking-widest">Live Tracking</Text>
                        </View>
                        <Text className="text-white font-bold text-xl tracking-wide">Back Squats</Text>
                    </View>

                    <TouchableOpacity className="bg-white/10 backdrop-blur-xl border border-white/10 p-2.5 rounded-full">
                        <MaterialIcons name="more-vert" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Big Rep Counter */}
                <View className="absolute top-[25%] w-full items-center justify-center pointer-events-none z-20">
                    <View className="relative">
                        <Text className="text-[140px] leading-none font-bold text-white shadow-2xl">12</Text>
                        <Text className="absolute -right-8 bottom-6 text-[#0df20d] font-bold text-xl uppercase tracking-tighter -rotate-12">Reps</Text>
                    </View>
                    <View className="mt-2 flex-row items-center gap-2 bg-[#0df20d]/90 px-5 py-2 rounded-full shadow-lg">
                        <MaterialIcons name="check-circle" size={20} color="black" />
                        <Text className="text-black font-bold text-sm tracking-tight">FORM: OPTIMAL</Text>
                    </View>
                </View>
            </View>

            {/* Dashboard Bottom Sheet Area */}
            <View className="h-[45%] bg-[#0a0f0a]/95 rounded-t-[40px] border-t border-white/10 px-6 pt-8 pb-10 z-30 mt-[-40px]">
                <View className="absolute top-4 left-1/2 -ml-6 w-12 h-1.5 bg-white/20 rounded-full"></View>
                
                <View className="flex-row gap-4 mb-4 mt-2">
                    {/* Time Under Tension */}
                    <View className="flex-1 bg-white/5 border border-white/5 p-4 rounded-3xl relative overflow-hidden">
                        <View className="absolute top-0 right-0 w-24 h-24 bg-[#0ea5e9]/10 rounded-full"></View>
                        <View className="flex-row items-center gap-2 mb-3">
                            <MaterialIcons name="timer" size={18} color="#0ea5e9" />
                            <Text className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Time Under Tension</Text>
                        </View>
                        <View className="flex-row items-baseline gap-1">
                            <Text className="text-3xl font-bold text-white">42.8</Text>
                            <Text className="text-[#0ea5e9] text-xs font-bold uppercase">sec</Text>
                        </View>
                        <View className="mt-3 w-full bg-white/5 h-1 rounded-full overflow-hidden">
                            <View className="bg-[#0ea5e9] h-full w-[70%]"></View>
                        </View>
                    </View>

                    {/* Heart Rate */}
                    <View className="flex-1 bg-white/5 border border-white/5 p-4 rounded-3xl relative overflow-hidden">
                        <View className="absolute top-0 right-0 w-24 h-24 bg-[#0df20d]/10 rounded-full"></View>
                        <View className="flex-row items-center gap-2 mb-3">
                            <MaterialIcons name="favorite" size={18} color="#0df20d" />
                            <Text className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Heart Rate</Text>
                        </View>
                        <View className="flex-row items-baseline gap-1">
                            <Text className="text-3xl font-bold text-white">148</Text>
                            <Text className="text-[#0df20d] text-xs font-bold uppercase">bpm</Text>
                        </View>
                        <View className="mt-3 flex-row items-end gap-1 h-4">
                            <View className="bg-[#0df20d]/30 w-full flex-1 h-[40%] rounded-t-sm"></View>
                            <View className="bg-[#0df20d]/40 w-full flex-1 h-[60%] rounded-t-sm"></View>
                            <View className="bg-[#0df20d]/60 w-full flex-1 h-[50%] rounded-t-sm"></View>
                            <View className="bg-[#0df20d] w-full flex-1 h-[90%] rounded-t-sm"></View>
                            <View className="bg-[#0df20d]/80 w-full flex-1 h-[75%] rounded-t-sm"></View>
                        </View>
                    </View>
                </View>

                {/* Form Accuracy */}
                <View className="bg-white/5 border border-white/5 p-5 rounded-3xl mb-6">
                    <View className="flex-row items-center gap-3 mb-4">
                        <View className="p-2 bg-[#0df20d]/20 rounded-xl">
                            <MaterialIcons name="analytics" size={20} color="#0df20d" />
                        </View>
                        <View>
                            <Text className="text-white font-bold text-sm">Form Accuracy</Text>
                            <Text className="text-white/40 text-[10px]">AI Posture Evaluation</Text>
                        </View>
                        <View className="ml-auto flex-row items-baseline">
                            <Text className="text-2xl font-bold text-white">96</Text>
                            <Text className="text-white/30 font-bold text-sm">%</Text>
                        </View>
                    </View>
                    
                    <View className="space-y-4">
                        <View className="mb-3">
                            <View className="flex-row justify-between text-[10px] font-bold uppercase mb-1.5">
                                <Text className="text-white/60 text-[10px]">Depth Consistency</Text>
                                <Text className="text-[#0df20d] text-[10px]">Perfect</Text>
                            </View>
                            <View className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <View className="h-full bg-[#0df20d] w-[98%]"></View>
                            </View>
                        </View>
                        <View>
                            <View className="flex-row justify-between text-[10px] font-bold uppercase mb-1.5">
                                <Text className="text-white/60 text-[10px]">Hip Hinge Timing</Text>
                                <Text className="text-[#0ea5e9] text-[10px]">Optimized</Text>
                            </View>
                            <View className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <View className="h-full bg-[#0ea5e9] w-[84%]"></View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Bottom Controls */}
                <View className="flex-row justify-center items-center gap-8 mt-auto">
                    <TouchableOpacity className="items-center gap-1">
                        <View className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                            <MaterialIcons name="refresh" size={24} color="white" />
                        </View>
                        <Text className="text-[10px] text-white/50 font-bold uppercase tracking-tighter mt-1">Reset</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity className="w-20 h-20 rounded-full bg-[#0df20d] flex items-center justify-center shadow-lg">
                        <MaterialIcons name="pause" size={40} color="black" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity className="items-center gap-1" onPress={handleFinish}>
                        <View className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <MaterialIcons name="stop" size={24} color="#ef4444" />
                        </View>
                        <Text className="text-[10px] text-red-500/70 font-bold uppercase tracking-tighter mt-1">Finish</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
