import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Animated,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import axiosClient from '../src/api/axiosClient';
import { analyzePosture } from '../src/ml/postureAnalyzer';
import SkeletonOverlay from '../src/components/SkeletonOverlay';
import PoseDetectionView from '../src/components/PoseDetectionView';

const { width, height } = Dimensions.get('window');

const EXERCISE_MAP: Record<string, { name: string; id: string }> = {
  squats:     { name: 'Back Squats',  id: 'squats' },
  pushups:    { name: 'Push-ups',     id: 'pushups' },
  bicep_curl: { name: 'Bicep Curls',  id: 'bicep_curl' },
  deadlift:   { name: 'Deadlift',     id: 'deadlift' },
  lunges:     { name: 'Lunges',       id: 'lunges' },
};

// Interval between camera frame captures for ML inference (ms)
const CAPTURE_INTERVAL_MS = 500;

export default function WorkoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const exerciseKey = (params.exercise as string) || 'squats';
  const exercise = EXERCISE_MAP[exerciseKey] || EXERCISE_MAP.squats;

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef   = useRef<any>(null);
  const mlViewRef   = useRef<any>(null);
  const captureRef  = useRef<any>(null);

  // ── Workout State ──────────────────────────────────────────────────────────
  const [reps, setReps]             = useState(0);
  const [time, setTime]             = useState(0);
  const [isPaused, setIsPaused]     = useState(true);
  const [modelReady, setModelReady] = useState(false);
  const [modelStatus, setModelStatus] = useState('Loading AI model…');
  const [modelError, setModelError] = useState<string | null>(null);
  const [humanDetected, setHumanDetected] = useState(false);
  const [keypoints, setKeypoints]   = useState<any[]>([]);
  const [formAccuracy, setFormAccuracy] = useState(0);
  const [metrics, setMetrics]       = useState<any[]>([]);
  const [feedback, setFeedback]     = useState('Waiting for AI model…');

  const timerRef      = useRef<any>(null);
  const prevScoreRef  = useRef(0);
  const capturingRef  = useRef(false);

  // ── Draggable Bottom Sheet ─────────────────────────────────────────────────
  const MAX_DOWN = height * 0.48;
  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onPanResponderGrant: () => {
        panY.setOffset((panY as any)._value || 0);
        panY.setValue(0);
      },
      onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        panY.flattenOffset();
        const cur = (panY as any)._value || 0;
        const target =
          g.dy > 50 || g.vy > 0.5 ? MAX_DOWN :
          g.dy < -50 || g.vy < -0.5 ? 0 :
          cur > MAX_DOWN / 2 ? MAX_DOWN : 0;
        Animated.spring(panY, { toValue: target, useNativeDriver: true, bounciness: 0 }).start();
      },
    })
  ).current;

  const clampedPanY = panY.interpolate({
    inputRange: [0, MAX_DOWN], outputRange: [0, MAX_DOWN], extrapolate: 'clamp',
  });

  const toggleBottomSheet = () => {
    const isUp = ((panY as any)._value || 0) < MAX_DOWN / 2;
    Animated.spring(panY, { toValue: isUp ? MAX_DOWN : 0, useNativeDriver: true, bounciness: 0 }).start();
  };

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => setTime(p => +(p + 0.1).toFixed(1)), 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  // ── Frame Capture Loop → ML WebView ───────────────────────────────────────
  const captureAndSend = useCallback(async () => {
    if (capturingRef.current || !cameraRef.current || !mlViewRef.current) return;
    if (!modelReady) return;

    capturingRef.current = true;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.15,
        base64: true,
        skipProcessing: true,
        exif: false,
        shutterSound: false, // no click sound
        flash: 'off',        // no flash burst
      });
      if (photo?.base64) {
        mlViewRef.current.processFrame(photo.base64);
      }
    } catch (_) {
      /* Camera busy — skip frame */
    } finally {
      capturingRef.current = false;
    }
  }, [modelReady]);

  // Start/stop capture loop
  useEffect(() => {
    if (!isPaused && modelReady && permission?.granted) {
      captureRef.current = setInterval(captureAndSend, CAPTURE_INTERVAL_MS);
    } else {
      clearInterval(captureRef.current);
    }
    return () => clearInterval(captureRef.current);
  }, [isPaused, modelReady, permission?.granted, captureAndSend]);

  // ── Receive Keypoints from ML WebView ─────────────────────────────────────
  const handleKeypoints = useCallback((kps: any[], detected: boolean) => {
    setHumanDetected(detected);
    setKeypoints(kps || []);

    if (!kps || kps.length === 0) {
      setFeedback('No human detected — step into frame');
      setFormAccuracy(0);
      setMetrics([]);
      return;
    }

    const { score, metrics: m, feedback: f } = analyzePosture(kps, exercise.id);
    setFormAccuracy(score);
    setMetrics(m);
    setFeedback(f);

    // Rep counter: score drops below 55 (bottom of motion) then recovers ≥ 80 (top)
    if (prevScoreRef.current < 55 && score >= 80) {
      setReps(r => r + 1);
    }
    prevScoreRef.current = score;
  }, [exercise.id]);

  const handleModelReady = useCallback(() => {
    setModelReady(true);
    setModelStatus('AI Ready');
    setFeedback('Press ▶ to start tracking');
  }, []);

  const handleModelError = useCallback((msg: string) => {
    setModelError(msg);
    setFeedback('AI unavailable — check internet');
  }, []);

  const handleModelStatus = useCallback((msg: string) => {
    setModelStatus(msg);
    setFeedback(msg);
  }, []);

  // ── Backend Save ───────────────────────────────────────────────────────────
  const saveSessionMutation = useMutation({
    mutationFn: (data: any) => axiosClient.post('/workouts/session', data),
    onSuccess: () => {
      router.push({
        pathname: '/workout-summary' as any,
        params: {
          exerciseName: exercise.name,
          totalReps: reps.toString(),
          duration: Math.round(time).toString(),
          caloriesBurned: Math.round(time * 0.15).toString(),
          formAccuracy: formAccuracy.toString(),
        },
      });
    },
    onError: (err) => console.error('Save failed:', err),
  });

  const handleFinish = () => {
    setIsPaused(true);
    saveSessionMutation.mutate({
      exerciseName: exercise.name,
      totalReps: reps,
      duration: Math.round(time),
      caloriesBurned: Math.round(time * 0.15),
      formAccuracy,
    });
  };

  // ── Derived colours ────────────────────────────────────────────────────────
  const scoreColor   = formAccuracy >= 90 ? '#0df20d' : formAccuracy >= 70 ? '#f97316' : '#ef4444';
  const humanColor   = humanDetected ? '#0df20d' : 'rgba(255,255,255,0.4)';
  const badgeLabel   = !modelReady ? modelStatus.toUpperCase() : humanDetected ? 'HUMAN DETECTED' : 'SEARCHING…';

  // ── Permission Guards ──────────────────────────────────────────────────────
  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#0df20d" size="large" />
        <Text style={styles.loadingText}>Initialising Camera…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="camera-alt" size={48} color="#0df20d" />
        <Text style={styles.loadingText}>Camera access required for AI tracking</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* ── Live Camera Feed ───────────────────────────────────────────── */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="front"
        ref={cameraRef}
        mute={true}
        flash="off"
      />

      {/* ── Skeleton SVG Overlay ──────────────────────────────────────── */}
      <SkeletonOverlay
        keypoints={keypoints}
        postureScore={formAccuracy}
        width={width}
        height={height}
      />

      {/* ── Hidden ML WebView ─────────────────────────────────────────── */}
      <PoseDetectionView
        ref={mlViewRef}
        onKeypoints={handleKeypoints}
        onModelReady={handleModelReady}
        onError={handleModelError}
        onStatus={handleModelStatus}
      />

      {/* ── Dark gradient for readability ────────────────────────────── */}
      <LinearGradient
        colors={['rgba(10,15,10,0.75)', 'rgba(10,15,10,0.05)', 'rgba(10,15,10,0.92)']}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topSection}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.glassIconBtn} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <View style={[styles.liveTrackingBadge, {
                borderColor: humanDetected ? 'rgba(13,242,13,0.4)' : 'rgba(255,255,255,0.15)',
              }]}>
                {!modelReady
                  ? <ActivityIndicator size={8} color="#f97316" style={{ marginRight: 6 }} />
                  : <View style={[styles.pulsingDot, { backgroundColor: humanColor }]} />
                }
                <Text style={[styles.liveTrackingText, { color: humanDetected ? '#0df20d' : 'rgba(255,255,255,0.5)' }]}>
                  {badgeLabel}
                </Text>
              </View>
              <Text style={styles.exerciseTitle}>{exercise.name}</Text>
            </View>

            <TouchableOpacity style={styles.glassIconBtn} onPress={() => setIsPaused(p => !p)}>
              <MaterialIcons name={isPaused ? 'play-arrow' : 'pause'} size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Rep Counter + Score Ring */}
          <View style={styles.repContainer}>
            <View style={[styles.scoreRing, {
              borderColor: formAccuracy > 0 ? scoreColor : 'rgba(255,255,255,0.2)',
            }]}>
              <Text style={styles.repNumber}>{reps}</Text>
              <Text style={[styles.repLabel, { color: formAccuracy > 0 ? scoreColor : 'rgba(255,255,255,0.4)' }]}>
                REPS
              </Text>
            </View>

            <View style={[styles.feedbackBadge, {
              backgroundColor: `${formAccuracy > 0 ? scoreColor : '#666'}18`,
              borderColor: `${formAccuracy > 0 ? scoreColor : '#666'}33`,
            }]}>
              <Text style={[styles.feedbackText, {
                color: formAccuracy > 0 ? scoreColor : 'rgba(255,255,255,0.55)',
              }]}>
                {feedback}
              </Text>
            </View>

            {formAccuracy > 0 && (
              <View style={styles.scoreRow}>
                <Text style={[styles.scoreLabel, { color: scoreColor }]}>FORM</Text>
                <Text style={[styles.scoreValue, { color: scoreColor }]}>{formAccuracy}%</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.detailsBounce} onPress={toggleBottomSheet}>
            <Text style={styles.detailsText}>DASHBOARD</Text>
            <MaterialIcons name="swipe" size={20} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
        </View>

        {/* ── Bottom Sheet Dashboard ──────────────────────────────────── */}
        <Animated.View style={[styles.bottomSheetContainer, { transform: [{ translateY: clampedPanY }] }]}>
          <ScrollView
            style={styles.bottomSheet}
            contentContainerStyle={styles.bottomSheetContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Animated.View
              {...panResponder.panHandlers}
              style={{ paddingBottom: 24, paddingTop: 8, width: '100%', alignItems: 'center' }}>
              <View style={styles.dragHandle} />
            </Animated.View>

            {modelError && (
              <View style={styles.errorBanner}>
                <MaterialIcons name="wifi-off" size={16} color="#f97316" />
                <Text style={styles.errorBannerText}>{modelError}</Text>
              </View>
            )}

            {/* Time + Score */}
            <View style={styles.grid2}>
              <View style={styles.glassPanel}>
                <View style={styles.panelHeader}>
                  <MaterialIcons name="timer" size={16} color="#0ea5e9" />
                  <Text style={styles.panelTitle}>TIME</Text>
                </View>
                <View style={styles.metricValueRow}>
                  <Text style={styles.metricNumber}>{time.toFixed(1)}</Text>
                  <Text style={[styles.metricUnit, { color: '#0ea5e9' }]}>S</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, {
                    width: `${Math.min(100, (time / 120) * 100)}%`,
                    backgroundColor: '#0ea5e9',
                  }]} />
                </View>
              </View>

              <View style={styles.glassPanel}>
                <View style={styles.panelHeader}>
                  <MaterialIcons name="psychology" size={16} color={scoreColor} />
                  <Text style={styles.panelTitle}>POSTURE</Text>
                </View>
                <View style={styles.metricValueRow}>
                  <Text style={[styles.metricNumber, { color: scoreColor }]}>{formAccuracy}</Text>
                  <Text style={[styles.metricUnit, { color: scoreColor }]}>/100</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${formAccuracy}%`, backgroundColor: scoreColor }]} />
                </View>
              </View>
            </View>

            {/* Joint Metrics */}
            <View style={styles.glassPanel}>
              <View style={[styles.panelHeader, { marginBottom: 16 }]}>
                <MaterialIcons name="analytics" size={16} color="#0df20d" />
                <Text style={[styles.panelTitle, { flex: 1 }]}>JOINT ANALYSIS</Text>
                {humanDetected && (
                  <View style={styles.detectedBadge}>
                    <View style={styles.detectedDot} />
                    <Text style={styles.detectedText}>LIVE</Text>
                  </View>
                )}
              </View>

              {metrics.length === 0 ? (
                <Text style={styles.emptyText}>
                  {!modelReady
                    ? `⏳ ${modelStatus}`
                    : isPaused
                    ? '▶ Press play to start tracking'
                    : !humanDetected
                    ? '👁 Step into camera frame'
                    : '🔄 Analysing joints…'}
                </Text>
              ) : (
                metrics.map((m, i) => (
                  <View key={i} style={styles.meterRow}>
                    <View style={styles.meterTopRow}>
                      <Text style={styles.meterName}>{m.name}</Text>
                      <Text style={[styles.meterStatus, { color: m.color }]}>
                        {m.value}{m.unit}  {m.status}
                      </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, {
                        width: `${Math.max(0, Math.min(100, Math.round((m.fillPct || 0) * 100)))}%`,
                        backgroundColor: m.color,
                      }]} />
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Controls */}
            <View style={styles.controlsBar}>
              <TouchableOpacity style={styles.controlAction} onPress={() => { setReps(0); setTime(0); }}>
                <View style={styles.controlIconCircle}>
                  <MaterialIcons name="restart-alt" size={24} color="#FFF" />
                </View>
                <Text style={styles.controlActionText}>RESET</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.playPauseBtn} onPress={() => setIsPaused(p => !p)}>
                <MaterialIcons name={isPaused ? 'play-arrow' : 'pause'} size={38} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlAction}
                onPress={handleFinish}
                disabled={saveSessionMutation.isPending}
              >
                <View style={styles.controlIconCircleRed}>
                  <MaterialIcons name="stop" size={24} color="#ef4444" />
                </View>
                <Text style={[styles.controlActionText, { color: 'rgba(239,68,68,0.8)' }]}>
                  {saveSessionMutation.isPending ? 'SAVING' : 'FINISH'}
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
  container:    { flex: 1, backgroundColor: '#0a0f0a' },
  centered:     { flex: 1, backgroundColor: '#0a0f0a', justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText:  { color: '#0df20d', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginTop: 16, textAlign: 'center' },
  permissionBtn: { backgroundColor: '#0df20d', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 20 },
  permissionBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
  safeArea:     { position: 'absolute', width: '100%', height: '100%', zIndex: 10 },
  topSection:   { height: height * 0.50, justifyContent: 'space-between', paddingBottom: 20 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 24, paddingTop: 16 },
  glassIconBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  headerCenter: { alignItems: 'center' },
  liveTrackingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, marginBottom: 4 },
  pulsingDot:   { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  liveTrackingText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5 },
  exerciseTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
  repContainer: { alignItems: 'center', gap: 10 },
  scoreRing:    { width: 160, height: 160, borderRadius: 80, borderWidth: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  repNumber:    { fontSize: 72, fontWeight: 'bold', color: '#FFF', lineHeight: 80 },
  repLabel:     { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 },
  feedbackBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  feedbackText:  { fontWeight: 'bold', fontSize: 13 },
  scoreRow:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scoreLabel:   { fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
  scoreValue:   { fontSize: 22, fontWeight: 'bold' },
  detailsBounce: { alignItems: 'center', opacity: 0.7 },
  detailsText:  { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 2 },
  bottomSheetContainer: { flex: 1, backgroundColor: 'rgba(10,15,10,0.96)', borderTopLeftRadius: 40, borderTopRightRadius: 40, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginTop: -20, overflow: 'hidden' },
  bottomSheet:  { flex: 1 },
  bottomSheetContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40 },
  dragHandle:   { width: 48, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginBottom: 20 },
  errorBanner:  { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(249,115,22,0.1)', borderWidth: 1, borderColor: 'rgba(249,115,22,0.2)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14 },
  errorBannerText: { color: '#f97316', fontSize: 12, flex: 1 },
  grid2:        { flexDirection: 'row', gap: 14, marginBottom: 14 },
  glassPanel:   { flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 22, padding: 18, marginBottom: 14 },
  panelHeader:  { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  panelTitle:   { color: 'rgba(255,255,255,0.45)', fontSize: 9, fontWeight: 'bold', letterSpacing: 1, marginLeft: 6 },
  metricValueRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  metricNumber: { fontSize: 30, fontWeight: 'bold', color: '#FFF' },
  metricUnit:   { fontSize: 11, fontWeight: 'bold', marginLeft: 4 },
  progressBarBg: { height: 4, width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 2 },
  detectedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(13,242,13,0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(13,242,13,0.2)' },
  detectedDot:   { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#0df20d', marginRight: 4 },
  detectedText:  { color: '#0df20d', fontSize: 8, fontWeight: 'bold', letterSpacing: 1 },
  emptyText:     { color: 'rgba(255,255,255,0.35)', fontSize: 13, textAlign: 'center', paddingVertical: 16, fontStyle: 'italic' },
  meterRow:      { marginBottom: 14 },
  meterTopRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  meterName:     { color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  meterStatus:   { fontSize: 10, fontWeight: 'bold' },
  controlsBar:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 10 },
  controlAction: { alignItems: 'center', gap: 6 },
  controlIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  controlIconCircleRed: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', justifyContent: 'center', alignItems: 'center' },
  controlActionText: { color: 'rgba(255,255,255,0.45)', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  playPauseBtn:  { width: 72, height: 72, borderRadius: 36, backgroundColor: '#0df20d', justifyContent: 'center', alignItems: 'center', shadowColor: '#0df20d', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20 },
});
