import React, { useRef, useEffect, useState } from 'react';
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
import { useForm as useHookForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../src/hooks/useAuth';

const { width, height } = Dimensions.get('window');

const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().min(5, 'Please enter a valid email or phone'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain one uppercase letter')
    .regex(/[0-9]/, 'Password must contain one number')
    .refine(val => !/(\d)\1/.test(val), 'Password must not contain repeating numbers'),
  confirmPassword: z.string(),
  age: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  goal: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignUpScreen() {
    const router = useRouter();
    const { register, isRegistering } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useHookForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: '', email: '', password: '', confirmPassword: '', age: '', height: '', weight: '', goal: '' }
    });

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, delay: 100, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, delay: 100, useNativeDriver: true }),
        ]).start();
    }, []);

    const onSubmit = async (data: any) => {
        if (!termsAccepted) {
            Alert.alert("Terms Required", "Please accept the Terms of Service to continue.");
            return;
        }

        const payload: any = {
            name: data.name,
            email: data.email,
            password: data.password,
            goal: data.goal,
        };

        if (data.age) payload.age = parseInt(data.age, 10);
        if (data.height) payload.height = parseFloat(data.height);
        if (data.weight) payload.weight = parseFloat(data.weight);

        try {
            await register(payload);
        } catch (error: any) {
            Alert.alert("Signup Failed", error?.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#111621" />

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

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={[styles.inputWrapper, errors.name && styles.inputWrapperError]}>
                                <MaterialIcons name="person" size={20} color="#64748b" style={styles.inputIcon} />
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                      <TextInput
                                          style={styles.input}
                                          placeholder="John Doe"
                                          placeholderTextColor="#64748b"
                                          onBlur={onBlur}
                                          onChangeText={onChange}
                                          value={value}
                                      />
                                    )}
                                />
                            </View>
                            {errors.name && <Text style={styles.errorText}>{errors.name.message as string}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email or Phone</Text>
                            <View style={[styles.inputWrapper, errors.email && styles.inputWrapperError]}>
                                <MaterialIcons name="alternate-email" size={20} color="#64748b" style={styles.inputIcon} />
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                      <TextInput
                                          style={styles.input}
                                          placeholder="Email or phone number"
                                          placeholderTextColor="#64748b"
                                          keyboardType="email-address"
                                          autoCapitalize="none"
                                          onBlur={onBlur}
                                          onChangeText={onChange}
                                          value={value}
                                      />
                                    )}
                                />
                            </View>
                            {errors.email && <Text style={styles.errorText}>{errors.email.message as string}</Text>}
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.statInputWrapper}>
                                <Text style={styles.labelSmall}>AGE</Text>
                                <Controller
                                    control={control}
                                    name="age"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                      <TextInput
                                          style={[styles.inputCenter, errors.age && styles.inputWrapperError]}
                                          placeholder="25"
                                          placeholderTextColor="#64748b"
                                          keyboardType="numeric"
                                          onBlur={onBlur}
                                          onChangeText={onChange}
                                          value={value}
                                      />
                                    )}
                                />
                            </View>
                            <View style={styles.statInputWrapper}>
                                <Text style={styles.labelSmall}>HEIGHT (CM)</Text>
                                <Controller
                                    control={control}
                                    name="height"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                      <TextInput
                                          style={[styles.inputCenter, errors.height && styles.inputWrapperError]}
                                          placeholder="180"
                                          placeholderTextColor="#64748b"
                                          keyboardType="numeric"
                                          onBlur={onBlur}
                                          onChangeText={onChange}
                                          value={value}
                                      />
                                    )}
                                />
                            </View>
                            <View style={styles.statInputWrapper}>
                                <Text style={styles.labelSmall}>WEIGHT (KG)</Text>
                                <Controller
                                    control={control}
                                    name="weight"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                      <TextInput
                                          style={[styles.inputCenter, errors.weight && styles.inputWrapperError]}
                                          placeholder="75"
                                          placeholderTextColor="#64748b"
                                          keyboardType="numeric"
                                          onBlur={onBlur}
                                          onChangeText={onChange}
                                          value={value}
                                      />
                                    )}
                                />
                            </View>
                        </View>
                        {(errors.age || errors.height || errors.weight) && (
                            <Text style={[styles.errorText, { marginBottom: 16 }]}>
                                {errors.age?.message as string || errors.height?.message as string || errors.weight?.message as string}
                            </Text>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Fitness Goal</Text>
                            <View style={[styles.inputWrapper, errors.goal && styles.inputWrapperError]}>
                                <MaterialIcons name="flag" size={20} color="#64748b" style={styles.inputIcon} />
                                <Controller
                                    control={control}
                                    name="goal"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                      <TextInput
                                          style={styles.input}
                                          placeholder="e.g. Lose Weight, Build Muscle"
                                          placeholderTextColor="#64748b"
                                          onBlur={onBlur}
                                          onChangeText={onChange}
                                          value={value}
                                      />
                                    )}
                                />
                            </View>
                            {errors.goal && <Text style={styles.errorText}>{errors.goal.message as string}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={[styles.inputWrapper, errors.password && styles.inputWrapperError]}>
                                <MaterialIcons name="lock" size={20} color="#64748b" style={styles.inputIcon} />
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                      <TextInput
                                          style={styles.input}
                                          placeholder="••••••••"
                                          placeholderTextColor="#64748b"
                                          secureTextEntry={!showPassword}
                                          onBlur={onBlur}
                                          onChangeText={onChange}
                                          value={value}
                                      />
                                    )}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconWrapper}>
                                    <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#64748b" />
                                </TouchableOpacity>
                            </View>
                            {errors.password && <Text style={styles.errorText}>{errors.password.message as string}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputWrapperError]}>
                                <MaterialIcons name="lock" size={20} color="#64748b" style={styles.inputIcon} />
                                <Controller
                                    control={control}
                                    name="confirmPassword"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                      <TextInput
                                          style={styles.input}
                                          placeholder="••••••••"
                                          placeholderTextColor="#64748b"
                                          secureTextEntry={!showPassword}
                                          onBlur={onBlur}
                                          onChangeText={onChange}
                                          value={value}
                                      />
                                    )}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconWrapper}>
                                    <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#64748b" />
                                </TouchableOpacity>
                            </View>
                            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message as string}</Text>}
                        </View>

                        <View style={styles.termsContainer}>
                            <TouchableOpacity style={styles.checkbox} onPress={() => setTermsAccepted(!termsAccepted)}>
                                {termsAccepted && <View style={styles.checkboxInner} />}
                            </TouchableOpacity>
                            <Text style={styles.termsText}>
                                By creating an account, I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} disabled={isRegistering}>
                            <Text style={styles.submitButtonText}>{isRegistering ? "Loading..." : "Create Profile"}</Text>
                            {!isRegistering && <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />}
                        </TouchableOpacity>

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
    safe: { flex: 1, backgroundColor: '#111621' },
    flex: { flex: 1 },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, justifyContent: 'space-between' },
    backButton: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: '#f1f5f9', fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center', marginLeft: -12 },
    scrollContent: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 48 },
    heroContainer: { width: '100%', height: 180, marginBottom: 20, borderRadius: 16, overflow: 'hidden' },
    heroImage: { width: '100%', height: '100%', justifyContent: 'flex-end' },
    heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(17, 22, 33, 0.4)' },
    heroTextContainer: { padding: 24 },
    heroTitle: { color: '#ffffff', fontSize: 28, fontWeight: 'bold', letterSpacing: -0.5 },
    heroSubtitle: { color: '#cbd5e1', fontSize: 14, marginTop: 4 },
    glassPanel: { backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    inputGroup: { marginBottom: 16 },
    label: { color: '#94a3b8', fontSize: 14, fontWeight: '500', marginBottom: 8, marginLeft: 4 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(17, 22, 33, 0.6)', borderWidth: 1, borderColor: '#334155', borderRadius: 16, height: 56 },
    inputWrapperError: { borderColor: '#ef4444' },
    inputIcon: { paddingLeft: 16, paddingRight: 10 },
    input: { flex: 1, color: '#ffffff', fontSize: 15, height: '100%' },
    eyeIconWrapper: { paddingHorizontal: 16, height: '100%', justifyContent: 'center' },
    errorText: { color: '#ef4444', fontSize: 12, marginTop: 4, marginLeft: 4 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 12 },
    statInputWrapper: { flex: 1 },
    labelSmall: { color: '#94a3b8', fontSize: 11, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
    inputCenter: { backgroundColor: 'rgba(17, 22, 33, 0.6)', borderWidth: 1, borderColor: '#334155', borderRadius: 16, height: 56, color: '#ffffff', fontSize: 15, textAlign: 'center' },
    termsContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, marginTop: 8, paddingHorizontal: 4 },
    checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#475569', borderRadius: 4, backgroundColor: 'rgba(17, 22, 33, 0.6)', marginRight: 12, marginTop: 2, alignItems: 'center', justifyContent: 'center' },
    checkboxInner: { width: 12, height: 12, backgroundColor: '#2463eb', borderRadius: 2 },
    termsText: { color: '#94a3b8', fontSize: 13, flex: 1, lineHeight: 20 },
    termsLink: { color: '#2463eb', fontWeight: '600' },
    submitButton: { width: '100%', height: 56, backgroundColor: '#2463eb', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8, shadowColor: '#2463eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
    submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginRight: 8 },
    loginRedirectContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
    loginRedirectText: { color: '#94a3b8', fontSize: 14 },
    loginRedirectLink: { color: '#2463eb', fontSize: 14, fontWeight: 'bold' },
});
