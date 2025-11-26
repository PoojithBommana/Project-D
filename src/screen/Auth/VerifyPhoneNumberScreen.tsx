import React, { Component } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar, 
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import { authService } from '../../services/AuthService';
import { validateOTP } from '../../utils/Validation';
import { showErrorAlert, showSuccessAlert, handleAPIError } from '../../utils/ErrorHandler';
import { DEFAULT_COUNTRY_CODE } from '../../constants/CountryCodes';
import styles from '../../styles/VerifyPhoneNumberScreenStyles';

interface Props {
  navigation?: NativeStackNavigationProp<RootStackParamList, 'VerifyPhoneNumber'>;
  route?: RouteProp<RootStackParamList, 'VerifyPhoneNumber'>;
}

interface State {
  otpCode: string[];
  otpRefs: React.RefObject<TextInput | null>[];
  loading: boolean;
  verifying: boolean;
  otpError?: string;
}

/**
 * VerifyPhoneNumberScreen Component
 * 
 * OTP verification screen for phone number authentication.
 * Uses the same theme as PhoneNumberLoginPage (white background, clean design).
 * 
 * Features:
 * - Back navigation button
 * - Displays phone number where code was sent
 * - 6 digit OTP input boxes with auto-focus
 * - Resend OTP functionality
 */
export default class VerifyPhoneNumberScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Create refs for OTP input boxes
    const otpRefs = Array(6).fill(null).map(() => React.createRef<TextInput>());
    
    this.state = {
      otpCode: ['', '', '', '', '', ''],
      otpRefs: otpRefs,
      loading: false,
      verifying: false,
      otpError: undefined,
    };
  }

  /**
   * Auto-focus first OTP input when component mounts
   */
  componentDidMount() {
    setTimeout(() => {
      this.state.otpRefs[0].current?.focus();
    }, 100);
  }

  /**
   * Handles navigation back to previous screen
   */
  handleGoBack = () => {
    this.props.navigation?.goBack();
  };

  /**
   * Handles OTP input change
   */
  handleOTPChange = (index: number, value: string) => {
    const { otpCode, otpRefs } = this.state;
    const newOTPCode = [...otpCode];

    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    newOTPCode[index] = value;
    this.setState({ otpCode: newOTPCode });

    // Auto-focus next input if value entered
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }

    // Auto-submit if all 6 digits entered
    if (newOTPCode.every(digit => digit !== '') && newOTPCode.length === 6) {
      this.handleOTPSubmit(newOTPCode.join(''));
    }
  };

  /**
   * Handles OTP backspace
   */
  handleOTPKeyPress = (index: number, key: string) => {
    const { otpCode, otpRefs } = this.state;

    if (key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  /**
   * Handles OTP submission with validation and API call
   */
  handleOTPSubmit = async (otp: string) => {
    const { route } = this.props;
    const params = route?.params;
    const countryCode = params?.countryCode || DEFAULT_COUNTRY_CODE;
    const phoneNumber = params?.phoneNumber || '';

    // Validate OTP
    const validation = validateOTP(otp);
    if (!validation.isValid) {
      this.setState({ otpError: validation.error });
      return;
    }

    // Set verifying state
    this.setState({ verifying: true, otpError: undefined });

    try {
      // Verify OTP via API
      const response = await authService.verifyOTP({
        otp,
        countryCode,
        phoneNumber,
      });

      if (response.success) {
        // Show success message
        showSuccessAlert('Phone number verified successfully!', 'Success');
        
        // Navigate to Home screen
        setTimeout(() => {
          this.props.navigation?.navigate('Home');
        }, 500);
      } else {
        // Show error message
        const errorMessage = handleAPIError(response.error || 'Invalid OTP code');
        this.setState({ otpError: errorMessage });
        
        // Clear OTP inputs on error
        this.setState({ otpCode: ['', '', '', '', '', ''] });
        setTimeout(() => {
          this.state.otpRefs[0].current?.focus();
        }, 100);
      }
    } catch (error) {
      // Handle unexpected errors
      const errorMessage = handleAPIError(error);
      showErrorAlert(errorMessage, 'Verification Error');
      this.setState({ otpError: errorMessage });
    } finally {
      // Reset verifying state
      this.setState({ verifying: false });
    }
  };

  /**
   * Handles resend OTP with API call
   */
  handleResendOTP = async () => {
    const { route } = this.props;
    const params = route?.params;
    const countryCode = params?.countryCode || DEFAULT_COUNTRY_CODE;
    const phoneNumber = params?.phoneNumber || '';

    // Set loading state
    this.setState({ loading: true, otpError: undefined });

    try {
      // Resend OTP via API
      const response = await authService.resendOTP({
        countryCode,
        phoneNumber,
      });

      if (response.success) {
        showSuccessAlert('OTP has been resent to your phone number', 'OTP Resent');
        
        // Reset OTP inputs
        this.setState({ otpCode: ['', '', '', '', '', ''] });
        
        // Focus first input
        setTimeout(() => {
          this.state.otpRefs[0].current?.focus();
        }, 100);
      } else {
        // Show error message
        const errorMessage = handleAPIError(response.error || 'Failed to resend OTP');
        showErrorAlert(errorMessage, 'Unable to Resend OTP');
      }
    } catch (error) {
      // Handle unexpected errors
      const errorMessage = handleAPIError(error);
      showErrorAlert(errorMessage, 'Error');
    } finally {
      // Reset loading state
      this.setState({ loading: false });
    }
  };

  render() {
    const { route } = this.props;
    const params = route?.params;
    const countryCode = params?.countryCode || DEFAULT_COUNTRY_CODE;
    const phoneNumber = params?.phoneNumber || '';
    const { otpCode, otpRefs, verifying, loading, otpError } = this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={this.handleGoBack} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="chevron-left" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Main Content Section */}
        <View style={styles.contentContainer}>
          {/* Title */}
          <Text style={styles.title}>Verify your number</Text>

          {/* Description */}
          <Text style={styles.description}>
            We have sent the code to {countryCode} {phoneNumber}
          </Text>

          {/* OTP Input Section */}
          <View style={styles.otpContainer}>
            {otpCode.map((digit, index) => (
              <TextInput
                key={index}
                ref={otpRefs[index]}
                style={[
                  styles.otpInput,
                  otpError && { borderColor: '#FF0000' }
                ]}
                value={digit}
                onChangeText={(value) => this.handleOTPChange(index, value)}
                onKeyPress={({ nativeEvent }) => this.handleOTPKeyPress(index, nativeEvent.key)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!verifying && !loading}
              />
            ))}
          </View>

          {/* Error Message */}
          {otpError && (
            <Text style={styles.errorText}>{otpError}</Text>
          )}

          {/* Resend OTP */}
          <TouchableOpacity 
            onPress={this.handleResendOTP}
            style={styles.resendContainer}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text style={[styles.resendText, loading && { opacity: 0.5 }]}>
              {loading ? 'Resending...' : 'Resend code'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
