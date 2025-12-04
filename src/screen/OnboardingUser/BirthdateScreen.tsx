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
  Dimensions,
  Vibration,
  Image,
  Modal,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/BirthdateScreenStyles';
import { Birthdayicon } from '../../assets';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'OnboardingStep2'>;
  route?: {
    params: {
      firstName: string;
      lastName: string;
      username: string;
      gender: string;
      showOnlyFirstLetter: boolean;
    };
  };
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const generateYears = (): number[] => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = currentYear; i >= currentYear - 100; i--) {
    years.push(i);
  }
  return years;
};

export default function OnboardingStep2({ navigation, route }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(0); // January
  const [selectedDay, setSelectedDay] = useState(0); // 1st
  const [selectedYear, setSelectedYear] = useState(2000);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [selectedButton, setSelectedButton] = useState<'yes' | 'no'>('yes');
  
  const monthScrollRef = useRef<ScrollView | null>(null);
  const dayScrollRef = useRef<ScrollView | null>(null);
  const yearScrollRef = useRef<ScrollView | null>(null);
  
  const prevMonthIndex = useRef(0);
  const prevDayIndex = useRef(0);
  const prevYearIndex = useRef(0);
  
  const buttonScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const modalScale = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const triggerHaptic = () => {
    if (Platform.OS === 'ios') {
      // Light impact feedback for iOS
      Vibration.vibrate(1);
    } else {
      // Short vibration for Android
      Vibration.vibrate(10);
    }
  };

  const years = generateYears();
  const daysInSelectedMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);
  const currentYearIndex = years.findIndex(y => y === selectedYear);

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
    
    // Initialize previous indices
    prevMonthIndex.current = selectedMonth;
    prevDayIndex.current = selectedDay;
    prevYearIndex.current = currentYearIndex >= 0 ? currentYearIndex : 0;
  }, []);

  useEffect(() => {
    // Adjust day if current selection is invalid for new month
    if (selectedDay >= daysInSelectedMonth) {
      setSelectedDay(daysInSelectedMonth - 1);
    }
  }, [selectedMonth, selectedYear, daysInSelectedMonth]);

  useEffect(() => {
    // Reset modal animation values when modal is closed
    if (!showAgeModal) {
      modalScale.setValue(0);
      modalOpacity.setValue(0);
    }
  }, [showAgeModal]);

  const scrollToIndex = (scrollView: ScrollView | null, index: number) => {
    if (scrollView) {
      scrollView.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: true,
      });
    }
  };

  const handleMonthScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < months.length && index !== prevMonthIndex.current) {
      prevMonthIndex.current = index;
      setSelectedMonth(index);
      triggerHaptic();
    }
  };

  const handleMonthScrollEnd = () => {
    if (monthScrollRef.current) {
      const offset = selectedMonth * ITEM_HEIGHT;
      monthScrollRef.current.scrollTo({ y: offset, animated: true });
    }
  };

  const handleDayScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < days.length && index !== prevDayIndex.current) {
      prevDayIndex.current = index;
      setSelectedDay(index);
      triggerHaptic();
    }
  };

  const handleDayScrollEnd = () => {
    if (dayScrollRef.current) {
      const offset = selectedDay * ITEM_HEIGHT;
      dayScrollRef.current.scrollTo({ y: offset, animated: true });
    }
  };

  const handleYearScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < years.length && index !== prevYearIndex.current) {
      prevYearIndex.current = index;
      setSelectedYear(years[index]);
      triggerHaptic();
    }
  };

  const handleYearScrollEnd = () => {
    if (yearScrollRef.current) {
      const currentIndex = years.findIndex(y => y === selectedYear);
      if (currentIndex >= 0) {
        const offset = currentIndex * ITEM_HEIGHT;
        yearScrollRef.current.scrollTo({ y: offset, animated: true });
      }
    }
  };

  useEffect(() => {
    // Scroll to selected positions on mount
    const yearIndex = years.findIndex(y => y === selectedYear);
    setTimeout(() => {
      if (monthScrollRef.current) {
        monthScrollRef.current.scrollTo({ y: selectedMonth * ITEM_HEIGHT, animated: false });
      }
      if (dayScrollRef.current) {
        dayScrollRef.current.scrollTo({ y: selectedDay * ITEM_HEIGHT, animated: false });
      }
      if (yearScrollRef.current && yearIndex >= 0) {
        yearScrollRef.current.scrollTo({ y: yearIndex * ITEM_HEIGHT, animated: false });
      }
    }, 100);
  }, []);

  const calculateAge = (): number => {
    const today = new Date();
    const birthDate = new Date(selectedYear, selectedMonth, days[selectedDay]);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const isButtonActive = calculateAge() >= 18 && calculateAge() <= 100;

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
    if (isButtonActive) {
      animateButtonPress();
      triggerHaptic();
      setSelectedButton('yes'); // Reset to yes when modal opens
      setShowAgeModal(true);
      // Animate modal appearance
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

  const handleYesPress = () => {
    triggerHaptic();
    if (selectedButton === 'yes') {
      // If Yes is already selected, confirm and navigate
      const age = calculateAge();
      // Animate modal disappearance
      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowAgeModal(false);
        navigation?.navigate('NotificationPermissionScreen', {
          firstName: route?.params?.firstName || '',
          lastName: route?.params?.lastName || '',
          username: route?.params?.username || '',
          gender: route?.params?.gender || '',
          age: age,
          showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
        });
      });
    } else {
      // Select Yes
      setSelectedButton('yes');
    }
  };

  const handleNoPress = () => {
    triggerHaptic();
    if (selectedButton === 'no') {
      // If No is already selected, cancel and close modal
      // Animate modal disappearance
      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowAgeModal(false);
      });
    } else {
      // Select No
      setSelectedButton('no');
    }
  };

  const renderPickerColumn = (
    data: (string | number)[],
    selectedIndex: number,
    onScroll: (event: any) => void,
    onScrollEnd: () => void,
    scrollRef: React.RefObject<ScrollView | null>,
    type: 'month' | 'day' | 'year'
  ) => {
    const paddingTop = (VISIBLE_ITEMS - 1) / 2 * ITEM_HEIGHT;
    const paddingBottom = (VISIBLE_ITEMS - 1) / 2 * ITEM_HEIGHT;
    const centerIndex = Math.floor(VISIBLE_ITEMS / 2);

    return (
      <View style={[
        styles.pickerColumn,
        type === 'month' && styles.pickerColumnMonth
      ]}>
        <View style={styles.pickerOverlayTop} pointerEvents="none" />
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={onScroll}
          onMomentumScrollEnd={onScrollEnd}
          scrollEventThrottle={16}
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
                key={`${type}-${index}`}
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
                    type === 'month' && styles.pickerItemTextMonth,
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

  const progress = 40; // Progress percentage for birthday screen

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
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
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Birthday? please… {'\n'}<Text style={styles.smallText}>so I know when to send cute wishes</Text></Text>
            <Text style={styles.subheading}>
            Your birthday lets us find matches who fit your energy — and helps us remember when to celebrate you
            </Text>
          </View>

          <View style={styles.iconContainer}>
            <Image source={Birthdayicon} style={styles.cakeIcon} resizeMode="contain" />
          </View>

          <View style={styles.pickerWrapper}>
            <View style={styles.selectionIndicator} />
            <View style={styles.pickerContainer}>
              {renderPickerColumn(
                months,
                selectedMonth,
                handleMonthScroll,
                handleMonthScrollEnd,
                monthScrollRef,
                'month'
              )}
              {renderPickerColumn(
                days,
                selectedDay,
                handleDayScroll,
                handleDayScrollEnd,
                dayScrollRef,
                'day'
              )}
              {(() => {
                const yearIdx = years.findIndex(y => y === selectedYear);
                return renderPickerColumn(
                  years,
                  yearIdx >= 0 ? yearIdx : 0,
                  handleYearScroll,
                  handleYearScrollEnd,
                  yearScrollRef,
                  'year'
                );
              })()}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Animated.View
              style={{
                transform: [{ scale: buttonScale }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  !isButtonActive && styles.nextButtonDisabled,
                ]}
                onPress={handleContinue}
                disabled={!isButtonActive}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.nextButtonText,
                    !isButtonActive && styles.nextButtonTextDisabled,
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      <Modal
        visible={showAgeModal}
        transparent={true}
        animationType="none"
        onRequestClose={handleNoPress}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                opacity: modalOpacity,
                transform: [{ scale: modalScale }],
              },
            ]}
          >
            <View style={styles.modalIconContainer}>
              <Image source={Birthdayicon} style={styles.modalIcon} resizeMode="contain" />
            </View>
            
            <Text style={styles.modalTitle}>
              You are <Text style={styles.modalAgeText}>{calculateAge()}</Text>
            </Text>
            
            <Text style={styles.modalWarning}>
              Make sure this is your correct age as you can't change this later
            </Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.modalButtonNo,
                  selectedButton === 'no' && styles.modalButtonSelected
                ]}
                onPress={handleNoPress}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.modalButtonNoText,
                  selectedButton === 'no' && styles.modalButtonSelectedText
                ]}>No</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modalButtonYes,
                  selectedButton === 'yes' && styles.modalButtonSelected
                ]}
                onPress={handleYesPress}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.modalButtonYesText,
                  selectedButton === 'yes' && styles.modalButtonSelectedText
                ]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

