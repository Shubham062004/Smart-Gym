import React from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';
import { useProfile } from '../src/hooks/useProfile';
import { useAuthStore } from '../src/store/authStore';
import { useUserStore } from '../src/store/userStore';

export default function Settings() {
  const router = useRouter();
  const { logout } = useAuth();
  const { deleteAccount, updateSettings } = useProfile();
  const { user } = useAuthStore();
  const { preferences, updatePreferences } = useUserStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (e) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert('Delete Account', 'Are you sure you want to delete your account? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteAccount();
          await logout();
          router.replace('/login');
        } catch (e) {
          Alert.alert('Error', 'Failed to delete account');
        }
      }}
    ]);
  };

  const toggleDarkMode = () => {
    const newValue = !preferences.darkMode;
    updatePreferences({ darkMode: newValue });
    updateSettings({ darkMode: newValue });
  };

  const toggleNotifications = () => {
    const newValue = !preferences.notifications;
    updatePreferences({ notifications: newValue });
    updateSettings({ notifications: newValue });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-gray-50/80 dark:bg-slate-900/80 z-10 sticky top-0">
        <TouchableOpacity 
          className="p-2 mr-4 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#0f172a" className="dark:color-white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900 dark:text-white">Settings</Text>
      </View>

      <ScrollView className="px-4 pb-24">
        {/* Account Section Card */}
        <View className="mt-2 mb-6">
          <View className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-full border-2 border-blue-600 overflow-hidden">
              <ImageBackground 
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7TOm6EFkrqTHyz7iuL5jvpoBJchFmNvmqATieV5-gKZP06dn-ViadnczmL-kHJN_zX4AX5pS-48tSqL_jeo-TeQvZoCw5sbw9ogm5Om4CWimuPbh27ckCCe_jjCNV9kdcZ5XpP3V852FN1_qHNJh2fQGRJIPl11k-WenIt65xnNTRPkqrnzIgeB_Wks9iQcwn54qGvKmM8KW-OS_mCW5HOWOBWqGDPCPrk5-g7FtAPzSZ7LmOTIaovuU4YG1TBk-2aRKvKeKqDT8" }} 
                className="w-full h-full"
              />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-slate-900 dark:text-white">{user?.name || 'User'}</Text>
              <View className="self-start px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded-full mt-1">
                <Text className="text-blue-600 dark:text-blue-400 text-xs font-semibold">Pro Member</Text>
              </View>
            </View>
            <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-full" onPress={() => router.push('/edit-profile' as any)}>
              <Text className="text-white text-sm font-medium">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Details */}
        <View className="mb-6 gap-2">
          <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-2">Account Details</Text>
          <View className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="lock" size={24} color="#94a3b8" />
                <Text className="text-slate-900 dark:text-white">Change Password</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="mail" size={24} color="#94a3b8" />
                <View>
                  <Text className="text-slate-900 dark:text-white">Email</Text>
                  <Text className="text-xs text-slate-500">{user?.email || 'email@example.com'}</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between p-4 hover:bg-slate-50">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="phone" size={24} color="#94a3b8" />
                <View>
                  <Text className="text-slate-900 dark:text-white">Phone</Text>
                  <Text className="text-xs text-slate-500">+1 (555) 012-3456</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Preferences */}
        <View className="mb-6 gap-2">
          <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-2">App Preferences</Text>
          <View className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <View className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="dark-mode" size={24} color="#94a3b8" />
                <Text className="text-slate-900 dark:text-white">Dark Mode</Text>
              </View>
              <Switch value={preferences.darkMode} onValueChange={toggleDarkMode} trackColor={{ false: "#cbd5e1", true: "#2563eb" }} />
            </View>
            <View className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="notifications-active" size={24} color="#94a3b8" />
                <Text className="text-slate-900 dark:text-white">Notifications</Text>
              </View>
              <Switch value={preferences.notifications} onValueChange={toggleNotifications} trackColor={{ false: "#cbd5e1", true: "#2563eb" }} />
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View className="mb-10 gap-2">
          <Text className="text-sm font-semibold text-red-500 uppercase tracking-wider px-2">Danger Zone</Text>
          <View className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-red-500/20">
            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700" onPress={handleLogout}>
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="logout" size={24} color="#ef4444" />
                <Text className="text-red-500 font-medium">Log Out</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between p-4" onPress={handleDeleteAccount}>
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="delete-forever" size={24} color="#dc2626" />
                <Text className="text-red-600 font-medium">Delete Account</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center mb-10">
          <Text className="text-slate-400 text-sm">AstraFit © 2026</Text>
          <Text className="mt-1 font-medium text-slate-400 text-sm">Version 2.4.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

