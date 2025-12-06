import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
  Modal,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/GenderSelectionStyles';
import { Boyicon, Girlicon, Usericon } from '../../assets';

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
  const [showConfirmationPopup, setShowConfirmationPopup] = useState<boolean>(false);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const popupScale = useRef(new Animated.Value(0.8)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;
  
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

  // Animate popup when it becomes visible
  useEffect(() => {
    if (showConfirmationPopup) {
      // Reset animation values - start with visible opacity and smaller scale
      popupScale.setValue(0.8);
      popupOpacity.setValue(1); // Make it visible immediately
      // Start animation after a small delay to ensure modal is rendered
      const timer = setTimeout(() => {
        Animated.spring(popupScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      }, 50);
      
      return () => clearTimeout(timer);
    } else {
      // Reset when modal closes
      popupScale.setValue(0.8);
      popupOpacity.setValue(0);
    }
  }, [showConfirmationPopup]);

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
    if (selectedGender) {
      animateButtonPress();
      setShowConfirmationPopup(true);
    }
  };

  const handleConfirmYes = () => {
    Animated.parallel([
      Animated.spring(popupScale, {
        toValue: 0.8,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowConfirmationPopup(false);
      // Reset animation values after closing
      popupScale.setValue(0.8);
      popupOpacity.setValue(0);
      navigation?.navigate('OnboardingStep2', {
        firstName: route?.params?.firstName || '',
        lastName: route?.params?.lastName || '',
        username: route?.params?.username,
        gender: selectedGender,
        showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
      });
    });
  };

  const handleConfirmNo = () => {
    Animated.parallel([
      Animated.spring(popupScale, {
        toValue: 0.8,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowConfirmationPopup(false);
      // Reset animation values after closing
      popupScale.setValue(0.8);
      popupOpacity.setValue(0);
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

      <Modal
        visible={showConfirmationPopup}
        transparent={true}
        animationType="none"
        onRequestClose={handleConfirmNo}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.popupContainer,
              {
                opacity: popupOpacity,
                transform: [{ scale: popupScale }],
              },
            ]}
          >
            <View style={styles.popupIconContainer}>
              <Image source={Usericon} style={styles.popupIcon} resizeMode="contain" />
            </View>

            <Text style={styles.popupTitle}>
              Are you <Text style={styles.popupTitleHighlight}>{getGenderLabel(selectedGender)}</Text>?
            </Text>

            <Text style={styles.popupMessage}>
              Make sure this is your correct gender as you can't change this later.
            </Text>

            <View style={styles.popupButtonsContainer}>
              <TouchableOpacity
                style={styles.popupButtonNo}
                onPress={handleConfirmNo}
                activeOpacity={0.8}
              >
                <Text style={styles.popupButtonNoText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.popupButtonYes}
                onPress={handleConfirmYes}
                activeOpacity={0.8}
              >
                <Text style={styles.popupButtonYesText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

