import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { getApiCall } from '../../../config/apiCall';
import styles from './PeopleScreenStyles';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

interface Profile {
  id: string;
  name: string;
  age: number;
  image: string;
  bio?: string;
  location?: string;
  distance?: number;
  verified?: boolean;
  job?: string;
  education?: string;
  isNew?: boolean;
  interests?: string[];
}

interface UserProfile {
  id: number;
  uid?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  bio?: string;
  photos?: string[];
  selfie_photo?: string;
  is_verified?: boolean;
  hobbies?: string[];
  known_languages?: string[];
  dating_goal?: string;
  interested_in_genders?: string[];
  interested_age_range?: {
    min?: number;
    max?: number;
  };
  is_onboarding_complete?: boolean;
}

export default function PeopleScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const nextCardScale = useRef(new Animated.Value(0.96)).current;
  const currentAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const isAnimatingRef = useRef(false);

  // Reset animation values when index changes to prevent flickering
  useEffect(() => {
    // Stop any ongoing animations
    if (currentAnimation.current) {
      currentAnimation.current.stop();
      currentAnimation.current = null;
    }
    
    // Reset values without animation
    position.setValue({ x: 0, y: 0 });
    rotate.setValue(0);
    nextCardScale.setValue(0.96);
    setIsAnimating(false);
    isAnimatingRef.current = false;
  }, [currentIndex, position, rotate, nextCardScale]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentAnimation.current) {
        currentAnimation.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsProfileLoading(true);
        const accessToken = await AsyncStorage.getItem('accessToken');

        if (!accessToken) {
          console.warn('[PeopleScreen] No access token found; skipping profile fetch');
          setProfiles([]);
          return;
        }

        const apiResponse: any = await getApiCall('AUTH', 'GET_PROFILE', accessToken);

        if (apiResponse?.error) {
          console.warn('[PeopleScreen] Failed to fetch profile', apiResponse?.response);
          setProfiles([]);
          return;
        }

        if (apiResponse?.response?.profile) {
          const profilePayload = apiResponse.response.profile;
          setUserProfile(profilePayload);

          const primaryPhoto =
            profilePayload?.photos?.[0] ||
            profilePayload?.selfie_photo ||
            profilePayload?.profile_photo ||
            '';

          const fullName =
            `${profilePayload?.first_name || ''} ${profilePayload?.last_name || ''}`.trim() ||
            profilePayload?.username ||
            'Profile';

          const mappedProfile: Profile = {
            id: String(profilePayload?.id ?? profilePayload?.uid ?? 'self'),
            name: fullName,
            age: profilePayload?.age || profilePayload?.interested_age_range?.min || 18,
            image: primaryPhoto || 'https://via.placeholder.com/400x600.png?text=Profile',
            bio: profilePayload?.bio,
            location: profilePayload?.currently || profilePayload?.location,
            verified: Boolean(profilePayload?.is_verified),
            interests: profilePayload?.hobbies || profilePayload?.known_languages || [],
          };

          setProfiles(primaryPhoto ? [mappedProfile] : []);
          setCurrentIndex(0);
        } else {
          setProfiles([]);
        }
      } catch (error) {
        console.warn('[PeopleScreen] Error fetching profile', error);
        setProfiles([]);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (isAnimatingRef.current || currentIndex >= profiles.length) return;
    
    // Stop any ongoing animation
    if (currentAnimation.current) {
      currentAnimation.current.stop();
    }
    
    setIsAnimating(true);
    isAnimatingRef.current = true;
    
    const x = direction === 'left' ? -width * 1.5 : direction === 'right' ? width * 1.5 : 0;
    const y = direction === 'up' ? -height * 1.5 : 0;

    currentAnimation.current = Animated.parallel([
      Animated.timing(position, {
        toValue: { x, y },
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(nextCardScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]);

    currentAnimation.current.start(({ finished }) => {
      currentAnimation.current = null;
      
      if (finished) {
        // Advance to next card - the useEffect will reset isAnimating
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        // Animation was interrupted, reset position
        position.setValue({ x: 0, y: 0 });
        rotate.setValue(0);
        nextCardScale.setValue(0.96);
        setIsAnimating(false);
        isAnimatingRef.current = false;
      }
    });
  };

  const resetPosition = () => {
    // Stop any ongoing animation
    if (currentAnimation.current) {
      currentAnimation.current.stop();
    }

    currentAnimation.current = Animated.parallel([
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(rotate, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(nextCardScale, {
        toValue: 0.96,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]);

    currentAnimation.current.start(() => {
      currentAnimation.current = null;
    });
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !isAnimatingRef.current,
        onMoveShouldSetPanResponder: (_, gesture) => {
          // Only start responding if there's significant movement and not animating
          return !isAnimatingRef.current && (Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2);
        },
        onPanResponderMove: (_, gesture) => {
          if (isAnimatingRef.current) return;
          
          position.setValue({ x: gesture.dx, y: gesture.dy });
          rotate.setValue(gesture.dx * 0.08);
          
          const progress = Math.min(Math.abs(gesture.dx) / 100, 1);
          nextCardScale.setValue(0.96 + progress * 0.04);
        },
        onPanResponderRelease: (_, gesture) => {
          if (isAnimatingRef.current) return;
          
          // Check velocity for faster swipes
          const isSwipeFast = Math.abs(gesture.vx) > 0.5 || Math.abs(gesture.vy) > 0.5;
          const swipeThreshold = isSwipeFast ? SWIPE_THRESHOLD * 0.5 : SWIPE_THRESHOLD;
          
          if (Math.abs(gesture.dx) > swipeThreshold) {
            handleSwipe(gesture.dx > 0 ? 'right' : 'left');
          } else if (gesture.dy < -swipeThreshold) {
            handleSwipe('up');
          } else {
            resetPosition();
          }
        },
      }),
    [handleSwipe, nextCardScale, position, resetPosition, rotate]
  );

  const renderCard = (profile: Profile, index: number) => {
    const isTopCard = index === currentIndex;
    const isNextCard = index === currentIndex + 1;
    const isThirdCard = index === currentIndex + 2;

    // Don't render cards that have been swiped
    if (index < currentIndex) return null;
    // Only render top 3 cards for performance
    if (index > currentIndex + 2) return null;

    const rotateCard = rotate.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['-20deg', '0deg', '20deg'],
    });

    const likeOpacity = position.x.interpolate({
      inputRange: [0, SWIPE_THRESHOLD],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const nopeOpacity = position.x.interpolate({
      inputRange: [-SWIPE_THRESHOLD, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const superLikeOpacity = position.y.interpolate({
      inputRange: [-SWIPE_THRESHOLD, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const cardStyle = isTopCard
      ? {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { rotate: rotateCard },
          ],
          zIndex: 1000,
          opacity: 1,
        }
      : isNextCard
      ? {
          transform: [
            { scale: 0.97 },
            { translateX: 12 },
            { translateY: -3 }
          ],
          zIndex: 999,
          opacity: 1,
        }
      : {
          transform: [
            { scale: 0.94 },
            { translateX: 24 },
            { translateY: -3 }
          ],
          zIndex: 998,
          opacity: 1,
        };

    return (
      <Animated.View
        key={profile.id}
        style={[styles.card, cardStyle]}
        {...(isTopCard ? panResponder.panHandlers : {})}
      >
        <Image source={{ uri: profile.image }} style={styles.cardImage} />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />

        {isTopCard && (
          <>
            <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
              <Text style={styles.likeLabelText}>LIKE</Text>
            </Animated.View>

            <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
              <Text style={styles.nopeLabelText}>NOPE</Text>
            </Animated.View>

            <Animated.View style={[styles.superLikeLabel, { opacity: superLikeOpacity }]}>
              <Text style={styles.superLikeLabelText}>SUPER LIKE</Text>
            </Animated.View>
          </>
        )}

        {profile.isNew && isTopCard && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>She likes you</Text>
          </View>
        )}

        <View style={styles.profileInfo}>
          <View style={styles.locationContainer}>
            <Icon name="map-marker" size={14} color="#fff" />
            <Text style={styles.locationText}>{profile.location}</Text>
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.age}>{profile.age}</Text>
            {profile.verified && (
              <Icon name="check-circle" size={24} color="#00BCD4" style={styles.verifiedIcon} />
            )}
          </View>

          {profile.bio && (
            <Text style={styles.bio} numberOfLines={2}>
              {profile.bio}
            </Text>
          )}

          {profile.job && <Text style={styles.detail}>{profile.job}</Text>}
          {profile.education && <Text style={styles.detail}>{profile.education}</Text>}
          {profile.distance && <Text style={styles.distance}> {profile.distance} km away</Text>}

          {profile.interests && profile.interests.length > 0 && (
            <View style={styles.interestsContainer}>
              {profile.interests.map((interest, i) => (
                <View key={i} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>You're all caught up!</Text>
      <Text style={styles.emptySubtext}>Come back later for more profiles.</Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.emptyText}>Loading profiles...</Text>
    </View>
  );

  const headerTitle = isProfileLoading
    ? 'Loading...'
    : userProfile?.username ||
      userProfile?.first_name ||
      'snixx';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="search" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileIconCircle}>
            <Icon name="user" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

    
      <View style={styles.cardsContainer}>
        {isProfileLoading
          ? renderLoadingState()
          : currentIndex >= profiles.length
          ? renderEmptyState()
          : profiles.map((profile, index) => renderCard(profile, index))}
      </View>

    
    </SafeAreaView>
  );
}
