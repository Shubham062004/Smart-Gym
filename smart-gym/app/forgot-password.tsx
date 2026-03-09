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
import { MaterialIcons } from '@expo/vector-icons';

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
            const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", data.message, [
                    {
                        text: "OK",
                        onPress: () => router.push({ pathname: '/reset-password', params: { email } })
                    }
                ]);
            } else {
                Alert.alert("Error", data.message || "Something went wrong.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Network Error", "Could not connect to the server.");
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
                <Text style={styles.headerTitle}>Forgot Password</Text>
                <View style={{ width: 48 }} />
            </View>

            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.container}>
                    <Text style={styles.description}>
                        Enter the email address associated with your account and we'll send you a 6-digit OTP to reset your password.
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="mail" size={20} color="#64748b" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
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
                        {!isLoading && <MaterialIcons name="send" size={20} color="#ffffff" />}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#111621' },
    flex: { flex: 1 },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: 'space-between',
    },
    backButton: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: '#f1f5f9', fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center', marginLeft: -12 },
    container: { padding: 24, flex: 1, justifyContent: 'center', paddingBottom: 100 },
    description: { color: '#94a3b8', fontSize: 15, lineHeight: 22, textAlign: 'center', marginBottom: 32 },
    inputGroup: { marginBottom: 24 },
    label: { color: '#cbd5e1', fontSize: 14, fontWeight: '500', marginBottom: 8, marginLeft: 4 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1c1f27', borderWidth: 1, borderColor: '#3b4354', borderRadius: 12, height: 52 },
    inputIcon: { paddingLeft: 16, paddingRight: 10 },
    input: { flex: 1, color: '#ffffff', fontSize: 15, height: '100%', paddingRight: 16 },
    submitButton: { width: '100%', height: 52, backgroundColor: '#2463eb', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#2463eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
    submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600', marginRight: 8 },
});
