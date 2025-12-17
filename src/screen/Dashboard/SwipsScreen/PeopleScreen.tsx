import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PeopleStackParamList } from '../../../navigation/PeopleStackNavigator';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { SnixxHometext } from '../../../assets';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureType,
} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile } from '../../../types/Profile';
import { getApiCall, postApiCall } from '../../../config/apiCall';
import styles from './PeopleScreenStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const ROTATION_MULTIPLIER = 10;
const PARALLAX_MULTIPLIER = 0.3;

interface SwipeableCardProps {
  profile: Profile;
  index: number;
  onSwipeComplete: (direction: 'left' | 'right') => void;
  onCardTap?: (profile: Profile) => void;
  isTopCard: boolean;
  stackOffset: number;
  stackScale: number;
  stackOpacity: number;
  shouldAnimateToTop?: boolean;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  profile,
  index,
  onSwipeComplete,
  onCardTap,
  isTopCard,
  stackOffset,
  stackScale,
  stackOpacity,
  shouldAnimateToTop = false,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(stackScale);
  const opacity = useSharedValue(stackOpacity);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // Initialize translateY with stack offset for non-top cards
  React.useEffect(() => {
    if (shouldAnimateToTop && !isTopCard) {
      // Smoothly animate this card to become the top card with very smooth spring
      scale.value = withSpring(1, { 
        damping: 25, 
        stiffness: 150,
        mass: 1.2,
        overshootClamping: false,
      });
      opacity.value = withSpring(1, { 
        damping: 25, 
        stiffness: 150,
        mass: 1.2,
        overshootClamping: false,
      });
      translateY.value = withSpring(0, { 
        damping: 25, 
        stiffness: 150,
        mass: 1.2,
        overshootClamping: false,
      });
    } else if (!isTopCard) {
      translateY.value = -stackOffset;
      scale.value = stackScale;
      opacity.value = stackOpacity;
    } else {
      translateY.value = 0;
      scale.value = 1;
      opacity.value = 1;
    }
  }, [isTopCard, stackOffset, shouldAnimateToTop, stackScale, stackOpacity]);

