import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
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
  const { profile } = route.params;
  const [readMore, setReadMore] = useState(false);

  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const backgroundOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  useEffect(() => {
    // Smooth fade and scale entrance animation with staggered timing
    backgroundOpacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });

    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
    
    scale.value = withSpring(1, {
      damping: 22,
      stiffness: 100,
      mass: 0.9,
    });

    contentTranslateY.value = withSpring(0, {
      damping: 22,
      stiffness: 100,
      mass: 0.9,
    });
  }, []);

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

  const primaryImage = profile.images && profile.images.length > 0 
    ? { uri: profile.images[0] } 
    : require('../../../assets/girl.png');

  const genre = profile.interests && profile.interests.length > 0 
    ? profile.interests[0] 
    : 'Dating';

  const displayBio = profile.bio || 'No bio available.';

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Blurred Background */}
      <Animated.View style={[StyleSheet.absoluteFill, backgroundAnimatedStyle]}>
        <Image
          source={primaryImage}
          style={styles.backgroundImage}
          resizeMode="cover"
          blurRadius={20}
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
        >
        {/* Top Navigation Bar */}
        <View style={styles.topNavBar}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
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
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              style={styles.heroGradient}
            />
            
            {/* Name Overlay */}
            <View style={styles.nameOverlay}>
              <Text style={styles.heroName}>{profile.name.toUpperCase()}</Text>
            </View>

            {/* Action Button */}
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <Icon name="play-circle" size={wp(24)} color="#000000" />
            
            </TouchableOpacity>
          </View>

          <LiquidButton title="View Photos" />

          {/* Profile Details Section */}
          <View style={styles.detailsSection}>
            {/* Title */}
            <Text style={styles.title}>
              {profile.name}, {profile.age}
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
  );
};

export default ProfileDetailsScreen;
