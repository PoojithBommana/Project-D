import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  Image,
  Alert,
  Keyboard,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import {
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/PromptsScreenStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Plusicon } from '../../assets';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'PromptsScreen'>;
  route?: {
    params: {
      firstName: string;
      lastName: string;
      username: string;
      gender: string;
      age: number;
      location: string;
      photos?: string[];
      showOnlyFirstLetter: boolean;
    };
  };
}

export default function PromptsScreen({ navigation, route }: Props) {
  const [bio, setBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const bioInputRef = useRef<TextInput>(null);

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

    // Keyboard listeners
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        // Scroll to end when keyboard opens
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 300);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
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

  const handleSelectProfilePhoto = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          setProfilePhoto(asset.uri);
        }
      }
    });
  };

  const handleContinue = () => {
    animateButtonPress();
    setTimeout(() => {
      navigation?.navigate('DatingPreferencesScreen', {
        firstName: route?.params?.firstName || '',
        lastName: route?.params?.lastName || '',
        username: route?.params?.username || '',
        gender: route?.params?.gender || '',
        age: route?.params?.age || 0,
        location: route?.params?.location || '',
        photo: profilePhoto || undefined,
        photos: route?.params?.photos || [],
        showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
      });
    }, 150);
  };

  const progress = 85; // Progress percentage

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(100) : 0}
      >
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.scrollContent,
            keyboardVisible && styles.scrollContentKeyboardOpen,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.heading}>Show your face, steal some hearts...💛</Text>
              <Text style={styles.subheading}>
              We keep your photos safe and private
              </Text>
            </View>

            {/* Profile Photo Container */}
            <View style={styles.photoSection}>
              <Text style={styles.sectionLabel}>Profile Photo</Text>
              <TouchableOpacity
                style={styles.photoContainer}
                onPress={handleSelectProfilePhoto}
                activeOpacity={0.8}
              >
                {profilePhoto ? (
                  <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} resizeMode="cover" />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Image source={Plusicon} style={styles.plusIcon} resizeMode="contain" />
                    <Text style={styles.photoPlaceholderText}>Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Bio Section */}
            <View 
              style={styles.bioSection}
              onLayout={(event) => {
                // Store bio section position for scrolling
              }}
            >
              <Text style={styles.sectionLabel}>BIO</Text>
              <TextInput
                ref={bioInputRef}
                style={styles.bioInput}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#999999"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 300);
                }}
              />
            </View>
          </Animated.View>
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.bottomContainer}>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

