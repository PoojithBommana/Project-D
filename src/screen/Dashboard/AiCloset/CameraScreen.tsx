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
  StatusBar,
  ScrollView,
  TextInput
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
  const [itemName, setItemName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
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
            setShowNameInput(true);
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
    setItemName('');
    setShowNameInput(false);
    handleOpenCamera();
  }, [handleOpenCamera]);

  const handleNameContinue = useCallback(() => {
    if (!itemName.trim()) {
      Alert.alert('Required', 'Please enter a name for your item');
      return;
    }
    setShowNameInput(false);
  }, [itemName]);

  const handleSave = useCallback(() => {
    if (capturedImage && itemName.trim()) {
      navigation?.navigate('Closet', { 
        newItemImage: capturedImage,
        newItemName: itemName.trim()
      });
    }
  }, [capturedImage, itemName, navigation]);

  const instructions = [
    {
      icon: 'lightbulb-on',
      title: 'Good Lighting',
      description: 'Make sure you have good, natural lighting. Avoid shadows and harsh direct sunlight.',
    },
    {
      icon: 'image-outline',
      title: 'Plain Background',
      description: 'Place your item on a plain, neutral background (white or light colored surface works best).',
    },
    {
      icon: 'crop-free',
      title: 'Center the Item',
      description: 'Position your item in the center of the frame. Make sure it\'s fully visible and not cut off.',
    },
    {
      icon: 'camera-enhance',
      title: 'Clear Focus',
      description: 'Ensure the item is in focus and the image is sharp. Avoid blurry or out-of-focus photos.',
    },
    {
      icon: 'view-array',
      title: 'Show Full Item',
      description: 'Capture the entire item in the frame. For clothing, lay it flat or hang it up neatly.',
    },
  ];

  const handleNextInstruction = useCallback(() => {
    if (currentInstructionIndex < instructions.length - 1) {
      setCurrentInstructionIndex(currentInstructionIndex + 1);
    } else {
      setShowInstructions(false);
    }
  }, [currentInstructionIndex, instructions.length]);

  const handleSkipInstructions = useCallback(() => {
    setShowInstructions(false);
  }, []);

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
            setShowNameInput(true);
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

  if (showInstructions) {
    const currentInstruction = instructions[currentInstructionIndex];
    const isLastInstruction = currentInstructionIndex === instructions.length - 1;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" />
        <View style={styles.instructionContainer}>
          {/* Header */}
          <View style={styles.instructionHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation?.goBack()}
            >
              <Icon name="arrow-left" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.instructionHeaderTitle}>Photo Tips</Text>
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleSkipInstructions}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Instruction Content */}
          <ScrollView 
            style={styles.instructionScroll}
            contentContainerStyle={styles.instructionContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.instructionIconContainer}>
              <Icon name={currentInstruction.icon} size={80} color="#000000" />
            </View>
            
            <Text style={styles.instructionTitle}>{currentInstruction.title}</Text>
            <Text style={styles.instructionDescription}>{currentInstruction.description}</Text>

            {/* Progress Indicators */}
            <View style={styles.progressContainer}>
              {instructions.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index === currentInstructionIndex && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>

            {/* Navigation Buttons */}
            <View style={[styles.instructionButtons, { paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
              {currentInstructionIndex > 0 && (
                <TouchableOpacity 
                  style={styles.prevButton}
                  onPress={() => setCurrentInstructionIndex(currentInstructionIndex - 1)}
                >
                  <Icon name="chevron-left" size={20} color="#000000" />
                  <Text style={styles.prevButtonText}>Previous</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.nextButton, !currentInstructionIndex && styles.nextButtonFull]}
                onPress={handleNextInstruction}
              >
                <Text style={styles.nextButtonText}>
                  {isLastInstruction ? 'Start Taking Photos' : 'Next'}
                </Text>
                {!isLastInstruction && <Icon name="chevron-right" size={20} color="#000000" />}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

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

  if (showNameInput && capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" />
        <View style={styles.nameInputContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                setCapturedImage(null);
                setItemName('');
                setShowNameInput(false);
              }}
            >
              <Icon name="arrow-left" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Name Your Item</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView 
            style={styles.nameInputScroll}
            contentContainerStyle={styles.nameInputScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Image Preview */}
            <View style={styles.nameInputImageWrapper}>
              <View style={styles.nameInputImageContainer}>
                <Image 
                  source={{ uri: capturedImage }} 
                  style={styles.nameInputImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Name Input Section */}
            <View style={styles.nameInputSection}>
              <Text style={styles.nameInputLabel}>What is this item?</Text>
              <Text style={styles.nameInputHint}>e.g., Blue Shirt, Jeans, Sneakers</Text>
              <TextInput
                style={styles.nameInput}
                placeholder="Enter item name"
                placeholderTextColor="#999999"
                value={itemName}
                onChangeText={setItemName}
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={handleNameContinue}
              />
              
              <TouchableOpacity 
                style={[styles.continueButton, !itemName.trim() && styles.continueButtonDisabled]}
                onPress={handleNameContinue}
                disabled={!itemName.trim()}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
                <Icon name="chevron-right" size={20} color="#000000" />
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    backgroundColor: '#FDFF8E',
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
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
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
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
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
    borderBottomColor: '#FDFF8E',
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
    backgroundColor: '#FFFCF1',
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
    borderTopColor: '#FDFF8E',
  },
  retakeButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  retakeButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'GTMaruMedium',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FDFF8E',
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
  instructionContainer: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  instructionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#FDFF8E',
    backgroundColor: '#FFFCF1',
  },
  instructionHeaderTitle: {
    fontSize: 20,
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  skipButton: {
    padding: 8,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'GTMaruMedium',
    color: '#666666',
  },
  instructionScroll: {
    flex: 1,
  },
  instructionContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 20,
  },
  instructionIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FDFF8E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    marginBottom: 32,
  },
  instructionTitle: {
    fontSize: 28,
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  instructionDescription: {
    fontSize: 18,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    marginBottom: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  progressDotActive: {
    backgroundColor: '#000000',
    width: 24,
  },
  instructionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    paddingTop: 0,
    gap: 12,
    width: '100%',
  },
  prevButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  prevButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'GTMaruMedium',
    marginLeft: 4,
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#FDFF8E',
    paddingVertical: 16,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    marginRight: 4,
  },
  nameInputContainer: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  nameInputScroll: {
    flex: 1,
  },
  nameInputScrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  nameInputImageWrapper: {
    marginTop: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  nameInputImageContainer: {
    height: 320,
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  nameInputImage: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  nameInputSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  nameInputLabel: {
    fontSize: 22,
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  nameInputHint: {
    fontSize: 14,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    marginBottom: 20,
    lineHeight: 20,
  },
  nameInput: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    paddingHorizontal: 18,
    fontSize: 16,
    fontFamily: 'GTMaruMedium',
    color: '#000000',
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: '#FDFF8E',
    paddingVertical: 16,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  continueButtonDisabled: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    marginRight: 8,
  },
});

export default CameraScreen;
