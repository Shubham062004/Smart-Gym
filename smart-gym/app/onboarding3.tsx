import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';

interface OnboardingScreen3Props {
  onGetStarted: () => void;
}

const OnboardingScreen3: React.FC<OnboardingScreen3Props> = ({
  onGetStarted,
}) => {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />
      <View style={styles.container}>

        {/* Top App Bar */}
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Step 3 of 3</Text>
        </View>

        {/* Illustration Area */}
        <View style={styles.illustrationArea}>
          <View style={styles.imageCard}>
            <ImageBackground
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoNnmL6Q41oCNST7HCvub44ayVeNrUuW8WK8D6LHQdKmrmW3g6ONTZSv6KdwyEf2xEsNK8xMqSvYxJY3GScz0pttsLLXl0VuOnIiLNcjLBctaSZheY0LQxih_JlvfPnLc59Tnp_SZxOJYfPX9hffoZ1yczEyaWRDG6Nh7QIslCi9NhtC60Z8FX9C2n7h5qFCQ-X4qxwS18vyrbt3R-GVQE-UxAhCcjNVGwkJyzTuAV0I464o2UAI1OZ7YNXUMzeHve1YvEyV9RQqI',
              }}
              style={styles.imageBg}
              imageStyle={styles.imageStyle}
              resizeMode="cover"
            >
              <View style={styles.gradientOverlay} />
            </ImageBackground>
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          <View style={styles.textBlock}>
            <Text style={styles.heading}>Track Your Transformation</Text>
            <Text style={styles.subheading}>
              Visualize your progress with AI-driven insights and daily streaks.
            </Text>
          </View>

          {/* Progress Dots */}
          <View style={styles.dotsRow}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
          </View>

          {/* Action Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={onGetStarted}
              activeOpacity={0.85}
            >
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen3;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#101622',
  },
  container: {
    flex: 1,
    backgroundColor: '#101622',
    alignItems: 'center',
    width: '100%',
  },

  topBar: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topBarText: {
    color: '#f1f5f9', // slate-100
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2, // -0.015em appx
  },

  illustrationArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },

  imageCard: {
    width: '100%',
    minHeight: 320,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a2235', // surface-dark (fallback)
    // No shadow in dark mode per HTML instruction
  },

  imageBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  imageStyle: {
    borderRadius: 16,
  },

  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16,22,34,0.3)', // gradient approximation
  },

  content: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },

  textBlock: {
    alignItems: 'center',
    marginBottom: 16,
  },

  heading: {
    color: '#f1f5f9', // slate-100
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },

  subheading: {
    color: '#94a3b8', // slate-400
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '400',
    maxWidth: 320,
  },

  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
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
    backgroundColor: '#0d59f2', // primary
  },

  actionContainer: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 32,
  },

  getStartedButton: {
    width: '100%',
    backgroundColor: '#0d59f2', // primary
    height: 56,
    paddingHorizontal: 20,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0d59f2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },

  getStartedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
