import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/ActivitySelectionScreenStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Studyinggirl, Workinggirl } from '../../assets';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'ActivitySelectionScreen'>;
  route?: {
    params: {
      firstName: string;
      lastName: string;
      username: string;
      gender: string;
      age: number;
      showOnlyFirstLetter: boolean;
    };
  };
}

interface ActivityOption {
  id: string;
  title: string;
  image?: any; // For future image support
}

const activities: ActivityOption[] = [
  { id: 'studying', title: 'Studying' },
  { id: 'working', title: 'Working' },
];

export default function ActivitySelectionScreen({ navigation, route }: Props) {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  // Animation for cards
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;

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

    // Staggered card animations
    Animated.sequence([
      Animated.spring(card1Anim, {
        toValue: 1,
        delay: 200,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(card2Anim, {
        toValue: 1,
        delay: 100,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const card1Scale = card1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const card2Scale = card2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const card1Opacity = card1Anim;
  const card2Opacity = card2Anim;

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

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivity(activityId);
  };

  const handleContinue = () => {
    if (selectedActivity) {
      animateButtonPress();
      setTimeout(() => {
        navigation?.navigate('MusicArtistsScreen', {
          firstName: route?.params?.firstName || '',
          lastName: route?.params?.lastName || '',
          username: route?.params?.username || '',
          gender: route?.params?.gender || '',
          age: route?.params?.age || 0,
          showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
          currently: selectedActivity, // Pass the selected activity as 'currently'
        });
      }, 150);
    }
  };

  const progress = 60; // Progress percentage

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

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
         
            <Text style={styles.heading}>What are you doing currently?</Text>
            <Text style={styles.subheading}>
              Help potential matches know more about you
            </Text>
          </View>

          {/* Activity Cards */}
          <View style={styles.cardsContainer}>
            {/* Studying Card */}
            <Animated.View
              style={[
                styles.cardWrapper,
                {
                  opacity: card1Opacity,
                  transform: [{ scale: card1Scale }],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.activityCard,
                  selectedActivity === 'studying' && styles.activityCardSelected,
                ]}
                onPress={() => handleActivitySelect('studying')}
                activeOpacity={0.8}
              >
                <View style={styles.cardImageContainer}>
                  <Image 
                    source={Studyinggirl} 
                    style={styles.cardImage} 
                    resizeMode="cover" 
                  />
                </View>
                <Text style={styles.cardTitle}>Studying</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Working Card */}
            <Animated.View
              style={[
                styles.cardWrapper,
                {
                  opacity: card2Opacity,
                  transform: [{ scale: card2Scale }],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.activityCard,
                  selectedActivity === 'working' && styles.activityCardSelected,
                ]}
                onPress={() => handleActivitySelect('working')}
                activeOpacity={0.8}
              >
                <View style={styles.cardImageContainer}>
                  <Image 
                    source={Workinggirl} 
                    style={styles.cardImage} 
                    resizeMode="cover" 
                  />
                </View>
                <Text style={styles.cardTitle}>Working</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <Animated.View
              style={{
                transform: [{ scale: buttonScale }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  selectedActivity ? styles.continueButtonActive : styles.continueButtonDisabled,
                ]}
                onPress={handleContinue}
                disabled={!selectedActivity}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.continueButtonText,
                    selectedActivity
                      ? styles.continueButtonTextActive
                      : styles.continueButtonTextDisabled,
                  ]}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

