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

const { width, height } = Dimensions.get('window');

// --- Google SVG as a component (using View approximation) ---
const GoogleIcon: React.FC = () => (
    <View style={googleStyles.container}>
        <View style={[googleStyles.segment, { backgroundColor: '#4285F4', top: 0, left: 6, width: 8, height: 10 }]} />
        <View style={[googleStyles.segment, { backgroundColor: '#34A853', bottom: 0, left: 6, width: 8, height: 10 }]} />
        <View style={[googleStyles.segment, { backgroundColor: '#FBBC05', left: 0, top: 6, width: 10, height: 8 }]} />
        <View style={[googleStyles.segment, { backgroundColor: '#EA4335', right: 0, top: 0, width: 10, height: 10 }]} />
        <View style={googleStyles.center} />
    </View>
);

const googleStyles = StyleSheet.create({
    container: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    segment: {
        position: 'absolute',
        borderRadius: 2,
    },
    center: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
});

// X (Twitter) icon
const XIcon: React.FC = () => (
    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>𝕏</Text>
);

// Dumbbell icon approximation
const DumbbellIcon: React.FC = () => (
    <Text style={{ fontSize: 26, color: '#fff' }}>🏋️</Text>
);

// Eye icons
const EyeOffIcon: React.FC = () => (
    <Text style={{ fontSize: 16, color: '#64748b' }}>🙈</Text>
);
const EyeOnIcon: React.FC = () => (
    <Text style={{ fontSize: 16, color: '#64748b' }}>👁️</Text>
);

// Mail icon
const MailIcon: React.FC = () => (
    <Text style={{ fontSize: 16, color: '#64748b' }}>✉️</Text>
);

// Lock icon
const LockIcon: React.FC = () => (
    <Text style={{ fontSize: 16, color: '#64748b' }}>🔒</Text>
);

