import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Homepage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <ScrollView className="flex-1 pb-20">
        {/* Header Section */}
        <View className="flex-row items-center justify-between p-6 pt-4">
          <View className="flex-row items-center gap-3">
            <View className="relative">
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC9UnceYa6FTFVwFTia-jGG_CwQkFNcydm0WV-sE4r1Qs1KV9KWA2D3Bh8RYOY7NIrw0YjlqZFNgWyeGF4IVfyrxVm0NpNn6_lnUQpVELI4k924BS2On2vlENe09aYz1h1xvcHlM2MB5FVFEulBD79msj0Zl4YBPnpNrgI1OUsTHglSY5lnAFlRlYvday4rDlL16SPWxreYzclZ4RrZRK4TxT-g94j7W_nR42bk_-7UU-NPsnvB2Z2U0F3nxZiemhX8-BVXp2lXO0' }} 
                className="w-12 h-12 rounded-full border-2 border-primary" 
              />
              <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" />
            </View>
            <View>
              <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">Welcome back,</Text>
              <Text className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Shubham</Text>
            </View>
          </View>
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
                <Text className="text-xs font-normal text-slate-500">Oct 24</Text>
            </View>
          </View>
          
          <View className="flex-col gap-4">
            {/* Main Stat Card */}
            <View className="bg-blue-600 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <View className="absolute top-0 right-0 p-3 opacity-10">
                <MaterialIcons name="fitness-center" size={100} color="white" />
              </View>
              <View className="relative z-10">
                <Text className="text-blue-100 font-medium mb-1">Total Reps</Text>
                <View className="flex-row items-end gap-2">
                  <Text className="text-4xl font-bold tracking-tight text-white">120</Text>
                  <Text className="text-sm font-medium text-blue-100 mb-1.5">+15% vs yesterday</Text>
                </View>
                <View className="mt-4 w-full bg-black/20 rounded-full h-1.5 opacity-50">
                  <View className="bg-white h-1.5 rounded-full" style={{ width: '75%' }} />
                </View>
              </View>
            </View>
            
            <View className="flex-row gap-4">
              {/* Secondary Stats */}
              <View className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="p-2 bg-green-100 dark:bg-green-500/10 rounded-lg">
                    <MaterialIcons name="timer" size={24} color="#22c55e" />
                  </View>
                  <Text className="text-xs font-medium text-slate-400">Target: 60m</Text>
                </View>
                <View>
                  <Text className="text-2xl font-bold text-slate-900 dark:text-white">45 <Text className="text-sm font-normal text-slate-500">min</Text></Text>
                  <Text className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Duration</Text>
                </View>
              </View>
              
              <View className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="p-2 bg-purple-100 dark:bg-purple-500/10 rounded-lg">
                    <MaterialIcons name="local-fire-department" size={24} color="#a855f7" />
                  </View>
                  <Text className="text-xs font-medium text-slate-400">Target: 500</Text>
                </View>
                <View>
                  <Text className="text-2xl font-bold text-slate-900 dark:text-white">320 <Text className="text-sm font-normal text-slate-500">kcal</Text></Text>
                  <Text className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Calories Burned</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Start */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <Text className="text-lg font-bold text-slate-900 dark:text-white">Quick Start</Text>
            <TouchableOpacity>
                <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
            {/* Pushups */}
            <View className="w-40 bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
              <View className="h-24 w-full bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden relative">
                <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCabioM815Tvfv8uoBdxjhd9-lEIYcJ9wq3s2_rVno8O8Pi3s3iY-jtP4fA75lBzLwt-xASROPfEdgpnps00-H-x_Ui8y7MNx9fpT-aNQhAU5GayhXzK56X3GLen9vO3d-z4diNSrD_EG8sbgE2L4SAO1KL5Y1kuH-iGvQY5hlabNGNWQmNt9mJCryQFNGPC7cAvORN7wqmkzhhbfG1sEz__hKspKXyLsYH_L_wiJaknXTFMXCV4McW5cjIBpOvAOIlNdW8ytRei3E" }} className="w-full h-full absolute" />
                <View className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <View className="bg-white/20 p-2 rounded-full">
                    <MaterialIcons name="play-arrow" size={24} color="white" />
                  </View>
                </View>
              </View>
              <View className="p-3">
                <Text className="font-bold text-slate-900 dark:text-white mb-1">Pushups</Text>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="bolt" size={14} color="#64748b" />
                  <Text className="text-xs text-slate-500 dark:text-slate-400">Intermediate</Text>
                </View>
              </View>
            </View>
            
            {/* Squats */}
            <View className="w-40 bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
              <View className="h-24 w-full bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden relative">
                <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMAihkbqE5Cx1P38prNCrMREfQWL-ZAuh8yH5QpV13eIhaUJTwSv4141F4fxhv1XfY1LIT1QS8P20RRnEMPNdkkFj_pbaB9ASlY2lxec_1bZzf5h4cyUTZO45uAECxGZmGXTDV1G_fKTZEFlXuKsNGAUMFgprg5S3jspr9m452Y99_KNXtCcE_qfTKXapOhgPfI2aEdPUcZcfPrz7rPAMuTAD_OxavuIKFK3jNUf24T2Lh-NRCPoxc92tO8xD2aAho2cvdA-np3iU" }} className="w-full h-full absolute" />
                <View className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <View className="bg-white/20 p-2 rounded-full">
                    <MaterialIcons name="play-arrow" size={24} color="white" />
                  </View>
                </View>
              </View>
              <View className="p-3">
                <Text className="font-bold text-slate-900 dark:text-white mb-1">Squats</Text>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="bolt" size={14} color="#64748b" />
                  <Text className="text-xs text-slate-500 dark:text-slate-400">Beginner</Text>
                </View>
              </View>
            </View>

            {/* Crunches */}
            <View className="w-40 bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
              <View className="h-24 w-full bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden relative">
                <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCESj5_g1EuooapcJdKGWxkKw2idpE1bcCRAi0ZG-sQpPcjvSSqg2MmCN716sdKBkVBHfAu3_2a997k6vOXVH3l2p262F2sicF-8tTnqAvdPRTERrNpqqYZjFsB-PgqFCktQZ_Zdt0y9Kyxm1XiR-od92p4rzR5tAanuy7RcR_vYfI7cVQQ_X3fvQt8Wkuj85zebwWm7XacWrp61pzcYBSVRAXklVX9P1NoySxsZk_WoW_9hh4oU2KAgSaA3GWRqdm-TAESihaL704" }} className="w-full h-full absolute" />
                <View className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <View className="bg-white/20 p-2 rounded-full">
                    <MaterialIcons name="play-arrow" size={24} color="white" />
                  </View>
                </View>
              </View>
              <View className="p-3">
                <Text className="font-bold text-slate-900 dark:text-white mb-1">Crunches</Text>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="bolt" size={14} color="#64748b" />
                  <Text className="text-xs text-slate-500 dark:text-slate-400">Beginner</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Weekly Progress */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Weekly Progress</Text>
          <View className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-sm text-slate-500 dark:text-slate-400">Average Activity</Text>
                <Text className="text-xl font-bold text-slate-900 dark:text-white">1.2 hrs<Text className="text-sm font-normal text-slate-500">/day</Text></Text>
              </View>
              <View className="flex-row items-center bg-green-100 dark:bg-green-500/10 px-2 py-1 rounded">
                <MaterialIcons name="trending-up" size={16} color="#22c55e" />
                <Text className="text-green-500 text-xs font-bold ml-1">+12%</Text>
              </View>
            </View>
            {/* Very simple chart replacement */}
            <View className="flex-row items-end justify-between h-32 gap-2">
              <View className="flex-1 items-center gap-2 h-full"><View className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-sm h-full justify-end overflow-hidden"><View className="w-full bg-slate-300 dark:bg-slate-600 rounded-t-sm" style={{ height: '40%' }} /></View><Text className="text-xs text-slate-500 font-medium">M</Text></View>
              <View className="flex-1 items-center gap-2 h-full"><View className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-sm h-full justify-end overflow-hidden"><View className="w-full bg-slate-300 dark:bg-slate-600 rounded-t-sm" style={{ height: '65%' }} /></View><Text className="text-xs text-slate-500 font-medium">T</Text></View>
              <View className="flex-1 items-center gap-2 h-full"><View className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-sm h-full justify-end overflow-hidden"><View className="w-full bg-slate-300 dark:bg-slate-600 rounded-t-sm" style={{ height: '35%' }} /></View><Text className="text-xs text-slate-500 font-medium">W</Text></View>
              <View className="flex-1 items-center gap-2 h-full"><View className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-sm h-full justify-end overflow-hidden"><View className="w-full bg-blue-600 rounded-t-sm" style={{ height: '85%' }} /></View><Text className="text-xs text-blue-600 font-bold">T</Text></View>
              <View className="flex-1 items-center gap-2 h-full"><View className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-sm h-full justify-end overflow-hidden"><View className="w-full bg-slate-300 dark:bg-slate-600 rounded-t-sm" style={{ height: '50%' }} /></View><Text className="text-xs text-slate-500 font-medium">F</Text></View>
              <View className="flex-1 items-center gap-2 h-full"><View className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-sm h-full justify-end overflow-hidden"><View className="w-full bg-slate-300 dark:bg-slate-600 rounded-t-sm" style={{ height: '30%' }} /></View><Text className="text-xs text-slate-500 font-medium">S</Text></View>
              <View className="flex-1 items-center gap-2 h-full"><View className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-sm h-full justify-end overflow-hidden"><View className="w-full bg-slate-300 dark:bg-slate-600 rounded-t-sm" style={{ height: '20%' }} /></View><Text className="text-xs text-slate-500 font-medium">S</Text></View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
