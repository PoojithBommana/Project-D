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
import { AuthStackParamList } from '../../navigation/AuthNavigation';
import CustomButton from '../../components/CustomButton';
import { validatePhoneNumber, validateCountryCode } from '../../utils/Validation';
import { showErrorAlert } from '../../utils/ErrorHandler';
import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from '../../constants/CountryCodes';
import { t } from '../../config/i18n';
import styles from '../../styles/RegisterScreenStyles';

interface Props {
  navigation?: NativeStackNavigationProp<AuthStackParamList, 'RegisterScreen'>;
}

interface State {
  countryCode: string;
  phoneNumber: string;
  countryCodeModalVisible: boolean;
  loading: boolean;
  phoneNumberError?: string;
}


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

  handleGoBack = () => {
    this.props.navigation?.goBack();
  };


  handleSelectCountryCode = (code: string) => {
    this.setState({ 
      countryCode: code,
      countryCodeModalVisible: false 
    });
  };


  handlePhoneNumberChange = (text: string) => {
   
    const cleaned = text.replace(/[^\d]/g, '');
    this.setState({ 
      phoneNumber: cleaned,
      phoneNumberError: undefined, 
    });
  };


  handleContinue = async () => {
    const { countryCode, phoneNumber } = this.state;
    

    const countryCodeValidation = validateCountryCode(countryCode);
    if (!countryCodeValidation.isValid) {
      showErrorAlert(countryCodeValidation.error || t('InvalidCountryCode'));
      return;
    }


    const phoneValidation = validatePhoneNumber(phoneNumber, countryCode);
    if (!phoneValidation.isValid) {
      this.setState({ phoneNumberError: phoneValidation.error });
      return;
    }

   
    this.setState({ loading: true, phoneNumberError: undefined });

    // try {
    
    //   const response = await authService.sendOTP({
    //     countryCode,
    //     phoneNumber: phoneNumber.trim(),
    //   });

    //   if (response.success) {
      
    //     this.props.navigation?.navigate('VerifyPhoneNumberScreen', {
    //       countryCode,
    //       phoneNumber: phoneNumber.trim(),
    //     });
    //   } else {
      
    //     const errorMessage = handleAPIError(response.error || t('FailedToSendOTP'));
    //     showErrorAlert(errorMessage, t('UnableToSendOTP'));
    //   }
    // } catch (error) {
    
    //   const errorMessage = handleAPIError(error);
    //   showErrorAlert(errorMessage, t('Error'));
    // } finally {
    
    //   this.setState({ loading: false });
    // }
  };


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
        <View style={styles.contentContainer}>
     
          <Text style={styles.title}>{t("CanWeGetYourNumber")}</Text>

    
          <Text style={styles.description}>
            {t("PhoneNumberDescription")}
          </Text>

        
          <View style={styles.phoneInputContainer}>
          
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>{t("Country")}</Text>
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

         
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputLabel}>{t("PhoneNumber")}</Text>
              <View style={styles.phoneInputWrapper}>
                <TextInput
                  style={[
                    styles.phoneInput,
                    phoneNumberError && { borderColor: '#FF0000' }
                  ]}
                  placeholder={t("EnterYourPhoneNumber")}
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

        <View style={styles.bottomContainer}>
          <CustomButton
            title={t("Continue")}
            variant="primary"
            onPress={this.handleContinue}
            customStyle={styles.continueButton}
            textStyle={styles.continueButtonText}
            loading={loading}
            disabled={loading}
          />
          
          <Text style={styles.privacyText}>
            {t("PrivacyText")}
          </Text>
        </View>

        <Modal
          visible={countryCodeModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => this.setState({ countryCodeModalVisible: false })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t("SelectCountry")}</Text>
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