// Back arrow
const BackIcon: React.FC = () => (
    <Text style={{ fontSize: 20, color: '#f1f5f9' }}>‹</Text>
);

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [emailFocused, setEmailFocused] = useState<boolean>(false);
    const [passwordFocused, setPasswordFocused] = useState<boolean>(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const logoScaleAnim = useRef(new Animated.Value(0.5)).current;
    const glowAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        // Logo pop in
        Animated.spring(logoScaleAnim, {
            toValue: 1,
            tension: 60,
            friction: 6,
            useNativeDriver: true,
        }).start();

        // Card fade + slide up
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                delay: 150,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 700,
                delay: 150,
                useNativeDriver: true,
            }),
        ]).start();

        // Glow pulse loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 0.7, duration: 2000, useNativeDriver: true }),
                Animated.timing(glowAnim, { toValue: 0.4, duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const handleLogin = () => {
        router.replace('/(tabs)');
    };

    const onBack = () => {
        router.back();
    };

    const onGoogleLogin = () => {
        router.replace('/(tabs)');
    };

    const onXLogin = () => {
        router.replace('/(tabs)');
    };

    const onSignUp = () => {
        router.push('/signup' as any);
    };
    const onForgotPassword = () => { };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#111621" />

            {/* Background glow blobs */}
            <Animated.View style={[styles.glowTopRight, { opacity: glowAnim }]} />
            <Animated.View style={[styles.glowBottomLeft, { opacity: glowAnim }]} />

            {/* Back Button */}
            <View style={styles.backButtonWrapper}>
                <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
                    <BackIcon />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View
                        style={[
                            styles.card,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                        ]}
                    >
                        {/* Branding */}
                        <View style={styles.brandingSection}>
                            <Animated.View
                                style={[
                                    styles.logoCircle,
                                    { transform: [{ scale: logoScaleAnim }] },
                                ]}
                            >
                                <DumbbellIcon />
                            </Animated.View>
                            <Text style={styles.heading}>Welcome Back</Text>
                            <Text style={styles.subheading}>Sign in to continue your AI fitness journey</Text>
                        </View>

                        {/* Email Field */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Email Address or Phone Number</Text>
                            <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                                <View style={styles.inputIcon}>
                                    <MailIcon />
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="you@example.com / +1234567890"
                                    placeholderTextColor="#4b5563"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                    selectionColor="#2463eb"
                                />
                            </View>
                        </View>

                        {/* Password Field */}
                        <View style={styles.fieldGroup}>
                            <View style={styles.passwordLabelRow}>
                                <Text style={styles.label}>Password</Text>
                                <TouchableOpacity onPress={onForgotPassword} activeOpacity={0.7}>
                                    <Text style={styles.forgotText}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <View style={[styles.inputWrapper, { flex: 1 }, passwordFocused && styles.inputWrapperFocused]}>
                                    <View style={styles.inputIcon}>
                                        <LockIcon />
                                    </View>
                                    <TextInput
                                        style={[styles.input, styles.passwordInput]}
                                        placeholder="••••••••"
                                        placeholderTextColor="#4b5563"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                        selectionColor="#2463eb"
                                    />
                                </View>
                                <TouchableOpacity
                                    style={styles.eyeButtonOutside}
                                    onPress={() => setShowPassword(prev => !prev)}
                                    activeOpacity={0.7}
                                >
                                    {showPassword ? <EyeOnIcon /> : <EyeOffIcon />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.loginButtonText}>Log In</Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Login */}
                        <View style={styles.socialRow}>
                            <TouchableOpacity
                                style={styles.socialButton}
                                onPress={onGoogleLogin}
                                activeOpacity={0.8}
                            >
                                <GoogleIcon />
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.socialButton}
                                onPress={onXLogin}
                                activeOpacity={0.8}
                            >
                                <XIcon />
                            </TouchableOpacity>
                        </View>

                        {/* Sign Up Link */}
                        <View style={styles.signupRow}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={onSignUp} activeOpacity={0.7}>
                                <Text style={styles.signupLink}>Sign up now</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#111621',
    },
    flex: {
        flex: 1,
    },

    // Background glows
    glowTopRight: {
        position: 'absolute',
        top: -height * 0.1,
        right: -width * 0.15,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#2463eb',
        // React Native doesn't support CSS blur, so we simulate with opacity + large radius
        opacity: 0.15,
    },
    glowBottomLeft: {
        position: 'absolute',
        bottom: -height * 0.05,
        left: -width * 0.1,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#2463eb',
        opacity: 0.08,
    },

    // Back button
    backButtonWrapper: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 32,
        paddingTop: 8,
    },

    // Card
    card: {
        backgroundColor: 'rgba(28,34,48,0.75)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        padding: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
        elevation: 16,
    },

    // Branding
    brandingSection: {
        alignItems: 'center',
        marginBottom: 28,
    },
    logoCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#2463eb',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#2463eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
    heading: {
        color: '#f1f5f9',
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: -0.5,
        marginBottom: 6,
        textAlign: 'center',
    },
    subheading: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',
    },

    // Fields
    fieldGroup: {
        marginBottom: 16,
    },
    label: {
        color: '#cbd5e1',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 8,
        marginLeft: 4,
    },
    passwordLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    forgotText: {
        color: '#2463eb',
        fontSize: 12,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(17,22,33,0.85)',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 52,
    },
    inputWrapperFocused: {
        borderColor: '#2463eb',
        shadowColor: '#2463eb',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 10,
        width: 22,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        color: '#f1f5f9',
        fontSize: 15,
        fontWeight: '400',
        paddingVertical: 0,
    },
    passwordInput: {
        paddingRight: 8,
    },
    eyeButton: {
        paddingLeft: 8,
        paddingVertical: 4,
    },
    eyeButtonOutside: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: 'rgba(17,22,33,0.85)',
        borderWidth: 1,
        borderColor: '#334155',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Login button
    loginButton: {
        width: '100%',
        height: 54,
        borderRadius: 14,
        backgroundColor: '#2463eb',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#2463eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.3,
    },

    // Divider
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        gap: 10,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#1e293b',
    },
    dividerText: {
        color: '#475569',
        fontSize: 11,
        fontWeight: '500',
        letterSpacing: 0.8,
    },

    // Social
    socialRow: {
        flexDirection: 'column',
    },
    googleButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: '#111621',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 14,
        height: 54,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#111621',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 14,
        height: 50,
    },
    socialButtonText: {
        color: '#cbd5e1',
        fontSize: 14,
        fontWeight: '500',
    },

    // Sign up
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    signupText: {
        color: '#94a3b8',
        fontSize: 13,
    },
    signupLink: {
        color: '#2463eb',
        fontSize: 13,
        fontWeight: '600',
    },
});
