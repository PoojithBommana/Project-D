import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PeopleStackParamList } from '../../../navigation/PeopleStackNavigator';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { Profile } from '../../../types/Profile';
import { getApiCall, postApiCall } from '../../../config/apiCall';
import { Plusicon } from '../../../assets';
import { wp } from '../../../utils/responsive';
import styles from './PeopleScreenStyles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const ROTATION_MULTIPLIER = 10;
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.7;

interface SwipeableCardProps {
  profile: Profile;
  index: number;
  onSwipeComplete: (direction: 'left' | 'right') => void;
  isTopCard: boolean;
  stackOffset: number;
  stackScale: number;
  stackOpacity: number;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  profile,
  index,
  onSwipeComplete,
  isTopCard,
  stackOffset,
  stackScale,
  stackOpacity,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(stackScale);
  const opacity = useSharedValue(stackOpacity);
  const scrollY = useSharedValue(0);
  const isScrolling = useSharedValue(false);
  const contentHeight = useSharedValue(0);
  const scrollViewHeight = useSharedValue(0);

  React.useEffect(() => {
    if (!isTopCard) {
      translateY.value = -stackOffset;
      scale.value = stackScale;
      opacity.value = stackOpacity;
    } else {
      translateY.value = 0;
      scale.value = 1;
      opacity.value = 1;
    }
  }, [isTopCard, stackOffset, stackScale, stackOpacity]);

  // Scroll handler to track scroll position
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      if (!isTopCard) return;
      
      const scrollPosition = event.contentOffset.y;
      const contentHeightValue = event.contentSize.height;
      const scrollViewHeightValue = event.layoutMeasurement.height;
      
