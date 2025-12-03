import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { rf } from '../../utils/responsive';
import styles from '../../styles/OnboardingStyles';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'OnboardingStep4'>;
  route?: {
    params: {
      firstName: string;
      age: number;
      location: string;
      showOnlyFirstLetter: boolean;
    };
  };
}

export default function OnboardingStep4({ navigation, route }: Props) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isButtonActive, setIsButtonActive] = useState(false);

  const handleSelectPhoto = () => {
    setIsButtonActive(true);
  };

  const handleSkip = () => {
    navigation?.navigate('OnboardingStep5', {
      firstName: route?.params?.firstName || '',
      age: route?.params?.age || 0,
      location: route?.params?.location || '',
      showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
    });
  };

  const handleContinue = () => {
    navigation?.navigate('OnboardingStep5', {
      firstName: route?.params?.firstName || '',
      age: route?.params?.age || 0,
      location: route?.params?.location || '',
      photo: photoUri || undefined,
      showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
    });
  };

  const progress = 60;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4F8" translucent={false} />
      <View style={styles.container}>
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>📸 Add a profile photo</Text>
          </View>

          <TouchableOpacity
            style={{
              width: '100%',
              height: hp(300),
              backgroundColor: '#FFFFFF',
              borderRadius: rs(20),
              borderWidth: 2,
              borderColor: '#4A90E2',
              borderStyle: 'dashed',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: hp(24),
            }}
            onPress={handleSelectPhoto}
            activeOpacity={0.7}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%', borderRadius: rs(18) }} />
            ) : (
              <>
                <Icon name="camera" size={rf(48)} color="#4A90E2" />
                <Text style={{ fontSize: rf(16), fontFamily: 'Inter', fontWeight: '400', color: '#666666', marginTop: hp(16) }}>
                  Tap to add photo
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                isButtonActive ? styles.continueButtonActive : styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!isButtonActive}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  isButtonActive
                    ? styles.continueButtonTextActive
                    : styles.continueButtonTextDisabled,
                ]}
              >
                Continue
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSkip}
              style={{ marginTop: hp(16), alignItems: 'center' }}
            >
              <Text style={{ fontSize: rf(16), fontFamily: 'Inter', fontWeight: '400', color: '#4A90E2' }}>
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

