import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DietPlanScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="flex-row items-center justify-between p-4 bg-[#121212] border-b border-slate-800 z-10 sticky top-0 pb-4">
                <Text className="text-xl font-bold tracking-tight text-white">My Diet Plan</Text>
                <TouchableOpacity className="bg-[#4ADE80] px-4 py-2 rounded-full flex-row items-center gap-2">
                    <MaterialIcons name="loop" size={16} color="black" />
                    <Text className="text-black text-sm font-semibold">Regenerate</Text>
                </TouchableOpacity>
            </View>
            <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Daily Nutrition Summary */}
                <View className="bg-[#1E1E1E] rounded-3xl p-6 shadow-xl border border-gray-800 mb-6 mt-2">
                    <Text className="text-lg font-semibold mb-6 text-[#4ADE80]">Daily Nutrition Summary</Text>
                    <View className="flex-row justify-between">
                        {/* Calories */}
                        <View className="items-center bg-[#1E1E1E]">
                           <View className="w-16 h-16 rounded-full border-4 border-[#4ADE80] items-center justify-center mb-2">
                               <Text className="text-xs text-gray-400 -mb-1">kcal</Text>
                               <Text className="text-sm font-bold text-white mt-1">1850</Text>
                           </View>
                           <Text className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Calories</Text>
                        </View>
                        {/* Protein */}
                        <View className="items-center">
                           <View className="w-16 h-16 rounded-full border-4 border-blue-400 items-center justify-center mb-2">
                               <Text className="text-xs text-gray-400 -mb-1">g</Text>
                               <Text className="text-sm font-bold text-white mt-1">160</Text>
                           </View>
                           <Text className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Protein</Text>
                        </View>
                        {/* Carbs */}
                        <View className="items-center">
                           <View className="w-16 h-16 rounded-full border-4 border-yellow-400 items-center justify-center mb-2">
                               <Text className="text-xs text-gray-400 -mb-1">g</Text>
                               <Text className="text-sm font-bold text-white mt-1">210</Text>
                           </View>
                           <Text className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Carbs</Text>
                        </View>
                        {/* Fats */}
                        <View className="items-center">
                           <View className="w-16 h-16 rounded-full border-4 border-red-400 items-center justify-center mb-2">
                               <Text className="text-xs text-gray-400 -mb-1">g</Text>
                               <Text className="text-sm font-bold text-white mt-1">55</Text>
                           </View>
                           <Text className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Fats</Text>
                        </View>
                    </View>
                </View>

                {/* Today's Meals */}
                <Text className="text-xl font-bold px-2 mb-4 text-white">Today's Meals</Text>

                {/* Breakfast */}
                <View className="bg-[#1E1E1E] rounded-2xl overflow-hidden flex-row shadow-lg border border-gray-800 mb-4 h-28">
                    <View className="w-24 h-full bg-gray-700">
                      <Image source={{uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfs6o2XfkBgHRuhie7I5uAVdPsqUcBxmZHU4ThkavLqrwtwKj7PzXzzLoNDk_fu9MrV0BSajxhX_GV8R67dwpA6BHQ05EdUET0rVPqgb8tTx2Ypz_3pl1HW0et9R1rlvl0uL37Sk6595zXOsYcq06XNwwLr9P6mZvg9vvP4isxgaLrnCcPwMk-Oep0ll6FAU30GH6coW2j1uAJ6esHR4IxMd_Su_2EbPsMe4klT_ttL_edn-jfrY-eWV4jFLPmi7zI1jwntAnA4As'}} className="w-full h-full" resizeMode="cover" />
                    </View>
                    <View className="p-4 flex-1 justify-center">
                       <View className="flex-row justify-between items-start">
                           <View>
                               <Text className="text-[10px] font-bold text-[#4ADE80] uppercase">Breakfast</Text>
                               <Text className="text-md font-semibold text-white">Overnight Berry Oats</Text>
                           </View>
                           <View className="text-right">
                               <Text className="text-sm font-bold text-white">420 kcal</Text>
                               <Text className="text-[10px] text-blue-400 ml-auto">12g Protein</Text>
                           </View>
                       </View>
                       <Text className="text-xs text-gray-400 mt-2">Oats, Blueberries, Almond Milk, Chia</Text>
                    </View>
                </View>

                {/* Lunch */}
                <View className="bg-[#1E1E1E] rounded-2xl overflow-hidden flex-row shadow-lg border border-gray-800 mb-4 h-28">
                    <View className="w-24 h-full bg-gray-700">
                      <Image source={{uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiP3uG9bqXNlC1Fq97dOEhtu0BmQrrvoy-zlTbDjFoQDEDg4x9-UVQG4NMy1e6OiQU7VZ0fQV7kMnfbIrGqIj6ha98czQR68RfwU7Ut-ZqHb0OlhJ5eW-lisHX_t7fYLeqoVihTX-qQk0MJpq-j7GYhIm9j-NsS7AjAsrHeiMC0UPNVhnZzLwiYUeyIyTCOJnE7OkEg_z9NscT9sFi_WWWACxuKHciDJSwK948j5qjYm--iQnyWprw20FoFw6AdE6K2aJPg-IVMk4'}} className="w-full h-full" resizeMode="cover" />
                    </View>
                    <View className="p-4 flex-1 justify-center">
                       <View className="flex-row justify-between items-start">
                           <View>
                               <Text className="text-[10px] font-bold text-[#4ADE80] uppercase">Lunch</Text>
                               <Text className="text-md font-semibold text-white">Grilled Chicken Bowl</Text>
                           </View>
                           <View className="text-right">
                               <Text className="text-sm font-bold text-white">580 kcal</Text>
                               <Text className="text-[10px] text-blue-400 ml-auto">45g Protein</Text>
                           </View>
                       </View>
                       <Text className="text-xs text-gray-400 mt-2">Chicken Breast, Quinoa, Avocado</Text>
                    </View>
                </View>

                {/* Dinner */}
                <View className="bg-[#1E1E1E] rounded-2xl overflow-hidden flex-row shadow-lg border border-gray-800 mb-6 h-28">
                    <View className="w-24 h-full bg-gray-700">
                      <Image source={{uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAodUpptyJfN-xivL-_EfKwi_HxDS8M3t4PrD9x5yOU7Ino7SU0q4PwKxK9yAYMaAmasxR-dyQisnfINVug6f59-QQdbh98f6BsmNYoHgXbz3ccFh54iKsZ696eyWHO6M91QdtQKq8SSsL6f4PZArWVO9711p2oXv8JasM-Jr3sL-b1d2ZnyRo7PeajjjYEMoARxl5i0KO3EXPC3V__qvySRSiH9DZmH1bXekVgKTgYVw23wuj34pukvOc5iIRSvzfC6AM7kwk8Wdc'}} className="w-full h-full" resizeMode="cover" />
                    </View>
                    <View className="p-4 flex-1 justify-center">
                       <View className="flex-row justify-between items-start">
                           <View>
                               <Text className="text-[10px] font-bold text-[#4ADE80] uppercase">Dinner</Text>
                               <Text className="text-md font-semibold text-white">Baked Salmon</Text>
                           </View>
                           <View className="text-right">
                               <Text className="text-sm font-bold text-white">510 kcal</Text>
                               <Text className="text-[10px] text-blue-400 ml-auto">38g Protein</Text>
                           </View>
                       </View>
                       <Text className="text-xs text-gray-400 mt-2">Salmon Fillet, Asparagus...</Text>
                    </View>
                </View>

                {/* AI Recommendations */}
                <View className="bg-[#1E1E1E] rounded-2xl p-6 border border-[#4ADE80]/30 mb-8 mt-2">
                    <View className="flex-row items-center gap-2 mb-4">
                        <View className="w-8 h-8 rounded-full bg-[#4ADE80]/20 items-center justify-center">
                            <MaterialIcons name="lightbulb" size={20} color="#4ADE80" />
                        </View>
                        <Text className="text-lg font-bold text-white">AI Nutrition Insight</Text>
                    </View>
                    <Text className="text-sm text-gray-300 leading-relaxed">
                        Based on your current activity levels, I recommend increasing your water intake by 500ml today. Your protein levels are on track for muscle recovery. Try to eat dinner at least 3 hours before sleep for better digestion.
                    </Text>
                </View>
                
                {/* Diet Preferences */}
                <View className="bg-[#1E1E1E] rounded-3xl p-6 border border-gray-800 mb-6">
                    <Text className="text-lg font-bold mb-4 text-white">Diet Preferences</Text>
                    <View className="flex-row items-center justify-between p-3 bg-gray-900/50 rounded-xl mb-6 mt-2">
                        <Text className="text-sm text-white font-medium">Intermittent Fasting</Text>
                        <Switch
                            trackColor={{ false: "#374151", true: "#4ADE80" }}
                            thumbColor={"#f4f3f4"}
                            value={true}
                        />
                    </View>
                    <TouchableOpacity className="w-full bg-[#4ADE80] py-3 rounded-xl items-center shadow-lg shadow-[#4ADE80]/20">
                        <Text className="text-black font-bold text-base">Update Preferences</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
