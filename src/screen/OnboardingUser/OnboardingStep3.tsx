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
  Modal,
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
    params: {
      firstName: string;
      lastName: string;
      username: string;
      gender: string;
      age: number;
      showOnlyFirstLetter: boolean;
    };
  };
}

export default function OnboardingStep3({ navigation, route }: Props) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
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
    setShowPhotoModal(true);
    Animated.spring(modalSlideAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(modalSlideAnim, {
      toValue: hp(100),
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowPhotoModal(false);
      setCurrentSlide(0);
    });
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
            message: 'DilMill needs access to your photos to select images.',
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
            message: 'DilMill needs access to your storage to select images.',
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
    handleCloseModal();
    // Navigate directly to next screen after closing modal
    setTimeout(() => {
      navigateToNextScreen();
    }, 300);
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
    // Show the guidelines modal instead of navigating directly
    setShowPhotoModal(true);
    Animated.spring(modalSlideAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const navigateToNextScreen = () => {
    animateButtonPress();
    setTimeout(() => {
      navigation?.navigate('OnboardingStep4', {
        firstName: route?.params?.firstName || '',
        lastName: route?.params?.lastName || '',
        username: route?.params?.username || '',
        gender: route?.params?.gender || '',
        age: route?.params?.age || 0,
        location: '', // Will be set in next screen
        showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
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
        <Modal
          visible={showPhotoModal}
          transparent={true}
          animationType="none"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={handleCloseModal}
            />
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ translateY: modalSlideAnim }],
                },
              ]}
            >
              <View style={styles.modalContent}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    Choose the right photos, get better matches
                  </Text>
                  <Text style={styles.modalSubtitle}>by DilMill Security</Text>
                </View>

                {/* Guideline Cards */}
                <View style={styles.guidelinesContainer}>
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={wp(280) + wp(20)}
                    snapToAlignment="center"
                    decelerationRate="fast"
                    onMomentumScrollEnd={(event) => {
                      const cardWidth = wp(280) + wp(20); // card width + margin
                      const slideIndex = Math.round(
                        event.nativeEvent.contentOffset.x / cardWidth
                      );
                      setCurrentSlide(slideIndex);
                    }}
                    style={styles.guidelinesScrollView}
                    contentContainerStyle={styles.guidelinesScrollContent}
                  >
                    {photoGuidelines.map((guideline, index) => (
                      <View key={guideline.id} style={styles.guidelineCard}>
                        <Text style={styles.guidelineText}>{guideline.text}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>

                {/* Pagination Dots */}
                <View style={styles.paginationContainer}>
                  {photoGuidelines.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.paginationDot,
                        index === currentSlide && styles.paginationDotActive,
                      ]}
                    />
                  ))}
                </View>

                {/* Modal Continue Button */}
                <TouchableOpacity
                  style={styles.modalContinueButton}
                  onPress={handleModalContinue}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalContinueButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
