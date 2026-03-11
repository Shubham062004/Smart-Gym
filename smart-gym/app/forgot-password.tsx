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
import { useRouter } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import axiosClient from '../src/api/axiosClient';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axiosClient.post('/auth/forgot-password', { email });
            Alert.alert("Success", response.data.message, [
                {
                    text: "OK",
                    onPress: () => router.push({ pathname: '/verify-otp', params: { email } })
                }
            ]);
        } catch (error: any) {
            console.error(error);
            Alert.alert("Error", error.response?.data?.message || "Could not connect to the server.");
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
            </View>

            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="screen-lock-portrait" size={32} color="#3b82f6" style={styles.heroIcon} />
                    </View>
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.description}>
                        No worries! Enter your email address below and we'll send you an OTP for verification.
                    </Text>

                    <View style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email address</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="example@fitcoach.ai"
                                    placeholderTextColor="#64748b"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.submitButton} onPress={handleSendOTP} disabled={isLoading}>
                            <Text style={styles.submitButtonText}>{isLoading ? "Sending..." : "Send OTP"}</Text>
                            {!isLoading && <MaterialIcons name="send" size={16} color="#ffffff" />}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.loginContainer} onPress={() => router.push('/login')}>
                        <Feather name="log-in" size={16} color="#94a3b8" />
                        <Text style={styles.loginText}>Back to Login</Text>
                    </TouchableOpacity>
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
    backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
    container: { padding: 24, flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(59,130,246,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    heroIcon: { opacity: 0.9 },
    title: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    description: { color: '#94a3b8', fontSize: 16, lineHeight: 24, textAlign: 'center', marginBottom: 40, paddingHorizontal: 10 },
    card: { width: '100%', backgroundColor: 'rgba(30,41,59,0.5)', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    inputGroup: { marginBottom: 24 },
    label: { color: '#f8fafc', fontSize: 14, fontWeight: '600', marginBottom: 12 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 16, height: 56 },
    inputIcon: { paddingLeft: 16, paddingRight: 10 },
    input: { flex: 1, color: '#ffffff', fontSize: 15, height: '100%', paddingRight: 16 },
    submitButton: { width: '100%', height: 56, backgroundColor: '#3b82f6', borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600', marginRight: 8 },
    loginContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 40 },
    loginText: { color: '#94a3b8', fontSize: 15, fontWeight: '600', marginLeft: 8 },
});
