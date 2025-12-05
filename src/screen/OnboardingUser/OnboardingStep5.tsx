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
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import { rf ,hp} from '../../utils/responsive';
// import { setOnboardingComplete } from '../../utils/tokenStorage';
import styles from '../../styles/OnboardingStyles';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'OnboardingStep5'>;
  route?: {
    params: {
      firstName: string;
      lastName: string;
      username: string;
      gender: string;
      age: number;
      location: string;
      photo?: string;
      showOnlyFirstLetter: boolean;
    };
  };
}

export default function OnboardingStep5({ navigation, route }: Props) {
  const [bio, setBio] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleInputChange = (text: string) => {
    setBio(text);
    setIsButtonActive(text.trim().length >= 10);
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
  };

  const handleContinue = async () => {
    if (bio.trim().length >= 10) {
      animateButtonPress();
      const onboardingData = {
        firstName: route?.params?.firstName || '',
        age: route?.params?.age || 0,
        location: route?.params?.location || '',
        photo: route?.params?.photo,
        bio: bio.trim(),
        showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
      };

      console.log('Onboarding complete:', onboardingData);
      
      try {
        // await setOnboardingComplete();
        navigation?.getParent()?.navigate('TabNavigation');
      } catch (error) {
        console.error('Error marking onboarding as complete:', error);
        navigation?.getParent()?.navigate('TabNavigation');
      }
    }
  };

  const progress = 75;

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

        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>✍️ Tell us about yourself</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.inputField,
                {
                  height: hp(120),
                  textAlignVertical: 'top',
                  paddingTop: hp(16),
                  paddingBottom: hp(16),
                },
              ]}
              placeholder="Write a short bio (min 10 characters)"
              placeholderTextColor="#999999"
              value={bio}
              onChangeText={handleInputChange}
              multiline
              maxLength={200}
              returnKeyType="done"
            />
            <Text
              style={{
                fontSize: rf(12),
                fontFamily: 'Inter',
                fontWeight: '400',
                color: '#999999',
                marginTop: hp(8),
                textAlign: 'right',
              }}
            >
              {bio.length}/200
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Animated.View
              style={{
                transform: [{ scale: buttonScale }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  isButtonActive ? styles.continueButtonActive : styles.continueButtonDisabled,
                ]}
                onPress={handleContinue}
                disabled={!isButtonActive}
                activeOpacity={1}
              >
                <Text
                  style={[
                    styles.continueButtonText,
                    isButtonActive
                      ? styles.continueButtonTextActive
                      : styles.continueButtonTextDisabled,
                  ]}
                >
                  Complete
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

