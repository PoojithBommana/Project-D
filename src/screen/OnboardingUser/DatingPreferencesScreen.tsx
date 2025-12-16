import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  Image,
  Vibration,
  Modal,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/DatingPreferencesScreenStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Boyicon, Girlicon, Nonbinaryicon } from '../../assets';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'DatingPreferencesScreen'>;
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
      bio?: string;
      birthday?: number;
    };
  };
}

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const MIN_AGE = 18;
const MAX_AGE = 100;

const generateAges = (): number[] => {
  const ages: number[] = [];
  for (let i = MIN_AGE; i <= MAX_AGE; i++) {
    ages.push(i);
  }
  return ages;
};

export default function DatingPreferencesScreen({ navigation, route }: Props) {
  const [selectedGenders, setSelectedGenders] = useState<string[]>(['Women']);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(22);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const modalScale = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const ages = generateAges();
  const minAgeScrollRef = useRef<ScrollView | null>(null);
  const maxAgeScrollRef = useRef<ScrollView | null>(null);

  const getMinAgeIndex = () => ages.findIndex(age => age === minAge);
  const getMaxAgeIndex = () => ages.findIndex(age => age === maxAge);

  const prevMinAgeIndex = useRef(0); // 18 is at index 0
  const prevMaxAgeIndex = useRef(4); // 22 is at index 4

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

    // Initialize previous indices (18 is index 0, 22 is index 4)
    prevMinAgeIndex.current = 0;
    prevMaxAgeIndex.current = 4;

    // Scroll to selected positions on mount with proper delay
    // Need to wait for layout to complete
    const scrollToInitialPosition = () => {
      if (minAgeScrollRef.current) {
        minAgeScrollRef.current.scrollTo({ y: 0, animated: false });
      }
      if (maxAgeScrollRef.current) {
        maxAgeScrollRef.current.scrollTo({ y: 4 * ITEM_HEIGHT, animated: false });
      }
      // Trigger haptic on initial load
      triggerHaptic();
    };

    // Try multiple times to ensure scroll happens
    setTimeout(scrollToInitialPosition, 100);
    setTimeout(scrollToInitialPosition, 300);
    setTimeout(scrollToInitialPosition, 500);
  }, []);

  useEffect(() => {
    // Ensure min age doesn't exceed max age
    if (minAge >= maxAge) {
      setMaxAge(Math.min(MAX_AGE, minAge + 1));
    }
  }, [minAge]);

  useEffect(() => {
    // Ensure max age doesn't go below min age
    if (maxAge <= minAge) {
      setMinAge(Math.max(MIN_AGE, maxAge - 1));
    }
  }, [maxAge]);

  const triggerHaptic = () => {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(1);
    } else {
      Vibration.vibrate(10);
    }
  };

  const handleMinAgeScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < ages.length && index !== prevMinAgeIndex.current) {
      prevMinAgeIndex.current = index;
      const newAge = ages[index];
      setMinAge(newAge);
      triggerHaptic();
    }
  };

  const handleMinAgeScrollEnd = () => {
    if (minAgeScrollRef.current) {
      const currentIndex = getMinAgeIndex();
      if (currentIndex >= 0) {
        const offset = currentIndex * ITEM_HEIGHT;
        minAgeScrollRef.current.scrollTo({ y: offset, animated: true });
      }
    }
  };

  const handleMaxAgeScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < ages.length && index !== prevMaxAgeIndex.current) {
      prevMaxAgeIndex.current = index;
      const newAge = ages[index];
      setMaxAge(newAge);
      triggerHaptic();
    }
  };

  const handleMaxAgeScrollEnd = () => {
    if (maxAgeScrollRef.current) {
      const currentIndex = getMaxAgeIndex();
      if (currentIndex >= 0) {
        const offset = currentIndex * ITEM_HEIGHT;
        maxAgeScrollRef.current.scrollTo({ y: offset, animated: true });
      }
    }
  };

  const renderPickerColumn = (
    data: number[],
    selectedIndex: number,
    onScroll: (event: any) => void,
    onScrollEnd: () => void,
    scrollRef: React.RefObject<ScrollView | null>
  ) => {
    const paddingTop = (VISIBLE_ITEMS - 1) / 2 * ITEM_HEIGHT;
    const paddingBottom = (VISIBLE_ITEMS - 1) / 2 * ITEM_HEIGHT;

    return (
      <View style={styles.pickerColumn}>
        <View style={styles.pickerOverlayTop} pointerEvents="none" />
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={onScroll}
          onMomentumScrollEnd={onScrollEnd}
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
          scrollEnabled={true}
          bounces={false}
          style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
          contentContainerStyle={{
            paddingTop,
            paddingBottom,
          }}
        >
          {data.map((item, index) => {
            const isSelected = index === selectedIndex;
            const distanceFromCenter = Math.abs(index - selectedIndex);
            const opacity = Math.max(0.3, 1 - distanceFromCenter * 0.3);
            const scale = isSelected ? 1 : Math.max(0.85, 1 - distanceFromCenter * 0.1);

            return (
              <View
                key={`age-${index}`}
                style={[
                  styles.pickerItem,
                  isSelected && styles.pickerItemSelected,
                  {
                    opacity,
                    transform: [{ scale }],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    isSelected && styles.pickerItemTextSelected,
                  ]}
                  numberOfLines={1}
                >
                  {item}
                </Text>
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.pickerOverlayBottom} pointerEvents="none" />
      </View>
    );
  };

  const handleGenderToggle = (gender: string) => {
    if (selectedGenders.includes(gender)) {
      setSelectedGenders(selectedGenders.filter(g => g !== gender));
    } else {
      setSelectedGenders([...selectedGenders, gender]);
    }
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
    if (selectedGenders.length > 0) {
      animateButtonPress();
      setShowConfirmModal(true);
      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleModalYes = () => {
    // Map selected genders to backend-friendly values
    const genderMap: Record<string, string> = {
      Women: 'female',
      Men: 'male',
      'Non-binary': 'non_binary',
    };
    const interestedGenders = selectedGenders.map(g => genderMap[g] || g.toLowerCase());
    const interestedAgeRange = { min: minAge, max: maxAge };

    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowConfirmModal(false);
      setTimeout(() => {
        navigation?.navigate('LocationPermissionScreen', {
          firstName: route?.params?.firstName || '',
          lastName: route?.params?.lastName || '',
          username: route?.params?.username || '',
          gender: route?.params?.gender || '',
          age: route?.params?.age || 0,
          location: route?.params?.location || '',
          photo: route?.params?.photo || '',
          photos: route?.params?.photos || [],
          datingGoal: 'go_with_flow',
          showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
          interested_in_genders: interestedGenders,
          interested_age_range: interestedAgeRange,
          bio: route?.params?.bio,
          birthday: route?.params?.birthday,
        });
      }, 100);
    });
  };

  const handleModalNo = () => {
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowConfirmModal(false);
    });
  };

  const getGenderText = () => {
    if (selectedGenders.length === 0) return '';
    if (selectedGenders.length === 1) return selectedGenders[0];
    if (selectedGenders.length === 2) return selectedGenders.join(' & ');
    return selectedGenders.slice(0, -1).join(', ') + ' & ' + selectedGenders[selectedGenders.length - 1];
  };

  const progress = 90; // Progress percentage

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

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          scrollEnabled={false}
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
              <View style={styles.headerTitleContainer}>
                
                <Text style={styles.heading}>Who do you want to date?</Text>
              </View>
              <Text style={styles.subheading}>
                You can select multiple and change these later
              </Text>
            </View>

            {/* Gender Selection Buttons */}
            <View style={styles.genderButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  selectedGenders.includes('Men') && styles.genderButtonSelected,
                ]}
                onPress={() => handleGenderToggle('Men')}
                activeOpacity={0.7}
              >
                <Image source={Boyicon} style={styles.genderIcon} resizeMode="contain" />
                <Text style={[
                  styles.genderButtonText,
                  selectedGenders.includes('Men') && styles.genderButtonTextSelected,
                ]}>
                  Men
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  selectedGenders.includes('Women') && styles.genderButtonSelected,
                ]}
                onPress={() => handleGenderToggle('Women')}
                activeOpacity={0.7}
              >
                <Image source={Girlicon} style={styles.genderIcon} resizeMode="contain" />
                <Text style={[
                  styles.genderButtonText,
                  selectedGenders.includes('Women') && styles.genderButtonTextSelected,
                ]}>
                  Women
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  selectedGenders.includes('Non-Binary') && styles.genderButtonSelected,
                ]}
                onPress={() => handleGenderToggle('Non-Binary')}
                activeOpacity={0.7}
              >
                <View style={styles.nonBinaryIconContainer}>
                  <Image source={Nonbinaryicon} style={styles.genderIcon} resizeMode="contain" />
                </View>
                <Text style={[
                  styles.genderButtonText,
                  selectedGenders.includes('Non-Binary') && styles.genderButtonTextSelected,
                ]}>
                  Non-Binary
                </Text>
              </TouchableOpacity>
            </View>

            {/* Age Range Section */}
            <View style={styles.ageRangeSection}>
              <Text style={styles.ageRangeTitle}>Age Range</Text>
              <Text style={styles.ageRangeText}>
                Between {minAge} & {maxAge}
              </Text>

              {/* Age Picker */}
              <View style={styles.pickerWrapper}>
                <View style={styles.selectionIndicator} />
                <View style={styles.pickerContainer}>
                  {renderPickerColumn(
                    ages,
                    getMinAgeIndex() >= 0 ? getMinAgeIndex() : 0,
                    handleMinAgeScroll,
                    handleMinAgeScrollEnd,
                    minAgeScrollRef
                  )}
                  <Text style={styles.pickerSeparator}>to</Text>
                  {renderPickerColumn(
                    ages,
                    getMaxAgeIndex() >= 0 ? getMaxAgeIndex() : 4,
                    handleMaxAgeScroll,
                    handleMaxAgeScrollEnd,
                    maxAgeScrollRef
                  )}
                </View>
              </View>
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
              style={[
                styles.continueButton,
                selectedGenders.length > 0
                  ? styles.continueButtonActive
                  : styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={selectedGenders.length === 0}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  selectedGenders.length > 0
                    ? styles.continueButtonTextActive
                    : styles.continueButtonTextDisabled,
                ]}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Confirmation Modal */}
        <Modal
          visible={showConfirmModal}
          transparent={true}
          animationType="none"
          onRequestClose={handleModalNo}
        >
          <Animated.View
            style={[
              styles.modalOverlay,
              {
                opacity: modalOpacity,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ scale: modalScale }],
                },
              ]}
            >
              <View style={styles.modalIconContainer}>
                <Icon name="favorite" size={rs(48)} color="#4A90E2" />
              </View>
              
              <Text style={styles.modalTitle}>
                You want to match with{'\n'}
                <Text style={styles.modalGenderText}>{getGenderText()}?</Text>
              </Text>
              
              <Text style={styles.modalSubtext}>
                If not, edit your preferences now
              </Text>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonNo]}
                  onPress={handleModalNo}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonYes]}
                  onPress={handleModalYes}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextYes]}>Yes</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

