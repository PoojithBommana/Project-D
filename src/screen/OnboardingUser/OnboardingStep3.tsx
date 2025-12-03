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
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'OnboardingStep3'>;
  route?: {
    params: {
      firstName: string;
      age: number;
      showOnlyFirstLetter: boolean;
    };
  };
}

export default function OnboardingStep3({ navigation, route }: Props) {
  const [location, setLocation] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);

  const handleInputChange = (text: string) => {
    setLocation(text);
    setIsButtonActive(text.trim().length > 0);
  };

  const handleContinue = () => {
    if (location.trim().length > 0) {
      navigation?.navigate('OnboardingStep4', {
        firstName: route?.params?.firstName || '',
        age: route?.params?.age || 0,
        location: location.trim(),
        showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
      });
    }
  };

  const progress = 45;

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
            <Text style={styles.heading}>📍 Where are you located?</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Enter your city"
              placeholderTextColor="#999999"
              value={location}
              onChangeText={handleInputChange}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleContinue}
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

