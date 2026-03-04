import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingScreen2Props {
  onNext: () => void;
}

const OnboardingScreen2: React.FC<OnboardingScreen2Props> = ({ onNext }) => {
  const scaleAnim = useRef<Animated.Value>(new Animated.Value(0.8)).current;
  const fadeAnim = useRef<Animated.Value>(new Animated.Value(0)).current;
  const slideAnim = useRef<Animated.Value>(new Animated.Value(40)).current;
  const pulseAnim = useRef<Animated.Value>(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 60,
      friction: 7,
      delay: 200,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#101622" />
      <View style={styles.container}>

        <View style={styles.topSpacer} />

        <View style={styles.dotsRow}>
          <View style={styles.dotInactive} />
          <View style={styles.dotActive} />
          <View style={styles.dotInactive} />
        </View>

        <View style={styles.content}>

          <Animated.View
            style={[styles.iconWrapper, { transform: [{ scale: pulseAnim }] }]}
          >
            <Animated.View
              style={[styles.iconInner, { transform: [{ scale: scaleAnim }] }]}
            >
              <ShieldIcon />

              <View style={styles.cameraBadge}>
                <CameraIcon />
              </View>
            </Animated.View>
          </Animated.View>

          <Animated.View
            style={[
              styles.textBlock,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.heading}>Privacy First</Text>
            <Text style={styles.subheading}>
              Your camera feed is processed locally and never stored on our servers.
            </Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.bottomArea, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={onNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen2;


// Shield Icon
const ShieldIcon: React.FC = () => {
  return (
    <View style={shieldStyles.container}>
      <View style={shieldStyles.shieldOuter}>
        <View style={shieldStyles.shieldTop} />
        <View style={shieldStyles.shieldBottom} />
      </View>

      <View style={shieldStyles.lockWrapper}>
        <View style={shieldStyles.lockShackle} />
        <View style={shieldStyles.lockBody}>
          <View style={shieldStyles.lockHole} />
        </View>
      </View>
    </View>
  );
};

const shieldStyles = StyleSheet.create({
  container: {
    width: 100,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldOuter: {
    width: 88,
    height: 100,
    alignItems: 'center',
    overflow: 'hidden',
  },
  shieldTop: {
    width: 88,
    height: 55,
    backgroundColor: '#0d55f2',
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
  },
  shieldBottom: {
    width: 88,
    height: 45,
    backgroundColor: '#0d55f2',
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 88,
  },
  lockWrapper: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    alignItems: 'center',
  },
  lockShackle: {
    width: 18,
    height: 14,
    borderWidth: 4,
    borderColor: '#101622',
    borderBottomWidth: 0,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    marginBottom: -2,
  },
  lockBody: {
    width: 26,
    height: 22,
    backgroundColor: '#101622',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockHole: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0d55f2',
  },
});


// Camera Icon
const CameraIcon: React.FC = () => {
  return (
    <View style={cameraStyles.body}>
      <View style={cameraStyles.bump} />
      <View style={cameraStyles.lens} />
    </View>
  );
};

const cameraStyles = StyleSheet.create({
  body: {
    width: 32,
    height: 24,
    backgroundColor: '#0d55f2',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bump: {
    position: 'absolute',
    top: -6,
    width: 12,
    height: 6,
    backgroundColor: '#0d55f2',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  lens: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#101622',
    borderWidth: 2,
    borderColor: '#3b7aff',
  },
});


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#101622',
  },
  container: {
    flex: 1,
    backgroundColor: '#101622',
    alignItems: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  topSpacer: {
    height: 16,
  },

  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dotInactive: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(13,85,242,0.25)',
    marginHorizontal: 5,
  },
  dotActive: {
    height: 10,
    width: 32,
    borderRadius: 5,
    backgroundColor: '#0d55f2',
    marginHorizontal: 5,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
  },

  iconWrapper: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(13,85,242,0.05)',
    borderWidth: 12,
    borderColor: 'rgba(13,85,242,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  cameraBadge: {
    position: 'absolute',
    bottom: -30,
    right: -44,
    backgroundColor: '#101622',
    borderRadius: 999,
    padding: 8,
  },

  textBlock: {
    alignItems: 'center',
    maxWidth: 280,
    marginTop: 48,
  },

  heading: {
    color: '#f1f5f9',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },

  subheading: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },

  bottomArea: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },

  nextButton: {
    width: '100%',
    backgroundColor: '#0d55f2',
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});