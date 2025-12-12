import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import { rf, hp, wp, rs } from '../../utils/responsive';
import styles from '../../styles/InterestsSelectionScreenStyles';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'InterestsSelectionScreen'>;
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
      bio?: string;
      birthday?: number;
    };
  };
}

interface Interest {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

const interests: Interest[] = [
  // Interests
  { id: 'science-tech', name: 'Science & Technology', category: 'Interests' },
  { id: 'business-finance', name: 'Business & Finance', category: 'Interests' },
  { id: 'fashion-beauty', name: 'Fashion & Beauty', category: 'Interests' },
  { id: 'animals', name: 'Animals', category: 'Interests' },
  { id: 'books', name: 'Books', category: 'Interests' },
  { id: 'gaming', name: 'Gaming', category: 'Interests' },
  { id: 'sports', name: 'Sports', category: 'Interests' },
  { id: 'history', name: 'History', category: 'Interests' },
  { id: 'world-affairs', name: 'World Affairs', category: 'Interests' },
  { id: 'music', name: 'Music', category: 'Interests' },
  
  // Movies & TV Shows
  { id: 'indian-entertainment', name: 'Indian Entertainment', category: 'Movies & TV Shows' },
  { id: 'kdrama-others', name: 'K-Drama & others', category: 'Movies & TV Shows' },
  { id: 'english-tv-movies', name: 'English TV & movies', category: 'Movies & TV Shows' },
  { id: 'anime', name: 'Anime', category: 'Movies & TV Shows' },
  
  // Personal Life
  { id: 'relationship-dating', name: 'Relationship & Dating', category: 'Personal Life' },
  { id: 'corporate-humor', name: 'Corporate Humor', category: 'Personal Life' },
];

export default function InterestsSelectionScreen({ navigation, route }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

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

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interestId)) {
        return prev.filter((id) => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedInterests.length >= 5) {
      (navigation as any)?.navigate('DevicePermissionsScreen', {
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
        hobbies: selectedInterests,
        bio: route?.params?.bio,
        birthday: route?.params?.birthday,
      });
    }
  };

  const groupedInterests = interests.reduce((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {} as Record<string, Interest[]>);

  const progress = 85;

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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Spill your hobbies… </Text>
            <Text style={styles.subheading}>who knows who'll be impressed 👀</Text>
          </View>

          {/* Selected Count */}
          {selectedInterests.length > 0 && (
            <View style={styles.selectedCountContainer}>
              <Text style={styles.selectedCountText}>
                {selectedInterests.length} Selected
              </Text>
            </View>
          )}

          {/* Interests by Category */}
          {Object.entries(groupedInterests).map(([category, categoryInterests]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <View style={styles.interestsGrid}>
                {categoryInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <TouchableOpacity
                      key={interest.id}
                      style={[
                        styles.interestChip,
                        isSelected && styles.interestChipSelected,
                      ]}
                      onPress={() => toggleInterest(interest.id)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.interestText,
                          isSelected && styles.interestTextSelected,
                        ]}
                      >
                        {interest.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Sticky Continue Button */}
        {isLiquidGlassSupported ? (
          <LiquidGlassView
            style={styles.stickyButtonContainer}
            effect="regular"
            tintColor="rgba(255, 255, 255, 0.15)"
            colorScheme="light"
            interactive={true}
          >
            <View style={styles.stickyButtonInner}>
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  selectedInterests.length >= 5
                    ? styles.continueButtonActive
                    : styles.continueButtonDisabled,
                ]}
                onPress={handleContinue}
                disabled={selectedInterests.length < 5}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.continueButtonGradient}
                >
                  <Text
                    style={[
                      styles.continueButtonText,
                      selectedInterests.length >= 5
                        ? styles.continueButtonTextActive
                        : styles.continueButtonTextDisabled,
                    ]}
                  >
                    Continue
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LiquidGlassView>
        ) : (
          <View style={[styles.stickyButtonContainer, styles.stickyButtonContainerFallback]}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                selectedInterests.length >= 5
                  ? styles.continueButtonActive
                  : styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={selectedInterests.length < 5}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  selectedInterests.length >= 5
                    ? styles.continueButtonTextActive
                    : styles.continueButtonTextDisabled,
                ]}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

