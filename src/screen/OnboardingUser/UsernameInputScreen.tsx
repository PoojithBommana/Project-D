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
import { Checkicon } from '../../assets';
import { rf } from '../../utils/responsive';
import styles from '../../styles/UsernameInputStyles';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'UsernameInputScreen'>;
  route?: {
    params: {
      firstName: string;
      lastName: string;
      showOnlyFirstLetter: boolean;
    };
  };
}

export default function UsernameInputScreen({ navigation, route }: Props) {
  const [username, setUsername] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const usernameInputRef = useRef<TextInput>(null);
  const buttonScale = useRef(new Animated.Value(1)).current;
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

  // Simulate username availability check
  const checkUsernameAvailability = async (text: string) => {
    if (text.trim().length === 0) {
      setIsUsernameAvailable(null);
      setIsButtonActive(false);
      return;
    }

    setIsChecking(true);
    // Simulate API call delay
    setTimeout(() => {
      // For now, simulate: username is available if length > 3
      // In real implementation, this would be an API call to check DB
      const isAvailable = text.trim().length > 3;
      setIsUsernameAvailable(isAvailable);
      setIsButtonActive(isAvailable);
      setIsChecking(false);
    }, 500);
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    checkUsernameAvailability(text);
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
    if (username.trim().length > 0 && isUsernameAvailable) {
      animateButtonPress();
      setTimeout(() => {
        navigation?.navigate('GenderSelectionScreen', {
          firstName: route?.params?.firstName || '',
          lastName: route?.params?.lastName || '',
          username: username.trim(),
          showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
        });
      }, 150);
    }
  };

  const progress = 30;

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
              Choose your username
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={usernameInputRef}
                style={styles.inputField}
                placeholder="Your username"
                placeholderTextColor="#999999"
                value={username}
                onChangeText={handleUsernameChange}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                accessibilityLabel="Username input"
                accessibilityHint="Enter your username"
              />
              {isUsernameAvailable === true && !isChecking && (
                <View style={styles.checkmarkContainer}>
                  <Image
                    source={Checkicon}
                    style={styles.checkmarkIcon}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
            {isUsernameAvailable === false && !isChecking && (
              <Text style={styles.errorText}>
                Username is not available
              </Text>
            )}
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

