import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
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

  const handleAllowLocation = async () => {
    setIsLoading(true);
    try {
      const permissionGranted = await requestLocationPermission();
      
      setIsLoading(false);
      
      if (permissionGranted) {
        // Navigate to next screen
        (navigation as any)?.navigate('InterestsSelectionScreen', {
          firstName: route?.params?.firstName || '',
          lastName: route?.params?.lastName || '',
          username: route?.params?.username || '',
          gender: route?.params?.gender || '',
          age: route?.params?.age || 0,
          location: route?.params?.location || '',
          photo: route?.params?.photo,
          photos: route?.params?.photos || [],
          datingGoal: route?.params?.datingGoal || '',
          showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
          interested_in_genders: route?.params?.interested_in_genders || [],
          interested_age_range: route?.params?.interested_age_range || { min: 18, max: 22 },
        });
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

