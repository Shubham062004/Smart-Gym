import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProfile } from '../src/hooks/useProfile';
import { useAuthStore } from '../src/store/authStore';

const editProfileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  age: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  fitnessGoals: z.string().optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { updateProfile, isUpdatingProfile } = useProfile();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { name: '', age: '', height: '', weight: '', fitnessGoals: '' }
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('age', user.age?.toString() || '');
      setValue('height', user.height?.toString() || '');
      setValue('weight', user.weight?.toString() || '');
      setValue('fitnessGoals', user.fitnessGoals || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data: EditProfileFormValues) => {
    try {
      const payload: any = { name: data.name };
      if (data.age) payload.age = Number(data.age);
      if (data.height) payload.height = Number(data.height);
      if (data.weight) payload.weight = Number(data.weight);
      if (data.fitnessGoals) payload.fitnessGoals = data.fitnessGoals;

      await updateProfile(payload);
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Could not update profile');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message as string}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput style={styles.input} keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (cm)</Text>
            <Controller
              control={control}
              name="height"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput style={styles.input} keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <Controller
              control={control}
              name="weight"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput style={styles.input} keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fitness Goals</Text>
            <Controller
              control={control}
              name="fitnessGoals"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)} disabled={isUpdatingProfile}>
            <Text style={styles.saveButtonText}>{isUpdatingProfile ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  flex: { flex: 1 },
  content: { padding: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', padding: 12, fontSize: 16, color: '#0f172a', borderRadius: 8 },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4 },
  saveButton: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  saveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});
