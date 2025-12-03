import React, { useState } from 'react';
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
import { rf } from '../../utils/responsive';
import styles from '../../styles/OnboardingStyles';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'OnboardingStep2'>;
  route?: {
    params: {
      firstName: string;
      showOnlyFirstLetter: boolean;
    };
  };
}

export default function OnboardingStep2({ navigation, route }: Props) {
  const [age, setAge] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);

  const handleInputChange = (text: string) => {
    const numericText = text.replace(/[^\d]/g, '');
    setAge(numericText);
    setIsButtonActive(numericText.length > 0 && parseInt(numericText) >= 18 && parseInt(numericText) <= 100);
  };

  const handleContinue = () => {
    if (age.trim().length > 0 && parseInt(age) >= 18) {
      navigation?.navigate('OnboardingStep3', {
        firstName: route?.params?.firstName || '',
        age: parseInt(age),
        showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
      });
    }
  };

  const progress = 30;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4F8" translucent={false} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>🎂 How old are you?</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Enter your age"
              placeholderTextColor="#999999"
              value={age}
              onChangeText={handleInputChange}
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              maxLength={3}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                isButtonActive ? styles.continueButtonActive : styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!isButtonActive}
              activeOpacity={0.8}
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

