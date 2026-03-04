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

// Material Symbol replacement using Unicode / emoji approximations
const CheckCircleIcon: React.FC = () => (
  <Text style={{ color: '#4ade80', fontSize: 16 }}>✓</Text>
);

const AnalyticsIcon: React.FC = () => (
  <Text style={{ color: '#2463eb', fontSize: 18 }}>📊</Text>
);

const ArrowForwardIcon: React.FC = () => (
  <Text style={{ color: '#fff', fontSize: 18 }}>→</Text>
);

const OnboardingScreen1: React.FC<OnboardingScreen1Props> = ({
  onNext,
  onSkip,
}) => {
  const barAnim = useRef<Animated.Value>(new Animated.Value(0)).current;
  const fadeAnim = useRef<Animated.Value>(new Animated.Value(0)).current;
  const slideAnim = useRef<Animated.Value>(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: 0.92,
      duration: 1200,
      delay: 400,
      useNativeDriver: false,
    }).start();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#111621" />
      <View style={styles.container}>

        <View style={styles.topNav}>
          <TouchableOpacity onPress={onSkip} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>

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

          <Animated.View
            style={[
              styles.textBlock,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.heading}>AI Posture Tracking</Text>
            <Text style={styles.subheading}>
              Perfect your form with real-time AI feedback to prevent injuries
              and maximize gains.
            </Text>
          </Animated.View>
        </View>

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
    maxWidth: 448,
    alignSelf: 'center',
    width: '100%',
  },

  topNav: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: 'flex-end',
    zIndex: 10,
  },
  skipText: {
    color: '#94a3b8',
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
    borderColor: '#1e293b',
    marginBottom: 32,
    backgroundColor: '#1a2233',
  },
  imageBg: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageStyle: {
    borderRadius: 16,
  },

  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(17,22,33,0.75)',
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
    paddingVertical: 6,
  },

  formBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },

  analyticsCard: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(17,22,33,0.85)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  analyticsIconBg: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(36,99,235,0.2)',
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
    backgroundColor: '#334155',
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#2463eb',
    borderRadius: 999,
  },

  analyticsPercent: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 12,
  },

  textBlock: {
    alignItems: 'center',
    maxWidth: 320,
  },

  heading: {
    color: '#f1f5f9',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },

  subheading: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },

  bottomControls: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    alignItems: 'center',
  },

  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    height: 8,
    width: 8,
    borderRadius: 999,
    backgroundColor: '#334155',
    marginHorizontal: 4,
  },

  dotActive: {
    width: 24,
    backgroundColor: '#2463eb',
  },

  nextButton: {
    width: '100%',
    backgroundColor: '#2463eb',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  nextButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 8,
  },
});