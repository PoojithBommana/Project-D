import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  Linking,
  Alert,
  PermissionsAndroid,
  Switch,
  AppState,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/DevicePermissionsScreenStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { submitOnboardingUpdate } from '../../utils/onboardingUpdate';
import { uploadImageAndGetUrl } from '../../utils/imageUpload';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'DevicePermissionsScreen'>;
  route?: {
    params: {
      firstName: string;
      lastName: string;
      username?: string;
      gender: string;
      age: number;
      location: string;
      photo?: string;
      photos?: string[];
      datingGoal: string;
      showOnlyFirstLetter: boolean;
      interested_in_genders: string[];
      interested_age_range: { min: number; max: number };
      hobbies: string[];
      currently?: string;
      known_languages?: string[];
      height_cm?: number;
      drinking?: string;
      smoking?: string;
      activity_interests?: string[];
      qualities?: string[];
      zodiac_sign?: string;
      music_genres?: string[];
      music_artist_ids?: string[];
      religion?: string;
      causes_communities?: string[];
      latitude?: number;
      longitude?: number;
      bio?: string;
      birthday?: number;
    };
  };
}

interface PermissionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  granted: boolean;
}

export default function DevicePermissionsScreen({ navigation, route }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const [permissions, setPermissions] = useState<PermissionItem[]>([
    {
      id: 'contacts',
      title: 'Contacts',
      description: 'So you can connect with friends already on snixx',
      icon: 'contacts',
      granted: false,
    },
    {
      id: 'media',
      title: 'Media Storage',
      description: 'So you can store snixx memes on your phone',
      icon: 'folder',
      granted: false,
    },
    {
      id: 'camera',
      title: 'Camera',
      description: 'So you can take photos and share moments',
      icon: 'camera-alt',
      granted: false,
    },
  ]);

  // Check permission status
  const checkPermissionStatus = async (permissionId: string) => {
    if (Platform.OS === 'android') {
      try {
        if (permissionId === 'contacts') {
          const status = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS
          );
          updatePermissionStatus(permissionId, status === true);
        } else if (permissionId === 'media') {
          const androidVersion = Platform.Version;
          let status = false;
          if (androidVersion >= 33) {
            status = await PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            );
          } else {
            status = await PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            );
          }
          updatePermissionStatus(permissionId, status === true);
        } else if (permissionId === 'camera') {
          const status = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.CAMERA
          );
          updatePermissionStatus(permissionId, status === true);
        }
      } catch (err) {
        console.error(`Error checking ${permissionId} permission:`, err);
      }
    } else {
      // iOS - check permissions if react-native-permissions is available
      try {
        const permissionsModule = require('react-native-permissions');
        const { check, PERMISSIONS } = permissionsModule;
        let permissionKey;
        
        if (permissionId === 'contacts') {
          permissionKey = PERMISSIONS.IOS.CONTACTS;
        } else if (permissionId === 'media') {
          permissionKey = PERMISSIONS.IOS.PHOTO_LIBRARY;
        } else if (permissionId === 'camera') {
          permissionKey = PERMISSIONS.IOS.CAMERA;
        }
        
        if (permissionKey) {
          const status = await check(permissionKey);
          updatePermissionStatus(permissionId, status === 'granted' || status === 'limited');
        }
      } catch (err) {
        // react-native-permissions not available, skip check
      }
    }
  };

  // Check all permissions on mount and when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Check all permissions when screen comes into focus
      permissions.forEach((perm) => {
        checkPermissionStatus(perm.id);
      });
    }, [])
  );

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

    // Check permissions on mount
    permissions.forEach((perm) => {
      checkPermissionStatus(perm.id);
    });

    // Listen for app state changes (when user returns from settings)
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // App came to foreground, check permissions again
        setTimeout(() => {
          permissions.forEach((perm) => {
            checkPermissionStatus(perm.id);
          });
        }, 500);
      }
    });

    return () => {
      subscription?.remove();
    };
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

  const togglePermission = async (permissionId: string, value: boolean) => {
    if (value) {
      await requestPermission(permissionId);
    } else {
      updatePermissionStatus(permissionId, false);
    }
  };

  const requestPermission = async (permissionId: string) => {
    try {
      if (permissionId === 'contacts') {
        if (Platform.OS === 'android') {
          try {
            // Check if permission is already granted
            const checkResult = await PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.READ_CONTACTS
            );
            
            console.log('Contacts permission check result:', checkResult);
            
            if (checkResult === true) {
              updatePermissionStatus(permissionId, true);
              return;
            }

            console.log('Requesting contacts permission...');
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
              {
                title: 'Contacts Permission',
                message: 'snixx needs access to your contacts to connect you with friends.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'Allow',
              }
            );
            
            console.log('Contacts permission request result:', granted);
            const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
            updatePermissionStatus(permissionId, isGranted);
            
            if (!isGranted) {
              if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                Alert.alert(
                  'Permission Required',
                  'Contacts permission was denied. Please enable it in Settings > Apps > snixx > Permissions.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Open Settings', 
                      onPress: async () => {
                        await Linking.openSettings();
                        // Check permission again after a delay when user returns
                        setTimeout(() => {
                          checkPermissionStatus(permissionId);
                        }, 1000);
                      }
                    },
                  ]
                );
              } else {
                // Permission denied but can ask again
                updatePermissionStatus(permissionId, false);
              }
            } else {
              // Permission granted
              updatePermissionStatus(permissionId, true);
            }
          } catch (err) {
            console.error('Error requesting contacts permission:', err);
            updatePermissionStatus(permissionId, false);
            Alert.alert(
              'Error',
              'Failed to request contacts permission. Please check if the permission is declared in the app manifest.',
              [{ text: 'OK' }]
            );
          }
        } else {
          // iOS contacts permission - try react-native-permissions if available, otherwise guide user
          try {
            const permissionsModule = require('react-native-permissions');
            const { request, PERMISSIONS, RESULTS } = permissionsModule;
            console.log('Requesting iOS contacts permission...');
            const result = await request(PERMISSIONS.IOS.CONTACTS);
            console.log('iOS contacts permission result:', result);
            updatePermissionStatus(permissionId, result === RESULTS.GRANTED);
          } catch (err) {
            console.error('Error requesting iOS contacts permission:', err);
            // Fallback: guide user to enable in settings
            // On iOS, we can't directly request contacts without react-native-permissions
            // So we'll mark it as enabled and let the user know they need to enable it in settings
            Alert.alert(
              'Contacts Permission',
              'To enable contacts access, please go to Settings > Privacy & Security > Contacts and enable it for snixx.',
              [
                { text: 'Cancel', style: 'cancel', onPress: () => updatePermissionStatus(permissionId, false) },
                { 
                  text: 'Open Settings', 
                  onPress: () => {
                    Linking.openSettings();
                    updatePermissionStatus(permissionId, true);
                  }
                },
              ]
            );
          }
        }
      } else if (permissionId === 'media') {
        if (Platform.OS === 'android') {
          try {
            const androidVersion = Platform.Version;
            let checkResult;
            let granted;

            if (androidVersion >= 33) {
              // Android 13+ uses granular media permissions
              checkResult = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
              );
              
              if (checkResult === true) {
                updatePermissionStatus(permissionId, true);
                return;
              }

              granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                {
                  title: 'Media Permission',
                  message: 'snixx needs access to your photos and media.',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'Allow',
                }
              );
            } else {
              // Android 12 and below
              checkResult = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
              );
              
              if (checkResult === true) {
                updatePermissionStatus(permissionId, true);
                return;
              }

              granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                  title: 'Storage Permission',
                  message: 'snixx needs access to your photos and media.',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'Allow',
                }
              );
            }
            updatePermissionStatus(
              permissionId,
              granted === PermissionsAndroid.RESULTS.GRANTED
            );
          } catch (err) {
            console.error('Error requesting media permission:', err);
            updatePermissionStatus(permissionId, false);
          }
        } else {
          // iOS media permission - request photo library access
          try {
            const permissionsModule = require('react-native-permissions');
            const { request, PERMISSIONS, RESULTS } = permissionsModule;
            const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
            updatePermissionStatus(permissionId, result === RESULTS.GRANTED || result === RESULTS.LIMITED);
          } catch (err) {
            // Fallback: will be requested automatically by react-native-image-picker when used
            // For now, mark as enabled and let image picker handle the actual request
            updatePermissionStatus(permissionId, true);
          }
        }
      } else if (permissionId === 'camera') {
        if (Platform.OS === 'android') {
          try {
            // Check if permission is already granted
            const checkResult = await PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.CAMERA
            );
            
            if (checkResult === true) {
              updatePermissionStatus(permissionId, true);
              return;
            }

            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: 'Camera Permission',
                message: 'snixx needs access to your camera to take photos.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'Allow',
              }
            );
            updatePermissionStatus(
              permissionId,
              granted === PermissionsAndroid.RESULTS.GRANTED
            );
          } catch (err) {
            console.error('Error requesting camera permission:', err);
            updatePermissionStatus(permissionId, false);
          }
        } else {
          // iOS camera permission
          try {
            const permissionsModule = require('react-native-permissions');
            const { request, PERMISSIONS, RESULTS } = permissionsModule;
            const result = await request(PERMISSIONS.IOS.CAMERA);
            updatePermissionStatus(permissionId, result === RESULTS.GRANTED);
          } catch (err) {
            // Fallback: camera permission will be requested by image picker when camera is used
            // For now, mark as enabled and let image picker handle the actual request
            updatePermissionStatus(permissionId, true);
          }
        }
      }
    } catch (error) {
      console.error(`Error requesting ${permissionId} permission:`, error);
      updatePermissionStatus(permissionId, false);
    }
  };

  const updatePermissionStatus = (permissionId: string, granted: boolean) => {
    setPermissions((prev) =>
      prev.map((perm) => (perm.id === permissionId ? { ...perm, granted } : perm))
    );
  };

  const handleGetStarted = async () => {
    animateButtonPress();

    // Request all permissions that are enabled, sequentially
    for (const perm of permissions) {
      if (perm.granted) {
        await requestPermission(perm.id);
        // Small delay between requests for better UX
        // so the permission dialogs don't feel too abrupt.
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));
      }
    }

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('Authentication required', 'Please log in again.');
        return;
      }

      const routeParams = route?.params as any;

      // Fallback: read music selections from AsyncStorage if not on route
      let storedMusicArtistIds: string[] | undefined;
      let storedMusicGenres: string[] | undefined;
      try {
        const storedIdsJson = await AsyncStorage.getItem('onboarding_music_artist_ids');
        const storedGenresJson = await AsyncStorage.getItem('onboarding_music_genres');
        storedMusicArtistIds = storedIdsJson ? JSON.parse(storedIdsJson) : undefined;
        storedMusicGenres = storedGenresJson ? JSON.parse(storedGenresJson) : undefined;
      } catch (e) {
        console.warn('[DevicePermissionsScreen] Failed to read stored music selections:', e);
      }

      // Normalize dating goal to API `connection_goal` values
      const mapConnectionGoal = (goal: string): string => {
        const goalLower = (goal || '').toLowerCase().replace(/-/g, '_');
        const goalMap: Record<string, string> = {
          casual: 'casual',
          long_term: 'long_term',
          longterm: 'long_term',
          short_term: 'short_term',
          shortterm: 'short_term',
          go_with_flow: 'casual',
          'go with flow': 'casual',
          friendship: 'friendship',
          friends: 'friendship',
        };
        return goalMap[goalLower] || 'casual';
      };

      const normalizedDatingGoal = mapConnectionGoal(routeParams?.datingGoal || '');

      // Collect profile photo and gallery photos from previous steps.
      // - `photo` is treated as the dedicated profile photo.
      // - `photos` is treated as the gallery.
      const profileSourceUri: string | undefined = routeParams?.photo;
      const gallerySourceUris: string[] = (routeParams?.photos || []).filter(Boolean);

      let profileUploadedUrl: string | undefined;
      const galleryUploadedUrls: string[] = [];

      // Upload or normalize the dedicated profile photo first
      if (profileSourceUri) {
        if (
          profileSourceUri.startsWith('http://') ||
          profileSourceUri.startsWith('https://')
        ) {
          profileUploadedUrl = profileSourceUri;
        } else {
          profileUploadedUrl = await uploadImageAndGetUrl({ uri: profileSourceUri });
        }
      }

      // Upload / normalize gallery photos, skipping duplicates of the profile photo
      for (const uri of gallerySourceUris) {
        if (!uri) continue;
        if (profileSourceUri && uri === profileSourceUri) {
          // Already handled as profile photo above
          continue;
        }
        if (uri.startsWith('http://') || uri.startsWith('https://')) {
          if (!galleryUploadedUrls.includes(uri)) {
            galleryUploadedUrls.push(uri);
          }
        } else {
          const uploadedUrl = await uploadImageAndGetUrl({ uri });
          if (!galleryUploadedUrls.includes(uploadedUrl)) {
            galleryUploadedUrls.push(uploadedUrl);
          }
        }
      }

      // Bio is required and must be non-empty
      const userBio = routeParams?.bio?.trim() || '';
      const finalBio =
        userBio ||
        `Hi! I'm ${routeParams?.firstName || 'here'} and I'm looking forward to meeting new people!`;

      const payload: Record<string, any> = {
        first_name: routeParams?.firstName || '',
        last_name: routeParams?.lastName || '',
        gender: routeParams?.gender || '',
        username: routeParams?.username || '',
        bio: finalBio,
        connection_goal: normalizedDatingGoal,
        interested_in_genders: routeParams?.interested_in_genders || [],
        interested_age_range: routeParams?.interested_age_range || { min: 18, max: 99 },
      };

      // Add birthday (Required - format: YYYY-MM-DD)
      if (routeParams?.birthday) {
        const birthdayDate = new Date(routeParams.birthday);
        if (!isNaN(birthdayDate.getTime())) {
          const year = birthdayDate.getFullYear();
          const month = String(birthdayDate.getMonth() + 1).padStart(2, '0');
          const day = String(birthdayDate.getDate()).padStart(2, '0');
          payload.birthday = `${year}-${month}-${day}`;
        }
      } else {
        const age = routeParams?.age || 0;
        if (age > 0) {
          const currentYear = new Date().getFullYear();
          const birthYear = currentYear - age;
          payload.birthday = `${birthYear}-01-01`;
        }
      }

      // Currently (Required: "studying" or "working")
      if (routeParams?.currently) {
        payload.currently = routeParams.currently;
      } else {
        payload.currently = 'working';
      }

      // Photos and profile_photo
      const finalPhotos: string[] = [];
      if (profileUploadedUrl) {
        finalPhotos.push(profileUploadedUrl);
        payload.profile_photo = profileUploadedUrl;
        // Persist profile photo so LivePhotoScreen can use it for VERIFY_FACE comparison
        try {
          await AsyncStorage.setItem('onboarding_profile_photo_url', profileUploadedUrl);
        } catch (e) {
          console.warn('[DevicePermissionsScreen] Failed to store profile photo URL:', e);
        }
      }
      // Append gallery photos (deduped) after the profile photo
      for (const url of galleryUploadedUrls) {
        if (!finalPhotos.includes(url)) {
          finalPhotos.push(url);
        }
      }

      payload.photos = finalPhotos;

      // NOTE: We intentionally do NOT send `live_photo` from this screen.
      // The real live selfie is captured and used only for VERIFY_FACE in LivePhotoScreen.

      // Hobbies
      if (routeParams?.hobbies && routeParams.hobbies.length > 0) {
        payload.hobbies = routeParams.hobbies;
      } else {
        payload.hobbies = ['photography'];
      }

      // Known languages
      if (routeParams?.known_languages && routeParams.known_languages.length > 0) {
        payload.known_languages = routeParams.known_languages;
      } else {
        payload.known_languages = ['English'];
      }

      // Height in cm
      if (routeParams?.height_cm) {
        payload.height_cm = routeParams.height_cm;
      } else {
        payload.height_cm = 170;
      }

      // Drinking
      if (routeParams?.drinking) {
        payload.drinking = routeParams.drinking;
      } else {
        payload.drinking = 'sometimes';
      }

      // Smoking
      if (routeParams?.smoking) {
        payload.smoking = routeParams.smoking;
      } else {
        payload.smoking = 'no';
      }

      // Activity interests
      if (routeParams?.activity_interests && routeParams.activity_interests.length >= 3) {
        payload.activity_interests = routeParams.activity_interests;
      } else {
        payload.activity_interests = ['hiking', 'travel', 'photography'];
      }

      // Qualities
      if (routeParams?.qualities && routeParams.qualities.length >= 3) {
        payload.qualities = routeParams.qualities;
      } else {
        payload.qualities = ['kindness', 'humor', 'loyalty'];
      }

      // Zodiac sign
      if (routeParams?.zodiac_sign) {
        payload.zodiac_sign = routeParams.zodiac_sign;
      } else {
        payload.zodiac_sign = 'aries';
      }

      // Music genres
      if (routeParams?.music_genres && routeParams.music_genres.length >= 1) {
        payload.music_genres = routeParams.music_genres;
      } else if (storedMusicGenres && storedMusicGenres.length >= 1) {
        payload.music_genres = storedMusicGenres;
      } else {
        payload.music_genres = ['pop'];
      }

      // Music artist ids
      const musicArtistIds: string[] | undefined =
        (routeParams as any)?.music_artist_ids ||
        (routeParams as any)?.musicArtistIds ||
        storedMusicArtistIds;
      if (Array.isArray(musicArtistIds) && musicArtistIds.length >= 1) {
        if (musicArtistIds.length <= 10) {
          payload.music_artist_ids = musicArtistIds;
        } else {
          payload.music_artist_ids = musicArtistIds.slice(0, 10);
        }
      } else {
        console.warn(
          '[DevicePermissionsScreen] music_artist_ids not provided - backend will report this in remaining_required if required',
          { routeMusicArtistIds: (routeParams as any)?.music_artist_ids },
        );
      }

      // Religion (optional) – map display label to backend enum slug
      if (routeParams?.religion) {
        const mapReligion = (label: string): string | undefined => {
          const key = (label || '').toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
          const mapping: Record<string, string> = {
            agnostic: 'agnostic',
            atheist: 'atheist',
            buddhist: 'buddhist',
            catholic: 'catholic',
            christian: 'christian',
            hindu: 'hindu',
            jain: 'jain',
            jewish: 'jewish',
            mormon: 'mormon',
            latter_day_saint: 'latter_day_saint',
            'latter-day_saint': 'latter_day_saint',
            muslim: 'muslim',
            zoroastrian: 'zoroastrian',
            sikh: 'sikh',
            spiritual: 'spiritual',
            other: 'other',
          };
          return mapping[key];
        };

        const mapped = mapReligion(routeParams.religion);
        if (mapped) {
          payload.religion = mapped;
        } else {
          console.warn('[DevicePermissionsScreen] Unknown religion label, skipping:', routeParams.religion);
        }
      }

      // Causes / communities (optional)
      if (routeParams?.causes_communities) {
        payload.causes_communities = routeParams.causes_communities;
      }

      // Location
      let latitude: number | undefined = routeParams?.latitude;
      let longitude: number | undefined = routeParams?.longitude;

      // If we don't have numeric lat/lng but we have a "lat,lon" string, parse it
      if ((!latitude || !longitude) && typeof routeParams?.location === 'string') {
        const parts = routeParams.location.split(/[, ]+/).filter(Boolean);
        if (parts.length >= 2) {
          const lat = parseFloat(parts[0]);
          const lon = parseFloat(parts[1]);
          if (!isNaN(lat) && !isNaN(lon)) {
            latitude = latitude ?? lat;
            longitude = longitude ?? lon;
          }
        }
      }

      if (routeParams?.location) {
        payload.location =
          typeof routeParams.location === 'string' && latitude != null && longitude != null
            ? `${latitude},${longitude}`
            : routeParams.location;
      }
      if (latitude != null && longitude != null) {
        payload.latitude = latitude;
        payload.longitude = longitude;
      }

      const response = await submitOnboardingUpdate(payload, accessToken || undefined);
      console.log('[DevicePermissionsScreen] Onboarding UPDATE response:', response);
      if (!response?.success) {
        Alert.alert(
          'Could not complete onboarding',
          response?.error || 'Please try again in a moment.',
        );
        return;
      }

      // If onboarding is not yet complete, block navigation and show what's missing
      if (!response.onboarding_complete) {
        const missingFields = response.remaining_required;
        const missingMessage =
          missingFields && missingFields.length > 0
            ? `Please complete these details before continuing:\n\n${missingFields.join(', ')}`
            : 'Some required details are still missing. Please go back and complete all onboarding steps.';

        Alert.alert('Profile not complete', missingMessage);
        return;
      }

      // Mark onboarding as complete locally
      await AsyncStorage.setItem('onboarding_complete', 'true');

      // Continue to live selfie verification after a short delay
      setTimeout(() => {
        navigateToNext();
      }, 500);
    } catch (error) {
      console.error('[DevicePermissionsScreen] Failed to call onboarding UPDATE:', error);
      Alert.alert(
        'Something went wrong',
        'We could not finish creating your profile. Please try again.',
      );
    }
  };

  const navigateToNext = () => {
    (navigation as any)?.navigate('LivePhotoScreen', {
      firstName: route?.params?.firstName || '',
      lastName: route?.params?.lastName || '',
      username: route?.params?.username,
      gender: route?.params?.gender || '',
      age: route?.params?.age || 0,
      location: route?.params?.location || '',
      photo: route?.params?.photo,
      photos: route?.params?.photos || [],
      datingGoal: route?.params?.datingGoal || '',
      showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
      interested_in_genders: route?.params?.interested_in_genders || [],
      interested_age_range: route?.params?.interested_age_range || { min: 18, max: 22 },
      hobbies: route?.params?.hobbies || [],
      bio: route?.params?.bio,
      birthday: route?.params?.birthday,
    });
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
        {/* Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Get the most out of snixx</Text>
          <Text style={styles.subheading}>
            Permissions required to help snixx provide a tailored experience
          </Text>
        </View>

        {/* Permissions Card */}
        <View style={styles.permissionCard}>
          {permissions.map((permission, index) => (
            <View key={permission.id}>
              <View style={styles.permissionRow}>
                <View style={styles.permissionLeft}>
                  <View style={styles.permissionIconContainer}>
                    <Icon name={permission.icon as any} size={rs(24)} color="#4A90E2" />
                  </View>
                  <View style={styles.permissionContent}>
                    <Text style={styles.permissionTitle}>{permission.title}</Text>
                    <Text style={styles.permissionDescription}>{permission.description}</Text>
                  </View>
                </View>
                <Switch
                  value={permission.granted}
                  onValueChange={(value) => togglePermission(permission.id, value)}
                  trackColor={{ false: '#F7F7F7', true: '#FDFF8D' }}
                  thumbColor={permission.granted ? '#FFFFFF' : '#E5E5E5'}
                  ios_backgroundColor="#F7F7F7"
                  style={styles.switch}
                />
              </View>
              {index < permissions.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Get Started Button */}
        <View style={styles.buttonContainer}>
          <Animated.View
            style={{
              transform: [{ scale: buttonScale }],
            }}
          >
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <Text style={styles.getStartedButtonText}>Get started</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

