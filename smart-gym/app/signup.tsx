import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    StatusBar,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

// Re-using same icons from login
const DumbbellIcon: React.FC = () => <Text style={{ fontSize: 26, color: '#fff' }}>🏋️</Text>;
const EyeOffIcon: React.FC = () => <Text style={{ fontSize: 16, color: '#64748b' }}>🙈</Text>;
const EyeOnIcon: React.FC = () => <Text style={{ fontSize: 16, color: '#64748b' }}>👁️</Text>;
const MailIcon: React.FC = () => <Text style={{ fontSize: 16, color: '#64748b' }}>✉️</Text>;
const LockIcon: React.FC = () => <Text style={{ fontSize: 16, color: '#64748b' }}>🔒</Text>;
const UserIcon: React.FC = () => <Text style={{ fontSize: 16, color: '#64748b' }}>👤</Text>;
const BackIcon: React.FC = () => <Text style={{ fontSize: 20, color: '#f1f5f9' }}>‹</Text>;

const { width, height } = Dimensions.get('window');

export default function SignUpScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Optional
    const [age, setAge] = useState('');
    const [heightVal, setHeightVal] = useState('');
    const [weight, setWeight] = useState('');
    const [goal, setGoal] = useState('');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, delay: 100, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, delay: 100, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleSignUp = () => {
        router.replace('/(tabs)' as any);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#111621" />

            <View style={styles.backButtonWrapper}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                    <BackIcon />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

                        <View style={styles.brandingSection}>
                            <View style={styles.logoCircle}>
                                <DumbbellIcon />
                            </View>
                            <Text style={styles.heading}>Create Account</Text>
                            <Text style={styles.subheading}>Join the AI fitness revolution today</Text>
                        </View>

                        {/* Full Name */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <View style={styles.inputIcon}><UserIcon /></View>
                                <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor="#4b5563" value={name} onChangeText={setName} selectionColor="#2463eb" />
                            </View>
                        </View>

                        {/* Email */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <View style={styles.inputIcon}><MailIcon /></View>
                                <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor="#4b5563" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} selectionColor="#2463eb" />
                            </View>
                        </View>

                        {/* Password */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <View style={[styles.inputWrapper, { flex: 1 }]}>
                                    <View style={styles.inputIcon}><LockIcon /></View>
                                    <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#4b5563" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} selectionColor="#2463eb" />
                                </View>
                                <TouchableOpacity style={styles.eyeButtonOutside} onPress={() => setShowPassword(prev => !prev)} activeOpacity={0.7}>
                                    {showPassword ? <EyeOnIcon /> : <EyeOffIcon />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputWrapper}>
                                <View style={styles.inputIcon}><LockIcon /></View>
                                <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#4b5563" secureTextEntry={!showPassword} value={confirmPassword} onChangeText={setConfirmPassword} selectionColor="#2463eb" />
                            </View>
                        </View>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OPTIONAL DETAILS</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.row3}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Age</Text>
                                <View style={styles.inputWrapper}><TextInput style={styles.input} placeholder="25" placeholderTextColor="#4b5563" keyboardType="numeric" value={age} onChangeText={setAge} selectionColor="#2463eb" /></View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Height (cm)</Text>
                                <View style={styles.inputWrapper}><TextInput style={styles.input} placeholder="175" placeholderTextColor="#4b5563" keyboardType="numeric" value={heightVal} onChangeText={setHeightVal} selectionColor="#2463eb" /></View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Weight (kg)</Text>
                                <View style={styles.inputWrapper}><TextInput style={styles.input} placeholder="70" placeholderTextColor="#4b5563" keyboardType="numeric" value={weight} onChangeText={setWeight} selectionColor="#2463eb" /></View>
                            </View>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Fitness Goal</Text>
                            <View style={styles.goalsRow}>
                                {['Lose Weight', 'Build Muscle', 'Stay Fit'].map(g => (
                                    <TouchableOpacity
                                        key={g}
                                        style={[styles.goalButton, goal === g && styles.goalButtonActive]}
                                        onPress={() => setGoal(g)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.goalText, goal === g && styles.goalTextActive]}>{g}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp} activeOpacity={0.85}>
                            <Text style={styles.signupButtonText}>Sign Up</Text>
                        </TouchableOpacity>

                        <View style={styles.loginRow}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/login' as any)} activeOpacity={0.7}>
                                <Text style={styles.loginLink}>Log In</Text>
                            </TouchableOpacity>
                        </View>

                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#111621' },
    flex: { flex: 1 },
    backButtonWrapper: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, zIndex: 10 },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
    scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingBottom: 32, paddingTop: 8 },
    card: { backgroundColor: 'rgba(28,34,48,0.75)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 24, elevation: 16 },
    brandingSection: { alignItems: 'center', marginBottom: 24 },
    logoCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#2463eb', alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#2463eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
    heading: { color: '#f1f5f9', fontSize: 26, fontWeight: '700', letterSpacing: -0.5, marginBottom: 4, textAlign: 'center' },
    subheading: { color: '#94a3b8', fontSize: 13, fontWeight: '400', textAlign: 'center' },
    fieldGroup: { marginBottom: 16 },
    label: { color: '#cbd5e1', fontSize: 13, fontWeight: '500', marginBottom: 8, marginLeft: 4 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(17,22,33,0.85)', borderWidth: 1, borderColor: '#334155', borderRadius: 14, paddingHorizontal: 14, height: 52 },
    inputIcon: { marginRight: 10, width: 22, alignItems: 'center' },
    input: { flex: 1, color: '#f1f5f9', fontSize: 15, fontWeight: '400', paddingVertical: 0 },
    eyeButtonOutside: { width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(17,22,33,0.85)', borderWidth: 1, borderColor: '#334155', alignItems: 'center', justifyContent: 'center' },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 10 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#1e293b' },
    dividerText: { color: '#475569', fontSize: 10, fontWeight: '600', letterSpacing: 0.8 },
    row3: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    goalsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    goalButton: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(17,22,33,0.85)', borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
    goalButtonActive: { backgroundColor: 'rgba(36,99,235,0.2)', borderColor: '#2463eb' },
    goalText: { color: '#94a3b8', fontSize: 13, fontWeight: '500' },
    goalTextActive: { color: '#2463eb', fontWeight: '600' },
    signupButton: { width: '100%', height: 54, borderRadius: 14, backgroundColor: '#2463eb', alignItems: 'center', justifyContent: 'center', marginTop: 12, shadowColor: '#2463eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
    signupButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', letterSpacing: 0.3 },
    loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
    loginText: { color: '#94a3b8', fontSize: 13 },
    loginLink: { color: '#2463eb', fontSize: 13, fontWeight: '600' },
});
