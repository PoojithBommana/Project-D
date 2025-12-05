import { Text, View, SafeAreaView, Alert, TouchableOpacity, StatusBar, Animated, Image } from 'react-native';
import React, { Component } from 'react';
import Video from 'react-native-video';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles/LoginScreenStyles';
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { rf } from '../../utils/responsive';
import { Staricon } from '../../assets/index';
import { authService } from '../../services/AuthService';

interface Props {
  navigation?: NativeStackNavigationProp<AuthStackParamList, 'LoginScreen'>;
}

interface State {
  buttonScale: Animated.Value;
  overlayOpacity: Animated.Value;
  metricsOpacity: Animated.Value;
}

export default class LoginScreen extends Component<Props, State> {
  private videoRef: any = null;

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
    Animated.sequence([
      Animated.spring(this.state.buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(this.state.buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    try {
      const result: any = await authService.signInWithGoogle();

      if (result.success && result.user) {
        await AsyncStorage.setItem('authToken', `${result.backendResponse?.token}`);
        this.props.navigation?.getParent()?.navigate('OnboardingNavigation');
      } else {
        if (result.error && result.error !== 'Sign in was cancelled') {
          Alert.alert('Error', result.error || 'Failed to sign in with Google');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to sign in');
    }
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
        <Video
          ref={(ref) => {
            this.videoRef = ref;
          }}
          source={require('./../../assets/videos/backgroundvideo.mp4')}
          style={styles.backgroundVideo}
          resizeMode="cover"
          repeat={false}
          muted={true}
          paused={false}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          onEnd={() => {
            this.videoRef?.seek(0);
          }}
        />
        <SafeAreaView style={styles.overlayContainer}>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

          <View style={styles.contentContainer}>
            <View style={styles.topSection}>
              <View style={styles.appTitleContainer}>
                <Text style={styles.appTitle}>DILMIL</Text>
              </View>
            </View>

            <Animated.View
              style={[
                styles.bottomOverlay,
                {
                  opacity: this.state.overlayOpacity,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.metricsContainer,
                  {
                    opacity: this.state.metricsOpacity,
                  },
                ]}
              >
                <View style={styles.metricBox}>
                  <Image source={Staricon} style={styles.metricIcon} resizeMode="contain" />
                  <Text style={styles.metricValue}>4.4</Text>
                  <Text style={styles.metricLabel}>Rating</Text>
                </View>

                <View style={styles.metricBox}>
                  <Icon name="heart" size={rf(24)} color="#FF6B9D" style={styles.metricIcon} />
                  <Text style={styles.metricValue}>2.4M</Text>
                  <Text style={styles.metricLabel}>Successful{'\n'}Dates</Text>
                </View>
              </Animated.View>

              <View style={styles.headingContainer}>
                <Text style={styles.heading}>Find your vibe</Text>
              </View>

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
            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
