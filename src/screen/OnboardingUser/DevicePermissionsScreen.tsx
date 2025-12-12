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
      description: 'So you can connect with friends already on Schmooze',
      icon: 'contacts',
      granted: false,
    },
    {
      id: 'media',
      title: 'Media Storage',
      description: 'So you can store Schmooze memes on your phone',
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
                message: 'Schmooze needs access to your contacts to connect you with friends.',
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
                  'Contacts permission was denied. Please enable it in Settings > Apps > Schmooze > Permissions.',
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
              'To enable contacts access, please go to Settings > Privacy & Security > Contacts and enable it for Schmooze.',
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
                  message: 'Schmooze needs access to your photos and media.',
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
                  message: 'Schmooze needs access to your photos and media.',
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
                message: 'Schmooze needs access to your camera to take photos.',
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
        await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
      }
    }
    // Continue to next screen after a short delay
    setTimeout(() => {
      navigateToNext();
    }, 500);
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
          <Text style={styles.heading}>Get the most out of Schmooze</Text>
          <Text style={styles.subheading}>
            Permissions required to help Schmooze provide a tailored experience
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

