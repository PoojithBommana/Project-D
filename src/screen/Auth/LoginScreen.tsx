import { Text, View, Alert, TouchableOpacity, StatusBar, Animated, Image, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { Component } from 'react';
// import Video from 'react-native-video'; // Commented out - bgvideo.mp4 file not found
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles/LoginScreenStyles';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { rf } from '../../utils/responsive';
import { Applogoicon, Staricon } from '../../assets/index';
// import { Bgvideo } from '../../assets/index'; // Commented out - bgvideo.mp4 file not found
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import LinearGradient from 'react-native-linear-gradient';


interface Props {
  navigation?: NativeStackNavigationProp<AuthStackParamList, 'LoginScreen'>;
}

interface State {
  buttonScale: Animated.Value;
  overlayOpacity: Animated.Value;
  metricsOpacity: Animated.Value;
}
 
export default class LoginScreen extends Component<Props, State> {
  // private videoRef: any = null; // Commented out - bgvideo.mp4 file not found

  constructor(props: Props) {
    super(props);
    this.state = {
      buttonScale: new Animated.Value(1),
      overlayOpacity: new Animated.Value(0),
      metricsOpacity: new Animated.Value(0),
    };
  }

  componentDidMount(): void {
    GoogleSignin.configure({
      webClientId: '168980396946-p9ad718oc5bjl5ino2u07b2bh4spgfb1.apps.googleusercontent.com',
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    Animated.parallel([
      Animated.timing(this.state.overlayOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.metricsOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }

  handleGetStarted = async () => {
    // Wait for animation to complete before navigating
    await new Promise<void>((resolve) => {
      Animated.sequence([
        Animated.spring(this.state.buttonScale, {
          toValue: 0.95,
          useNativeDriver: true,
        }),
        Animated.spring(this.state.buttonScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => resolve(), 100);
      });
    });
    
    // Navigate to AuthOptionsScreen instead of directly signing in
    this.props.navigation?.navigate('AuthOptionsScreen');
  };

  handleTermsPress = () => {
    Alert.alert('Terms & Conditions', 'Terms and conditions content');
  };

  handlePrivacyPress = () => {
    Alert.alert('Privacy Policy', 'Privacy policy content');
  };

  render() {
    return (
      <View style={styles.container}>
        {/* Background video - commented out until bgvideo.mp4 file is added */}
        {/* <Video
          ref={(ref) => {
            this.videoRef = ref;
          }}
          source={Bgvideo}
          style={styles.backgroundVideo}
          resizeMode="cover"
          repeat={true}
          muted={true}
          paused={false}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
        /> */}
        <SafeAreaView style={styles.overlayContainer}>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

          <View style={styles.contentContainer}>
            <View style={styles.topSection}>
              <View style={styles.appTitleContainer}>
                <Text style={styles.appTitle}>snixx</Text>
                <Text style={styles.appTitleSub}>connections that hit different</Text>
              </View>
            </View>

            <Animated.View
              style={[
                styles.bottomOverlayContainer,
                {
                  opacity: this.state.overlayOpacity,
                },
              ]}
            >
              {isLiquidGlassSupported ? (
                <LiquidGlassView
                  style={styles.bottomOverlay}
                  effect="regular"
                  tintColor="rgba(255, 255, 255, 0.2)"
                  colorScheme="light"
                  interactive={true}
                >
                  <View pointerEvents="none" style={styles.sheenOverlay}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0.12)', 'transparent']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.sheenGradient}
                    />
                  </View>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.08)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientOverlay}
                  >
                    <Animated.View
                      style={{
                        transform: [{ scale: this.state.buttonScale }],
                      }}
                    >
                      <TouchableOpacity
                        style={styles.getStartedButton}
                        onPress={this.handleGetStarted}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel="Get Started"
                      >
                        <Text style={styles.getStartedButtonText}>Get Started</Text>
                      </TouchableOpacity>
                    </Animated.View>

                    <View style={styles.termsContainer}>
                      <Text style={styles.termsText}>
                        By clicking you accept our{' '}
                        <Text style={styles.termsLink} onPress={this.handleTermsPress}>
                          Terms
                        </Text>{' '}
                        &{' '}
                        <Text style={styles.termsLink} onPress={this.handlePrivacyPress}>
                          Privacy policy
                        </Text>
                      </Text>
                    </View>
                  </LinearGradient>
                </LiquidGlassView>
              ) : (
                <View style={[styles.bottomOverlay, styles.glassFallback]}>
                  <View pointerEvents="none" style={styles.sheenOverlay}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)', 'transparent']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.sheenGradient}
                    />
                  </View>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientOverlay}
                  >
                    <Animated.View
                      style={{
                        transform: [{ scale: this.state.buttonScale }],
                      }}
                    >
                      <TouchableOpacity
                        style={styles.getStartedButton}
                        onPress={this.handleGetStarted}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel="Get Started"
                      >
                        <Text style={styles.getStartedButtonText}>Get Started</Text>
                      </TouchableOpacity>
                    </Animated.View>

                    <View style={styles.termsContainer}>
                      <Text style={styles.termsText}>
                        By clicking you accept our{' '}
                        <Text style={styles.termsLink} onPress={this.handleTermsPress}>
                          Terms
                        </Text>{' '}
                        &{' '}
                        <Text style={styles.termsLink} onPress={this.handlePrivacyPress}>
                          Privacy policy
                        </Text>
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              )}
            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