      // Update content height and scroll view height
      contentHeight.value = contentHeightValue;
      scrollViewHeight.value = scrollViewHeightValue;
      
    },
    onBeginDrag: () => {
      isScrolling.value = true;
    },
    onEndDrag: () => {
      isScrolling.value = false;
    },
  });

  // Pan gesture for card swipe (left/right)
  const panGesture = Gesture.Pan()
    .enabled(isTopCard)
    .activeOffsetX([-10, 10])
    .failOffsetY([-100, 100])
    .onStart((event) => {
      if (!isTopCard) return;
      translateX.value = 0;
      translateY.value = 0;
    })
    .onUpdate((event) => {
      if (!isTopCard) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (!isTopCard) return;
      
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;

      if (shouldSwipeLeft || shouldSwipeRight) {
        const direction = shouldSwipeLeft ? 'left' : 'right';
        const targetX = shouldSwipeLeft ? -SCREEN_WIDTH * 1.5 : SCREEN_WIDTH * 1.5;
        
        translateX.value = withTiming(targetX, { duration: 400 });
        translateY.value = withTiming(event.translationY, { duration: 400 });
        opacity.value = withTiming(0, { duration: 350 }, () => {
          runOnJS(onSwipeComplete)(direction);
        });
      } else {
        translateX.value = withSpring(0, { damping: 22, stiffness: 140 });
        translateY.value = withSpring(0, { damping: 22, stiffness: 140 });
      }
    });

  useAnimatedReaction(
    () => isTopCard,
    (isTop) => {
      if (isTop) {
        scale.value = withSpring(1, { damping: 25, stiffness: 150 });
        opacity.value = withSpring(1, { damping: 25, stiffness: 150 });
        translateY.value = withSpring(0, { damping: 25, stiffness: 150 });
      } else {
        scale.value = withSpring(stackScale, { damping: 25, stiffness: 150 });
        opacity.value = withSpring(stackOpacity, { damping: 25, stiffness: 150 });
        translateY.value = withSpring(-stackOffset, { damping: 25, stiffness: 150 });
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

      const response = await postApiCall(
        'POST',
        'CONNECTIONS',
        'SEND',
        { target_user_id: targetUserId },
        accessToken,
      );

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

  const rawData = profile.rawData || {};
  const profilePhoto = rawData.profile_photo || rawData.profile_picture || profile.images?.[0];
  const bannerImage = profile.images && profile.images.length > 0 
    ? profile.images[0] 
    : null;
  const allImages = profile.images || [];
  const [accountType, setAccountType] = React.useState<'My profile' | 'Share profile'>('My profile');

  const staticZIndex = isTopCard ? 1000 : 100 - index;


  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, cardStyle, { zIndex: staticZIndex }]}>
        {/* Scrollable Container with Image and Details */}
        <Animated.ScrollView
          style={styles.cardScrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          onContentSizeChange={(width, height) => {
            contentHeight.value = height;
          }}
          onLayout={(event) => {
            scrollViewHeight.value = event.nativeEvent.layout.height;
          }}
          bounces={true}
        >
          {/* Fixed Banner Background */}
          <ImageBackground
            source={
              bannerImage
                ? { uri: bannerImage }
                : require('../../../assets/girl.png')
            }
            style={styles.fixedBannerBackground}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
              style={styles.bannerGradient}
            />
            
            {/* Name and Account Buttons Overlay on Banner */}
            <View style={styles.bannerOverlayContent}>
              {/* Thumbnail with + icon and Name */}
              <View style={styles.bannerProfileInfoContainer}>
                <View style={styles.thumbnailContainer}>
                  <Image
                    source={
                      profilePhoto
                        ? { uri: profilePhoto }
                        : require('../../../assets/user.png')
                    }
                    style={styles.thumbnailPicture}
                    resizeMode="cover"
                  />
                  <View style={styles.plusIconContainer}>
                    <Image source={Plusicon} style={styles.plusIcon} />
                  </View>
                </View>
                
                {/* Name and Verified Badge */}
                <View style={styles.bannerNameContainer}>
                  <Text style={styles.bannerNameText}>
                    {profile.name || rawData.first_name || rawData.name || 'Unknown'}
                  </Text>
                  {rawData.is_verified && (
                    <Icon name="checkmark-circle" size={18} color="#1DA1F2" style={styles.verifiedIcon} />
                  )}
                </View>
              </View>

              {/* Account Type Buttons */}
              <View style={styles.accountButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.accountButton,
                    accountType === 'My profile' && styles.accountButtonActive,
                  ]}
                  onPress={() => setAccountType('My profile')}
                >
                  <Text
                    style={[
                      styles.accountButtonText,
                      accountType === 'My profile' && styles.accountButtonTextActive,
                    ]}
                  >
                    My profile
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.accountButton,
                    accountType === 'Share profile' && styles.accountButtonActive,
                  ]}
                  onPress={() => setAccountType('Share profile')}
                >
                  <Text
                    style={[
                      styles.accountButtonText,
                      accountType === 'Share profile' && styles.accountButtonTextActive,
                    ]}
                  >
                    Share profile
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          {/* Header Over Banner - Fixed */}
          {isTopCard && (
            <View style={styles.headerOverBanner}>
              <View style={styles.headerCenter}>
                <TouchableOpacity style={styles.headerShareButton}>
                  <Icon name="arrow-up" size={20} color="#FFFFFF" />
                  <Text style={styles.headerShareText}>Share</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.headerIcon}>
                  <Icon name="create-outline" size={26} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIcon}>
                  <Icon name="settings-outline" size={26} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Profile Picture Section - Scrollable */}
          <View style={styles.profilePictureSection}>
            {/* Username and Followers on Same Line */}
            {rawData.username && (
              <View style={styles.usernameFollowersContainer}>
                <Text style={styles.usernameFollowersText}>
                  {rawData.username} {rawData.followers_count ? `• ${rawData.followers_count} followers` : ''}
                </Text>
              </View>
            )}
          </View>

          {/* Location Bar */}
          {profile.location && (
            <View style={styles.locationBarContainer}>
              <Icon name="location-outline" size={18} color="#FFFFFF" />
              <Text style={styles.locationBarText}>{profile.location}</Text>
            </View>
          )}

          {/* Personal Details */}
          {rawData.personalDetails && (
            <View style={styles.personalDetailsContainer}>
              <Text style={styles.personalDetailsText}>{rawData.personalDetails}</Text>
              <View style={styles.purpleVIcon}>
                <Text style={styles.purpleVText}>V</Text>
              </View>
            </View>
          )}

          {/* Details Section - White background container */}
          <View style={styles.detailsContainer}>
            {/* My Bio Section */}
            {(profile.bio || rawData.bio) && (
              <View style={styles.bioCard}>
                <Text style={styles.sectionTitle}>My bio</Text>
                <Text style={styles.bioText}>{profile.bio || rawData.bio}</Text>
              </View>
            )}

            {/* About me Section - Basic Info */}
            {(() => {
              const tags: React.ReactElement[] = [];
              
              // Height
              if (rawData.height_cm && rawData.height_cm !== null) {
                tags.push(
                  <View key="height" style={styles.tag}>
                    <Icon name="resize-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{rawData.height_cm} cm</Text>
                  </View>
                );
              }
              
              // Gender
              if (rawData.gender && rawData.gender.trim() !== '') {
                tags.push(
                  <View key="gender" style={styles.tag}>
                    <Icon name="person-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{rawData.gender}</Text>
                  </View>
                );
              }
              
              // Pronouns
              if (rawData.pronouns && rawData.pronouns.trim() !== '') {
                tags.push(
                  <View key="pronouns" style={styles.tag}>
                    <Icon name="person-circle-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{rawData.pronouns}</Text>
                  </View>
                );
              }
              
              // Age
              if (profile.age && profile.age > 0) {
                tags.push(
                  <View key="age" style={styles.tag}>
                    <Icon name="calendar-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{profile.age}</Text>
                  </View>
                );
              }
              
              // Zodiac sign
              if (rawData.zodiac_sign && rawData.zodiac_sign.trim() !== '') {
                tags.push(
                  <View key="zodiac" style={styles.tag}>
                    <Icon name="star-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{rawData.zodiac_sign}</Text>
                  </View>
                );
              }
              
              if (tags.length === 0) return null;
              
              return (
                <View style={styles.aboutCard}>
                  <Text style={styles.sectionTitle}>About me</Text>
                  <View style={styles.tagsContainer}>
                    {tags}
                  </View>
                </View>
              );
            })()}

            {/* Lifestyle Section */}
            {(() => {
              const tags: React.ReactElement[] = [];
              
              // Drinking
              if (rawData.drinking && rawData.drinking.trim() !== '') {
                tags.push(
                  <View key="drinking" style={styles.tag}>
                    <Icon name="wine-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{rawData.drinking}</Text>
                  </View>
                );
              }
              
              // Smoking
              if (rawData.smoking && rawData.smoking.trim() !== '') {
                tags.push(
                  <View key="smoking" style={styles.tag}>
                    <Icon name="create-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{rawData.smoking}</Text>
                  </View>
                );
              }
              
              if (tags.length === 0) return null;
              
              return (
                <View style={styles.aboutCard}>
                  <Text style={styles.sectionTitle}>Lifestyle</Text>
                  {/* <View style={styles.tagsContainer}>
                    {qualities.map((quality: string, index: number) => (
                      <View key={index} style={styles.pillTag}>
                        <Icon name="search-outline" size={16} color="#000000" style={styles.tagIcon} />
                        <Text style={styles.pillTagText}>{quality}</Text>
                      </View>
                    ))}
                  </View> */}
                </View>
              );
            })()}

            {/* Images Gallery - 1 per row, full width */}
            <View style={styles.imagesContainer}>
              {allImages.length > 0 ? (
                allImages.map((imageUrl: string, index: number) => {
                  return (
                    <View key={index} style={styles.imageItem}>
                      <Image
                        source={
                          imageUrl && typeof imageUrl === 'string'
                            ? { uri: imageUrl }
                            : require('../../../assets/user.png')
                        }
                        style={styles.gridImage}
                        resizeMode="cover"
                      />
                    </View>
                  );
                })
              ) : (
                <View style={styles.noImagesContainer}>
                  <Text style={styles.noImagesText}>No images yet</Text>
                </View>
              )}
            </View>

            {/* Comment Button below Images */}
            {allImages.length > 0 && (
              <View style={styles.commentButtonContainer}>
                <TouchableOpacity style={styles.commentButton}>
                  <Icon name="chatbubble-ellipses-outline" size={18} color="#000000" />
                  <Text style={styles.commentButtonText}>Comment</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Education & Career Section */}
            {rawData.currently && rawData.currently.trim() !== '' && (
              <View style={styles.aboutCard}>
                <Text style={styles.sectionTitle}>Education & Career</Text>
                <View style={styles.tagsContainer}>
                  <View style={styles.tag}>
                    <Icon name="school-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{rawData.currently}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* My interests Section */}
            {(() => {
              const tags: React.ReactElement[] = [];
              
              // Hobbies
              if (rawData.hobbies && Array.isArray(rawData.hobbies) && rawData.hobbies.length > 0) {
                rawData.hobbies.forEach((hobby: string, idx: number) => {
                  if (hobby && hobby.trim() !== '') {
                    tags.push(
                      <View key={`hobby-${idx}`} style={styles.tag}>
                        <Text style={styles.tagText}>{hobby}</Text>
                      </View>
                    );
                  }
                });
              }
              
              // Activity Interests
              if (rawData.activity_interests && Array.isArray(rawData.activity_interests) && rawData.activity_interests.length > 0) {
                rawData.activity_interests.forEach((interest: string, idx: number) => {
                  if (interest && interest.trim() !== '') {
                    tags.push(
                      <View key={`activity-${idx}`} style={styles.tag}>
                        <Text style={styles.tagText}>{interest}</Text>
                      </View>
                    );
                  }
                });
              }
              
              if (tags.length === 0) return null;
              
              return (
                <View style={styles.aboutCard}>
                  <Text style={styles.sectionTitle}>Interests</Text>
                  <View style={styles.tagsContainer}>
                    {tags}
                  </View>
                </View>
              );
            })()}

            {/* Values Section */}
            {(() => {
              const tags: React.ReactElement[] = [];
              
              // Religion
              if (rawData.religion && rawData.religion.trim() !== '') {
                tags.push(
                  <View key="religion" style={styles.tag}>
                    <Icon name="happy-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{rawData.religion}</Text>
                  </View>
                );
              }
              
              // Causes & Communities
              if (rawData.causes_communities && Array.isArray(rawData.causes_communities) && rawData.causes_communities.length > 0) {
                rawData.causes_communities.forEach((cause: string, idx: number) => {
                  if (cause && cause.trim() !== '') {
                    tags.push(
                      <View key={`cause-${idx}`} style={styles.tag}>
                        <Icon name="people-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                        <Text style={styles.tagText}>{cause}</Text>
                      </View>
                    );
                  }
                });
              }
              
              // Qualities
              if (rawData.qualities && Array.isArray(rawData.qualities) && rawData.qualities.length > 0) {
                rawData.qualities.forEach((quality: string, idx: number) => {
                  if (quality && quality.trim() !== '') {
                    tags.push(
                      <View key={`quality-${idx}`} style={styles.tag}>
                        <Icon name="sparkles-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                        <Text style={styles.tagText}>{quality}</Text>
                      </View>
                    );
                  }
                });
              }
              
              if (tags.length === 0) return null;
              
              return (
                <View style={styles.aboutCard}>
                  <Text style={styles.sectionTitle}>Values</Text>
                  <View style={styles.tagsContainer}>
                    {tags}
                  </View>
                </View>
              );
            })()}

            {/* Looking for Section */}
            {rawData.connection_goal && rawData.connection_goal.trim() !== '' && (
              <View style={styles.aboutCard}>
                <Text style={styles.sectionTitle}>Looking for</Text>
                <View style={styles.tagsContainer}>
                  <View style={styles.tag}>
                    <Icon name="heart-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{rawData.connection_goal}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Languages Section */}
            {rawData.known_languages && Array.isArray(rawData.known_languages) && rawData.known_languages.length > 0 && (
              <View style={styles.aboutCard}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={styles.tagsContainer}>
                  {rawData.known_languages.map((lang: string, idx: number) => {
                    if (lang && lang.trim() !== '') {
                      return (
                        <View key={`lang-${idx}`} style={styles.tag}>
                          <Icon name="language-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                          <Text style={styles.tagText}>{lang}</Text>
                        </View>
                      );
                    }
                    return null;
                  })}
                </View>
              </View>
            )}
          </View>

            {/* Bottom Spacing */}
            <View style={{ height: 40 }} />
      
        </Animated.ScrollView>
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
  const [isLoading, setIsLoading] = useState(true);

  const handleSwipeComplete = useCallback(async (direction: 'left' | 'right') => {
    const currentProfile = profiles[currentIndex];
    
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken && currentProfile) {
        const actionPayload = {
          target_user_id: parseInt(currentProfile.id, 10),
          action: direction === 'right' ? 'like' : 'dislike',
        };
        
        console.log('=== SWIPE ACTION API Call (handleSwipeComplete) ===');
        console.log('Payload:', JSON.stringify(actionPayload, null, 2));
        
        const actionResponse = await postApiCall(
          'POST',
          'SWIPE',
          'ACTION',
          actionPayload,
          accessToken,
        );

        console.log('=== SWIPE ACTION API Response (handleSwipeComplete) ===');
        console.log('Full Response:', JSON.stringify(actionResponse, null, 2));
        console.log('Response Status Code:', actionResponse?.statusCode);
        console.log('Response Error:', actionResponse?.error);
        console.log('Response Data:', actionResponse?.response);
        console.log('======================================================');

        if (actionResponse?.response?.match === true) {
            Alert.alert(
              '🎉 It\'s a Match!',
            actionResponse?.response?.message || 'You both liked each other!',
            );
        }
      }
    } catch (error) {
      console.error('Error calling swipe action API:', error);
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 150);
  }, [currentIndex, profiles]);

  const transformUserToProfile = (user: any): Profile => {
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Unknown';

    const images: string[] = [];
    if (user.profile_photo) images.push(user.profile_photo);
    if (user.live_photo) images.push(user.live_photo);
    if (Array.isArray(user.images)) images.push(...user.images);
    if (Array.isArray(user.photos)) images.push(...user.photos);

    let interests: string[] = [];
    if (Array.isArray(user.hobbies)) {
      interests = user.hobbies.filter(Boolean);
    } else if (user.hobbies && typeof user.hobbies === 'object') {
      interests = Object.values(user.hobbies).flat().filter(Boolean) as string[];
    } else if (Array.isArray(user.interests)) {
      interests = user.interests.filter(Boolean);
    }

    return {
      id: user.id?.toString() || '',
      name: fullName || 'Unknown',
      age: typeof user.age === 'number' ? user.age : 0,
      images: images.length > 0 ? images : [],
      job: (user.job || user.profession || '').toString(),
      profession: (user.profession || user.job || '').toString(),
      education: (user.education || '').toString(),
      location: (user.location || '').toString(),
      distance: typeof user.distance_km === 'number' ? user.distance_km : 0,
      verified: Boolean(user.verified),
      isNew: Boolean(user.is_new),
      interests: Array.isArray(interests) ? interests : [],
      bio: (user.bio || '').toString(),
      rawData: user,
    };
  };

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

      const response = await getApiCall('SWIPE', 'GET_USERS', accessToken, { limit: 15 });
      
      // Console log the full API response
      console.log('=== GET_USERS API Response ===');
      console.log('Full Response Object:', JSON.stringify(response, null, 2));
      console.log('Response Status Code:', response?.statusCode);
      console.log('Response Error:', response?.error);
      console.log('Response Data:', response?.response);
      console.log('Response Type:', typeof response?.response);
      console.log('Is Array:', Array.isArray(response?.response));
      if (Array.isArray(response?.response)) {
        console.log('Number of users:', response.response.length);
        response.response.forEach((user: any, index: number) => {
          console.log(`\n--- User ${index + 1} ---`);
          console.log('Raw User Data:', JSON.stringify(user, null, 2));
          console.log('User Keys:', Object.keys(user || {}));
        });
      }
      console.log('===================================');
      
      if (response?.error) {
        const errorMessage = 
          response?.response?.message || 
          response?.response?.error ||
          'Failed to load users. Please try again.';
        if (isInitialLoad) {
          Alert.alert('Error', errorMessage);
          setProfiles([]);
        }
      } else if (response?.response) {
        const apiProfiles: Profile[] = Array.isArray(response.response)
          ? response.response.map((user: any) => {
              const transformed = transformUserToProfile(user);
              console.log('Transformed Profile:', JSON.stringify(transformed, null, 2));
              return transformed;
            })
          : [];
        
        console.log('=== Transformed Profiles Summary ===');
        console.log('Total Profiles:', apiProfiles.length);
        apiProfiles.forEach((profile, idx) => {
          console.log(`Profile ${idx + 1}:`, {
            id: profile.id,
            name: profile.name,
            age: profile.age,
            images: profile.images?.length || 0,
            bio: profile.bio?.substring(0, 50) + '...',
            rawDataKeys: Object.keys(profile.rawData || {}),
          });
        });
        console.log('====================================');
        
        if (isInitialLoad) {
          setProfiles(apiProfiles);
        } else {
          setProfiles((prevProfiles) => {
            const existingIds = new Set(prevProfiles.map(p => p.id));
            const newProfiles = apiProfiles.filter(p => !existingIds.has(p.id));
            if (newProfiles.length > 0) {
              console.log(`✅ Found ${newProfiles.length} new user(s) - adding to swipes`);
              newProfiles.forEach((profile, idx) => {
                console.log(`  - New user ${idx + 1}: ${profile.name} (ID: ${profile.id})`);
              });
              return [...prevProfiles, ...newProfiles];
            } else {
              console.log('ℹ️ No new users found in this poll');
              return prevProfiles;
            }
          });
        }
      } else {
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

  useEffect(() => {
    // Initial load
    fetchUsers(true);
    
    // Poll for new users every 50 seconds
    const pollInterval = setInterval(() => {
      console.log('🔄 Polling for new users...');
      fetchUsers(false);
    }, 50000); // 50 seconds = 50000ms
    
    // Cleanup interval on unmount
    return () => {
      console.log('🧹 Cleaning up polling interval');
      clearInterval(pollInterval);
    };
  }, [fetchUsers]);

  const visibleCards = profiles.slice(currentIndex, currentIndex + 2);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>snixx</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <View style={styles.menuIcon}>
            <View style={styles.menuIconRow}>
              <View style={styles.menuIconCircle} />
              <View style={styles.menuIconDash} />
            </View>
            <View style={styles.menuIconRow}>
              <View style={styles.menuIconDash} />
              <View style={styles.menuIconCircle} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Card Stack */}
      <View style={styles.cardStackContainer}>
        {visibleCards.map((profile, index) => {
          const isTopCard = index === 0;
          const stackOffset = 20;
          const stackScale = 0.95;
          const stackOpacity = 0.8;

          return (
            <SwipeableCard
              key={`${profile.id}-${currentIndex + index}`}
              profile={profile}
              index={index}
              onSwipeComplete={handleSwipeComplete}
              isTopCard={isTopCard}
              stackOffset={stackOffset}
              stackScale={stackScale}
              stackOpacity={stackOpacity}
            />
          );
        }).reverse()}
      </View>

   
    </GestureHandlerRootView>
  );
};

export default PeopleScreen;