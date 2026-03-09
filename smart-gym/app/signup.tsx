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
// Removed unused Picker import


const { width, height } = Dimensions.get('window');

export default function SignUpScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Optional fields from design
    const [age, setAge] = useState('');
    const [heightVal, setHeightVal] = useState('');
    const [weight, setWeight] = useState('');
    const [goal, setGoal] = useState('Select your goal');

    const [termsAccepted, setTermsAccepted] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay: 100,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                delay: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all mandatory fields.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        if (!termsAccepted) {
            Alert.alert("Terms Required", "Please accept the Terms of Service to continue.");
            return;
        }

        setIsLoading(true);
        try {
            // Check if on device vs simulator
            const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Sending name, email, password to fit the backend schema
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Account created successfully!", [
                    { text: "OK", onPress: () => router.replace('/login') }
                ]);
            } else {
                Alert.alert("Signup Failed", data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Signup Error:", error);
            Alert.alert("Network Error", "Could not connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#111621" />

            {/* Back Button and Title */}
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                    <MaterialIcons name="arrow-back" size={24} color="#f1f5f9" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Account</Text>
                <View style={{ width: 48 }} />
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                    {/* Hero Section */}
                    <View style={styles.heroContainer}>
                        <ImageBackground
                            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiQ41XduabUsGhWPQ0HqM0hAk02gHxZn2p_VR-DIBUbDfSg5ZC-FnggTcd9o47D1yo9drexvwj29wGMbaqmBLGAhQzL5heZyyyEQhRXRgwH-YQkNfdQ4acFiZbelpOEJhajTmaAA6d5mO_XegzSVY7s0_21UzSb59Gml0mqCzJPM33EazP_jOi83HEGio-mVs8X8ja7SqmM284Jyk5hfNJHEqsvvlyrOaWT0yg-xqXBd4ShRfhIu07cg6cqElVuK_dumfnF8P0R24" }}
                            style={styles.heroImage}
                            imageStyle={{ borderRadius: 16 }}
                        >
                            <View style={styles.heroOverlay} />
                            <View style={styles.heroTextContainer}>
                                <Text style={styles.heroTitle}>Start Your Transformation</Text>
                                <Text style={styles.heroSubtitle}>Join the elite community and track your progress.</Text>
                            </View>
                        </ImageBackground>
                    </View>

                    <Animated.View style={[styles.glassPanel, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

                        {/* Profile Identity */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="person" size={20} color="#64748b" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="John Doe"
                                    placeholderTextColor="#64748b"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email or Phone</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="alternate-email" size={20} color="#64748b" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="email@example.com"
                                    placeholderTextColor="#64748b"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        {/* Bio Stats Row */}
                        <View style={styles.statsRow}>
                            <View style={styles.statInputWrapper}>
                                <Text style={styles.labelSmall}>AGE</Text>
                                <TextInput
                                    style={styles.inputCenter}
                                    placeholder="25"
                                    placeholderTextColor="#64748b"
                                    keyboardType="numeric"
                                    value={age}
                                    onChangeText={setAge}
                                />
                            </View>
                            <View style={styles.statInputWrapper}>
                                <Text style={styles.labelSmall}>HEIGHT (CM)</Text>
                                <TextInput
                                    style={styles.inputCenter}
                                    placeholder="180"
                                    placeholderTextColor="#64748b"
                                    keyboardType="numeric"
                                    value={heightVal}
                                    onChangeText={setHeightVal}
                                />
                            </View>
                            <View style={styles.statInputWrapper}>
                                <Text style={styles.labelSmall}>WEIGHT (KG)</Text>
                                <TextInput
                                    style={styles.inputCenter}
                                    placeholder="75"
                                    placeholderTextColor="#64748b"
                                    keyboardType="numeric"
                                    value={weight}
                                    onChangeText={setWeight}
                                />
                            </View>
                        </View>

                        {/* Fitness Goal */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Fitness Goal</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="api" size={20} color="#64748b" style={styles.inputIcon} />
                                {/* Emulating select/picker since standard picker looks different per OS */}
                                {/* For simplicity, just an input here, but let's make it a text field acting like a dropdown visually. */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Select your goal"
                                    placeholderTextColor="#ffffff"
                                    value={goal}
                                    editable={false}
                                />
                                <MaterialIcons name="expand-more" size={20} color="#64748b" style={{ paddingRight: 16 }} />
                            </View>
                        </View>

                        {/* Passwords */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="lock" size={20} color="#64748b" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
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

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="lock" size={20} color="#64748b" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#64748b"
                                    secureTextEntry={!showPassword}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </View>
                        </View>

                        {/* Terms */}
                        <View style={styles.termsContainer}>
                            <TouchableOpacity style={styles.checkbox} onPress={() => setTermsAccepted(!termsAccepted)}>
                                {termsAccepted && <View style={styles.checkboxInner} />}
                            </TouchableOpacity>
                            <Text style={styles.termsText}>
                                By creating an account, I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
                            </Text>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity style={styles.submitButton} onPress={handleSignUp} disabled={isLoading}>
                            <Text style={styles.submitButtonText}>{isLoading ? "Loading..." : "Create Profile"}</Text>
                            {!isLoading && <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />}
                        </TouchableOpacity>

                        {/* Login Redirect */}
                        <View style={styles.loginRedirectContainer}>
                            <Text style={styles.loginRedirectText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text style={styles.loginRedirectLink}>Log In</Text>
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
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: 'space-between',
    },
    backButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#f1f5f9',
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
        marginLeft: -12, // centers it perfectly despite the absolute-like icon space
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingBottom: 48,
    },
    heroContainer: {
        width: '100%',
        height: 180,
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(17, 22, 33, 0.4)',
    },
    heroTextContainer: {
        padding: 24,
    },
    heroTitle: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },
    heroSubtitle: {
        color: '#cbd5e1',
        fontSize: 14,
        marginTop: 4,
    },

    // Form Glass Panel
    glassPanel: {
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(17, 22, 33, 0.6)',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 16,
        height: 56,
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
    },
    eyeIconWrapper: {
        paddingHorizontal: 16,
        height: '100%',
        justifyContent: 'center',
    },

    // Stats Row
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 12,
    },
    statInputWrapper: {
        flex: 1,
    },
    labelSmall: {
        color: '#94a3b8',
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputCenter: {
        backgroundColor: 'rgba(17, 22, 33, 0.6)',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 16,
        height: 56,
        color: '#ffffff',
        fontSize: 15,
        textAlign: 'center',
    },

    // Terms
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
        marginTop: 8,
        paddingHorizontal: 4,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#475569',
        borderRadius: 4,
        backgroundColor: 'rgba(17, 22, 33, 0.6)',
        marginRight: 12,
        marginTop: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        backgroundColor: '#2463eb',
        borderRadius: 2,
    },
    termsText: {
        color: '#94a3b8',
        fontSize: 13,
        flex: 1,
        lineHeight: 20,
    },
    termsLink: {
        color: '#2463eb',
        fontWeight: '600',
    },

    // Submit button
    submitButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#2463eb',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#2463eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },

    // Redirect
    loginRedirectContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    loginRedirectText: {
        color: '#94a3b8',
        fontSize: 14,
    },
    loginRedirectLink: {
        color: '#2463eb',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
