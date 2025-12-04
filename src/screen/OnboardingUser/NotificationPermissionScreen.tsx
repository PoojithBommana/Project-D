import React, { useRef, useEffect } from 'react';
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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/NotificationPermissionScreenStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Bellicon } from '../../assets';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'NotificationPermissionScreen'>;
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

interface NotificationItem {
  id: number;
  name: string;
  text: string;
  time: string;
  avatarColor: string;
  hasStar: boolean;
  isEvent?: boolean;
}

const notifications: NotificationItem[] = [
  { id: 1, name: 'Cynthia Nolan', text: 'Sent you a photo', time: '2m', avatarColor: '#E0BBE4', hasStar: true },
  { id: 2, name: 'Founders Happy Hour', text: 'You just got approved to join!', time: '1h', avatarColor: '#FFF9C4', hasStar: false, isEvent: true },
  { id: 3, name: 'Kevin Murphy', text: 'Posted in Founders Happy Hour', time: '2h', avatarColor: '#B3E0FF', hasStar: true },
];

export default function NotificationPermissionScreen({ navigation, route }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const bellRotate = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  // Create animated values for each notification
  const notificationAnims = useRef(
    notifications.map(() => ({
      translateY: new Animated.Value(100),
      opacity: new Animated.Value(0),
    }))
  ).current;

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

    // Animate bell icon with subtle rotation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bellRotate, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bellRotate, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Staggered animation for notifications - slide up from bottom (smooth and slower)
    const notificationAnimations = notificationAnims.map((anim, index) => {
      return Animated.parallel([
        Animated.spring(anim.translateY, {
          toValue: 0,
          delay: 500 + index * 200, // Stagger each notification by 200ms (slower)
          tension: 40, // Lower tension for smoother motion
          friction: 10, // Higher friction for slower, smoother animation
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          delay: 500 + index * 200,
          duration: 600, // Longer duration for smoother fade
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(150, notificationAnimations).start(); // Increased stagger delay
  }, []);

  const bellRotation = bellRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-15deg'],
  });

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

  const handleTurnOnNotifications = () => {
    animateButtonPress();
    // Navigate to activity selection screen
    navigation?.navigate('ActivitySelectionScreen', {
      firstName: route?.params?.firstName || '',
      lastName: route?.params?.lastName || '',
      username: route?.params?.username || '',
      gender: route?.params?.gender || '',
      age: route?.params?.age || 0,
      showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
    });
  };

  const handleNotRightNow = () => {
    // Navigate to next screen without enabling notifications
    navigation?.navigate('OnboardingStep3', {
      firstName: route?.params?.firstName || '',
      lastName: route?.params?.lastName || '',
      username: route?.params?.username || '',
      gender: route?.params?.gender || '',
      age: route?.params?.age || 0,
      showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
            {/* Bell Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.bellCircle}>
                <Animated.View
                  style={{
                    transform: [{ rotate: bellRotation }],
                  }}
                >
                  <Image source={Bellicon} style={styles.bellIcon} resizeMode="contain" />
                </Animated.View>
              </View>
            </View>

            {/* Heading */}
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>Get Notified</Text>
              <Text style={styles.subheading}>
                Keep up with event invites, updates, and chats from your friends.
              </Text>
            </View>

            {/* Notification List */}
            <View style={styles.notificationListContainer}>
              {notifications.map((notification, index) => {
                const anim = notificationAnims[index];
                return (
                  <Animated.View
                    key={notification.id}
                    style={[
                      styles.notificationCard,
                      {
                        opacity: anim.opacity,
                        transform: [{ translateY: anim.translateY }],
                      },
                    ]}
                  >
                    <View style={styles.notificationLeft}>
                      {notification.isEvent ? (
                        <View style={styles.iconContainerSmall}>
                          <Icon name="star" size={rs(20)} color="#FFD700" />
                        </View>
                      ) : (
                        <View style={styles.avatarContainer}>
                          <View style={[styles.avatar, { backgroundColor: notification.avatarColor }]} />
                          {notification.hasStar && (
                            <View style={styles.starBadge}>
                              <Icon name="star" size={rs(8)} color="#FFD700" />
                            </View>
                          )}
                        </View>
                      )}
                      <View style={styles.notificationContent}>
                        <Text style={styles.notificationName}>{notification.name}</Text>
                        <Text style={styles.notificationText}>{notification.text}</Text>
                      </View>
                    </View>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                  </Animated.View>
                );
              })}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Animated.View
                style={{
                  transform: [{ scale: buttonScale }],
                }}
              >
                <TouchableOpacity
                  style={styles.turnOnButton}
                  onPress={handleTurnOnNotifications}
                  activeOpacity={0.8}
                >
                  <Text style={styles.turnOnButtonText}>Turn On Notifications</Text>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity
                style={styles.notRightNowButton}
                onPress={handleNotRightNow}
                activeOpacity={0.7}
              >
                <Text style={styles.notRightNowText}>Not Right Now</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

