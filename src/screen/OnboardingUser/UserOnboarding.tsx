import React, { useState, useRef, useEffect } from 'react';
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
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Checkicon } from '../../assets';
import { rf } from '../../utils/responsive';
import styles from '../../styles/UserOnboardingStyles';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'UserOnboarding'>;
}

export default function UserOnboarding({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showOnlyFirstLetter, setShowOnlyFirstLetter] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const checkboxScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
    updateButtonState(text, lastName);
  };

  const handleLastNameChange = (text: string) => {
    setLastName(text);
    updateButtonState(firstName, text);
  };

  const updateButtonState = (first: string, last: string) => {
    setIsButtonActive(first.trim().length > 0 && last.trim().length > 0);
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

  const animateCheckboxPress = () => {
    Animated.sequence([
      Animated.spring(checkboxScale, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(checkboxScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
  };

  const togglePrivacyOption = () => {
    animateCheckboxPress();
    setShowOnlyFirstLetter(!showOnlyFirstLetter);
  };

  const handleContinue = () => {
    if (firstName.trim().length > 0 && lastName.trim().length > 0) {
      animateButtonPress();
      setTimeout(() => {
        navigation?.navigate('UsernameInputScreen', {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          showOnlyFirstLetter,
        });
      }, 150);
    }
  };

  const getPrivacyExample = () => {
    if (firstName.trim().length > 0) {
      return `:${firstName.trim()} shown as ${firstName.trim()}`;
    }
    return ':Ria shown as Ria';
  };

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
          <Animated.View style={[styles.progressBar]} />
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
            Hey there!{'\n'}What should we call you?
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              ref={firstNameInputRef}
              style={styles.inputField}
              placeholder="Your first name"
              placeholderTextColor="#999999"
              value={firstName}
              onChangeText={handleFirstNameChange}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => lastNameInputRef.current?.focus()}
              accessibilityLabel="First name input"
              accessibilityHint="Enter your first name"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              ref={lastNameInputRef}
              style={styles.inputField}
              placeholder="Your last name"
              placeholderTextColor="#999999"
              value={lastName}
              onChangeText={handleLastNameChange}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              accessibilityLabel="Last name input"
              accessibilityHint="Enter your last name"
            />
          </View>

          <TouchableOpacity
            style={styles.privacyContainer}
            onPress={togglePrivacyOption}
            activeOpacity={1}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: showOnlyFirstLetter }}
            accessibilityLabel="Show your first name on profile"
          >
            <View style={styles.privacyRow}>
              <Animated.View
                style={[
                  styles.checkbox,
                  showOnlyFirstLetter
                    ? styles.checkboxChecked
                    : styles.checkboxUnchecked,
                  {
                    transform: [{ scale: checkboxScale }],
                  },
                ]}
              >
                {showOnlyFirstLetter && (
                  <Image
                    source={Checkicon}
                    style={styles.checkboxIcon}
                    resizeMode="contain"
                  />
                )}
              </Animated.View>
              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyText}>
                We’ll flash your first name on your profile—keep it cute!
                </Text>
               
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <Animated.View
              style={{
                transform: [{ scale: buttonScale }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  
                ]}
                onPress={handleContinue}
                disabled={!isButtonActive}
                activeOpacity={1}
                accessibilityRole="button"
                accessibilityLabel="Continue"
                accessibilityState={{ disabled: !isButtonActive }}
              >
                <Text
                  style={[
                    styles.continueButtonText,
                 
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
