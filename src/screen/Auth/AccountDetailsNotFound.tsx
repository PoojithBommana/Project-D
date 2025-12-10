import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigation';
import CustomButton from '../../components/CustomButton';
import { t } from '../../config/i18n';
import styles from '../../styles/AccountNotFoundScreenStyles';

interface Props {
  navigation?: NativeStackNavigationProp<AuthStackParamList, 'AccountNotFound'>;
}

export default class AccountNotFoundScreen extends React.Component<Props> {

  handleGoBack = () => {
    this.props.navigation?.goBack();
  };
  handleCreateAccount = () => {
    this.props.navigation?.navigate('RegisterScreen');
  };
  handleTryDifferentMethod = () => {
    
    this.props.navigation?.navigate('LoginScreen');
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
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
          <View style={styles.iconCircle}>
            <Icon name="minus" size={40} color="#000000" />
          </View>

          <Text style={styles.title}>{t("AccountNotFound")}</Text>

          <Text style={styles.description}>
            {t("AccountNotFoundDescription")}
          </Text>
        </View>

        <View style={styles.bottomContainer}>
          <CustomButton
            title={t("CreateNewAccount")}
            variant="primary"
            onPress={this.handleCreateAccount}
            customStyle={styles.createAccountButton}
            textStyle={styles.createAccountButtonText}
          />
          
          <CustomButton
            title={t("TryDifferentLoginMethod")}
            variant="borderless"
            onPress={this.handleTryDifferentMethod}
            customStyle={styles.tryDifferentMethodButton}
            textStyle={styles.tryDifferentMethodButtonText}
          />
        </View>
      </SafeAreaView>
    );
  }
}