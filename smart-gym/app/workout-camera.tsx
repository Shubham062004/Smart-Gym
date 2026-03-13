import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation } from '@tanstack/react-query';
import axiosClient from '../src/api/axiosClient';
import { ENABLE_CAMERA } from '../src/config/devMode';

// Conditionally load camera modules to prevent Expo Go crashes
let AICamera: any = null;
if (ENABLE_CAMERA) {
    try {
        AICamera = require('../src/components/AICamera').AICamera;
    } catch (e) {
        console.warn("Camera modules failed to load. Falling back to dev mode.");
    }
}

const { width } = Dimensions.get('window');

export default function WorkoutCameraScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(ENABLE_CAMERA ? false : true);
  const [isTfReady, setIsTfReady] = useState(ENABLE_CAMERA ? false : true);
  
  const [reps, setReps] = useState(0);
  const [time, setTime] = useState(0);
  const [heartRate, setHeartRate] = useState(148);
  const [formAccuracy, setFormAccuracy] = useState(ENABLE_CAMERA ? 100 : 0);
  const [isPaused, setIsPaused] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  // Timer Ref
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (ENABLE_CAMERA) {
        const { Camera } = require('react-native-vision-camera');
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'granted');
            setIsTfReady(true); // Simplified for dev fallback
        })();
    }
  }, []);

  useEffect(() => {
      if (!isPaused && isWorking) {
          timerRef.current = setInterval(() => {
              setTime(prev => +(prev + 0.1).toFixed(1));
          }, 100);
      } else {
          if (timerRef.current) clearInterval(timerRef.current);
      }
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, isWorking]);

  const saveSessionMutation = useMutation({
    mutationFn: (data: any) => axiosClient.post('/workout-session', data),
    onSuccess: (response) => {
      router.push({
          pathname: '/workout-summary' as any,
          params: {
              exerciseName: "Squats",
              totalReps: reps,
              duration: Math.round(time),
              caloriesBurned: Math.round(time * 0.15),
              formAccuracy: formAccuracy
          }
      });
    },
    onError: (error) => {
      console.error("Failed to save session", error);
    }
  });

  const handleFinish = () => {
    saveSessionMutation.mutate({
      exerciseName: "Squats",
      totalReps: reps,
      duration: Math.round(time),
      caloriesBurned: Math.round(time * 0.15),
      formAccuracy: formAccuracy,
    });
  };

  const handleReset = () => {
    setReps(0);
    setTime(0);
  };

  const toggleWorkingState = () => {
      if (!isWorking) setIsWorking(true);
      
      // MOCK REP COUNTER: In Dev Mode, toggling pause increments reps
      if (!ENABLE_CAMERA && !isPaused) {
          setReps(prev => prev + 1);
          setFormAccuracy(prev => Math.min(100, prev + 5));
      }
      
      setIsPaused(!isPaused);
  };

  if (ENABLE_CAMERA && (!hasPermission || !isTfReady)) {
    return (
      <View className="flex-1 bg-black items-center justify-center p-6">
        <ActivityIndicator size="large" color="#0df20d" />
        <Text className="text-white text-center mt-4 text-lg font-bold">
            {!hasPermission ? "Camera Access Required" : "Loading AI Model..."}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 relative">
        <View className="absolute inset-0 bg-slate-900 items-center justify-center">
            {ENABLE_CAMERA && AICamera ? (
                <AICamera isPaused={isPaused} onPoseDetected={() => {}} />
            ) : (
                <View className="items-center px-10">
                    <MaterialIcons name="videocam-off" size={64} color="#334155" />
                    <Text className="text-slate-500 text-center mt-4 font-medium">
                        Camera tracking will be available in the development build.
                    </Text>
                </View>
            )}
        </View>

        <LinearGradient
           colors={['rgba(10, 15, 10, 0.8)', 'rgba(10, 15, 10, 0.2)', 'rgba(10, 15, 10, 0.9)']}
           className="absolute inset-0"
        />

        {!ENABLE_CAMERA && (
            <View className="absolute top-20 left-0 right-0 items-center z-50">
                <View className="bg-orange-500/20 px-4 py-1.5 rounded-full border border-orange-500/30">
                    <Text className="text-orange-400 font-bold text-[10px] uppercase tracking-widest">
                        AI tracking disabled in Expo Go. Use Dev Build for full features.
                    </Text>
                </View>
            </View>
        )}

        <Svg height="100%" width="100%" viewBox="0 0 375 812" style={StyleSheet.absoluteFill}>
          <Path 
            d="M187 200 L187 350 M187 350 L140 350 L120 450 L130 550 M187 350 L234 350 L254 450 L244 550" 
            stroke={ENABLE_CAMERA ? "#0df20d" : "#334155"} 
            strokeWidth="4" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </Svg>

        <View className="flex-row items-center justify-between px-6 pt-4">
          <TouchableOpacity className="w-12 h-12 bg-white/10 rounded-full items-center justify-center border border-white/20" onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="items-center">
            <View className="flex-row items-center bg-green-500/20 px-4 py-1.5 rounded-full border border-green-500/30 gap-2 mb-1">
              <View className="w-2 h-2 rounded-full bg-primary" />
              <Text className="text-primary font-bold text-[10px] uppercase tracking-widest">
                  {ENABLE_CAMERA ? "AI Tracked" : "Dev Mock"}
              </Text>
            </View>
            <Text className="text-white font-bold text-xl uppercase tracking-tighter">Squats</Text>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-white/10 rounded-full items-center justify-center border border-white/20">
            <MaterialIcons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center">
          <View className="items-center">
            <Text className="text-[120px] font-bold text-white leading-none">{reps}</Text>
            <Text className="text-primary font-bold text-2xl uppercase italic absolute -right-16 bottom-10 -rotate-12">Reps</Text>
          </View>
          <View className="mt-4 bg-primary px-6 py-2 rounded-full shadow-lg flex-row items-center gap-2">
            <MaterialIcons name="check-circle" size={20} color="black" />
            <Text className="text-black font-bold tracking-tight">
                {formAccuracy > 90 ? "FORM: OPTIMAL" : formAccuracy > 0 ? "CHECK POSTURE" : "AWAITING DATA"}
            </Text>
          </View>
        </View>

        <View className="bg-[#0a0f0a]/95 rounded-t-[40px] border-t border-white/10 p-6 pt-10 pb-12">
           <View className="w-12 h-1.5 bg-white/20 rounded-full self-center mb-8" />
           <View className="flex-row gap-4 mb-6">
              <View className="flex-1 bg-white/5 border border-white/10 p-5 rounded-3xl">
                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialIcons name="timer" size={18} color="#0ea5e9" />
                  <Text className="text-white/50 text-[10px] uppercase font-bold">Duration</Text>
                </View>
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-3xl font-bold text-white">{time}</Text>
                  <Text className="text-accent text-xs font-bold uppercase">sec</Text>
                </View>
              </View>

              <View className="flex-1 bg-white/5 border border-white/10 p-5 rounded-3xl">
                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialIcons name="monitor-heart" size={18} color="#0df20d" />
                  <Text className="text-white/50 text-[10px] uppercase font-bold">Heart Rate</Text>
                </View>
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-3xl font-bold text-white">--</Text>
                  <Text className="text-primary text-xs font-bold uppercase">bpm</Text>
                </View>
              </View>
           </View>

           <View className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-8">
              <View className="flex-row items-center gap-3 mb-6">
                 <MaterialIcons name="analytics" size={24} color="#0df20d" />
                 <Text className="text-white font-bold">AI Consistency: {formAccuracy}%</Text>
              </View>
              <View className="space-y-4">
                  <View className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <View className="h-full bg-primary" style={{ width: `${formAccuracy}%` }} />
                  </View>
                  <Text className="text-white/40 text-[10px] uppercase">
                      {ENABLE_CAMERA ? "Maintain mid-foot balance" : "Start workout to see analytics"}
                  </Text>
              </View>
           </View>

           <View className="flex-row items-center justify-between pt-4">
              <TouchableOpacity className="items-center gap-2" onPress={handleReset}>
                 <View className="w-14 h-14 bg-white/5 border border-white/10 rounded-full items-center justify-center">
                    <MaterialIcons name="restart-alt" size={28} color="white" />
                 </View>
              </TouchableOpacity>

              <TouchableOpacity 
                className="w-20 h-20 bg-primary rounded-full items-center justify-center shadow-lg"
                onPress={toggleWorkingState}
              >
                <MaterialIcons name={isPaused || !isWorking ? "play-arrow" : "pause"} size={40} color="black" />
              </TouchableOpacity>

              <TouchableOpacity className="items-center gap-2" onPress={handleFinish}>
                 <View className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full items-center justify-center">
                    <MaterialIcons name="stop" size={28} color="#ef4444" />
                 </View>
              </TouchableOpacity>
           </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
