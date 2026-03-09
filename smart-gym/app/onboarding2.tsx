import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';

interface OnboardingScreen2Props {
  onNext: () => void;
}

// Minimal Material Symbol replacements using Unicode or basic shapes
const ShieldIcon: React.FC = () => (
  // We use a simplified text symbol or emoji for the shield since material icons might not be installed
  <Text style={{ color: '#0d55f2', fontSize: 100, textAlign: 'center' }}>🛡</Text>
);

const CameraIcon: React.FC = () => (
  <Text style={{ color: '#0d55f2', fontSize: 24, textAlign: 'center' }}>📷</Text>
);

const OnboardingScreen2: React.FC<OnboardingScreen2Props> = ({
  onNext,
}) => {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />
      <View style={styles.container}>

        {/* Top Status Bar Area Spacer */}
        <View style={styles.topSpacer} />

        {/* Page Indicators */}
        <View style={styles.dotsRow}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>

          <View style={styles.illustrationContainer}>
            {/* Illustration / Image */}
            <View style={styles.circleBg}>
              <ShieldIcon />
              <View style={styles.cameraIconContainer}>
                <CameraIcon />
              </View>
            </View>

            {/* Text Content */}
            <View style={styles.textBlock}>
              <Text style={styles.heading}>Privacy First</Text>
              <Text style={styles.subheading}>
                Your camera feed is processed locally and never stored on our servers.
              </Text>
            </View>
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={onNext}
              activeOpacity={0.85}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen2;

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

  topSpacer: {
    height: 48,
    width: '100%',
  },

  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    width: '100%',
  },

  dot: {
    height: 10,
    width: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(13,85,242,0.3)', // primary/30
    marginHorizontal: 6,
  },

  dotActive: {
    width: 32,
    backgroundColor: '#0d55f2', // primary
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'space-between',
    width: '100%',
  },

  illustrationContainer: {
    alignItems: 'center',
    marginTop: 32,
  },

  circleBg: {
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: 'rgba(13,85,242,0.05)', // primary/5
    borderWidth: 12,
    borderColor: 'rgba(13,85,242,0.1)', // primary/10
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
    // Add shadow
    shadowColor: '#0d55f2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 8,
  },

  cameraIconContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#101622', // background-dark
    borderRadius: 999,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  textBlock: {
    alignItems: 'center',
    width: '100%',
  },

  heading: {
    color: '#f1f5f9', // slate-100
    fontSize: 28,
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
    maxWidth: 280,
  },

  bottomControls: {
    width: '100%',
    paddingBottom: 32,
  },

  nextButton: {
    width: '100%',
    backgroundColor: '#0d55f2', // primary
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0d55f2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },

  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});