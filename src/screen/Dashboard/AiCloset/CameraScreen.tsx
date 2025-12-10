import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert, 
  Platform, 
  PermissionsAndroid,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WardrobeStackParamList } from './WardrobeFeature';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';

interface CameraScreenProps {
  navigation?: NativeStackNavigationProp<WardrobeStackParamList, 'Camera'>;
}

const CameraScreen = ({ navigation }: CameraScreenProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      // iOS permissions are handled automatically by the image picker
      return true;
    }

    try {
      // Wait a bit to ensure Activity is ready
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

      // Check if permission is already granted
      const checkResult = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      
      if (checkResult) {
        return true;
      }

      // Request camera permission
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'Snixx needs access to your camera to take photos of your items.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Allow',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err: any) {
      // Silently handle Activity not ready errors
      if (err?.message?.includes('not attached to an Activity')) {
        return false;
      }
      return false;
    }
  }, []);

  const requestGalleryPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

      let hasPermission = false;
      if (Platform.Version >= 33) {
        const checkResult = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        if (!checkResult) {
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
          hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          hasPermission = true;
        }
      } else {
        const checkResult = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        if (!checkResult) {
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
          hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          hasPermission = true;
        }
      }
      return hasPermission;
    } catch (err: any) {
      if (err?.message?.includes('not attached to an Activity')) {
        return false;
      }
      return false;
    }
  }, []);

  const handleOpenCamera = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    setLoading(true);
    
    try {
      // Step 1: Request permission first
      const hasPermission = await requestCameraPermission();
      
      if (!isMountedRef.current) {
        setLoading(false);
        return;
      }
      
      if (!hasPermission) {
        setLoading(false);
        // Use setTimeout to ensure Activity is ready for Alert
        setTimeout(() => {
          if (isMountedRef.current) {
            Alert.alert(
              'Permission Required',
              'Camera permission is required to take photos. Please enable it in your device settings.',
              [{ text: 'OK' }]
            );
          }
        }, 300);
        return;
      }

      // Step 2: Open camera after permission is granted
      const options: CameraOptions = {
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
        includeBase64: false,
      };

      launchCamera(options, (response: ImagePickerResponse) => {
        if (!isMountedRef.current) return;
        
        setLoading(false);
        
        if (response.didCancel) {
          // User cancelled, stay on screen
        } else if (response.errorCode) {
          setTimeout(() => {
            if (isMountedRef.current) {
              Alert.alert('Error', response.errorMessage || 'Failed to capture image');
            }
          }, 300);
        } else if (response.assets && response.assets[0]) {
          const imageUri = response.assets[0].uri;
          if (imageUri) {
            setCapturedImage(imageUri);
          }
        }
      });
    } catch {
      if (!isMountedRef.current) return;
      
      setLoading(false);
      setTimeout(() => {
        if (isMountedRef.current) {
          Alert.alert('Error', 'Failed to open camera');
        }
      }, 300);
    }
  }, [requestCameraPermission]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    handleOpenCamera();
  }, [handleOpenCamera]);

  const handleSave = useCallback(() => {
    if (capturedImage) {
      navigation?.navigate('Closet', { newItemImage: capturedImage });
    }
  }, [capturedImage, navigation]);

  const handleSelectFromGallery = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    setLoading(true);
    
    try {
      // Step 1: Request permission first
      const hasPermission = await requestGalleryPermission();
      
      if (!isMountedRef.current) {
        setLoading(false);
        return;
      }
      
      if (!hasPermission) {
        setLoading(false);
        setTimeout(() => {
          if (isMountedRef.current) {
            Alert.alert('Permission Required', 'Photo library permission is required.');
          }
        }, 300);
        return;
      }

      // Step 2: Open gallery after permission is granted
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
        includeBase64: false,
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (!isMountedRef.current) return;
        
        setLoading(false);
        
        if (response.didCancel) {
          // User cancelled, do nothing
        } else if (response.errorCode) {
          setTimeout(() => {
            if (isMountedRef.current) {
              Alert.alert('Error', response.errorMessage || 'Failed to select image');
            }
          }, 300);
        } else if (response.assets && response.assets[0]) {
          const imageUri = response.assets[0].uri;
          if (imageUri) {
            setCapturedImage(imageUri);
          }
        }
      });
    } catch {
      if (!isMountedRef.current) return;
      
      setLoading(false);
      setTimeout(() => {
        if (isMountedRef.current) {
          Alert.alert('Error', 'Failed to open gallery');
        }
      }, 300);
    }
  }, [requestGalleryPermission]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadingText}>Requesting permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (capturedImage) {
    // Calculate bottom padding to account for tab bar
    const actionButtonsBottomPadding = Platform.OS === 'ios' 
      ? Math.max(insets.bottom, 20) + 88 
      : 90;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" />
        <View style={styles.previewContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation?.goBack()}
            >
              <Icon name="arrow-left" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Preview</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Image Preview */}
          <View style={styles.imagePreviewContainer}>
            <Image 
              source={{ uri: capturedImage }} 
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>

          {/* Action Buttons */}
          <View style={[styles.actionButtons, { paddingBottom: actionButtonsBottomPadding }]}>
            <TouchableOpacity 
              style={styles.retakeButton}
              onPress={handleRetake}
            >
              <Icon name="refresh" size={20} color="#000000" style={styles.buttonIcon} />
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Icon name="check" size={20} color="#000000" style={styles.buttonIcon} />
              <Text style={styles.saveButtonText}>Save Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="camera-plus" size={64} color="#000000" />
        </View>
        <Text style={styles.title}>Camera</Text>
        <Text style={styles.subtitle}>Take a photo of your item</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleOpenCamera}
          >
            <Icon name="camera-plus" size={20} color="#000000" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleSelectFromGallery}
          >
            <Icon name="image-multiple" size={20} color="#000000" style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.backButtonSmall}
          onPress={() => navigation?.goBack()}
        >
          <Icon name="arrow-left" size={16} color="#000000" style={styles.backIcon} />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FDFF8D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#FDFF8D',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FDFF8D',
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'GTMaruBold',
  },
  secondaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'GTMaruMedium',
  },
  backButtonSmall: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDFF8D',
  },
  backIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'GTMaruMedium',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#FDFF8D',
    backgroundColor: '#FFFCF1',
    minHeight: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'GTMaruBold',
    color: '#000000',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  backButton: {
    padding: 8,
    width: 40,
    alignItems: 'flex-start',
  },
  imagePreviewContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
    backgroundColor: '#FFFCF1',
    borderTopWidth: 2,
    borderTopColor: '#FDFF8D',
  },
  retakeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FDFF8D',
  },
  retakeButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'GTMaruMedium',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FDFF8D',
    paddingVertical: 16,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'GTMaruBold',
  },
});

export default CameraScreen;
