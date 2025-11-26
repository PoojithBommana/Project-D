import React, { Component } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar, 
  TextInput,
  Modal,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import CustomButton from '../../components/CustomButton';
import { authService } from '../../services/AuthService';
import { validatePhoneNumber, validateCountryCode } from '../../utils/Validation';
import { showErrorAlert, handleAPIError } from '../../utils/ErrorHandler';
import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from '../../constants/CountryCodes';
import styles from '../../styles/LoginScreenStyles';

interface Props {
  navigation?: NativeStackNavigationProp<RootStackParamList, 'PhoneNumberLogin'>;
}

interface State {
  countryCode: string;
  phoneNumber: string;
  countryCodeModalVisible: boolean;
  loading: boolean;
  phoneNumberError?: string;
}

/**
 * LoginScreen Component
 * 
 * Phone number login screen with country code selector.
 * Uses the same theme as AccountDetailsNotFound page.
 * 
 * Features:
 * - Back navigation button
 * - Country code selector
 * - Phone number input
 * - Continue button
 */
export default class RegisterScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      countryCode: DEFAULT_COUNTRY_CODE,
      phoneNumber: '',
      countryCodeModalVisible: false,
      loading: false,
      phoneNumberError: undefined,
    };
  }

  /**
   * Handles navigation back to previous screen
   */
  handleGoBack = () => {
    this.props.navigation?.goBack();
  };

  /**
   * Handles country code selection
   */
  handleSelectCountryCode = (code: string) => {
    this.setState({ 
      countryCode: code,
      countryCodeModalVisible: false 
    });
  };

  /**
   * Handles phone number input change with validation
   */
  handlePhoneNumberChange = (text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/[^\d]/g, '');
    this.setState({ 
      phoneNumber: cleaned,
      phoneNumberError: undefined, // Clear error on input
    });
  };

  /**
   * Handles continue button press with validation and API call
   */
  handleContinue = async () => {
    const { countryCode, phoneNumber } = this.state;
    
    // Validate country code
    const countryCodeValidation = validateCountryCode(countryCode);
    if (!countryCodeValidation.isValid) {
      showErrorAlert(countryCodeValidation.error || 'Invalid country code');
      return;
    }

    // Validate phone number
    const phoneValidation = validatePhoneNumber(phoneNumber, countryCode);
    if (!phoneValidation.isValid) {
      this.setState({ phoneNumberError: phoneValidation.error });
      return;
    }

    // Set loading state
    this.setState({ loading: true, phoneNumberError: undefined });

    try {
      // Send OTP via API
      const response = await authService.sendOTP({
        countryCode,
        phoneNumber: phoneNumber.trim(),
      });

      if (response.success) {
        // Navigate to OTP verification screen
        this.props.navigation?.navigate('VerifyPhoneNumber', {
          countryCode,
          phoneNumber: phoneNumber.trim(),
        });
      } else {
        // Show error message
        const errorMessage = handleAPIError(response.error || 'Failed to send OTP');
        showErrorAlert(errorMessage, 'Unable to Send OTP');
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

  /**
   * Renders country code item in the list
   */
  renderCountryCodeItem = ({ item }: { item: typeof COUNTRY_CODES[0] }) => (
    <TouchableOpacity
      style={styles.countryCodeItem}
      onPress={() => this.handleSelectCountryCode(item.code)}
      activeOpacity={0.7}
    >
      <Text style={styles.countryCodeText}>{item.code}</Text>
      <Text style={styles.countryName}>{item.country}</Text>
    </TouchableOpacity>
  );

  render() {
    const { countryCode, phoneNumber, countryCodeModalVisible, loading, phoneNumberError } = this.state;
    const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode);

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
          <Text style={styles.title}>Can We Get Your Number?</Text>

          {/* Description */}
          <Text style={styles.description}>
            We'll only use phone number to make sure everyone in DilMil is real.
          </Text>

          {/* Phone Number Input Section */}
          <View style={styles.phoneInputContainer}>
            {/* Country Code Section */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Country</Text>
              <TouchableOpacity
                style={styles.countryCodeButton}
                onPress={() => this.setState({ countryCodeModalVisible: true })}
                activeOpacity={0.7}
              >
                <Text style={styles.countryAbbreviation}>{selectedCountry?.abbreviation}</Text>
                <Text style={styles.countryCodeDisplay}>{countryCode}</Text>
                <Icon name="chevron-down" size={16} color="#666666" style={styles.dropdownIcon} />
              </TouchableOpacity>
            </View>

            {/* Phone Number Input Section */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>Phone number</Text>
              <View style={styles.phoneInputWrapper}>
                <TextInput
                  style={[
                    styles.phoneInput,
                    phoneNumberError && { borderColor: '#FF0000' }
                  ]}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999999"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={this.handlePhoneNumberChange}
                  maxLength={15}
                  editable={!loading}
                />
              </View>
              {phoneNumberError && (
                <Text style={styles.errorText}>{phoneNumberError}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Bottom Action Button */}
        <View style={styles.bottomContainer}>
          <CustomButton
            title="Continue"
            variant="primary"
            onPress={this.handleContinue}
            customStyle={styles.continueButton}
            textStyle={styles.continueButtonText}
            loading={loading}
            disabled={loading}
          />
          
          <Text style={styles.privacyText}>
            We never share this with anyone and it won't be on your profile too.
          </Text>
        </View>

        {/* Country Code Modal */}
        <Modal
          visible={countryCodeModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => this.setState({ countryCodeModalVisible: false })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Country</Text>
                <TouchableOpacity
                  onPress={() => this.setState({ countryCodeModalVisible: false })}
                  style={styles.modalCloseButton}
                >
                  <Icon name="times" size={24} color="#000000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={COUNTRY_CODES}
                renderItem={this.renderCountryCodeItem}
                keyExtractor={(item) => item.code}
                style={styles.countryCodeList}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}
