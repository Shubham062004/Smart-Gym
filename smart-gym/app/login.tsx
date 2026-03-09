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
    ImageBackground,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
// Removed unused expo-linear-gradient import


const { width, height } = Dimensions.get('window');

// SVG Path for Google Icon
const GoogleIcon: React.FC = () => (
    <View style={{ width: 24, height: 24, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontWeight: 'bold', color: '#EA4335', fontSize: 16 }}>G</Text>
    </View>
);

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        try {
            // Replace with actual local IP if running on device. Assuming localhost for web/simulator
            const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                // Here we might save token into AsyncStorage / SecureStore
                router.replace('/(tabs)');
            } else {
                Alert.alert("Login Failed", data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert("Network Error", "Could not connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#111621" />

            {/* Decorative background blur equivalent (just a subtle glow with opacity) */}
            <View style={styles.topGlow} />

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
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1, width: '100%' }}>

                        {/* Header Section */}
                        <View style={styles.headerContainer}>
                            <View style={styles.logoBox}>
                                <MaterialIcons name="fitness-center" size={48} color="#ffffff" />
                            </View>
                            <Text style={styles.mainTitle}>Smart GYM</Text>
                            <Text style={styles.subTitle}>Your personal AI trainer</Text>
                        </View>

                        {/* Hero Image */}
                        <View style={styles.heroImageContainer}>
                            <ImageBackground
                                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQqOg5InAITjNfP9qAzOA4s6D0BpcTfr-IuDfb1GYA2Djgzy5EQoTPh0VZojNnuLAD26Jrz00f55ASNizWceDWMv-j5Kx37E2BrT7b-T8M8dPORldaji7SNBiDVYJdArKcUtI_mQemD-Cv_jrpkqOSgaZY3VJKc7XlTBbqTgPt9JY_Bnjw-yoDkc7_i1YdFbUDA7rGKkTxTtQc_FvVcFsFm5b9ZYFE4WfuGi6h6dLPxBirkZdB0iVh-kHKXLfzBX8BCzhJ6KsaxHE" }}
                                style={styles.heroImage}
                                imageStyle={{ borderRadius: 12 }}
                            >
                                <View style={styles.heroOverlay} />
                                <View style={styles.aiTag}>
                                    <MaterialIcons name="bolt" size={16} color="#2463eb" />
                                    <Text style={styles.aiTagText}>AI Tracking Active</Text>
                                </View>
                            </ImageBackground>
                        </View>

                        {/* Login Form */}
                        <View style={styles.formContainer}>
                            <Text style={styles.formTitle}>Welcome Back</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputWrapper}>
                                    <MaterialIcons name="mail" size={20} color="#64748b" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email or Phone number"
                                        placeholderTextColor="#64748b"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputWrapper}>
                                    <MaterialIcons name="lock" size={20} color="#64748b" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your password"
                                        placeholderTextColor="#64748b"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconWrapper}>
                                        <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#64748b" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.forgotPasswordContainer}>
                                <TouchableOpacity>
                                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
                                <Text style={styles.loginButtonText}>{isLoading ? "Loading..." : "Login"}</Text>
                                {!isLoading && <MaterialIcons name="arrow-forward" size={20} color="#fff" />}
                            </TouchableOpacity>
                        </View>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Login */}
                        <TouchableOpacity style={styles.googleButton}>
                            <GoogleIcon />
                            <Text style={styles.googleButtonText}>Continue with Google</Text>
                        </TouchableOpacity>

                        {/* Sign Up Link */}
                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/signup')}>
                                <Text style={styles.signupLink}>Sign up</Text>
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
    topGlow: {
        position: 'absolute',
        top: -height * 0.1,
        left: 0,
        width: '100%',
        height: '50%',
        backgroundColor: 'rgba(36, 99, 235, 0.1)',
        borderBottomLeftRadius: 300,
        borderBottomRightRadius: 300,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 24,
        alignItems: 'center',
    },

    // Header / Branding
    headerContainer: {
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    logoBox: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#2463eb', // Emulating linear gradient simply
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2463eb',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
        marginBottom: 16,
    },
    mainTitle: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },
    subTitle: {
        color: '#94a3b8',
        fontSize: 14,
        marginTop: 6,
        fontWeight: '500',
    },

    // Hero Image
    heroImageContainer: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    heroImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(17, 22, 33, 0.6)',
    },
    aiTag: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(17, 22, 33, 0.7)',
        margin: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    aiTagText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },

    // Form
    formContainer: {
        width: '100%',
    },
    formTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        color: '#cbd5e1',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1c1f27',
        borderWidth: 1,
        borderColor: '#3b4354',
        borderRadius: 12,
        height: 52,
    },
    inputIcon: {
        paddingLeft: 16,
        paddingRight: 10,
    },
    input: {
        flex: 1,
        color: '#ffffff',
        fontSize: 15,
        height: '100%',
        paddingRight: 16,
    },
    eyeIconWrapper: {
        paddingHorizontal: 16,
        height: '100%',
        justifyContent: 'center',
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    forgotPasswordText: {
        color: '#2463eb',
        fontSize: 14,
        fontWeight: '500',
    },

    // Login Button
    loginButton: {
        width: '100%',
        height: 52,
        backgroundColor: '#2463eb',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2463eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },

    // Divider
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 24,
        width: '100%',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(59, 67, 84, 0.5)',
    },
    dividerText: {
        color: '#64748b',
        fontSize: 13,
        paddingHorizontal: 16,
        backgroundColor: '#111621',
    },

    // Social Button
    googleButton: {
        width: '100%',
        height: 52,
        backgroundColor: '#1c1f27',
        borderWidth: 1,
        borderColor: '#3b4354',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    googleButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '500',
        marginLeft: 12,
    },

    // Signup Container
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8,
    },
    signupText: {
        color: '#94a3b8',
        fontSize: 14,
    },
    signupLink: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
        textDecorationColor: '#2463eb',
    },
});

