import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  PanResponder,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import {
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/PhotoSelectionScreenStyles';
import { Plusicon, Wrongicon, Lightbulbicon } from '../../assets';

// Enable LayoutAnimation on Android (deprecated in New Architecture, but kept for compatibility)
// This is a no-op in the New Architecture but doesn't cause errors
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental && !UIManager.hasViewManagerConfig) {
  try {
  UIManager.setLayoutAnimationEnabledExperimental(true);
  } catch (e) {
    // Silently ignore - this is deprecated in New Architecture
  }
}

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'OnboardingStep4'>;
  route?: {
    params: {
      firstName: string;
      lastName: string;
      username: string;
      gender: string;
      age: number;
      location: string;
      showOnlyFirstLetter: boolean;
    };
  };
}

interface PhotoItem {
  id: number;
  uri: string | null;
}

interface DraggablePhotoCardProps {
  photo: PhotoItem;
  index: number;
  onSelectPhoto: (index: number) => void;
  onRemovePhoto: (index: number) => void;
  onDragStart: () => void;
  onDragEnd: (fromIndex: number, toIndex: number) => void;
  isDragging: boolean;
}

const DraggablePhotoCard: React.FC<DraggablePhotoCardProps> = ({
  photo,
  index,
  onSelectPhoto,
  onRemovePhoto,
  onDragStart,
  onDragEnd,
  isDragging,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const startX = useRef(0);
  const startY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !!photo.uri,
      onMoveShouldSetPanResponder: () => !!photo.uri,
      onPanResponderGrant: () => {
        if (photo.uri) {
          translateX.stopAnimation((value) => {
            startX.current = value || 0;
          });
          translateY.stopAnimation((value) => {
            startY.current = value || 0;
          });
          onDragStart();
          Animated.parallel([
            Animated.spring(scale, { toValue: 1.1, useNativeDriver: true }),
            Animated.spring(opacity, { toValue: 0.8, useNativeDriver: true }),
          ]).start();
        }
      },
      onPanResponderMove: (_, gestureState) => {
        if (photo.uri) {
          translateX.setValue(startX.current + gestureState.dx);
          translateY.setValue(startY.current + gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (photo.uri) {
          const cardWidth = wp(160);
          const cardHeight = wp(160);
          const gap = wp(16);
          const currentX = startX.current + gestureState.dx;
          const currentY = startY.current + gestureState.dy;
          
          // Calculate new position in 2x2 grid
          const col = Math.round(currentX / (cardWidth + gap));
          const row = Math.round(currentY / (cardHeight + gap));
          
          // Convert to linear index (2 columns)
          const newCol = Math.max(0, Math.min(1, col));
          const newRow = Math.max(0, Math.min(1, row));
          const newIndex = newRow * 2 + newCol;
          const clampedIndex = Math.max(0, Math.min(3, newIndex));
          
          // Always reset position - reordering will be handled by state update
          Animated.parallel([
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
          ]).start();
          
          // Trigger reorder if moved to different position
          if (clampedIndex !== index && clampedIndex >= 0 && clampedIndex < 4) {
            onDragEnd(index, clampedIndex);
          }
        }
      },
    })
  ).current;

  const animatedStyle = {
    transform: [
      { translateX },
      { translateY },
      { scale },
    ],
    opacity,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <Animated.View
      style={[styles.photoSlot, animatedStyle]}
      {...panResponder.panHandlers}
    >
      {photo.uri ? (
        <>
          <Image source={{ uri: photo.uri }} style={styles.photoImage} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemovePhoto(index)}
            activeOpacity={0.7}
          >
            <Image source={Wrongicon} style={styles.removeIcon} />
          </TouchableOpacity>
          {isDragging && (
            <View style={styles.dragIndicator}>
              <Icon name="drag-handle" size={rs(24)} color="#FFFFFF" />
            </View>
          )}
        </>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onSelectPhoto(index)}
          activeOpacity={0.7}
        >
          <Image source={Plusicon} style={styles.addIcon} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default function OnboardingStep4({ navigation, route }: Props) {
  const [photos, setPhotos] = useState<PhotoItem[]>([
    { id: 0, uri: null },
    { id: 1, uri: null },
    { id: 2, uri: null },
    { id: 3, uri: null },
  ]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const requestAndroidPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      console.log('Not Android, skipping permission request');
      return true;
    }

    try {
      // For Android 13+ (API 33+), use READ_MEDIA_IMAGES
      if (Platform.Version >= 33) {
        // Check if permission is already granted
        const checkResult = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        console.log('Permission check result (READ_MEDIA_IMAGES):', checkResult);
        
        if (checkResult) {
          console.log('Permission already granted');
          return true;
        }

        // Request permission
        console.log('Requesting READ_MEDIA_IMAGES permission');
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
        
        console.log('Permission request result:', granted);
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        console.log('Permission granted:', isGranted);
        return isGranted;
      } else {
        // For Android 12 and below, use READ_EXTERNAL_STORAGE
        const checkResult = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        console.log('Permission check result (READ_EXTERNAL_STORAGE):', checkResult);
        
        if (checkResult) {
          console.log('Permission already granted');
          return true;
        }

        // Request permission
        console.log('Requesting READ_EXTERNAL_STORAGE permission');
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
        
        console.log('Permission request result:', granted);
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        console.log('Permission granted:', isGranted);
        return isGranted;
      }
    } catch (err) {
      console.error('Permission request error:', err);
      return false;
    }
  };

  const handleSelectPhoto = async (index: number) => {
    console.log('handleSelectPhoto called with index:', index);
    
    try {
      // Request permissions for Android
      if (Platform.OS === 'android') {
        console.log('Android detected, requesting permissions...');
        const hasPermission = await requestAndroidPermission();
        console.log('Permission result:', hasPermission);
        
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Please grant photo library permission to select images.',
            [{ text: 'OK' }]
          );
          return;
        }
      }

      console.log('Opening image library...');
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
        includeBase64: false,
      };

      console.log('Image picker options:', options);
      console.log('About to call launchImageLibrary...');
      
      // Call launchImageLibrary directly
      launchImageLibrary(options, (response: ImagePickerResponse) => {
          try {
            console.log('=== ImagePicker Response ===');
            console.log('Full response:', JSON.stringify(response, null, 2));
            console.log('didCancel:', response.didCancel);
            console.log('errorCode:', response.errorCode);
            console.log('errorMessage:', response.errorMessage);
            console.log('assets:', response.assets);
            console.log('===========================');

            if (response.didCancel) {
              console.log('User cancelled image picker');
              return;
            }

            if (response.errorCode) {
              console.error('ImagePicker Error Code:', response.errorCode);
              console.error('ImagePicker Error Message:', response.errorMessage);
              
              let errorMessage = 'Failed to select image';
              if (response.errorCode === 'permission') {
                errorMessage = 'Permission denied. Please grant photo library access in settings.';
              } else if (response.errorCode === 'others') {
                errorMessage = response.errorMessage || 'An error occurred while selecting image.';
              } else if (response.errorMessage) {
                errorMessage = response.errorMessage;
              }
              
              Alert.alert('Error', errorMessage);
              return;
            }

            if (response.assets && response.assets.length > 0) {
              const asset = response.assets[0];
              console.log('Selected asset:', asset);
              const uri = asset.uri;
              
              if (uri) {
                console.log('Image URI:', uri);
                const newPhotos = [...photos];
                newPhotos[index] = { ...newPhotos[index], uri };
                setPhotos(newPhotos);
                console.log('Image selected successfully and added to state');
              } else {
                console.log('No URI in asset');
              }
            } else {
              console.log('No assets in response');
              Alert.alert('No Image', 'No image was selected.');
            }
          } catch (callbackError) {
            console.error('Error in image picker callback:', callbackError);
            Alert.alert('Error', 'Failed to process selected image.');
          }
        });
    } catch (error) {
      console.error('=== Error in handleSelectPhoto ===');
      console.error('Error type:', typeof error);
      console.error('Error:', error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('================================');
      Alert.alert('Error', 'An unexpected error occurred while selecting image.');
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = { ...newPhotos[index], uri: null };
    setPhotos(newPhotos);
  };

  const handleReorderPhotos = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) {
      setDraggedIndex(null);
      return;
    }
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newPhotos = [...photos];
    const [movedItem] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedItem);
    setPhotos(newPhotos);
    setDraggedIndex(null);
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
    animateButtonPress();
    setTimeout(() => {
      const selectedPhotos = photos.filter(photo => photo.uri !== null).map(photo => photo.uri!);
      navigation?.navigate('PromptsScreen', {
        firstName: route?.params?.firstName || '',
        lastName: route?.params?.lastName || '',
        username: route?.params?.username || '',
        gender: route?.params?.gender || '',
        age: route?.params?.age || 0,
        location: route?.params?.location || '',
        photos: selectedPhotos,
        showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
      });
    }, 150);
  };

  const handlePhotoTips = () => {
    // TODO: Navigate to photo tips screen or show modal
    Alert.alert('Photo Tips', 'Check out our photo tips to get the best results!');
  };

  const progress = 90;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4F8" translucent={false} />
      <View style={styles.container}>
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.headerContainer}>
          
            <Text style={styles.headerText}>Nice! Click 'continue' or keep adding more photos</Text>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitleText}>Hold & drag to rearrange the photos</Text>

          {/* Photo Grid */}
          <View style={styles.photoGrid}>
            {photos.map((photo, index) => (
              <DraggablePhotoCard
                key={photo.id}
                photo={photo}
                index={index}
                onSelectPhoto={handleSelectPhoto}
                onRemovePhoto={handleRemovePhoto}
                onDragStart={() => setDraggedIndex(index)}
                onDragEnd={(fromIndex, toIndex) => handleReorderPhotos(fromIndex, toIndex)}
                isDragging={draggedIndex === index}
              />
            ))}
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            {/* Tips Section */}
            <TouchableOpacity
              style={styles.tipsContainer}
              onPress={handlePhotoTips}
              activeOpacity={0.7}
            >
              <Image source={Lightbulbicon} style={styles.lightbulbIcon} resizeMode="contain" />
              <Text style={styles.tipsText}>
                Not sure which photos to use?{' '}
                <Text style={styles.tipsLink}>Check out our photo tips</Text>
              </Text>
            </TouchableOpacity>
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
        </View>
      </View>
    </SafeAreaView>
  );
}
