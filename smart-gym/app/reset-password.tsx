import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import axiosClient from '../src/api/axiosClient';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const email = params.email as string || '';
    const otp = params.otp as string || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const hasMinLength = newPassword.length >= 8;
    const hasOneNumber = /[0-9]/.test(newPassword);

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        if (!hasMinLength) {
            Alert.alert("Error", "Password must be at least 8 characters.");
            return;
        }
        if (!/[a-z]/.test(newPassword)) {
            Alert.alert("Error", "Password must contain one lowercase letter.");
            return;
        }
        if (!/[A-Z]/.test(newPassword)) {
            Alert.alert("Error", "Password must contain one uppercase letter.");
            return;
        }
        if (!hasOneNumber) {
            Alert.alert("Error", "Password must contain one number.");
            return;
        }
        if (/(\d)\1/.test(newPassword)) {
            Alert.alert("Error", "Password must not contain repeating numbers.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axiosClient.post('/auth/reset-password', { email, otp, newPassword });
            Alert.alert("Success", response.data.message, [
                {
                    text: "Login",
                    onPress: () => router.replace('/login')
                }
            ]);
        } catch (error: any) {
            console.error(error);
            Alert.alert("Error", error.response?.data?.message || "Invalid or expired OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color="#f1f5f9" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>OnlyFitness</Text>
            </View>

            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.container}>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.description}>
                        Create a new secure password for your account
                    </Text>

                    <View style={styles.card}>
                        {/* New Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>New Password</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="lock-outline" size={20} color="#64748b" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter new password"
                                    placeholderTextColor="#64748b"
                                    secureTextEntry={!showPassword}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconWrapper}>
                                    <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#64748b" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm New Password</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="loop" size={20} color="#64748b" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Re-enter new password"
                                    placeholderTextColor="#64748b"
                                    secureTextEntry={!showPassword}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconWrapper}>
                                    <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#64748b" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.indicatorsRow}>
                            <View style={[styles.indicatorBadge, hasMinLength ? styles.indicatorActive : null]}>
                                <MaterialIcons name="check-circle" size={14} color={hasMinLength ? "#4ade80" : "#64748b"} />
                                <Text style={[styles.indicatorText, hasMinLength ? styles.indicatorTextActive : null]}>8+ Characters</Text>
                            </View>
                            <View style={[styles.indicatorBadge, hasOneNumber ? styles.indicatorActive : null]}>
                                <MaterialIcons name="check-circle" size={14} color={hasOneNumber ? "#4ade80" : "#64748b"} />
                                <Text style={[styles.indicatorText, hasOneNumber ? styles.indicatorTextActive : null]}>One Number</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.submitButton} onPress={handleResetPassword} disabled={isLoading}>
                            <Text style={styles.submitButtonText}>{isLoading ? "Updating..." : "Update Password"}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Having trouble? <Text style={styles.footerLink}>Contact Support</Text></Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#0f172a' },
    flex: { flex: 1 },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 0,
        justifyContent: 'flex-start',
    },
    backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    headerTitle: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
    container: { padding: 24, flex: 1, paddingTop: 40 },
    title: { color: '#ffffff', fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
    description: { color: '#94a3b8', fontSize: 16, lineHeight: 24, marginBottom: 40 },
    card: { width: '100%', backgroundColor: 'rgba(30,41,59,0.5)', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    inputGroup: { marginBottom: 24 },
    label: { color: '#f8fafc', fontSize: 14, fontWeight: '600', marginBottom: 12 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 16, height: 56 },
    inputIcon: { paddingLeft: 16, paddingRight: 10 },
    input: { flex: 1, color: '#ffffff', fontSize: 15, height: '100%', paddingRight: 16 },
    eyeIconWrapper: { paddingHorizontal: 16, height: '100%', justifyContent: 'center' },
    indicatorsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
    indicatorBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
    indicatorActive: { backgroundColor: 'rgba(74,222,128,0.1)' },
    indicatorText: { color: '#64748b', fontSize: 12, fontWeight: '600', marginLeft: 6 },
    indicatorTextActive: { color: '#4ade80' },
    submitButton: { width: '100%', height: 56, backgroundColor: '#3b82f6', borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
    footerContainer: { marginTop: 'auto', marginBottom: 20, alignItems: 'center' },
    footerText: { color: '#64748b', fontSize: 14 },
    footerLink: { color: '#3b82f6', fontWeight: 'bold' },
});
