import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  Animated,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import { rf, hp, wp, rs } from '../../utils/responsive';
import styles from '../../styles/LocationPermissionScreenStyles';
import { Mapicon } from '../../assets';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'LocationPermissionScreen'>;
  route?: {
    params: {
      firstName: string;
      lastName: string;
      username: string;
      gender: string;
      age: number;
      location: string;
      photo?: string;
      photos?: string[];
      datingGoal: string;
      showOnlyFirstLetter: boolean;
      interested_in_genders: string[];
      interested_age_range: { min: number; max: number };
    };
  };
}

export default function LocationPermissionScreen({ navigation, route }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [isLoading, setIsLoading] = useState(false);

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

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Check if permission is already granted
        const checkResult = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        
        console.log('Location permission check result:', checkResult);
        
        if (checkResult === true) {
          // Permission already granted
          return true;
        }

        // Request location permission
        console.log('Requesting location permission...');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'SNIXX needs access to your location to find you matches nearby.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Allow',
          }
        );
        
        console.log('Location permission request result:', granted);
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Permission Required',
            'Location permission was denied. Please enable it in Settings > Apps > SNIXX > Permissions > Location.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
          return false;
        } else {
          // Permission denied
          return false;
        }
      } catch (err) {
        console.error('Error requesting location permission:', err);
        Alert.alert(
          'Error',
          'Failed to request location permission. Please check if the permission is declared in the app manifest.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } else {
      // iOS location permission
      try {
        const permissionsModule = require('react-native-permissions');
        const { request, PERMISSIONS, RESULTS } = permissionsModule;
        console.log('Requesting iOS location permission...');
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        console.log('iOS location permission result:', result);
        return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
      } catch (err) {
        console.error('Error requesting iOS location permission:', err);
        // Fallback: guide user to enable in settings
        Alert.alert(
          'Location Permission',
          'To enable location access, please go to Settings > Privacy & Security > Location Services and enable it for SNIXX.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }
    }
  };

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      // Try to use @react-native-community/geolocation if available
      let Geolocation: any = null;
      let getCurrentPositionFn: any = null;
      
      try {
        // Try to require the community geolocation package dynamically
        const geolocationModule = require('@react-native-community/geolocation');
        
        // The package might export as default or named export
        // Check different possible export structures
        if (geolocationModule && typeof geolocationModule.getCurrentPosition === 'function') {
          getCurrentPositionFn = geolocationModule.getCurrentPosition;
        } else if (geolocationModule && geolocationModule.default && typeof geolocationModule.default.getCurrentPosition === 'function') {
          getCurrentPositionFn = geolocationModule.default.getCurrentPosition;
        } else if (geolocationModule && geolocationModule.default) {
          Geolocation = geolocationModule.default;
          getCurrentPositionFn = Geolocation.getCurrentPosition;
        } else {
          Geolocation = geolocationModule;
          getCurrentPositionFn = Geolocation?.getCurrentPosition;
        }
      } catch (e) {
        // Package not installed or not accessible
        console.warn('Geolocation package not accessible. Proceeding without coordinates.');
        console.warn('To enable location tracking, ensure @react-native-community/geolocation is installed and properly linked.');
        resolve(null);
        return;
      }

      // Check if we have a valid getCurrentPosition function
      if (!getCurrentPositionFn || typeof getCurrentPositionFn !== 'function') {
        console.warn('Geolocation package loaded but getCurrentPosition is not available.');
        console.warn('This might mean the package needs to be properly linked. Proceeding without coordinates.');
        console.warn('Try: cd ios && pod install (for iOS) or rebuild the app (for Android)');
        resolve(null);
        return;
      }

      // Use the geolocation package
      // First try with high accuracy, if that fails, try with lower accuracy
      let locationObtained = false;
      
      const tryGetLocation = (highAccuracy: boolean, attempt: number) => {
        try {
          getCurrentPositionFn(
            (position: { coords: { latitude: number; longitude: number } }) => {
              if (!locationObtained) {
                locationObtained = true;
                console.log('Location obtained:', position.coords.latitude, position.coords.longitude);
                resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
              }
            },
            (error: { message?: string; code?: number; TIMEOUT?: number; PERMISSION_DENIED?: number }) => {
              console.error(`Error getting location (attempt ${attempt}, highAccuracy: ${highAccuracy}):`, error);
              
              // If high accuracy timed out, try with lower accuracy
              if (highAccuracy && error.code === error.TIMEOUT && attempt === 1) {
                console.log('High accuracy timed out, trying with lower accuracy...');
                setTimeout(() => {
                  if (!locationObtained) {
                    tryGetLocation(false, 2);
                  }
                }, 500);
              } else {
                // All attempts failed or other error - don't block user flow
                if (!locationObtained) {
                  locationObtained = true;
                  resolve(null);
                }
              }
            },
            {
              enableHighAccuracy: highAccuracy,
              timeout: highAccuracy ? 10000 : 15000, // Shorter timeout for high accuracy, longer for fallback
              maximumAge: highAccuracy ? 0 : 60000, // For fallback, accept cached location up to 1 minute old
            }
          );
        } catch (error) {
          console.error('Error calling getCurrentPosition:', error);
          if (!locationObtained) {
            locationObtained = true;
            resolve(null);
          }
        }
      };
      
      // Start with high accuracy
      tryGetLocation(true, 1);
    });
  };

  const handleAllowLocation = async () => {
    setIsLoading(true);
    try {
      const permissionGranted = await requestLocationPermission();
      
      if (permissionGranted) {
        // Get actual location coordinates
        const location = await getCurrentLocation();
        
        setIsLoading(false);
        
        // Navigate to next screen - include location if available, otherwise proceed without it
        const locationString = location 
          ? `${location.latitude},${location.longitude}` 
          : route?.params?.location || '';
        
        (navigation as any)?.navigate('InterestsSelectionScreen', {
          firstName: route?.params?.firstName || '',
          lastName: route?.params?.lastName || '',
          username: route?.params?.username || '',
          gender: route?.params?.gender || '',
          age: route?.params?.age || 0,
          location: locationString,
          city: route?.params?.city || '',
          ...(location && {
            latitude: location.latitude,
            longitude: location.longitude,
          }),
          photo: route?.params?.photo,
          photos: route?.params?.photos || [],
          datingGoal: route?.params?.datingGoal || '',
          showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
          interested_in_genders: route?.params?.interested_in_genders || [],
          interested_age_range: route?.params?.interested_age_range || { min: 18, max: 22 },
          religion: (route?.params as any)?.religion,
          causes_communities: (route?.params as any)?.causes_communities || [],
        });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'Failed to request location permission. Please try again.');
    }
  };

  const progress = 80;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" translucent={false} />
      
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.content}>
          {/* Map Image */}
          <View style={styles.mapContainer}>
          <Image source={Mapicon} style={styles.mapImage} resizeMode="contain" />
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.heading}>
              Allow Snixx to use your location to find you matches
            </Text>
            <Text style={styles.subheading}>
              You won't be able to match with people otherwise.
            </Text>
          </View>

          {/* Allow Location Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.allowButton}
              onPress={handleAllowLocation}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.allowButtonText}>
                {isLoading ? 'Requesting...' : 'Allow Location'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

