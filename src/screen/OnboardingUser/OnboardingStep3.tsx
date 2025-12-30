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
  ScrollView,
  Image,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';

import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/PhotoUploadScreenStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Plusicon } from '../../assets';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'OnboardingStep3'>;
  route?: {
    params: OnboardingStackParamList['OnboardingStep3'];
  };
}

export default function OnboardingStep3({ navigation, route }: Props) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(0.95)).current;
  const modalSlideAnim = useRef(new Animated.Value(hp(100))).current;

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
      Animated.spring(cardScale, {
        toValue: 1,
        delay: 200,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  const handleAddPhoto = () => {
    navigateToNextScreen();
  };

  const requestAndroidPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      if (Platform.Version >= 33) {
        const checkResult = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        
        if (checkResult) {
          return true;
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Photo Library Permission',
            message: 'Snixx needs access to your photos to select images.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const checkResult = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        
        if (checkResult) {
          return true;
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'Snixx needs access to your storage to select images.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.error('Permission request error:', err);
      return false;
    }
  };

  const handleModalContinue = () => {
    navigateToNextScreen();
  };

  const photoGuidelines = [
    {
      id: 1,
      text: 'Upload a bright and clear photo of just you',
    },
    {
      id: 2,
      text: 'Photos will be verified and your face is not shown to others until verified',
    },
    {
      id: 3,
      text: 'Make sure your face is clearly visible',
    },
  ];

  const handleContinue = () => {
    navigateToNextScreen();
  };

  const navigateToNextScreen = () => {
    animateButtonPress();
    setTimeout(() => {
      navigation?.navigate('OnboardingStep4', {
        // Forward everything collected so far (including beliefs, causes, music, etc.)
        ...(route?.params || ({} as any)),
        // Location will be set in the next screen
        location: '',
      });
    }, 150);
  };

  const progress = 80; // Progress percentage
  const firstName = route?.params?.firstName || '';
  const age = route?.params?.age || 0;
  const displayName = firstName || 'User';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <View style={styles.cardHeader}>
              <View style={styles.headerTitleRow}>
             
                <Text style={styles.cardTitle}>Keep it real. Add your photos!</Text>
              </View>
              <Text style={styles.cardSubtitle}>
                Join 3M+ users who trusted us with their photos
              </Text>
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
          {/* Main Card */}
          <Animated.View
            style={[
              styles.cardContainer,
              {
                transform: [{ scale: cardScale }],
              },
            ]}
          >
            {/* Header Section */}
         

            {/* Profile Photo Placeholder */}
            <View style={styles.photoContainer}>
              <View style={styles.silhouetteContainer}>
               
                <TouchableOpacity
                
                  onPress={handleAddPhoto}
                  activeOpacity={0.8}
                >
                  <Image source={Plusicon} style={styles.addIcon} />
                </TouchableOpacity>
              </View>
            </View>

            {/* User Info */}
            <View style={styles.userInfoContainer}>
              <Text style={styles.userInfoText}>
                {displayName}, {age}
              </Text>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Animated.View
            style={{
              transform: [{ scale: buttonScale }],
            }}
          >
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Photo Guidelines Modal */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
