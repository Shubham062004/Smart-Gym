import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation } from '@tanstack/react-query';
import axiosClient from '../src/api/axiosClient';

const { width, height } = Dimensions.get('window');

export default function WorkoutCameraScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [reps, setReps] = useState(12);
  const [time, setTime] = useState(42.8);
  const [heartRate, setHeartRate] = useState(148);
  const [formAccuracy, setFormAccuracy] = useState(96);
  const [isPaused, setIsPaused] = useState(false);

  // Camera permissions
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const saveSessionMutation = useMutation({
    mutationFn: (data: any) => axiosClient.post('/workout-session', data),
    onSuccess: () => {
      router.push('/(tabs)');
    },
    onError: (error) => {
      console.error("Failed to save session", error);
    }
  });

  const handleFinish = () => {
    saveSessionMutation.mutate({
      exerciseName: "Back Squats",
      totalReps: reps,
      duration: Math.round(time),
      caloriesBurned: 120, // Mock
      formAccuracy: formAccuracy,
    });
  };

  const handleReset = () => {
    setReps(0);
    setTime(0);
  };

  if (!hasPermission) {
    return (
      <View className="flex-1 bg-black items-center justify-center p-6">
        <MaterialIcons name="camera-alt" size={64} color="#0df20d" />
        <Text className="text-white text-center mt-4 text-lg font-bold">Camera Access Required</Text>
        <Text className="text-gray-400 text-center mt-2">AI tracking needs camera permissions to function.</Text>
        <TouchableOpacity 
          className="mt-8 bg-primary px-8 py-3 rounded-full"
          onPress={async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'authorized');
          }}
        >
          <Text className="text-black font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 relative">
        {/* Camera View - Mocked as black if no real camera for now */}
        {/* In production this would be <Camera style={StyleSheet.absoluteFill} device={device} isActive={isActive} /> */}
        <View className="absolute inset-0 bg-slate-900">
           {/* Placeholder for live camera feed */}
        </View>

        {/* Camera Overlay Gradient */}
        <LinearGradient
           colors={['rgba(10, 15, 10, 0.8)', 'rgba(10, 15, 10, 0.2)', 'rgba(10, 15, 10, 0.9)']}
           className="absolute inset-0"
        />

        {/* Skeleton SVG Overlay (Mocked) */}
        <Svg height="100%" width="100%" viewBox="0 0 375 812" style={StyleSheet.absoluteFill}>
          <Path 
            d="M187 200 L187 350 M187 350 L140 350 L120 450 L130 550 M187 350 L234 350 L254 450 L244 550" 
            stroke="#0df20d" 
            strokeWidth="4" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <Circle cx="187" cy="180" r="25" stroke="#0df20d" strokeWidth="4" fill="none" />
          {[ [187, 350], [140, 350], [234, 350], [120, 450], [254, 450] ].map((p, i) => (
            <Circle key={i} cx={p[0]} cy={p[1]} r="5" fill="#0df20d" />
          ))}
        </Svg>

        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4">
          <TouchableOpacity className="w-12 h-12 bg-white/10 rounded-full items-center justify-center border border-white/20" onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="items-center">
            <View className="flex-row items-center bg-green-500/20 px-4 py-1.5 rounded-full border border-green-500/30 gap-2 mb-1">
              <View className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <Text className="text-primary font-bold text-[10px] uppercase tracking-widest">Live Tracking</Text>
            </View>
            <Text className="text-white font-bold text-xl uppercase tracking-tighter">Back Squats</Text>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-white/10 rounded-full items-center justify-center border border-white/20">
            <MaterialIcons name="more-vert" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Large Rep Counter */}
        <View className="flex-1 items-center justify-center">
          <View className="items-center">
            <Text className="text-[120px] font-bold text-white leading-none">{reps}</Text>
            <Text className="text-primary font-bold text-2xl uppercase italic absolute -right-16 bottom-10 -rotate-12">Reps</Text>
          </View>
          <View className="mt-4 bg-primary px-6 py-2 rounded-full shadow-lg flex-row items-center gap-2">
            <MaterialIcons name="check-circle" size={20} color="black" />
            <Text className="text-black font-bold tracking-tight">FORM: OPTIMAL</Text>
          </View>
        </View>

        {/* Details Arrow */}
        <View className="items-center mb-10 opacity-60">
           <Text className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Details</Text>
           <MaterialIcons name="keyboard-double-arrow-down" size={24} color="white" />
        </View>

        {/* Bottom Details Panel */}
        <View className="bg-[#0a0f0a]/95 rounded-t-[40px] border-t border-white/10 p-6 pt-10 pb-12">
           <View className="w-12 h-1.5 bg-white/20 rounded-full self-center mb-8" />
           
           <View className="flex-row gap-4 mb-6">
              <View className="flex-1 bg-white/5 border border-white/10 p-5 rounded-3xl relative overflow-hidden">
                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialIcons name="timer" size={18} color="#0ea5e9" />
                  <Text className="text-white/50 text-[10px] uppercase font-bold tracking-wider">Time Under Tension</Text>
                </View>
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-3xl font-bold text-white">{time}</Text>
                  <Text className="text-accent text-xs font-bold uppercase">sec</Text>
                </View>
                <View className="h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                  <View className="h-full bg-accent" style={{ width: '70%' }} />
                </View>
              </View>

              <View className="flex-1 bg-white/5 border border-white/10 p-5 rounded-3xl relative overflow-hidden">
                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialIcons name="monitor-heart" size={18} color="#0df20d" />
                  <Text className="text-white/50 text-[10px] uppercase font-bold tracking-wider">Heart Rate</Text>
                </View>
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-3xl font-bold text-white">{heartRate}</Text>
                  <Text className="text-primary text-xs font-bold uppercase">bpm</Text>
                </View>
                {/* Micro heart rate graph mock */}
                <View className="flex-row items-end gap-[2px] h-6 mt-3">
                   {[40, 60, 50, 80, 95, 75].map((h, i) => (
                     <View key={i} className={`flex-1 bg-primary${i < 4 ? '/20' : ''} rounded-t-sm`} style={{ height: `${h}%` }} />
                   ))}
                </View>
              </View>
           </View>

           {/* Metrics Graph Section */}
           <View className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-6">
              <View className="flex-row justify-between items-center mb-6">
                 <View>
                    <Text className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Rep Consistency</Text>
                    <Text className="text-white font-bold text-lg">Velocity Profile</Text>
                 </View>
                 <View className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                    <Text className="text-primary text-[10px] font-bold uppercase">Stable</Text>
                 </View>
              </View>
              <View className="h-32 flex-row items-end justify-between gap-2 border-b border-white/5 pb-2">
                 {[80, 85, 75, 95, 82, 88, 65].map((h, i) => (
                    <View key={i} className={`flex-1 ${i === 3 ? 'bg-primary' : i > 0 && i < 6 ? 'bg-accent/40' : 'bg-white/10'} rounded-t-lg`} style={{ height: `${h}%` }}>
                       {i === 0 && <Text className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/40">R1</Text>}
                    </View>
                 ))}
              </View>
              <View className="flex-row justify-between mt-3 px-2">
                 <Text className="text-[10px] text-white/30 font-bold uppercase">Rep 1</Text>
                 <Text className="text-[10px] text-white/30 font-bold uppercase">Current</Text>
              </View>
           </View>

           {/* Form Accuracy Panel */}
           <View className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-8">
              <View className="flex-row items-center gap-3 mb-6">
                 <View className="bg-primary/20 p-2 rounded-xl">
                    <MaterialIcons name="analytics" size={24} color="#0df20d" />
                 </View>
                 <View className="flex-1">
                    <Text className="text-white font-bold">Form Accuracy</Text>
                    <Text className="text-white/40 text-xs uppercase tracking-tighter">AI Posture Evaluation</Text>
                 </View>
                 <View className="items-end">
                    <Text className="text-2xl font-bold text-white">96<Text className="text-sm text-white/30">%</Text></Text>
                 </View>
              </View>
              <View className="space-y-4">
                 {[ 
                   { label: 'Depth Consistency', val: '98%', status: 'Perfect', color: '#0df20d' },
                   { label: 'Hip Hinge Timing', val: '84%', status: 'Optimized', color: '#0ea5e9' },
                   { label: 'Balance Center', val: '92%', status: 'Mid-foot', color: '#ffffff' }
                 ].map((item, i) => (
                   <View key={i} className="gap-2">
                     <View className="flex-row justify-between">
                        <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{item.label}</Text>
                        <Text style={{ color: item.color }} className="text-[10px] font-bold uppercase">{item.status}</Text>
                     </View>
                     <View className={`h-1.5 w-full bg-white/5 rounded-full overflow-hidden`}>
                        <View className="h-full" style={{ width: item.val, backgroundColor: item.color, shadowColor: item.color, shadowRadius: 8, shadowOpacity: 0.5 }} />
                     </View>
                   </View>
                 ))}
              </View>
           </View>

           {/* Bottom Action Bar */}
           <View className="flex-row items-center justify-between pt-4">
              <TouchableOpacity className="items-center gap-2" onPress={handleReset}>
                 <View className="w-14 h-14 bg-white/5 border border-white/10 rounded-full items-center justify-center">
                    <MaterialIcons name="restart-alt" size={28} color="white" />
                 </View>
                 <Text className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="w-20 h-20 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/30"
                onPress={() => setIsPaused(!isPaused)}
              >
                <MaterialIcons name={isPaused ? "play-arrow" : "pause"} size={40} color="black" />
              </TouchableOpacity>

              <TouchableOpacity className="items-center gap-2" onPress={handleFinish}>
                 <View className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full items-center justify-center">
                    <MaterialIcons name="stop" size={28} color="#ef4444" />
                 </View>
                 <Text className="text-[10px] text-red-500/70 font-bold uppercase tracking-widest">Finish</Text>
              </TouchableOpacity>
           </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
