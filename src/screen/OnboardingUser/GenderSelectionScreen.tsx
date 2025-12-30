import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/GenderSelectionStyles';
import { Boyicon, Girlicon } from '../../assets';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'GenderSelectionScreen'>;
  route?: {
    params: {
      firstName: string;
      lastName: string;
      username?: string;
      showOnlyFirstLetter: boolean;
    };
  };
}

export default function GenderSelectionScreen({ navigation, route }: Props) {
  const [selectedGender, setSelectedGender] = useState<string>('');
  const buttonScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  ];

  const optionScales = useRef(
    genderOptions.reduce((acc, option) => {
      acc[option.value] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animateOptionPress = (value: string) => {
    Animated.sequence([
      Animated.spring(optionScales[value], {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(optionScales[value], {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
  };

  const handleGenderSelect = (gender: string) => {
    animateOptionPress(gender);
    setSelectedGender(gender);
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

  const handleContinue = () => {
    if (!selectedGender) {
      return;
    }
    animateButtonPress();
    navigation?.navigate('OnboardingStep2', {
      firstName: route?.params?.firstName || '',
      lastName: route?.params?.lastName || '',
      username: route?.params?.username,
      gender: selectedGender,
      showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
    });
  };

  const getGenderLabel = (value: string): string => {
    const option = genderOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const progress = 40;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFCF1"
        translucent={false}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>
              What's your gender?
            </Text>
            <Text style={styles.subheading}>
            For… scientific cuteness reasons 👀
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            {genderOptions.map((option) => (
              <Animated.View
                key={option.value}
                style={{
                  transform: [{ scale: optionScales[option.value] }],
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    selectedGender === option.value && styles.genderOptionSelected,
                  ]}
                  onPress={() => handleGenderSelect(option.value)}
                  activeOpacity={1}
                >
                  <Text
                    style={[
                      styles.genderOptionText,
                      selectedGender === option.value && styles.genderOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.value === 'male' && (
                    <Image source={Boyicon} style={styles.genderOptionImage} resizeMode="contain" />
                  )}
                  {option.value === 'female' && (
                    <Image source={Girlicon} style={styles.genderOptionImage} resizeMode="contain" />
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
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
                  !selectedGender && styles.continueButtonDisabled,
                ]}
                onPress={handleContinue}
                disabled={!selectedGender}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Continue"
                accessibilityState={{ disabled: !selectedGender }}
              >
                <Text
                  style={[
                    styles.continueButtonText,
                    !selectedGender && styles.continueButtonTextDisabled,
                  ]}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

  