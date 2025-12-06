import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import { rf, hp, wp, rs } from '../../utils/responsive';
import styles from '../../styles/OnboardingStep5Styles';
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

interface DatingGoal {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

const datingGoals: DatingGoal[] = [
  {
    id: 'casual',
    title: 'Keep it casual',
    description: 'Looking for something fun and light',
    emoji: '🥵',
  },
  {
    id: 'short-term',
    title: 'Short-term relationship',
    description: 'Something meaningful but not forever',
    emoji: '🌚',
  },
  {
    id: 'long-term',
    title: 'Long-term relationship',
    description: 'Looking for my forever person',
    emoji: '👯‍♀️',
  },
  {
    id: 'go-with-flow',
    title: 'Go with the flow',
    description: 'Open to whatever comes my way',
    emoji: '🤷‍♂️',
  },
];

export default function OnboardingStep5({ navigation, route }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

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

  const handleContinue = () => {
    if (selectedGoal) {
      (navigation as any)?.navigate('LocationPermissionScreen', {
        firstName: route?.params?.firstName || '',
        lastName: route?.params?.lastName || '',
        username: route?.params?.username || '',
        gender: route?.params?.gender || '',
        age: route?.params?.age || 0,
        location: route?.params?.location || '',
        photo: route?.params?.photo,
        photos: route?.params?.photos || [],
        datingGoal: selectedGoal,
        showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
      });
    }
  };

  const progress = 75;

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
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>What are your dating goals?</Text>
            <Text style={styles.subheading}>
              Let us know what you're into to find your kind of people.
            </Text>
          </View>

          {/* Dating Goals Cards */}
          <View style={styles.goalsContainer}>
            {datingGoals.map((goal) => {
              const isSelected = selectedGoal === goal.id;
              return (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalCard,
                    isSelected && styles.goalCardSelected,
                  ]}
                  onPress={() => setSelectedGoal(goal.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                  <View style={styles.goalTextContainer}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalDescription}>{goal.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                selectedGoal ? styles.continueButtonActive : styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!selectedGoal}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  selectedGoal
                    ? styles.continueButtonTextActive
                    : styles.continueButtonTextDisabled,
                ]}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
