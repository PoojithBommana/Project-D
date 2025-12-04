import React, { useState } from 'react';
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

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'AccountSelectionScreen'>;
}

export default function AccountSelectionScreen({ navigation }: Props) {
  const [selectedAccount, setSelectedAccount] = useState<'existing' | 'new'>('existing');
  const [showModal, setShowModal] = useState(false);

  const handleExistingAccountSelect = () => {
    setSelectedAccount('existing');
  };

  const handleNewAccountSelect = () => {
    setSelectedAccount('new');
  };

  const handleContinue = () => {
    if (selectedAccount === 'new') {
      setShowModal(true);
    } else {
      navigation?.navigate('ProfileSetupIntroScreen');
    }
  };

  const handleModalContinue = () => {
    setShowModal(false);
    navigation?.navigate('ProfileSetupIntroScreen');
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

              <View style={styles.accountHeader}>
                <Text style={styles.createdDate}>Created 4 days ago</Text>
              </View>

              <View style={styles.accountBody}>
                <View style={styles.profileImageContainer}>
                  <View style={styles.profileImagePlaceholder}>
                    <Image source={Usericon} style={styles.profileIcon} resizeMode="contain" />
                  </View>
                </View>

                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>Tej, 19</Text>
                  <Text style={styles.accountLogin}>Login: +918919926373</Text>
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
              ]}
              onPress={handleNewAccountSelect}
              activeOpacity={0.8}
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
                  <Text style={styles.accountLogin}>Login: myselfyours.tej@gmail.com</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              You can only have 1 active account at a time. All the other accounts will need to be deleted
            </Text>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
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
              <Text style={styles.modalHighlightedText}>myselfyours.tej@gmail.com</Text>
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

