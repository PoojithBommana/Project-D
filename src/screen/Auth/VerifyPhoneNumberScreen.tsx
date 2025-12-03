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
import { AuthStackParamList } from '../../navigation/AuthNavigation';
import { authService } from '../../services/AuthService';
import { validateOTP } from '../../utils/Validation';
import { showErrorAlert, showSuccessAlert, handleAPIError } from '../../utils/ErrorHandler';
import { DEFAULT_COUNTRY_CODE } from '../../constants/CountryCodes';
import { t } from '../../config/i18n';
import { storeToken, storeRefreshToken } from '../../utils/tokenStorage';
import styles from '../../styles/VerifyPhoneNumberScreenStyles';

interface Props {
  navigation?: NativeStackNavigationProp<AuthStackParamList, 'VerifyPhoneNumberScreen'>;
  route?: RouteProp<AuthStackParamList, 'VerifyPhoneNumberScreen'>;
}

interface State {
  otpCode: string[];
  otpRefs: React.RefObject<TextInput | null>[];
  loading: boolean;
  verifying: boolean;
  otpError?: string;
}


export default class VerifyPhoneNumberScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  
    const otpRefs = Array(6).fill(null).map(() => React.createRef<TextInput>());
    
    this.state = {
      otpCode: ['', '', '', '', '', ''],
      otpRefs: otpRefs,
      loading: false,
      verifying: false,
      otpError: undefined,
    };
  }


  componentDidMount() {
    setTimeout(() => {
      this.state.otpRefs[0].current?.focus();
    }, 100);
  }


  handleGoBack = () => {
    this.props.navigation?.goBack();
  };


  handleOTPChange = (index: number, value: string) => {
    const { otpCode, otpRefs } = this.state;
    const newOTPCode = [...otpCode];

  
    if (value.length > 1) {
      value = value.slice(-1);
    }

  
    if (value && !/^\d$/.test(value)) {
      return;
    }

    newOTPCode[index] = value;
    this.setState({ otpCode: newOTPCode });

   
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }

    if (newOTPCode.every(digit => digit !== '') && newOTPCode.length === 6) {
      this.handleOTPSubmit(newOTPCode.join(''));
    }
  };


  handleOTPKeyPress = (index: number, key: string) => {
    const { otpCode, otpRefs } = this.state;

    if (key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };


  handleOTPSubmit = async (otp: string) => {
    const { route } = this.props;
    const params = route?.params;
    const countryCode = params?.countryCode || DEFAULT_COUNTRY_CODE;
    const phoneNumber = params?.phoneNumber || '';

   
    const validation = validateOTP(otp);
    if (!validation.isValid) {
      this.setState({ otpError: validation.error });
      return;
    }

    this.setState({ verifying: true, otpError: undefined });

    try {
 
      const response = await authService.verifyOTP({
        otp,
        countryCode,
        phoneNumber,
      });

      if (response.success) {
        // Store tokens if provided
        if (response.token) {
          await storeToken(response.token);
        }
        if (response.refreshToken) {
          await storeRefreshToken(response.refreshToken);
        }
        
        showSuccessAlert(t('PhoneNumberVerified'), t('Success'));
        
      
        setTimeout(() => {
          this.props.navigation?.getParent()?.navigate('OnboardingNavigation');
        }, 500);
      } else {
     
        const errorMessage = handleAPIError(response.error || t('InvalidOTPCode'));
        this.setState({ otpError: errorMessage });
        
      
        this.setState({ otpCode: ['', '', '', '', '', ''] });
        setTimeout(() => {
          this.state.otpRefs[0].current?.focus();
        }, 100);
      }
    } catch (error) {
    
      const errorMessage = handleAPIError(error);
      showErrorAlert(errorMessage, t('VerificationError'));
      this.setState({ otpError: errorMessage });
    } finally {
    
      this.setState({ verifying: false });
    }
  };

  handleResendOTP = async () => {
    const { route } = this.props;
    const params = route?.params;
    const countryCode = params?.countryCode || DEFAULT_COUNTRY_CODE;
    const phoneNumber = params?.phoneNumber || '';

   
    this.setState({ loading: true, otpError: undefined });

    try {
     
      const response = await authService.resendOTP({
        countryCode,
        phoneNumber,
      });

      if (response.success) {
        showSuccessAlert(t('OTPResent'), t('OTPResentTitle'));
        
      
        this.setState({ otpCode: ['', '', '', '', '', ''] });
        
        setTimeout(() => {
          this.state.otpRefs[0].current?.focus();
        }, 100);
      } else {
       
        const errorMessage = handleAPIError(response.error || t('FailedToResendOTP'));
        showErrorAlert(errorMessage, t('UnableToResendOTP'));
      }
    } catch (error) {
     
      const errorMessage = handleAPIError(error);
      showErrorAlert(errorMessage, t('Error'));
    } finally {
   
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

       
        <View style={styles.contentContainer}>
        
          <Text style={styles.title}>{t("VerifyYourNumber")}</Text>
          <Text style={styles.description}>
            {t("CodeSentTo")} {countryCode} {phoneNumber}
          </Text>

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

          {otpError && (
            <Text style={styles.errorText}>{otpError}</Text>
          )}

       
          <TouchableOpacity 
            onPress={this.handleResendOTP}
            style={styles.resendContainer}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text style={[styles.resendText, loading && { opacity: 0.5 }]}>
              {loading ? t("Resending") : t("ResendCode")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
