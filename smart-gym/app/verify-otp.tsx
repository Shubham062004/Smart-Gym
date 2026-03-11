import React, { useState, useRef, useEffect } from 'react';
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

export default function VerifyOtpScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const email = params.email as string || '';
    
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(30);

    const inputs = useRef<TextInput[]>([]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleOtpChange = (value: string, index: number) => {
        // Handle paste
        if (value.length > 1) {
            const pastedData = value.substring(0, 4).split('');
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
            // Focus on the right input
            const nextIndex = Math.min(pastedData.length, 3);
            inputs.current[nextIndex]?.focus();
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 4) {
            Alert.alert("Error", "Please enter the 4-digit OTP.");
            return;
        }

        setIsLoading(true);
        try {
            await axiosClient.post('/auth/verify-otp', { email, otp: otpString });
            router.push({ pathname: '/reset-password', params: { email, otp: otpString } });
        } catch (error: any) {
            console.error(error);
            Alert.alert("Error", error.response?.data?.message || "Invalid OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        
        try {
            await axiosClient.post('/auth/forgot-password', { email });
            Alert.alert("Success", "OTP has been resent to your email.");
            setCountdown(30);
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "Failed to resend OTP.");
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color="#f1f5f9" />
                </TouchableOpacity>
                <View style={{ width: 48 }} />
            </View>

            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.container}>
                    <Text style={styles.title}>Verify OTP</Text>
                    <Text style={styles.description}>
                        Enter the 4-digit code sent to your email
                    </Text>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { if (ref) inputs.current[index] = ref; }}
                                style={styles.otpInput}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={4} // Allow paste up to 4 length
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleVerify} disabled={isLoading}>
                        <Text style={styles.submitButtonText}>{isLoading ? "Verifying..." : "Verify & Continue"}</Text>
                    </TouchableOpacity>

                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>Didn't receive the code? </Text>
                        <TouchableOpacity onPress={handleResend} disabled={countdown > 0}>
                            <Text style={[styles.resendLink, countdown > 0 && styles.resendLinkDisabled]}>
                                {countdown > 0 ? `Resend Code (${countdown}s)` : "Resend Code"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#0f172a' },
    flex: { flex: 1 },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, justifyContent: 'space-between' },
    backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
    container: { padding: 24, flex: 1, marginTop: 40 },
    title: { color: '#ffffff', fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
    description: { color: '#94a3b8', fontSize: 16, lineHeight: 24, marginBottom: 40 },
    otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
    otpInput: { width: 64, height: 64, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#334155', borderRadius: 16, color: '#ffffff', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    submitButton: { width: '100%', height: 56, backgroundColor: '#3b82f6', borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
    resendContainer: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 },
    resendText: { color: '#94a3b8', fontSize: 14 },
    resendLink: { color: '#3b82f6', fontSize: 14, fontWeight: '600' },
    resendLinkDisabled: { color: '#64748b' },
});