  const panGesture = Gesture.Pan()
    .enabled(isTopCard)
    .activeOffsetX([-5, 5])
    .activeOffsetY([-5, 5])
    .onStart(() => {
      if (!isTopCard) return;
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      if (!isTopCard) return;
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd((event) => {
      if (!isTopCard) return;
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;
      const shouldSwipeUp = translateY.value < -SWIPE_THRESHOLD * 0.5;

      if (shouldSwipeUp && Math.abs(translateX.value) < SWIPE_THRESHOLD * 0.5) {
        // Treat swipe up as opening profile details
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        if (onCardTap) {
          runOnJS(onCardTap)(profile);
        }
        return;
      }

      if (shouldSwipeLeft || shouldSwipeRight) {
        const direction = shouldSwipeLeft ? 'left' : 'right';
        const targetX = shouldSwipeLeft ? -SCREEN_WIDTH * 1.5 : SCREEN_WIDTH * 1.5;
        
        // Smooth exit animation with easing
        translateX.value = withTiming(targetX, { 
          duration: 400,
        });
        translateY.value = withTiming(event.translationY, { 
          duration: 400,
        });
        opacity.value = withTiming(0, { 
          duration: 350,
        }, () => {
          runOnJS(onSwipeComplete)(direction);
        });
      } else {
        // Spring back to center with smoother animation
        translateX.value = withSpring(0, {
          damping: 22,
          stiffness: 140,
          mass: 1.0,
          overshootClamping: false,
        });
        translateY.value = withSpring(0, {
          damping: 22,
          stiffness: 140,
          mass: 1.0,
          overshootClamping: false,
        });
      }
    });

  const tapGesture = Gesture.Tap()
    .enabled(isTopCard)
    .numberOfTaps(1)
    .maxDuration(250)
    .onEnd(() => {
      // Only trigger tap if card hasn't moved significantly
      if (Math.abs(translateX.value) < 10 && Math.abs(translateY.value) < 10) {
        if (onCardTap) {
          runOnJS(onCardTap)(profile);
        }
      }
    });

  const composedGesture = Gesture.Race(tapGesture, panGesture);

  // Update scale, opacity, and position when this card becomes the top card
  useAnimatedReaction(
    () => isTopCard,
    (isTop) => {
      if (isTop) {
        // Smoothly animate to top position with very smooth spring
        scale.value = withSpring(1, { 
          damping: 25, 
          stiffness: 150,
          mass: 1.2,
          overshootClamping: false,
        });
        opacity.value = withSpring(1, { 
          damping: 25, 
          stiffness: 150,
          mass: 1.2,
          overshootClamping: false,
        });
        translateY.value = withSpring(0, { 
          damping: 25, 
          stiffness: 150,
          mass: 1.2,
          overshootClamping: false,
        });
      } else {
        // Animate to stacked position with smooth spring
        scale.value = withSpring(stackScale, { 
          damping: 25, 
          stiffness: 150,
          mass: 1.2,
          overshootClamping: false,
        });
        opacity.value = withSpring(stackOpacity, { 
          damping: 25, 
          stiffness: 150,
          mass: 1.2,
          overshootClamping: false,
        });
        translateY.value = withSpring(-stackOffset, { 
          damping: 25, 
          stiffness: 150,
          mass: 1.2,
          overshootClamping: false,
        });
      }
    },
    [stackScale, stackOpacity, stackOffset],
  );

  const cardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-ROTATION_MULTIPLIER, 0, ROTATION_MULTIPLIER],
      Extrapolate.CLAMP,
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${rotation}deg` },
      ],
      opacity: opacity.value,
    };
  });


  const imageStyle = useAnimatedStyle(() => {
    // Image moves exactly with card - no parallax to prevent separation
    return {
      transform: [{ translateX: 0 }],
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    const labelOpacity = interpolate(
      Math.abs(translateX.value),
      [SWIPE_THRESHOLD * 0.7, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP,
    );

    return {
      opacity: labelOpacity,
    };
  });

  const likeLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [SWIPE_THRESHOLD * 0.5, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP,
    );
    return { opacity };
  });

  const passLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.5],
      [1, 0],
      Extrapolate.CLAMP,
    );
    return { opacity };
  });

  const primaryImage = profile.images && profile.images.length > 0 
    ? { uri: profile.images[0] } 
    : require('../../../assets/girl.png');

  const handleConnectPress = useCallback(async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('Authentication required', 'Please log in again.');
        return;
      }

      const targetUserId = parseInt(profile.id, 10);
      if (Number.isNaN(targetUserId)) {
        Alert.alert('Error', 'Invalid user id');
        return;
      }

      console.log('=== CONNECTION SEND API Call ===');
      console.log('Payload:', { target_user_id: targetUserId });

      const response = await postApiCall(
        'POST',
        'CONNECTIONS',
        'SEND',
        { target_user_id: targetUserId },
        accessToken,
      );

      console.log('=== CONNECTION SEND API Response ===');
      console.log('Full Response:', JSON.stringify(response, null, 2));

      if (response?.error) {
        const msg = response?.response?.error || response?.response?.message || 'Failed to send connection request';
        Alert.alert('Error', msg);
      } else {
        const status = response?.response?.status;
        const message = response?.response?.message || 'Connection request sent';
        Alert.alert('Connect', `${message}${status ? ` (status: ${status})` : ''}`);
      }
    } catch (err) {
      console.error('Connection send failed:', err);
      Alert.alert('Error', 'Unable to send connection request');
    }
  }, [profile.id]);

  // Static z-index for proper stacking (animated views need static z-index)
  const staticZIndex = isTopCard ? 1000 : 100 - index;

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.card, cardStyle, { zIndex: staticZIndex }]}>
        <View style={styles.cardImageContainer}>
          <Image
            source={primaryImage}
            style={styles.cardImage}
            resizeMode="cover"
          />
          {/* Only show gradient overlay on stacked cards, not on top card */}
          {!isTopCard && (
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.95)']}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
          )}
        </View>

        {/* Connect Button - Top Right */}
        {isTopCard && (
          <View style={styles.connectButtonContainer}>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={handleConnectPress}
              activeOpacity={0.8}
            >
              {Platform.OS === 'ios' ? (
                <BlurView
                  blurType="light"
                  blurAmount={10}
                  style={styles.connectButtonGlass}
                  reducedTransparencyFallbackColor="rgba(255,255,255,0.8)"
                />
              ) : (
                <View style={styles.androidGlassButton} />
              )}
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content */}
        <View style={styles.cardContent}>
          {profile.verified && profile.name && typeof profile.name === 'string' && (
            <Text style={styles.subtitle}>
              {(profile.name.split(' ')[0] || '').toUpperCase()}
            </Text>
          )}
          {profile.name && typeof profile.name === 'string' && (
            <Text style={styles.title}>
              {profile.name.split(' ')[0] || ''}, {String(profile.age || 0)}
            </Text>
          )}
          {profile.job && typeof profile.job === 'string' && profile.job.trim() && (
            <Text style={styles.subtitle}>{profile.job}</Text>
          )}
          {typeof profile.distance === 'number' && profile.distance > 0 && (
            <Text style={styles.dateText}>
              {profile.distance} km away
            </Text>
          )}
        </View>

        {/* Swipe Overlay Labels */}
        {isTopCard && (
          <Animated.View style={styles.overlayLabelContainer} pointerEvents="none">
            <Animated.View style={[styles.overlayLabel, styles.likeLabel, likeLabelStyle]}>
              <Text style={[styles.overlayLabelText, styles.likeLabelText]}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[styles.overlayLabel, styles.passLabel, passLabelStyle]}>
              <Text style={[styles.overlayLabelText, styles.passLabelText]}>PASS</Text>
            </Animated.View>
          </Animated.View>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

interface PeopleScreenProps {
  navigation?: NativeStackNavigationProp<PeopleStackParamList, 'PeopleScreen'>;
}

const PeopleScreen: React.FC<PeopleScreenProps> = ({ navigation }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(1); // 0: Coming Soon, 1: Now Playing, 2: Tomorrow
  const [isLoading, setIsLoading] = useState(true);

  const handleCardTap = useCallback((profile: Profile) => {
    // Small delay for smoother transition
    setTimeout(() => {
      navigation?.navigate('ProfileDetailsScreen', { profile });
    }, 50);
  }, [navigation]);

  const handleSwipeComplete = useCallback(async (direction: 'left' | 'right') => {
    setIsAnimating(true);
    
    // Get current profile before updating index
    const currentProfile = profiles[currentIndex];
    
    // Call API to save swipe action
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken && currentProfile) {
        const actionPayload = {
          target_user_id: parseInt(currentProfile.id, 10), // API expects integer
          action: direction === 'right' ? 'like' : 'dislike', // API uses 'like' or 'dislike'
        };
        
        console.log('=== SWIPE ACTION API Call ===');
        console.log('Payload:', JSON.stringify(actionPayload, null, 2));
        
        const actionResponse = await postApiCall(
          'POST',
          'SWIPE',
          'ACTION',
          actionPayload,
          accessToken,
        );

        console.log('=== SWIPE ACTION API Response ===');
        console.log('Full Response:', JSON.stringify(actionResponse, null, 2));
        console.log('Response Data:', actionResponse?.response);
        console.log('Response Status:', actionResponse?.statusCode);
        console.log('==================================');

        if (actionResponse?.error) {
          console.error('Swipe action failed:', actionResponse.response);
          Alert.alert(
            'Error',
            actionResponse?.response?.error || 
            actionResponse?.response?.message || 
            'Failed to record swipe action'
          );
          // Continue with UI update even if API call fails
        } else {
          const responseData = actionResponse?.response;
          console.log('Swipe action successful:', responseData);
          
          // Handle match response
          if (responseData?.match === true) {
            Alert.alert(
              '🎉 It\'s a Match!',
              responseData?.message || 'You both liked each other!',
              [{ text: 'OK', onPress: () => {} }]
            );
          }
        }
      }
    } catch (error) {
      console.error('Error calling swipe action API:', error);
      // Continue with UI update even if API call fails
    }

    // Delay to ensure smooth transition animation starts after card exits
    setTimeout(() => {
      setCurrentIndex((prev) => {
        setIsAnimating(false);
        return prev + 1;
      });
    }, 150);
  }, [currentIndex, profiles]);

  // Transform user data to Profile format
  const transformUserToProfile = (user: any): Profile => {
    // Combine first_name and last_name
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Unknown';

    // Build images array - profile_photo first, then live_photo
    const images: string[] = [];
    if (user.profile_photo) images.push(user.profile_photo);
    if (user.live_photo) images.push(user.live_photo);
    // Also check for additional photos arrays if API provides them
    if (Array.isArray(user.images)) images.push(...user.images);
    if (Array.isArray(user.photos)) images.push(...user.photos);

    // Handle hobbies - can be array or object
    let interests: string[] = [];
    if (Array.isArray(user.hobbies)) {
      // If hobbies is already an array, use it directly
      interests = user.hobbies.filter(Boolean);
    } else if (user.hobbies && typeof user.hobbies === 'object') {
      // If hobbies is an object (e.g., {creative: [...], fun: [...]}), flatten it
      interests = Object.values(user.hobbies)
        .flat()
        .filter(Boolean) as string[];
    } else if (Array.isArray(user.interests)) {
      // Fallback to interests if hobbies not available
      interests = user.interests.filter(Boolean);
    }

    return {
      id: user.id?.toString() || '',
      name: fullName || 'Unknown',
      age: typeof user.age === 'number' ? user.age : 0,
      images: images.length > 0 ? images : [], // Ensure array is never empty
      job: (user.job || user.profession || '').toString(),
      profession: (user.profession || user.job || '').toString(),
      education: (user.education || '').toString(),
      location: (user.location || '').toString(),
      distance: typeof user.distance_km === 'number' ? user.distance_km : (typeof user.distance === 'number' ? user.distance : 0),
      verified: Boolean(user.verified),
      isNew: Boolean(user.is_new),
      interests: Array.isArray(interests) ? interests : [],
      bio: (user.bio || '').toString(),
      // Preserve raw backend payload for detail screen
      rawData: user,
    };
  };

  // Fetch users function - can be called on mount or for polling
  const fetchUsers = useCallback(async (isInitialLoad: boolean = false) => {
    try {
      if (isInitialLoad) {
        setIsLoading(true);
      }
      
      const accessToken = await AsyncStorage.getItem('accessToken');
      
      if (!accessToken) {
        if (isInitialLoad) {
          Alert.alert('Authentication required', 'Please log in again.');
          setIsLoading(false);
        }
        return;
      }

      // Optional: Add limit parameter (default is 15)
      const response = await getApiCall('SWIPE', 'GET_USERS', accessToken, { limit: 15 });
      
      // Console log the full API response
      console.log('=== GET_USERS API Response ===');
      console.log('Full Response:', JSON.stringify(response, null, 2));
      console.log('Response Data:', response?.response);
      console.log('Response Status:', response?.statusCode);
      console.log('=============================');
      
      if (response?.error) {
        const errorMessage = 
          response?.response?.message || 
          response?.response?.Message || 
          response?.response?.error ||
          'Failed to load users. Please try again.';
        console.error('API Error:', errorMessage);
        if (isInitialLoad) {
          Alert.alert('Error', errorMessage);
          setProfiles([]);
        }
      } else if (response?.response) {
        // Console log the raw response data
        console.log('Raw API Response Data:', response.response);
        
        // Transform API response to Profile format
        // API returns array of users with: id, first_name, last_name, age, profile_photo, live_photo, hobbies, bio, distance_km, connection_status
        const apiProfiles: Profile[] = Array.isArray(response.response)
          ? response.response.map((user: any) => {
              console.log('Processing user:', user);
              return transformUserToProfile(user);
            })
          : [];
        
        console.log('Transformed Profiles:', apiProfiles);
        
        if (isInitialLoad) {
          // On initial load, replace all profiles
          setProfiles(apiProfiles);
        } else {
          // On polling, append only new users (avoid duplicates)
          setProfiles((prevProfiles) => {
            const existingIds = new Set(prevProfiles.map(p => p.id));
            const newProfiles = apiProfiles.filter(p => !existingIds.has(p.id));
            
            if (newProfiles.length > 0) {
              console.log(`Adding ${newProfiles.length} new profile(s) to the stack`);
              return [...prevProfiles, ...newProfiles];
            } else {
              console.log('No new profiles found');
              return prevProfiles;
            }
          });
        }
      } else {
        console.warn('Unexpected response format:', response);
        if (isInitialLoad) {
          setProfiles([]);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      if (isInitialLoad) {
        Alert.alert('Error', 'Failed to load users. Please try again.');
        setProfiles([]);
      }
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  }, []);

  // Fetch users on component mount and set up polling
  useEffect(() => {
    // Initial load
    fetchUsers(true);

    // Set up polling every 50 seconds
    const pollInterval = setInterval(() => {
      console.log('Polling for new users...');
      fetchUsers(false);
    }, 50000); // 50 seconds

    // Cleanup interval on unmount
    return () => {
      clearInterval(pollInterval);
    };
  }, [fetchUsers]);

  // Show current card + next card slightly behind it
  const visibleCards = profiles.slice(currentIndex, currentIndex + 2);
  
  console.log(`Showing ${visibleCards.length} cards, currentIndex: ${currentIndex}, total profiles: ${profiles.length}`);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.emptyStateText}>Loading profiles...</Text>
        </View>
      </View>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            No more profiles available.{'\n'}Check back later!
          </Text>
        </View>
      </View>
    );
  }

  

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Homescreen Background - Behind cards */}
      <View style={styles.homescreenBackgroundContainer}>
       
        {/* Snixx Home Text at top */}
        {/* <Image
          source={SnixxHometext}
          style={styles.snixxHomeText}
          resizeMode="contain"
        /> */}
        
        {/* Light black overlay from top to bottom */}
      
      </View>
      
      {/* Header Section with App Name */}
      <View style={styles.headerSection}>
        <Text style={styles.appNameText}>snixx</Text>
      </View>

      <View style={styles.cardStackContainer}>
        {visibleCards.map((profile, index) => {
          const isTopCard = index === 0;
          const stackIndex = index;
          
          // No static stacking - cards share same position/size.
          // The next card will only be revealed as the top card moves while swiping.
          let stackOffset = 0;
          let stackScale = 1;
          let stackOpacity = 1;

          // Render cards from back to front for proper stacking
          // Cards behind should render first (lower z-index), top card renders last (higher z-index)
          const zIndex = isTopCard ? 1000 : 900;

          // No special animation needed for next card
          const shouldAnimateToTop = false;

          return (
            <SwipeableCard
              key={`${profile.id}-${currentIndex + index}`}
              profile={profile}
              index={index}
              onSwipeComplete={handleSwipeComplete}
              onCardTap={handleCardTap}
              isTopCard={isTopCard}
              stackOffset={stackOffset}
              stackScale={stackScale}
              stackOpacity={stackOpacity}
              shouldAnimateToTop={shouldAnimateToTop}
            />
          );
        }).reverse()}
      </View>
    </GestureHandlerRootView>
  );
};

export default PeopleScreen;