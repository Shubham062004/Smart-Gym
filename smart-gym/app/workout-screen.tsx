import React, { useRef, useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView, 
    Dimensions, 
    ScrollView,
    Animated,
    PanResponder
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import axiosClient from '../src/api/axiosClient';

const { width, height } = Dimensions.get('window');

export default function WorkoutScreen() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);

    // Live Workout State
    const [reps, setReps] = useState(0);
    const [time, setTime] = useState(0);
    const [heartRate, setHeartRate] = useState(148);
    const [formAccuracy, setFormAccuracy] = useState(96);
    const [isPaused, setIsPaused] = useState(true);
    const timerRef = useRef<any>(null);

    // Draggable Bottom Sheet State
    const MAX_DOWN = height * 0.48;
    const panY = useRef(new Animated.Value(0)).current;
    
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
            onPanResponderGrant: () => {
                panY.setOffset((panY as any)._value || 0);
                panY.setValue(0);
            },
            onPanResponderMove: Animated.event(
                [null, { dy: panY }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (_, gestureState) => {
                panY.flattenOffset();
                if (gestureState.dy > 50 || gestureState.vy > 0.5) {
                    Animated.spring(panY, { toValue: MAX_DOWN, useNativeDriver: true, bounciness: 0 }).start();
                } else if (gestureState.dy < -50 || gestureState.vy < -0.5) {
                    Animated.spring(panY, { toValue: 0, useNativeDriver: true, bounciness: 0 }).start();
                } else {
                    Animated.spring(panY, { toValue: (panY as any)._value > MAX_DOWN / 2 ? MAX_DOWN : 0, useNativeDriver: true, bounciness: 0 }).start();
                }
            }
        })
    ).current;

    const clampedPanY = panY.interpolate({
        inputRange: [0, MAX_DOWN],
        outputRange: [0, MAX_DOWN],
        extrapolate: 'clamp'
    });

    const toggleBottomSheet = () => {
        const isUp = ((panY as any)._value || 0) < MAX_DOWN / 2;
        Animated.spring(panY, {
            toValue: isUp ? MAX_DOWN : 0,
            useNativeDriver: true,
            bounciness: 0
        }).start();
    };

    // Timer Effect
    useEffect(() => {
        if (!isPaused) {
            timerRef.current = setInterval(() => {
                setTime(prev => +(prev + 0.1).toFixed(1));
            }, 100);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isPaused]);

    // Backend Saving Mutation
    const saveSessionMutation = useMutation({
        mutationFn: (data: any) => axiosClient.post('/workouts/session', data),
        onSuccess: () => {
            // After successfully saving, navigate to summary
            router.push({
                pathname: '/workout-summary' as any,
                params: {
                    exerciseName: "Back Squats",
                    totalReps: reps.toString(),
                    duration: Math.round(time).toString(),
                    caloriesBurned: Math.round(time * 0.15).toString(), // Basic calc
                    formAccuracy: formAccuracy.toString()
                }
            });
        },
        onError: (error) => {
            console.error("Failed to save session to backend:", error);
        }
    });

    const handleReset = () => {
        setReps(0);
        setTime(0);
        setIsPaused(true);
    };

    const toggleWorkingState = () => {
        // Dev Mode Simulation: manually ticking reps when unpaused 
        if (isPaused) {
            setReps(prev => prev + 1);
            setFormAccuracy(prev => Math.min(100, prev + 2));
        }
        setIsPaused(!isPaused);
    };

    const handleFinish = () => {
        setIsPaused(true);
        saveSessionMutation.mutate({
            exerciseName: "Back Squats",
            totalReps: reps,
            duration: Math.round(time),
            caloriesBurned: Math.round(time * 0.15),
            formAccuracy: formAccuracy,
        });
    };

    if (!permission) {
        return (
            <View style={styles.centered}>
                <Text style={styles.loadingText}>Initializing AI Systems...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.centered}>
                <Text style={styles.permissionText}>Camera access is essential for AI live tracking.</Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                    <Text style={styles.permissionBtnText}>Enable Camera</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Absolute Camera Layer */}
            <CameraView 
                style={StyleSheet.absoluteFillObject} 
                facing="front" 
                ref={cameraRef}
                mute={true}
            />
            
            {/* Dark Overlay Gradient for readability */}
            <LinearGradient
                colors={['rgba(10, 15, 10, 0.8)', 'rgba(10, 15, 10, 0.2)', 'rgba(10, 15, 10, 0.9)']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Everything inside SafeArea remains on top of UI */}
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.topSection}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.glassIconBtn} onPress={() => router.back()}>
                            <MaterialIcons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        
                        <View style={styles.headerCenter}>
                            <View style={styles.liveTrackingBadge}>
                                <View style={styles.pulsingDot} />
                                <Text style={styles.liveTrackingText}>LIVE TRACKING</Text>
                            </View>
                            <Text style={styles.exerciseTitle}>Back Squats</Text>
                        </View>

                        <TouchableOpacity style={styles.glassIconBtn}>
                            <MaterialIcons name="more-vert" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Main Middle Display */}
                    <View style={styles.repContainer}>
                        <View style={styles.repNumberWrapper}>
                            <Text style={styles.repNumber}>{reps}</Text>
                            <Text style={styles.repLabel}>REPS</Text>
                        </View>
                        
                        <View style={styles.formBadge}>
                            <MaterialIcons name="check-circle" size={18} color="#000" />
                            <Text style={styles.formBadgeText}>
                                {formAccuracy >= 90 ? "FORM: OPTIMAL" : "CHECK POSTURE"}
                            </Text>
                        </View>
                    </View>
                    {/* Animated Details Arrow */}
                    <TouchableOpacity style={styles.detailsBounce} onPress={toggleBottomSheet}>
                        <Text style={styles.detailsText}>DASHBOARD</Text>
                        <MaterialIcons name="swipe" size={20} color="rgba(255,255,255,0.5)" />
                    </TouchableOpacity>
                </View>

                {/* Bottom Sheet Dashboard */}
                <Animated.View style={[styles.bottomSheetContainer, { transform: [{ translateY: clampedPanY }] }]}>
                    <ScrollView 
                        style={styles.bottomSheet} 
                        contentContainerStyle={styles.bottomSheetContent}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        <Animated.View {...panResponder.panHandlers} style={{ paddingBottom: 24, paddingTop: 8, width: '100%', alignItems: 'center' }}>
                            <View style={[styles.dragHandle, { marginBottom: 0 }]} />
                        </Animated.View>

                        {/* Top 2 Cards: Tension / Heart Rate */}
                        <View style={styles.grid2}>
                            <View style={styles.glassPanel}>
                                <View style={styles.panelHeader}>
                                    <MaterialIcons name="timer" size={18} color="#0ea5e9" />
                                    <Text style={styles.panelTitle}>TIME UNDER TENSION</Text>
                                </View>
                                <View style={styles.metricValueRow}>
                                    <Text style={styles.metricNumber}>{time.toFixed(1)}</Text>
                                    <Text style={[styles.metricUnit, { color: '#0ea5e9' }]}>SEC</Text>
                                </View>
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: '70%', backgroundColor: '#0ea5e9', shadowColor: '#0ea5e9', shadowOpacity: 0.8, shadowRadius: 5 }]} />
                                </View>
                            </View>

                            <View style={styles.glassPanel}>
                                <View style={styles.panelHeader}>
                                    <MaterialIcons name="favorite" size={18} color="#0df20d" />
                                    <Text style={styles.panelTitle}>HEART RATE</Text>
                                </View>
                                <View style={styles.metricValueRow}>
                                    <Text style={styles.metricNumber}>{heartRate}</Text>
                                    <Text style={[styles.metricUnit, { color: '#0df20d' }]}>BPM</Text>
                                </View>
                                <View style={styles.barGraphContainer}>
                                    <View style={[styles.bar, { height: '40%', backgroundColor: 'rgba(13,242,13,0.2)' }]} />
                                    <View style={[styles.bar, { height: '60%', backgroundColor: 'rgba(13,242,13,0.3)' }]} />
                                    <View style={[styles.bar, { height: '50%', backgroundColor: 'rgba(13,242,13,0.4)' }]} />
                                    <View style={[styles.bar, { height: '80%', backgroundColor: 'rgba(13,242,13,0.6)' }]} />
                                    <View style={[styles.bar, { height: '95%', backgroundColor: '#0df20d' }]} />
                                    <View style={[styles.bar, { height: '75%', backgroundColor: 'rgba(13,242,13,0.7)' }]} />
                                </View>
                            </View>
                        </View>

                        {/* Velocity Profile Graph */}
                        <View style={styles.glassPanel}>
                            <View style={styles.velocityHeaderRow}>
                                <View>
                                    <Text style={styles.panelTitle}>REP CONSISTENCY</Text>
                                    <Text style={styles.velocityTitle}>Velocity Profile</Text>
                                </View>
                                <View style={styles.stableBadge}>
                                    <Text style={styles.stableBadgeText}>STABLE</Text>
                                </View>
                            </View>
                            
                            <View style={styles.velocityGraphArea}>
                                <View style={[styles.vBar, { backgroundColor: 'rgba(255,255,255,0.1)', height: '80%' }]} />
                                <View style={[styles.vBar, { backgroundColor: 'rgba(14,165,233,0.4)', height: '85%' }]} />
                                <View style={[styles.vBar, { backgroundColor: 'rgba(14,165,233,0.6)', height: '75%' }]} />
                                <View style={[styles.vBar, { backgroundColor: '#0df20d', height: '95%' }]} />
                                <View style={[styles.vBar, { backgroundColor: 'rgba(14,165,233,0.6)', height: '82%' }]} />
                                <View style={[styles.vBar, { backgroundColor: 'rgba(14,165,233,0.4)', height: '88%' }]} />
                                <View style={[styles.vBar, { backgroundColor: 'rgba(255,255,255,0.1)', height: '65%' }]} />
                            </View>
                            
                            <View style={styles.velocityLabels}>
                                <Text style={styles.graphSubLabel}>REP 1</Text>
                                <Text style={styles.graphSubLabel}>CURRENT</Text>
                            </View>
                        </View>

                        {/* Form Accuracy Module */}
                        <View style={styles.glassPanel}>
                            <View style={styles.formHeaderFlex}>
                                <View style={styles.formIconBox}>
                                    <MaterialIcons name="analytics" size={24} color="#0df20d" />
                                </View>
                                <View style={styles.formTitleGroup}>
                                    <Text style={styles.formBlockTitle}>Form Accuracy</Text>
                                    <Text style={styles.formBlockSubtitle}>AI Posture Evaluation</Text>
                                </View>
                                <View style={styles.formPercentWrap}>
                                    <Text style={styles.formPercentNum}>{formAccuracy}</Text>
                                    <Text style={styles.formPercentSign}>%</Text>
                                </View>
                            </View>

                            <View style={styles.metersBlock}>
                                <View style={styles.meterRow}>
                                    <View style={styles.meterTopRow}>
                                        <Text style={styles.meterName}>DEPTH CONSISTENCY</Text>
                                        <Text style={[styles.meterStatus, { color: '#0df20d' }]}>PERFECT</Text>
                                    </View>
                                    <View style={styles.progressBarBg}>
                                        <View style={[styles.progressBarFill, { width: '98%', backgroundColor: '#0df20d' }]} />
                                    </View>
                                </View>

                                <View style={styles.meterRow}>
                                    <View style={styles.meterTopRow}>
                                        <Text style={styles.meterName}>HIP HINGE TIMING</Text>
                                        <Text style={[styles.meterStatus, { color: '#0ea5e9' }]}>OPTIMIZED</Text>
                                    </View>
                                    <View style={styles.progressBarBg}>
                                        <View style={[styles.progressBarFill, { width: '84%', backgroundColor: '#0ea5e9' }]} />
                                    </View>
                                </View>
                                
                                <View style={styles.meterRow}>
                                    <View style={styles.meterTopRow}>
                                        <Text style={styles.meterName}>BALANCE CENTER</Text>
                                        <Text style={[styles.meterStatus, { color: 'rgba(255,255,255,0.8)' }]}>92% MID-FOOT</Text>
                                    </View>
                                    <View style={styles.progressBarBg}>
                                        <View style={[styles.progressBarFill, { width: '92%', backgroundColor: 'rgba(255,255,255,0.4)' }]} />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Controls Toolbar */}
                        <View style={styles.controlsBar}>
                            <TouchableOpacity style={styles.controlAction} onPress={handleReset}>
                                <View style={styles.controlIconCircle}>
                                    <MaterialIcons name="restart-alt" size={24} color="#FFF" />
                                </View>
                                <Text style={styles.controlActionText}>RESET</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.playPauseBtn}
                                onPress={toggleWorkingState}
                            >
                                <MaterialIcons name={isPaused ? "play-arrow" : "pause"} size={38} color="#000" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.controlAction} onPress={handleFinish} disabled={saveSessionMutation.isPending}>
                                <View style={styles.controlIconCircleRed}>
                                    <MaterialIcons name="stop" size={24} color="#ef4444" />
                                </View>
                                <Text style={[styles.controlActionText, { color: 'rgba(239, 68, 68, 0.8)' }]}>
                                    {saveSessionMutation.isPending ? "SAVING" : "FINISH"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0f0a',
    },
    centered: {
        flex: 1, 
        backgroundColor: '#0a0f0a',
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 24,
    },
    loadingText: {
        color: '#0df20d',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    permissionText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    permissionBtn: {
        backgroundColor: '#0df20d',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    permissionBtnText: {
        color: '#000',
        fontWeight: 'bold',
    },
    safeArea: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10,
    },
    topSection: {
        height: height * 0.45,
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    glassIconBtn: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
    },
    headerCenter: {
        alignItems: 'center',
    },
    liveTrackingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(13,242,13,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(13,242,13,0.3)',
        marginBottom: 4,
    },
    pulsingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#0df20d',
        marginRight: 6,
    },
    liveTrackingText: {
        color: '#0df20d',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    exerciseTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    repContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    repNumberWrapper: {
        flexDirection: 'row',
        alignItems: 'baseline',
        position: 'relative',
    },
    repNumber: {
        fontSize: 140,
        fontWeight: 'bold',
        color: '#FFF',
        textShadowColor: 'rgba(255,255,255,0.2)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 30,
        lineHeight: 140,
    },
    repLabel: {
        color: '#0df20d',
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: -1,
        transform: [{ rotate: '-10deg' }],
        position: 'absolute',
        bottom: 20,
        right: -35,
    },
    formBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(13,242,13,0.9)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 10,
        shadowColor: '#0df20d',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    formBadgeText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 0.5,
        marginLeft: 6,
    },
    detailsBounce: {
        alignItems: 'center',
        opacity: 0.7,
    },
    detailsText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 2,
    },
    bottomSheetContainer: {
        flex: 1,
        backgroundColor: 'rgba(10,15,10,0.95)',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderTopWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginTop: -20,
        overflow: 'hidden',
    },
    bottomSheet: {
        flex: 1,
    },
    bottomSheetContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 40,
    },
    dragHandle: {
        width: 48,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'center',
        marginBottom: 24,
    },
    grid2: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    glassPanel: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        overflow: 'hidden',
    },
    panelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    panelTitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginLeft: 6,
    },
    metricValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    metricNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
    },
    metricUnit: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    progressBarBg: {
        height: 4,
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 2,
    },
    barGraphContainer: {
        height: 24,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    bar: {
        width: '15%',
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
    },
    velocityHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    velocityTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 2,
    },
    stableBadge: {
        backgroundColor: 'rgba(13,242,13,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(13,242,13,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    stableBadgeText: {
        color: '#0df20d',
        fontSize: 9,
        fontWeight: 'bold',
    },
    velocityGraphArea: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 8,
    },
    vBar: {
        width: '12%',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    velocityLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        marginTop: 12,
    },
    graphSubLabel: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 9,
        fontWeight: 'bold',
    },
    formHeaderFlex: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    formIconBox: {
        backgroundColor: 'rgba(13,242,13,0.15)',
        padding: 8,
        borderRadius: 12,
        marginRight: 12,
    },
    formTitleGroup: {
        flex: 1,
    },
    formBlockTitle: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    formBlockSubtitle: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
    },
    formPercentWrap: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        // alignItems: 'baseline',
    },
    formPercentNum: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    formPercentSign: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    metersBlock: {
        gap: 16,
    },
    meterRow: {},
    meterTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    meterName: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    meterStatus: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    controlsBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 8,
    },
    controlAction: {
        alignItems: 'center',
        gap: 6,
    },
    controlIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlIconCircleRed: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlActionText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    playPauseBtn: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#0df20d',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0df20d',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    }
});
