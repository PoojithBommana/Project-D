import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Image,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, Asset } from 'react-native-image-picker';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import styles from '../../styles/LivePhotoScreenStyles';
import { submitOnboardingUpdate } from '../../utils/onboardingUpdate';
import { uploadImageAndGetUrl } from '../../utils/imageUpload';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postApiCall } from '../../config/apiCall';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'LivePhotoScreen'>;
  route?: {
    params: {
      firstName: string;
      lastName: string;
      username?: string;
      gender: string;
      age: number;
      location: string;
      photo?: string;
      birthday: number;
      photos?: string[];
      datingGoal: string;
      currently: string;
      favorite_artist: string;
      bio: string;
      hobbies: string[];
      known_languages?: string[];
      interested_in_genders: string[];
      interested_age_range: { min: number; max: number };
      showOnlyFirstLetter: boolean;
    };
  };
}

export default function LivePhotoScreen({ navigation, route }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const [livePhoto, setLivePhoto] = useState<Asset | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera permission',
          message: 'We need access to your camera to take a live selfie.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Camera permission error:', err);
      return false;
    }
  };

  const handleCaptureLivePhoto = async () => {
    animateButtonPress();

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Camera permission needed',
        'Please enable camera access to capture a live selfie.',
      );
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'front',
        includeBase64: true,
        maxHeight: 1280,
        maxWidth: 1280,
        // quality: 0.85,
        saveToPhotos: false,
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          console.error('Live photo capture error:', response.errorMessage);
          Alert.alert('Capture failed', 'Could not open your camera. Please try again.');
          return;
        }

        const asset = response.assets?.[0];
        if (asset) {
          setLivePhoto(asset);
        }
      },
    );
  };

  const handleContinue = async () => {
    if (!livePhoto?.uri) {
      Alert.alert('Live photo required', 'Please capture a quick live selfie to continue.');
      return;
    }

    setIsSaving(true);
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('Authentication required', 'Please log in again.');
        setIsSaving(false);
        return;
      }

      // Upload live selfie to Cloudinary to get a CDN URL
      const selfieUrl = await uploadImageAndGetUrl({
        uri: livePhoto.uri,
        type: livePhoto.type,
        fileName: (livePhoto as any)?.fileName,
      });

      // Verify face by comparing live photo with uploaded photos
      const verifyResponse = await postApiCall(
        'POST',
        'AUTH',
        'VERIFY_FACE',
        {
          live_photo: selfieUrl,
        },
        accessToken,
      );

      if (verifyResponse?.error) {
        const errorMessage =
          verifyResponse?.response?.message ||
          verifyResponse?.response?.Message ||
          'Face verification failed. Please try again.';
        Alert.alert('Verification failed', errorMessage);
        setIsSaving(false);
        return;
      }

      if (!verifyResponse?.response?.verified) {
        Alert.alert(
          'Verification failed',
          verifyResponse?.response?.message ||
            'Your face could not be verified. Please ensure your live photo matches your profile photos.',
        );
        setIsSaving(false);
        return;
      }

      console.log('[LivePhotoScreen] Face verified successfully:', verifyResponse.response);

      const normalizedDatingGoal =
        (route?.params?.datingGoal || '').replace(/-/g, '_');

      const rawPhotos: (string | undefined)[] = [
        ...(route?.params?.photos || []),
        route?.params?.photo, // include single profile photo if provided
      ].filter(Boolean);
      const uploadedPhotos: string[] = [];

      if (rawPhotos.length) {
        for (const photoUri of rawPhotos) {
          if (!photoUri) continue;
          if (photoUri.startsWith('http://') || photoUri.startsWith('https://')) {
            uploadedPhotos.push(photoUri);
            continue;
          }
          const uploadedUrl = await uploadImageAndGetUrl({ uri: photoUri });
          uploadedPhotos.push(uploadedUrl);
        }
      }

      const response = await submitOnboardingUpdate(
        {
          first_name: route?.params?.firstName || '',
          last_name: route?.params?.lastName || '',
          gender: route?.params?.gender || '',
          birthday: route?.params?.birthday,
          currently: route?.params?.currently || '',
          favorite_artist: route?.params?.favorite_artist || '',
          photos: uploadedPhotos,
          username: route?.params?.username || '',
          bio: route?.params?.bio || '',
          hobbies: route?.params?.hobbies || [],
          known_languages: route?.params?.known_languages?.length
            ? route?.params?.known_languages
            : ['English'],
          connection_goal: normalizedDatingGoal,
          interested_in_genders: route?.params?.interested_in_genders || [],
          interested_age_range: route?.params?.interested_age_range,
          selfie_photo: selfieUrl,
        },
        accessToken || undefined,
      );
      if (!response?.success) {
        Alert.alert(
          'Could not create profile',
          response?.error || 'Please try again in a moment.',
        );
        return;
      }
      await AsyncStorage.setItem('onboarding_complete', 'true');
      navigateToHome();
    } catch (error) {
      console.error('Error completing onboarding with live photo:', error);
      Alert.alert(
        'Something went wrong',
        'We could not finish creating your profile. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const navigateToHome = () => {
    const rootNavigation = (navigation as any)?.getParent()?.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('TabNavigation');
    } else {
      (navigation as any)?.getParent()?.navigate('TabNavigation');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" translucent={false} />

      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Snap a quick live selfie</Text>
          <Text style={styles.subheading}>
            A short live shot helps us keep profiles real. This stays private and is only used to
            verify you.
          </Text>
        </View>

        {/* Preview Card */}
        <View style={styles.previewCard}>
          {livePhoto?.uri ? (
            <View style={styles.previewImageWrapper}>
              <Image source={{ uri: livePhoto.uri }} style={styles.previewImage} />
              <View style={styles.previewBadge}>
                <Icon name="check-decagram" size={18} color="#111" />
                <Text style={styles.previewBadgeText}>Live selfie ready</Text>
              </View>
            </View>
          ) : (
            <View style={styles.previewPlaceholder}>
              <View style={styles.previewIconCircle}>
                <Icon name="camera-outline" size={36} color="#111" />
              </View>
              <Text style={styles.previewPlaceholderTitle}>No live photo yet</Text>
              <Text style={styles.previewPlaceholderSubtitle}>
                Use your front camera, keep your face in frame, and make it natural.
              </Text>
            </View>
          )}
        </View>

        {/* Capture + Continue */}
        <View style={styles.actionsContainer}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCaptureLivePhoto}
              activeOpacity={0.85}
            >
              <Icon name="camera-outline" size={20} color="#111" />
              <Text style={styles.captureButtonText}>
                {livePhoto ? 'Retake live photo' : 'Take live photo'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={[styles.continueButton, (!livePhoto || isSaving) && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!livePhoto || isSaving}
            activeOpacity={0.9}
          >
            {isSaving ? (
              <ActivityIndicator color="#111" />
            ) : (
              <Text style={styles.continueButtonText}>Continue & create profile</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.privacyNote}>
            Your live selfie is used for verification only and won’t show on your profile.
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
