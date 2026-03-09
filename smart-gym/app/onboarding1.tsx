import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Animated,
  StatusBar,
  SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen1Props {
  onNext: () => void;
  onSkip: () => void;
}

// Minimal Material Symbol replacements using Unicode or basic shapes
const CheckCircleIcon: React.FC = () => (
  <Text style={{ color: '#4ade80', fontSize: 16 }}>✓</Text>
);

const AnalyticsIcon: React.FC = () => (
  <Text style={{ color: '#2463eb', fontSize: 18 }}>📊</Text>
);

const ArrowForwardIcon: React.FC = () => (
  <Text style={{ color: '#fff', fontSize: 18, marginLeft: 8 }}>→</Text>
);

const OnboardingScreen1: React.FC<OnboardingScreen1Props> = ({
  onNext,
  onSkip,
}) => {
  const barAnim = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: 0.92,
      duration: 1200,
      delay: 400,
      useNativeDriver: false,
    }).start();
  }, []);

  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#111621" />
      <View style={styles.container}>

        {/* Top Navigation */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={onSkip} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View style={styles.content}>
          {/* Illustration Container */}
          <View style={styles.imageCard}>
            <ImageBackground
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALGdDE68Rj0qW6uGKkPPS2TtmPV1Vub_g4tG3FKaiv42EP4F7J122jxavVJkqlBly4MjQ0he_7NUWy12phQSqh6SoKiug2dpmZQQu5X8ZgCGFZlKy6TTkzLqU7JxI7dYjhnkjAOZaUVi2g7odBDw63RqZvq0a0EvuxSZzQ3zKEltreQ6mhvlQbn4bC87YM0Wej_GMFadxH8kCWQ-pprFRYKezZfUlosC7vZA8IEh2j9BLsbckm3y8HUyxKLSVNkC7YumN4tMkb6mU',
              }}
              style={styles.imageBg}
              imageStyle={styles.imageStyle}
              resizeMode="cover"
            >
              <View style={styles.gradientOverlay} />

              <View style={styles.formBadge}>
                <CheckCircleIcon />
                <Text style={styles.formBadgeText}>Form Perfect</Text>
              </View>

              <View style={styles.analyticsCard}>
                <View style={styles.analyticsIconBg}>
                  <AnalyticsIcon />
                </View>

                <View style={styles.analyticsText}>
                  <Text style={styles.analyticsLabel}>Spine Alignment</Text>

                  <View style={styles.progressTrack}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        { width: barWidth },
                      ]}
                    />
                  </View>
                </View>

                <Text style={styles.analyticsPercent}>92%</Text>
              </View>
            </ImageBackground>
          </View>

          {/* Text Content */}
          <View style={styles.textBlock}>
            <Text style={styles.heading}>AI Posture Tracking</Text>
            <Text style={styles.subheading}>
              Perfect your form with real-time AI feedback to prevent injuries
              and maximize gains.
            </Text>
          </View>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={onNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <ArrowForwardIcon />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen1;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#111621',
  },
  container: {
    flex: 1,
    backgroundColor: '#111621',
    alignItems: 'center',
    width: '100%',
  },

  topNav: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    alignItems: 'flex-end',
    zIndex: 10,
  },
  skipText: {
    color: '#94a3b8', // slate-400
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },

  imageCard: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e293b', // slate-800
    marginBottom: 32,
    backgroundColor: '#1a2233', // surface-dark
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  imageBg: {
    flex: 1,
  },
  imageStyle: {
    borderRadius: 16,
  },

  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17,22,33,0.3)',
  },

  formBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  formBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
  },

  analyticsCard: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(17,22,33,0.8)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  analyticsIconBg: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(36,99,235,0.2)', // primary/20
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  analyticsText: {
    flex: 1,
  },

  analyticsLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },

  progressTrack: {
    width: 128,
    height: 6,
    backgroundColor: '#334155', // slate-700
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#2463eb', // primary
    borderRadius: 999,
  },

  analyticsPercent: {
    color: '#4ade80', // green-400
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 'auto',
  },

  textBlock: {
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },

  heading: {
    color: '#f1f5f9', // slate-100
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },

  subheading: {
    color: '#94a3b8', // slate-400
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '400',
  },

  bottomControls: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 24,
    alignItems: 'center',
    backgroundColor: '#111621',
  },

  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  dot: {
    height: 8,
    width: 8,
    borderRadius: 999,
    backgroundColor: '#334155', // slate-700
    marginHorizontal: 4,
  },

  dotActive: {
    width: 24,
    backgroundColor: '#2463eb', // primary
  },

  nextButton: {
    width: '100%',
    backgroundColor: '#2463eb', // primary
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2463eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});