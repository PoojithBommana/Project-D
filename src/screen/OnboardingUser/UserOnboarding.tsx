import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { rf } from '../../utils/responsive';
import styles from '../../styles/UserOnboardingStyles';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'UserOnboarding'>;
}

export default function UserOnboarding({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [showOnlyFirstLetter, setShowOnlyFirstLetter] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleInputChange = (text: string) => {
    setFirstName(text);
    setIsButtonActive(text.trim().length > 0);
  };

  const togglePrivacyOption = () => {
    setShowOnlyFirstLetter(!showOnlyFirstLetter);
  };

  const handleContinue = () => {
    if (firstName.trim().length > 0) {
      navigation?.navigate('OnboardingStep2', {
        firstName: firstName.trim(),
        showOnlyFirstLetter,
      });
    }
  };

  const getPrivacyExample = () => {
    if (firstName.trim().length > 0) {
      const firstLetter = firstName.trim()[0].toUpperCase();
      return `${firstName.trim()} shown as ${firstLetter}`;
    }
    return ':Ria shown as R';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#E8F4F8"
        translucent={false}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar]} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>
              👋 What's your first name?
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.inputField}
              placeholder="Your first name"
              placeholderTextColor="#999999"
              value={firstName}
              onChangeText={handleInputChange}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              accessibilityLabel="First name input"
              accessibilityHint="Enter your first name"
            />
          </View>

          <TouchableOpacity
            style={styles.privacyContainer}
            onPress={togglePrivacyOption}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: showOnlyFirstLetter }}
            accessibilityLabel="Show only the first letter on profile"
          >
            <View style={styles.privacyRow}>
              <View
                style={[
                  styles.checkbox,
                  showOnlyFirstLetter
                    ? styles.checkboxChecked
                    : styles.checkboxUnchecked,
                ]}
              >
                {showOnlyFirstLetter && (
                  <Icon
                    name="check"
                    size={rf(12)}
                    style={styles.checkboxIcon}
                  />
                )}
              </View>

              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyText}>
                  Show only the first letter on profile
                </Text>
                <Text style={styles.privacyExample}>
                  (💡 {getPrivacyExample()})
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                isButtonActive
                  ? styles.continueButtonActive
                  : styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!isButtonActive}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Continue"
              accessibilityState={{ disabled: !isButtonActive }}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  isButtonActive
                    ? styles.continueButtonTextActive
                    : styles.continueButtonTextDisabled,
                ]}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
