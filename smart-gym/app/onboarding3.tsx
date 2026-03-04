import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingScreen3Props {
  onGetStarted: () => void;
}

export default function OnboardingScreen3({ onGetStarted }: OnboardingScreen3Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const imageScaleAnim = useRef(new Animated.Value(1.08)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Image subtle zoom-out on enter
    Animated.timing(imageScaleAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Text fade + slide up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Button bounce in
    Animated.spring(buttonAnim, {
      toValue: 1,
      tension: 55,
      friction: 7,
      delay: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />
      <View style={styles.container}>

        {/* Step Label */}
        <View style={styles.topBar}>
          <Text style={styles.stepLabel}>Step 3 of 3</Text>
        </View>

        {/* Illustration */}
        <View style={styles.imageWrapper}>
          <Animated.View
            style={[
              styles.imageContainer,
              { transform: [{ scale: imageScaleAnim }] },
            ]}
          >
            <ImageBackground
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoNnmL6Q41oCNST7HCvub44ayVeNrUuW8WK8D6LHQdKmrmW3g6ONTZSv6KdwyEf2xEsNK8xMqSvYxJY3GScz0pttsLLXl0VuOnIiLNcjLBctaSZheY0LQxih_JlvfPnLc59Tnp_SZxOJYfPX9hffoZ1yczEyaWRDG6Nh7QIslCi9NhtC60Z8FX9C2n7h5qFCQ-X4qxwS18vyrbt3R-GVQE-UxAhCcjNVGwkJyzTuAV0I464o2UAI1OZ7YNXUMzeHve1YvEyV9RQqI',
              }}
              style={styles.imageBg}
              imageStyle={styles.imageStyle}
              resizeMode="cover"
            >
              {/* Bottom gradient overlay */}
              <View style={styles.imageGradient} />
            </ImageBackground>
          </Animated.View>
        </View>

        {/* Text + Dots + Button */}
        <Animated.View
          style={[
            styles.bottomContent,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.heading}>
            Track Your{'\n'}Transformation
          </Text>
          <Text style={styles.subheading}>
            Visualize your progress with AI-driven insights and daily streaks.
          </Text>

          {/* Pagination Dots */}
          <View style={styles.dotsRow}>
            <View style={styles.dotInactive} />
            <View style={styles.dotInactive} />
            <View style={styles.dotActive} />
          </View>
        </Animated.View>

        {/* Get Started Button */}
        <Animated.View
          style={[
            styles.buttonWrapper,
            {
              opacity: buttonAnim,
              transform: [{ scale: buttonAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={onGetStarted}
            activeOpacity={0.85}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#101622',
  },
  container: {
    flex: 1,
    backgroundColor: '#101622',
    alignItems: 'center',
    maxWidth: 448,
    alignSelf: 'center',
    width: '100%',
  },

  // Top bar
  topBar: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
  },
  stepLabel: {
    color: '#f1f5f9',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
    textAlign: 'center',
  },

  // Image
  imageWrapper: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 0,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  imageBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 20,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(16,22,34,0.75)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  // Bottom content
  bottomContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 36,
    gap: 12,
  },
  heading: {
    color: '#f1f5f9',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 40,
    textAlign: 'center',
    marginBottom: 4,
  },
  subheading: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 300,
  },

  // Dots
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  dotInactive: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#334155',
  },
  dotActive: {
    height: 8,
    width: 24,
    borderRadius: 4,
    backgroundColor: '#0d59f2',
  },

  // Button
  buttonWrapper: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 8,
  },
  getStartedButton: {
    width: '100%',
    height: 56,
    borderRadius: 999,
    backgroundColor: '#0d59f2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0d59f2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
