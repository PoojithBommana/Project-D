import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Image,
  Platform,
  Alert,
  TextInput,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/AuthNavigation';
import styles from '../../styles/AuthOptionsScreenStyles.tsx';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../services/AuthService';
import { authController } from '../../controllers/AuthController';
import Spinner from 'react-native-loading-spinner-overlay';
import { ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';

interface Props {
  navigation?: NativeStackNavigationProp<AuthStackParamList, 'AuthOptionsScreen'>;
}

interface State {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  isLoading: boolean;
  phoneNumber: string;
  otp: string;
  showOtpInput: boolean;
  countryCode: string;
}

export default class AuthOptionsScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      slideAnim: new Animated.Value(50),
      isLoading: false,
      phoneNumber: '',
      otp: '',
      showOtpInput: false,
      countryCode: '+91',
    };
  }

  componentDidMount(): void {
    Animated.parallel([
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }

  handleSendOtp = async () => {
    if (this.state.phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    Keyboard.dismiss();
    this.setState({ isLoading: true });

    const fullPhone = `${this.state.countryCode}${this.state.phoneNumber}`;
    const result = await authService.startPhoneVerification(fullPhone);

    this.setState({ isLoading: false });

    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to send verification code');
      return;
    }

    this.setState({
      showOtpInput: true,
    });

    Alert.alert('OTP Sent', `OTP sent to ${this.state.countryCode} ${this.state.phoneNumber}`);
  };

  handleVerifyOtp = async () => {
    if (this.state.otp.length < 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP');
      return;
    }

    Keyboard.dismiss();
    this.setState({ isLoading: true });

    const fullPhone = `${this.state.countryCode}${this.state.phoneNumber}`;
    const result = await authService.verifyPhoneCodeAndLogin(this.state.otp, fullPhone);

    this.setState({ isLoading: false });

    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to verify code');
      return;
    }

    const backend = result.backendResponse;

    // If backend provided tokens & onboarding status, follow same flow as Google login
    if (backend?.access && backend?.refresh) {
      // Rely on SplashScreenController to route based on stored tokens
      const rootNavigation = this.props.navigation?.getParent()?.getParent();
      if (rootNavigation) {
        rootNavigation.navigate('TabNavigation');
      } else {
        this.props.navigation?.getParent()?.navigate('TabNavigation');
      }
      return;
    }

    // Fallback: navigate to onboarding flow
    const rootNavigation = this.props.navigation?.getParent()?.getParent();
    if (rootNavigation) {
      rootNavigation.dispatch(
        CommonActions.navigate({
          name: 'OnboardingNavigation',
        })
      );
    } else {
      this.props.navigation?.getParent()?.navigate('OnboardingNavigation');
    }
  };

  handleGoogleSignIn = async () => {
    this.setState({ isLoading: true });

    try {
      const result: any = await authService.signInWithGoogle();

      if (result.success && result.user) {
        const backend = result.backendResponse;
        console.log('[AuthOptions] Firebase user', result.user?.uid, result.user?.email);
        console.log('[AuthOptions] backend login response', backend);

        if (!backend) {
          this.setState({ isLoading: false });
          Alert.alert('Login failed', 'Could not reach server. Please try again.');
          return;
        }

        // After SOCIAL_LOGIN, always go to AccountSelectionScreen.
        // AccountSelectionScreen will handle choosing existing vs new account
        // and call USE_EXISTING_ACCOUNT / CREATE_NEW_ACCOUNT as needed.
        const rootNavigation = this.props.navigation?.getParent()?.getParent();
        const screenParams = {
          screen: 'AccountSelectionScreen',
          params: {
            existingUser: backend?.existing_user || null,
            firebaseUid: result.user?.uid,
            email: backend?.existing_user?.email || backend?.email || result.user?.email,
            phone: backend?.existing_user?.phone || backend?.phone || result.user?.phoneNumber,
            canCreateNewAccount: backend?.can_create_new_account ?? true,
          },
        };

        this.setState({ isLoading: false });

        if (rootNavigation) {
          rootNavigation.navigate('OnboardingNavigation', screenParams);
        } else {
          this.props.navigation?.getParent()?.navigate('OnboardingNavigation', screenParams);
        }
      } else {
        this.setState({ isLoading: false });
        if (result.error && result.error !== 'Sign in was cancelled') {
          Alert.alert('Error', result.error || 'Failed to sign in with Google');
        }
      }
    } catch (error: any) {
      this.setState({ isLoading: false });
      Alert.alert('Error', error?.message || 'Failed to sign in');
    }
  };

  handleFacebookSignIn = () => {
    Alert.alert('Coming Soon', 'Facebook login will be available soon!');
  };

  handleBack = () => {
    this.props.navigation?.goBack();
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: this.state.fadeAnim,
              transform: [{ translateY: this.state.slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Login or Sign up</Text>
          </View>

          {/* Phone Number Input with Gloss Effect */}
          <View style={styles.inputSection}>
            {isLiquidGlassSupported ? (
              <LiquidGlassView
                style={styles.glassInput}
                effect="regular"
                tintColor="rgba(255, 255, 255, 0.8)"
                colorScheme="light"
                interactive={true}
              >
                <View style={styles.phoneInputContainer}>
                  <Text style={styles.countryCode}>{this.state.countryCode}</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter mobile number"
                    placeholderTextColor="#999999"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={this.state.phoneNumber}
                    onChangeText={(text) => this.setState({ phoneNumber: text })}
                    editable={!this.state.showOtpInput}
                  />
                </View>
              </LiquidGlassView>
            ) : (
              <View style={[styles.glassInput, styles.glassFallback]}>
                <View style={styles.phoneInputContainer}>
                  <Text style={styles.countryCode}>{this.state.countryCode}</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter mobile number"
                    placeholderTextColor="#999999"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={this.state.phoneNumber}
                    onChangeText={(text) => this.setState({ phoneNumber: text })}
                    editable={!this.state.showOtpInput}
                  />
                </View>
              </View>
            )}

            {/* OTP Input - Shows after phone number is submitted */}
            {this.state.showOtpInput && (
              <Animated.View style={styles.otpContainer}>
                {isLiquidGlassSupported ? (
                  <LiquidGlassView
                    style={styles.glassInput}
                    effect="regular"
                    tintColor="rgba(255, 255, 255, 0.8)"
                    colorScheme="light"
                    interactive={true}
                  >
                    <TextInput
                      style={styles.otpInput}
                      placeholder="Enter 6-digit OTP"
                      placeholderTextColor="#999999"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={this.state.otp}
                      onChangeText={(text) => this.setState({ otp: text })}
                    />
                  </LiquidGlassView>
                ) : (
                  <View style={[styles.glassInput, styles.glassFallback]}>
                    <TextInput
                      style={styles.otpInput}
                      placeholder="Enter 6-digit OTP"
                      placeholderTextColor="#999999"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={this.state.otp}
                      onChangeText={(text) => this.setState({ otp: text })}
                    />
                  </View>
                )}
              </Animated.View>
            )}

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                (this.state.showOtpInput ? this.state.otp.length >= 6 : this.state.phoneNumber.length >= 10)
                  ? styles.continueButtonActive
                  : styles.continueButtonInactive,
              ]}
              onPress={this.state.showOtpInput ? this.handleVerifyOtp : this.handleSendOtp}
              activeOpacity={0.8}
              disabled={this.state.showOtpInput ? this.state.otp.length < 6 : this.state.phoneNumber.length < 10}
            >
              <Text style={styles.continueButtonText}>
                {this.state.showOtpInput ? 'Verify OTP' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            {/* Google Button */}
            {isLiquidGlassSupported ? (
              <LiquidGlassView
                style={styles.socialButtonGlass}
                effect="regular"
                tintColor="rgba(255, 255, 255, 0.15)"
                colorScheme="light"
                interactive={true}
              >
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={this.handleGoogleSignIn}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.socialButtonGradient}
                  >
                    <Image
                      source={require('../../assets/Google.png')}
                      style={styles.socialIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.socialButtonText}>Google</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LiquidGlassView>
            ) : (
              <TouchableOpacity
                style={[styles.socialButton, styles.socialButtonFallback]}
                onPress={this.handleGoogleSignIn}
                activeOpacity={0.8}
              >
                <Image
                  source={require('../../assets/Google.png')}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
            )}

            {/* Facebook Button */}
            {isLiquidGlassSupported ? (
              <LiquidGlassView
                style={styles.socialButtonGlass}
                effect="regular"
                tintColor="rgba(255, 255, 255, 0.15)"
                colorScheme="light"
                interactive={true}
              >
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={this.handleFacebookSignIn}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.socialButtonGradient}
                  >
                    <Image
                      source={require('../../assets/Facebook.png')}
                      style={styles.socialIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.socialButtonText}>Facebook</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LiquidGlassView>
            ) : (
              <TouchableOpacity
                style={[styles.socialButton, styles.socialButtonFallback]}
                onPress={this.handleFacebookSignIn}
                activeOpacity={0.8}
              >
                <Image
                  source={require('../../assets/Facebook.png')}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Terms - Fixed at Bottom */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>

        {/* Loading Overlay */}
        <Spinner
          visible={this.state.isLoading}
          textContent={''}
          textStyle={{ color: '#FFFFFF' }}
          overlayColor="rgba(0, 0, 0, 0.85)"
          color="#FFFFFF"
          size="large"
          customIndicator={<ActivityIndicator size="large" color="#FFFFFF" />}
        />
      </SafeAreaView>
    );
  }
}


