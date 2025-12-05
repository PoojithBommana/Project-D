import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
<<<<<<< HEAD
import { rf, wp, rs } from '../../utils/responsive';
import styles from '../../styles/OnboardingStep5Styles';
=======
import { rf ,hp} from '../../utils/responsive';
// import { setOnboardingComplete } from '../../utils/tokenStorage';
import styles from '../../styles/OnboardingStyles';
>>>>>>> 5af2cc5d241ab9ac23c96084a83c200186be3c34

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'OnboardingStep5'>;
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
      showOnlyFirstLetter: boolean;
    };
  };
}

interface ColorSwatch {
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
}

// Colors arranged in order: Top Left, Top Right, Middle Left, Middle Right, Bottom Left, Bottom Right
const colors: ColorSwatch[] = [
  { name: 'Inchworm', hex: 'B1FA63', rgb: { r: 177, g: 250, b: 99 } },        // Top Left
  { name: 'Gunmetal', hex: '243837', rgb: { r: 36, g: 56, b: 55 } },         // Top Right
  { name: 'Orange', hex: 'FE7733', rgb: { r: 254, g: 119, b: 51 } },         // Middle Left
  { name: 'Pale Violet', hex: 'B2A1FF', rgb: { r: 178, g: 161, b: 255 } },   // Middle Right
  { name: 'Bright Snow', hex: 'FFFFFF', rgb: { r: 255, g: 255, b: 255 } },    // Bottom Left
  { name: 'American Silver', hex: 'D1D1D1', rgb: { r: 209, g: 209, b: 209 } }, // Bottom Right
];

export default function OnboardingStep5({ navigation, route }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

  const renderColorSwatch = (color: ColorSwatch, index: number) => {
    const backgroundColor = `#${color.hex}`;
    // Calculate luminance to determine text color for better contrast
    // For white, light gray, and bright colors, use dark text; for dark colors, use white text
    const luminance = (0.299 * color.rgb.r + 0.587 * color.rgb.g + 0.114 * color.rgb.b) / 255;
    const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

    return (
      <View key={index} style={styles.swatchContainer}>
        <View style={[styles.colorSwatch, { backgroundColor }]}>
          <View style={styles.colorInfoContainer}>
            <Text style={[styles.colorName, { color: textColor }]}>{color.name}</Text>
            <Text style={[styles.colorHex, { color: textColor }]}>#{color.hex}</Text>
            <Text style={[styles.colorRgb, { color: textColor }]}>
              RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
            </Text>
          </View>
        </View>
      </View>
    );
  };

<<<<<<< HEAD
=======
  const handleContinue = async () => {
    if (bio.trim().length >= 10) {
      animateButtonPress();
      const onboardingData = {
        firstName: route?.params?.firstName || '',
        age: route?.params?.age || 0,
        location: route?.params?.location || '',
        photo: route?.params?.photo,
        bio: bio.trim(),
        showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
      };

      console.log('Onboarding complete:', onboardingData);
      
      try {
        // await setOnboardingComplete();
        navigation?.getParent()?.navigate('TabNavigation');
      } catch (error) {
        console.error('Error marking onboarding as complete:', error);
        navigation?.getParent()?.navigate('TabNavigation');
      }
    }
  };

  const progress = 75;

>>>>>>> 5af2cc5d241ab9ac23c96084a83c200186be3c34
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={false} />
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.colorGrid}>
            {colors.map((color, index) => renderColorSwatch(color, index))}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
