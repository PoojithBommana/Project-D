import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './PeopleScreenStyles';
import { getApiCall, postApiCall } from '../../../config/apiCall';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;
const CARD_WIDTH = width - 20;
const CARD_HEIGHT = height * 0.75;

interface Profile {
  id: string;
  name: string;
  age: number;
  image: string;
  school?: string;
  bio?: string;
  location?: string;
  distance?: number;
  photos?: string[];
  interests?: string[];
  job?: string;
  height?: string;
  exercise?: string;
  education?: string;
  drinking?: string;
  smoking?: string;
  lookingFor?: string;
  // Additional fields from API
  live_photo?: string;
  hobbies?: {
    chill?: string[];
    outdoor?: string[];
  };
  latitude?: number;
  longitude?: number;
  first_name?: string;
  last_name?: string;
}

export default function BumbleSwipeScreen() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Shared translateX value to track top card's swipe position
  const topCardTranslateX = useSharedValue(0);

  // Helper function to map API users to Profile format
  const mapUsersToProfiles = (usersData: any[]): Profile[] => {
    return usersData.map((user: any) => {
      // Handle hobbies - can be array or object with chill/outdoor
      let hobbiesData: { chill?: string[]; outdoor?: string[] } | undefined;
      let interestsArray: string[] = [];
      
      if (user.hobbies) {
        if (Array.isArray(user.hobbies)) {
          // If hobbies is an array, use it as interests
          interestsArray = user.hobbies;
        } else if (typeof user.hobbies === 'object') {
          // If hobbies is an object with chill/outdoor
          hobbiesData = {
            chill: Array.isArray(user.hobbies.chill) ? user.hobbies.chill : [],
            outdoor: Array.isArray(user.hobbies.outdoor) ? user.hobbies.outdoor : [],
          };
          // Combine all hobbies into interests array for display
          interestsArray = [
            ...(hobbiesData.chill || []),
            ...(hobbiesData.outdoor || []),
          ];
        }
      }

      // Build photos array
      const photosArray: string[] = [];
      if (user.profile_photo) photosArray.push(user.profile_photo);
      if (user.live_photo) photosArray.push(user.live_photo);
      if (user.photos && Array.isArray(user.photos)) {
        photosArray.push(...user.photos);
      }

      return {
        id: user.id?.toString() || '',
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown',
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age || 0,
        image: user.profile_photo || '',
        bio: user.bio || '',
        location: user.location || undefined,
        distance: user.distance_km ? Math.round(user.distance_km) : undefined,
        photos: photosArray.length > 0 ? photosArray : undefined,
        interests: interestsArray.length > 0 ? interestsArray : undefined,
        hobbies: hobbiesData,
        job: user.job || user.occupation || undefined,
        school: user.school || user.education || undefined,
        live_photo: user.live_photo || undefined,
        latitude: user.latitude !== null && user.latitude !== undefined ? user.latitude : undefined,
        longitude: user.longitude !== null && user.longitude !== undefined ? user.longitude : undefined,
      };
    });
  };

  // Fetch new users (for periodic updates - doesn't set loading state)
  const fetchNewUsers = useCallback(async (isInitialLoad: boolean = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
        setError(null);
      }
      
      const accessToken = await AsyncStorage.getItem('accessToken');
      
      if (!accessToken) {
        if (isInitialLoad) {
          setError('Please login to view profiles');
          setLoading(false);
        }
        return;
      }

      // Call the API endpoint: GET_USERS: '/auth/swipe/users/'
      const logPrefix = isInitialLoad ? '=== Calling API ===' : '=== Fetching New Users (30s interval) ===';
      console.log(logPrefix);
      console.log('Endpoint: GET_USERS -> /auth/swipe/users/');
      console.log('Params: { limit: 15 }');
      console.log('==================');
      
      const apiResponse = await getApiCall('SWIPE', 'GET_USERS', accessToken, { limit: 15 });
      
      // Log the full API response
      console.log('=== API Response ===');
      console.log('Full Response:', JSON.stringify(apiResponse, null, 2));
      console.log('===================');
      
      if (apiResponse?.error) {
        const errorMessage = 
          apiResponse?.response?.message ||
          apiResponse?.response?.Message ||
          apiResponse?.response?.error ||
          'Failed to fetch users';
        console.error('API Error:', errorMessage);
        if (isInitialLoad) {
          setError(errorMessage);
          setLoading(false);
        }
        return;
      }

      const usersData = apiResponse?.response || [];
      
      // Log the raw users data from API
      console.log('=== Users Data from API ===');
      console.log('Number of users:', usersData.length);
      console.log('Users:', JSON.stringify(usersData, null, 2));
      console.log('==========================');
      
      const mappedProfiles = mapUsersToProfiles(usersData);

      // Log the mapped profiles
      console.log('=== Mapped Profiles ===');
      console.log('Number of profiles:', mappedProfiles.length);
      console.log('Profiles:', JSON.stringify(mappedProfiles, null, 2));
      console.log('=======================');

      if (isInitialLoad) {
        // Initial load - replace all profiles
        setProfiles(mappedProfiles);
        setLoading(false);
      } else {
        // Periodic update - merge new users with existing ones
        setProfiles((prevProfiles) => {
          const existingIds = new Set(prevProfiles.map(p => p.id));
          const newProfiles = mappedProfiles.filter(p => !existingIds.has(p.id));
          
          if (newProfiles.length > 0) {
            console.log(`=== Adding ${newProfiles.length} new user(s) ===`);
            console.log('New users:', newProfiles.map(p => `${p.name} (ID: ${p.id})`).join(', '));
            console.log('===========================================');
            return [...prevProfiles, ...newProfiles];
          } else {
            console.log('=== No new users found ===');
            return prevProfiles;
          }
        });
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      if (isInitialLoad) {
        setError(err?.message || 'Failed to fetch users');
        setLoading(false);
      }
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchNewUsers(true);
  }, [fetchNewUsers]);

  // Set up interval to fetch new users every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchNewUsers(false);
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchNewUsers]);

  // Reset shared translateX value when currentIndex changes
  useEffect(() => {
    topCardTranslateX.value = 0;
  }, [currentIndex]);

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    if (currentIndex >= profiles.length) return;
    
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    // Call the ACTION API
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      
      if (!accessToken) {
        console.error('No access token available for swipe action');
      } else {
        // Map direction to action type
        // left = dislike, right = like
        const actionType = direction === 'right' ? 'like' : 'dislike';
        
        // Convert target_user_id to integer as per API spec
        const targetUserId = parseInt(currentProfile.id, 10);
        
        const actionParams = {
          target_user_id: targetUserId,
          action: actionType,
        };

        console.log('=== Calling Swipe Action API ===');
        console.log('Endpoint: ACTION -> /auth/swipe/action/');
        console.log('Method: POST');
        console.log('Params:', JSON.stringify(actionParams, null, 2));
        console.log('================================');

        const apiResponse = await postApiCall(
          'POST',
          'SWIPE',
          'ACTION',
          actionParams,
          accessToken
        );

        console.log('=== Swipe Action API Response ===');
        console.log('Full Response:', JSON.stringify(apiResponse, null, 2));
        console.log('=================================');

        if (apiResponse?.error) {
          console.error('Swipe action API error:', apiResponse.response);
          const errorMessage = 
            apiResponse?.response?.message ||
            apiResponse?.response?.Message ||
            'Failed to record swipe action';
          console.error('Error message:', errorMessage);
        } else {
          const responseData = apiResponse?.response || {};
          console.log('Swipe action successful');
          console.log('Success:', responseData.success);
          console.log('Message:', responseData.message);
          console.log('Match:', responseData.match);
          
          // Handle match response
          if (responseData.match === true) {
            console.log('🎉🔥 IT\'S A MATCH!');
            console.log('Match ID:', responseData.match_id);
            // TODO: Show match modal/notification here
            // You can add a state to show a match modal or navigate to a match screen
          }
        }
      }
    } catch (error) {
      console.error('Error calling swipe action API:', error);
    }

    // Update UI state after API call
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    console.log(`Swiped ${direction} on ${currentProfile.name} (ID: ${currentProfile.id})`);
  }, [currentIndex, profiles]);

  const handleButtonSwipe = useCallback((direction: 'left' | 'right') => {
    handleSwipe(direction);
  }, [handleSwipe]);

  // Background Image Component - Shows next profile when swiping
  const BackgroundImage = ({ profile, translateX }: { profile: Profile; translateX: SharedValue<number> }) => {
    const backgroundStyle = useAnimatedStyle(() => {
      // Only show background when actively swiping (translateX > 0)
      // Start appearing after 20px of movement, fully visible at halfway point
      const swipeAmount = Math.abs(translateX.value);
      const startShowing = 20; // Start showing after 20px of swipe
      const fullyVisible = SWIPE_THRESHOLD / 2; // Fully visible at halfway point
      
      if (swipeAmount < startShowing) {
        return { opacity: 0 };
      }
      
      const progress = interpolate(
        swipeAmount,
        [startShowing, fullyVisible],
        [0, 1],
        Extrapolation.CLAMP
      );
      
      return {
        opacity: progress,
      };
    });

    const imageUri = profile.image || profile.photos?.[0];
    
    return (
      <Animated.View style={[styles.backgroundImageContainer, backgroundStyle]}>
        <Image
          key={imageUri}
          source={{ uri: imageUri }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </Animated.View>
    );
  };

  // Card Component
  const Card = ({ profile, index, onSwipe, topCardTranslateX: sharedTranslateX }: { profile: Profile; index: number; onSwipe: (direction: 'left' | 'right') => void; topCardTranslateX: SharedValue<number> }) => {
    const isTop = index === currentIndex;
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(isTop ? 1 : 0.95);
    const opacity = useSharedValue(isTop ? 1 : 0.5);
    const scrollViewRef = useRef<ScrollView>(null);

    // Update scale and opacity when card becomes top
    useEffect(() => {
      if (isTop) {
        scale.value = withSpring(1);
        opacity.value = withSpring(1);
        translateX.value = 0;
        translateY.value = 0;
        sharedTranslateX.value = 0;
      } else {
        scale.value = withSpring(0.95);
        opacity.value = withSpring(0.5);
      }
    }, [isTop]);

    const disableScroll = () => {
      if (scrollViewRef.current) {
        scrollViewRef.current.setNativeProps({ scrollEnabled: false });
      }
    };

    const enableScroll = () => {
      if (scrollViewRef.current) {
        scrollViewRef.current.setNativeProps({ scrollEnabled: true });
      }
    };

    const panGesture = Gesture.Pan()
      .enabled(isTop)
      .activeOffsetX([-5, 5])
      .onStart(() => {
        runOnJS(disableScroll)();
      })
      .onUpdate((event) => {
        // If horizontal movement is dominant, update card position
        if (Math.abs(event.translationX) > Math.abs(event.translationY) || Math.abs(event.translationX) > 5) {
          translateX.value = event.translationX;
          translateY.value = event.translationY * 0.1;
          // Sync with shared value for next card animation
          if (isTop) {
            sharedTranslateX.value = event.translationX;
          }
        }
      })
      .onEnd((event) => {
        runOnJS(enableScroll)();
        const shouldSwipe = Math.abs(event.translationX) > SWIPE_THRESHOLD || Math.abs(event.velocityX) > 500;
        
        if (shouldSwipe) {
          const direction = event.translationX > 0 ? 'right' : 'left';
          translateX.value = withTiming(direction === 'right' ? width * 1.5 : -width * 1.5, { duration: 300 });
          translateY.value = withTiming(0, { duration: 300 });
          opacity.value = withTiming(0, { duration: 300 });
          // Reset shared value when swipe completes
          if (isTop) {
            sharedTranslateX.value = withTiming(0, { duration: 300 });
          }
          runOnJS(onSwipe)(direction);
        } else {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          // Reset shared value when swipe is cancelled
          if (isTop) {
            sharedTranslateX.value = withSpring(0);
          }
        }
      });

    const cardStyle = useAnimatedStyle(() => {
      const rotate = interpolate(
        translateX.value,
        [-200, 0, 200],
        [-15, 0, 15],
        Extrapolation.CLAMP
      );

      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { rotate: `${rotate}deg` },
          { scale: scale.value },
        ],
        opacity: opacity.value,
        zIndex: isTop ? 1000 : 1000 - index,
      };
    });

    const likeOpacity = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateX.value,
        [20, 150],
        [0, 1],
        Extrapolation.CLAMP
      );
      return { opacity };
    });

    const nopeOpacity = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateX.value,
        [-150, -20],
        [1, 0],
        Extrapolation.CLAMP
      );
      return { opacity };
    });

    const nextCardStyle = useAnimatedStyle(() => {
      if (!isTop && index === currentIndex + 1) {
        // Use shared translateX from top card to animate next card
        // Make card fully visible at halfway point (SWIPE_THRESHOLD / 2)
        const opacityProgress = interpolate(
          Math.abs(sharedTranslateX.value),
          [0, SWIPE_THRESHOLD / 2],
          [0.5, 1.0],
          Extrapolation.CLAMP
        );
        const scaleProgress = interpolate(
          Math.abs(sharedTranslateX.value),
          [0, SWIPE_THRESHOLD / 2],
          [0.95, 1.0],
          Extrapolation.CLAMP
        );
        return {
          transform: [{ scale: scaleProgress }],
          opacity: opacityProgress,
        };
      }
      return {};
    });

    if (!isTop && index > currentIndex + 1) {
      return null;
    }

    return (
      <Animated.View
        style={[
          styles.card,
          cardStyle,
          !isTop && nextCardStyle,
        ]}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View style={{ flex: 1 }}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              scrollEnabled={isTop}
              bounces={false}
            >
              {/* Main Image Section */}
              <View style={styles.photoContainer}>
                <Image 
                  source={{ uri: profile.image || profile.photos?.[0] }} 
                  style={styles.mainPhoto}
                  resizeMode="cover"
                />
                
                {/* Gradient Overlay */}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.6)']}
                  style={styles.gradient}
                />

                {/* Share Button */}
                <TouchableOpacity style={styles.shareButton}>
                  <Icon name="share-variant" size={24} color="#fff" />
                </TouchableOpacity>

                {/* Swipe Indicators */}
                {isTop && (
                  <>
                    <Animated.View style={[styles.likeLabel, likeOpacity]}>
                      <View style={styles.likeLabelContainer}>
                        <Text style={styles.likeLabelText}>LIKE</Text>
                      </View>
                    </Animated.View>

                    <Animated.View style={[styles.nopeLabel, nopeOpacity]}>
                      <View style={styles.nopeLabelContainer}>
                        <Text style={styles.nopeLabelText}>NOPE</Text>
                      </View>
                    </Animated.View>
                  </>
                )}

                {/* Basic Info Overlay */}
                <View style={styles.photoOverlay}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{profile.name}</Text>
                    <Text style={styles.age}>, {profile.age}</Text>
                  </View>
                  {profile.job && (
                    <View style={styles.infoRow}>
                      <Icon name="briefcase-outline" size={14} color="#fff" />
                      <Text style={styles.infoText}>{profile.job}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Scrollable Details Section */}
              <View style={styles.detailsSection}>
                {/* Bio Section */}
                {profile.bio && (
                  <View style={styles.bioSection}>
                    <View style={styles.bioHeader}>
                      <Icon name="format-quote-close" size={16} color="#FFC629" />
                      <Text style={styles.bioHeaderText}>ABOUT ME</Text>
                    </View>
                    <Text style={styles.bioText}>{profile.bio}</Text>
                  </View>
                )}

                {/* Basics Chips */}
                <View style={styles.basicsContainer}>
                  {profile.school && (
                    <View style={styles.basicChip}>
                      <Icon name="school-outline" size={16} color="#666" />
                      <Text style={styles.basicChipText}>{profile.school}</Text>
                    </View>
                  )}
                  {profile.distance && (
                    <View style={styles.basicChip}>
                      <Icon name="map-marker-outline" size={16} color="#666" />
                      <Text style={styles.basicChipText}>{profile.distance} km away</Text>
                    </View>
                  )}
                  {profile.job && (
                    <View style={styles.basicChip}>
                      <Icon name="briefcase-outline" size={16} color="#666" />
                      <Text style={styles.basicChipText}>{profile.job}</Text>
                    </View>
                  )}
                </View>

                {/* Hobbies - Chill */}
                {profile.hobbies?.chill && profile.hobbies.chill.length > 0 && (
                  <View style={styles.interestsSection}>
                    <Text style={styles.interestsTitle}>CHILL HOBBIES</Text>
                    <View style={styles.interestsGrid}>
                      {profile.hobbies.chill.map((hobby, idx) => (
                        <View key={idx} style={styles.interestTag}>
                          <Text style={styles.interestText}>{hobby}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Hobbies - Outdoor */}
                {profile.hobbies?.outdoor && profile.hobbies.outdoor.length > 0 && (
                  <View style={styles.interestsSection}>
                    <Text style={styles.interestsTitle}>OUTDOOR HOBBIES</Text>
                    <View style={styles.interestsGrid}>
                      {profile.hobbies.outdoor.map((hobby, idx) => (
                        <View key={idx} style={styles.interestTag}>
                          <Text style={styles.interestText}>{hobby}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Interests (fallback for array format) */}
                {profile.interests && profile.interests.length > 0 && !profile.hobbies && (
                  <View style={styles.interestsSection}>
                    <Text style={styles.interestsTitle}>MY INTERESTS</Text>
                    <View style={styles.interestsGrid}>
                      {profile.interests.map((interest, idx) => (
                        <View key={idx} style={styles.interestTag}>
                          <Text style={styles.interestText}>{interest}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Location Details */}
                {(profile.latitude !== undefined || profile.longitude !== undefined || profile.distance !== undefined) && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>LOCATION</Text>
                    {profile.distance !== undefined && (
                      <View style={styles.detailRow}>
                        <Icon name="map-marker-distance" size={20} color="#666" />
                        <Text style={styles.detailText}>{profile.distance} km away</Text>
                      </View>
                    )}
                    {profile.latitude !== undefined && profile.longitude !== undefined && (
                      <View style={styles.detailRow}>
                        <Icon name="map-marker" size={20} color="#666" />
                        <Text style={styles.detailText}>
                          {profile.latitude.toFixed(4)}, {profile.longitude.toFixed(4)}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Live Photo */}
                {profile.live_photo && (
                  <View style={styles.morePhotosSection}>
                    <Text style={styles.interestsTitle}>LIVE PHOTO</Text>
                    <Image
                      source={{ uri: profile.live_photo }}
                      style={styles.morePhoto}
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* More Images */}
                {profile.photos && profile.photos.length > 1 && (
                  <View style={styles.morePhotosSection}>
                    <Text style={styles.interestsTitle}>MORE PHOTOS</Text>
                    {profile.photos.slice(1).map((photo, idx) => (
                      <Image
                        key={idx}
                        source={{ uri: photo }}
                        style={styles.morePhoto}
                        resizeMode="cover"
                      />
                    ))}
                  </View>
                )}

                {/* All Profile Data (Debug/Info) */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>PROFILE INFO</Text>
                  <View style={styles.detailRow}>
                    <Icon name="identifier" size={20} color="#666" />
                    <Text style={styles.detailText}>ID: {profile.id}</Text>
                  </View>
                  {profile.first_name && (
                    <View style={styles.detailRow}>
                      <Icon name="account" size={20} color="#666" />
                      <Text style={styles.detailText}>First Name: {profile.first_name}</Text>
                    </View>
                  )}
                  {profile.last_name && (
                    <View style={styles.detailRow}>
                      <Icon name="account" size={20} color="#666" />
                      <Text style={styles.detailText}>Last Name: {profile.last_name}</Text>
                    </View>
                  )}
                  {profile.age > 0 && (
                    <View style={styles.detailRow}>
                      <Icon name="cake" size={20} color="#666" />
                      <Text style={styles.detailText}>Age: {profile.age}</Text>
                    </View>
                  )}
                </View>

                {/* End of Profile */}
                <View style={styles.endOfProfile}>
                  <Text style={styles.endOfProfileText}>End of Profile</Text>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Icon name="account-outline" size={26} color="#666" />
          
            <Icon name="menu" size={26} color="#666" />
          </View>
          <View style={[styles.emptyState, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={[styles.emptyText, { marginTop: 16 }]}>Loading profiles...</Text>
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  // Error state
  if (error) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
          
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Error loading profiles</Text>
            <Text style={styles.emptySubtext}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchNewUsers(true)}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  // Empty state
  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            
          </View>
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>👋</Text>
            </View>
            <Text style={styles.emptyText}>That's everyone!</Text>
            <Text style={styles.emptySubtext}>Check back later for more people nearby.</Text>
            <TouchableOpacity
              style={styles.startOverButton}
              onPress={() => {
                setCurrentIndex(0);
                fetchNewUsers(true);
              }}
            >
              <Text style={styles.startOverButtonText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <Text style={styles.appTitle}>snixx</Text>
       
        <Icon name="menu" size={26} color="#666" />
      </View>

      {/* Cards Container */}
      <View style={styles.cardsContainer}>
        {profiles.map((profile, index) => (
          <Card
            key={`${profile.id}-${index}`}
            profile={profile}
            index={index}
            onSwipe={handleSwipe}
            topCardTranslateX={topCardTranslateX}
          />
        ))}
      </View>

      {/* Floating Action Buttons */}
      
    
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}