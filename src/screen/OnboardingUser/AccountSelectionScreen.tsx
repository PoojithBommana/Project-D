import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/AccountSelectionStyles';
import { Backicon, Checkicon, Usericon } from '../../assets';
import { authController } from '../../controllers/AuthController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'AccountSelectionScreen'>;
  route?: {
    params?: {
      existingUser?: any;
      firebaseUid?: string;
      email?: string;
      phone?: string;
      canCreateNewAccount?: boolean;
    };
  };
}

export default function AccountSelectionScreen({ navigation, route }: Props) {
  const [selectedAccount, setSelectedAccount] = useState<'existing' | 'new'>('existing');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingUser = route?.params?.existingUser;
  const firebaseUid = route?.params?.firebaseUid;
  const emailParam = route?.params?.email;
  const phoneParam = route?.params?.phone;
  const canCreateNewAccount = route?.params?.canCreateNewAccount ?? true;

  const existingAccountLabel = useMemo(() => {
    if (!existingUser) return 'Existing account';
    const name = existingUser.first_name || existingUser.firstName || 'User';
    const age = existingUser.age ? `, ${existingUser.age}` : '';
    return `${name}${age}`;
  }, [existingUser]);

  const existingAccountLogin = useMemo(() => {
    if (!existingUser) return 'Login info unavailable';
    return existingUser.phone || existingUser.email || 'Login info unavailable';
  }, [existingUser]);

  const handleExistingAccountSelect = () => {
    setSelectedAccount('existing');
  };

  const handleNewAccountSelect = () => {
    if (!canCreateNewAccount) {
      Alert.alert('Use existing account', 'Creating a new account is disabled for this login.');
      return;
    }
    setSelectedAccount('new');
  };

  const handleContinue = async () => {
    if (selectedAccount === 'new') {
      if (!canCreateNewAccount) {
        Alert.alert('Use existing account', 'Please continue with your existing account.');
        return;
      }
      setShowModal(true);
      return;
    }

    if (!existingUser?.id) {
      Alert.alert('Select account', 'No existing account details available.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authController.useExistingAccount(existingUser.id);
      if (!response.success || !response.access || !response.refresh) {
        Alert.alert('Could not continue', response.error || 'Please try again.');
        return;
      }

      await AsyncStorage.multiSet([
        ['accessToken', response.access],
        ['refreshToken', response.refresh],
        ['userId', String(response.user_id ?? existingUser.id)],
        ['onboarding_complete', response.onboarding_complete ? 'true' : 'false'],
      ]);

      const rootNavigation = (navigation as any)?.getParent()?.getParent();
      if (rootNavigation) {
        rootNavigation.navigate('TabNavigation');
      } else {
        navigation?.getParent()?.navigate('TabNavigation');
      }
    } catch (error) {
      console.error('Error continuing with existing account:', error);
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalContinue = async () => {
    if (!firebaseUid) {
      Alert.alert('Missing info', 'Unable to create a new account right now.');
      return;
    }

    setShowModal(false);
    setIsSubmitting(true);
    try {
      const response = await authController.createNewAccount({
        firebase_uid: firebaseUid,
        email: emailParam,
        phone: phoneParam,
      });

      if (!response.success || !response.access || !response.refresh) {
        Alert.alert('Could not create account', response.error || 'Please try again.');
        return;
      }

      await AsyncStorage.multiSet([
        ['accessToken', response.access],
        ['refreshToken', response.refresh],
        ['userId', response.user_id ? String(response.user_id) : firebaseUid || ''],
        ['onboarding_complete', 'false'],
      ]);

      navigation?.navigate('ProfileSetupIntroScreen');
    } catch (error) {
      console.error('Error creating new account:', error);
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF8E1" />
      
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <Image source={Backicon} style={styles.backButtonImage} resizeMode="contain" />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <Text style={styles.heading}>
            Looks like you have multiple accounts, you can{' '}
            <Text style={styles.highlightedText}>only keep one</Text>
          </Text>

          <Text style={styles.subHeading}>Select the account you want to use</Text>

          <View style={styles.accountsContainer}>
            <TouchableOpacity
              style={[
                styles.accountCard,
                selectedAccount === 'existing' && styles.accountCardSelected,
              ]}
              onPress={handleExistingAccountSelect}
              activeOpacity={0.8}
            >
              <View style={styles.selectionIndicator}>
                {selectedAccount === 'existing' ? (
                  <View style={styles.checkIconContainer}>
                    <Image source={Checkicon} style={styles.checkIcon} resizeMode="contain" />
                  </View>
                ) : (
                  <View style={styles.radioButton} />
                )}
              </View>

              <View style={styles.accountBody}>
                <View style={styles.profileImageContainer}>
                  {existingUser?.profile_photo ? (
                    <Image source={{ uri: existingUser.profile_photo }} style={styles.profileImagePlaceholder} resizeMode="cover" />
                  ) : (
                    <View style={styles.profileImagePlaceholder}>
                      <Image source={Usericon} style={styles.profileIcon} resizeMode="contain" />
                    </View>
                  )}
                </View>

                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>{existingAccountLabel}</Text>
                  <Text style={styles.accountLogin}>Login: {existingAccountLogin}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>or</Text>
              <View style={styles.separatorLine} />
            </View>

            <TouchableOpacity
              style={[
                styles.accountCard,
                styles.newAccountCard,
                selectedAccount === 'new' && styles.accountCardSelected,
                !canCreateNewAccount && { opacity: 0.5 },
              ]}
              onPress={handleNewAccountSelect}
              activeOpacity={0.8}
              disabled={!canCreateNewAccount}
            >
              <View style={styles.selectionIndicator}>
                {selectedAccount === 'new' ? (
                  <View style={styles.checkIconContainer}>
                    <Image source={Checkicon} style={styles.checkIcon} resizeMode="contain" />
                  </View>
                ) : (
                  <View style={styles.radioButton} />
                )}
              </View>

              <View style={styles.accountBody}>
                <View style={styles.profileImageContainer}>
                  <View style={styles.profileImagePlaceholder}>
                    <Image source={Usericon} style={styles.profileIcon} resizeMode="contain" />
                  </View>
                </View>

                <View style={styles.accountInfo}>
                  <Text style={styles.newAccountText}>Create a new account</Text>
                  <Text style={styles.accountLogin}>
                    Login: {emailParam || phoneParam || 'Use your current login'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            {!canCreateNewAccount && (
              <Text style={styles.footerText}>
                New account creation is disabled for this login. Please continue with your existing account.
              </Text>
            )}
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              You can only have 1 active account at a time. All the other accounts will need to be deleted
            </Text>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              <Text style={styles.continueButtonText}>
                {isSubmitting ? 'Please wait...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentWrapper}>
            <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIcon}>
                <Image source={Usericon} style={styles.modalProfileIcon} resizeMode="contain" />
              </View>
            </View>

            <Text style={styles.modalHeading}>
              You are creating a new account with{' '}
              <Text style={styles.modalHighlightedText}>{emailParam || phoneParam || 'your login'}</Text>
            </Text>

            <Text style={styles.modalWarning}>
              All other accounts and purchases will be deleted.
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

