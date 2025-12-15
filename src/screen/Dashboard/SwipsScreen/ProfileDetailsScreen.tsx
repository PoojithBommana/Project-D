import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Profile } from '../../../types/Profile';
import { hp, wp } from '../../../utils/responsive';
import styles from './ProfileDetailsScreenStyles.tsx';
import LiquidButton from '../../../components/CustomButton';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params: {
      profile: Profile;
    };
  };
}

const ProfileDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const profile = route?.params?.profile;
  const [readMore, setReadMore] = useState(false);

  // Safety check - if no profile, go back
  useEffect(() => {
    if (!profile) {
      setTimeout(() => {
        navigation.goBack();
      }, 100);
    }
  }, [profile, navigation]);

  // Animation values - start from initial state for smooth entrance
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const backgroundOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  // Run entrance animation whenever the screen gains focus to avoid flicker on return
  useFocusEffect(
    useCallback(() => {
      opacity.value = 0;
      scale.value = 0.95;
      backgroundOpacity.value = 0;
      contentTranslateY.value = 50;

      opacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
      scale.value = withSpring(1, {
        damping: 20,
        stiffness: 90,
        mass: 0.8,
      });
      backgroundOpacity.value = withTiming(1, {
        duration: 350,
        easing: Easing.out(Easing.ease),
      });
      contentTranslateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
        mass: 0.8,
      });

      // No special cleanup needed; values will reset on next focus
      return () => {};
    }, [opacity, scale, backgroundOpacity, contentTranslateY]),
  );

  // Smooth exit animation before leaving screen to avoid flicker
  const runExitAnimation = useCallback(() => {
    opacity.value = withTiming(
      0,
      { duration: 220, easing: Easing.inOut(Easing.ease) },
      (finished) => {
        if (finished) {
          runOnJS(navigation.goBack)();
        }
      },
    );
    backgroundOpacity.value = withTiming(0, { duration: 180, easing: Easing.inOut(Easing.ease) });
    contentTranslateY.value = withTiming(30, { duration: 220, easing: Easing.inOut(Easing.ease) });
    scale.value = withTiming(0.96, { duration: 220, easing: Easing.inOut(Easing.ease) });
  }, [navigation, opacity, backgroundOpacity, contentTranslateY, scale]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  // Safe access to profile properties
  const primaryImage = profile?.images && profile.images.length > 0 
    ? { uri: profile.images[0] } 
    : require('../../../assets/girl.png');

  const genre = profile?.interests && profile.interests.length > 0 
    ? profile.interests[0] 
    : 'Dating';

  const displayBio = profile?.bio || 'No bio available.';

  // Always render container with black background, even if profile is missing
  return (
    <View style={styles.container}>
      {/* Black background layer to prevent white screen */}
      <View style={styles.blackBackgroundLayer} />
      
      {!profile ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <Animated.View style={[StyleSheet.absoluteFill, containerAnimatedStyle]}>
          {/* Blurred Background - only blurred image, no card */}
          <Animated.View style={[StyleSheet.absoluteFill, backgroundAnimatedStyle]}>
            <Image
              source={primaryImage}
              style={styles.backgroundImage}
              resizeMode="cover"
              blurRadius={25}
              defaultSource={require('../../../assets/girl.png')}
            />
            <View style={styles.backgroundOverlay} />
          </Animated.View>

          <Animated.View 
            style={[styles.scrollViewContainer, contentAnimatedStyle]}
          >
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={true}
              contentOffset={{ x: 0, y: 0 }}
            >
        {/* Top Navigation Bar */}
        <View style={styles.topNavBar}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={runExitAnimation}
            activeOpacity={0.7}
          >
            <BlurView
              blurType="dark"
              blurAmount={10}
              style={styles.backButtonBlur}
            >
              <Icon name="chevron-back" size={wp(24)} color="#FFFFFF" />
            </BlurView>
          </TouchableOpacity>

          {/* Right Side Tags */}
          <View style={styles.topTagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{genre}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>1h 30m</Text>
            </View>
            <View style={styles.tag}>
              <Icon name="star" size={wp(14)} color="#FFFFFF" />
              <Text style={styles.tagText}>7.9/10</Text>
            </View>
          </View>
        </View>

        {/* Main Content Card */}
        <View style={styles.contentCard}>
          {/* Hero Image Section */}
          <View style={styles.heroImageContainer}>
            <Image
              source={primaryImage}
              style={styles.heroImage}
              resizeMode="cover"
              defaultSource={require('../../../assets/girl.png')}
            />
            
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              style={styles.heroGradient}
            />
            
            {/* Name Overlay */}
            <View style={styles.nameOverlay}>
              <Text style={styles.heroName}>{(profile?.name || 'Profile').toUpperCase()}</Text>
            </View>

            {/* Action Button */}
           
          </View>

     

          {/* Profile Details Section */}
          <View style={styles.detailsSection}>
            {/* Title */}
            <Text style={styles.title}>
              {profile?.name || 'Unknown'}, {profile?.age || 'N/A'}
            </Text>

            {/* Description/Bio */}
            <Text style={styles.description} numberOfLines={readMore ? undefined : 4}>
              {displayBio}
            </Text>

            {/* Read More Link */}
            {displayBio.length > 150 && (
              <TouchableOpacity onPress={() => setReadMore(!readMore)}>
                <Text style={styles.readMoreText}>
                  {readMore ? 'Read Less' : 'Read More'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Additional Info */}
            {profile.profession && (
              <View style={styles.infoRow}>
                <Icon name="briefcase-outline" size={wp(18)} color="#FFFFFF" />
                <Text style={styles.infoText}>{profile.profession}</Text>
              </View>
            )}

            {profile.education && (
              <View style={styles.infoRow}>
                <Icon name="school-outline" size={wp(18)} color="#FFFFFF" />
                <Text style={styles.infoText}>{profile.education}</Text>
              </View>
            )}

            {profile.location && (
              <View style={styles.infoRow}>
                <Icon name="location-outline" size={wp(18)} color="#FFFFFF" />
                <Text style={styles.infoText}>{profile.location}</Text>
              </View>
            )}

            {profile.distance && (
              <View style={styles.infoRow}>
                <Icon name="location" size={wp(18)} color="#FFFFFF" />
                <Text style={styles.infoText}>{profile.distance} km away</Text>
              </View>
            )}
          </View>

          {/* Interests/Photos Section (Cast) */}
          {profile.interests && profile.interests.length > 0 && (
            <View style={styles.interestsSection}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.interestsScrollContent}
              >
                {profile.images && profile.images.slice(0, 6).map((imageUri, index) => (
                  <View key={index} style={styles.interestItem}>
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.interestImage}
                      resizeMode="cover"
                    />
                    {profile.interests && profile.interests[index] && (
                      <>
                        <Text style={styles.interestName} numberOfLines={1}>
                          {profile.interests[index]}
                        </Text>
                        <Text style={styles.interestRole} numberOfLines={1}>
                          Photo {index + 1}
                        </Text>
                      </>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

export default ProfileDetailsScreen;
