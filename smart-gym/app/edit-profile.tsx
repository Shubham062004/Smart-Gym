import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProfile } from '../src/hooks/useProfile';
import { useAuthStore } from '../src/store/authStore';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  age: z.number(),
  height: z.number(),
  weight: z.number(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfile() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { updateProfile, isUpdatingProfile } = useProfile();

  const { control, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      name: user?.name || '',
      age: user?.age || 0,
      height: user?.height || 0,
      weight: user?.weight || 0,
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile(data as any);
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View className="flex-row items-center px-4 py-4 bg-gray-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <MaterialIcons name="arrow-back" size={24} color="#0f172a" className="dark:color-white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4 text-slate-900 dark:text-white">Edit Profile</Text>
      </View>

      <ScrollView className="p-6">
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border-2 border-blue-600">
            <MaterialIcons name="person" size={48} color="#94a3b8" />
          </View>
          <TouchableOpacity className="mt-2">
            <Text className="text-blue-600 font-bold">Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View className="gap-4">
          <View>
            <Text className="text-sm font-semibold text-slate-500 mb-2">Full Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="John Doe"
                  placeholderTextColor="#94a3b8"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value?.toString()}
                />
              )}
            />
            {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name.message as string}</Text>}
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-slate-500 mb-2">Age</Text>
              <Controller
                control={control}
                name="age"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    placeholder="25"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(Number(text))}
                    value={value?.toString()}
                  />
                )}
              />
              {errors.age && <Text className="text-red-500 text-xs mt-1">Invalid age</Text>}
            </View>

            <View className="flex-1">
              <Text className="text-sm font-semibold text-slate-500 mb-2">Height (cm)</Text>
              <Controller
                control={control}
                name="height"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    placeholder="180"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(Number(text))}
                    value={value?.toString()}
                  />
                )}
              />
              {errors.height && <Text className="text-red-500 text-xs mt-1">Invalid height</Text>}
            </View>
          </View>

          <View>
            <Text className="text-sm font-semibold text-slate-500 mb-2">Weight (kg)</Text>
            <Controller
              control={control}
              name="weight"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="75"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(Number(text))}
                  value={value?.toString()}
                />
              )}
            />
            {errors.weight && <Text className="text-red-500 text-xs mt-1">Invalid weight</Text>}
          </View>

          <TouchableOpacity 
            className="w-full bg-blue-600 items-center justify-center py-4 rounded-xl shadow-lg mt-6"
            onPress={handleSubmit(onSubmit)}
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Save Changes</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
