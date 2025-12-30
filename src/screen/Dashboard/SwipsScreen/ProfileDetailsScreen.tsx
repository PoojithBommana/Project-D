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

  // Get raw data if available (contains all backend fields)
  const rawData = (profile as any).rawData || profile;

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

  // Normalize key fields to safe string/number values for rendering
  const safeName = typeof profile.name === 'string' ? profile.name : '';
  const safeAge = typeof profile.age === 'number' ? profile.age : 0;
  const safeBio = typeof profile.bio === 'string'
    ? profile.bio
    : (typeof rawData?.bio === 'string' ? rawData.bio : '');
  const displayBio = safeBio || 'No bio available.';
  const safeProfession = typeof profile.profession === 'string' ? profile.profession : '';
  const safeEducation = typeof profile.education === 'string' ? profile.education : '';
  const safeLocation = typeof profile.location === 'string' ? profile.location : '';
  const safeDistance = typeof profile.distance === 'number' ? profile.distance : null;
  const connectionStatus = typeof rawData?.connection_status === 'string'
    ? rawData.connection_status
    : 'none';

  const primaryImage = profile.images && profile.images.length > 0 
    ? { uri: profile.images[0] } 
    : require('../../../assets/girl.png');

  // Get hobbies from raw data - handle both object and array formats
  const hobbies = rawData?.hobbies || profile.interests || [];
  const hobbiesObject = typeof hobbies === 'object' && !Array.isArray(hobbies) ? hobbies : null;
  const hobbiesArray = Array.isArray(hobbies)
    ? hobbies.filter((h) => typeof h === 'string')
    : hobbiesObject
      ? (Object.values(hobbiesObject).flat().filter((h) => typeof h === 'string') as string[])
      : [];

  const genre = hobbiesArray.length > 0 
    ? hobbiesArray[0] 
    : 'Dating';

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
            activeOpacity={0.8}
          >
            <BlurView
              blurType="light"
              blurAmount={12}
              style={styles.backButtonBlur}
              reducedTransparencyFallbackColor="rgba(255,255,255,0.85)"
              
            >
              <Text style={styles.backButtonText}>Back</Text>
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Hero Image Section - Separate Card */}
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
            <Text style={styles.heroName}>{safeName.toUpperCase()}</Text>
          </View>
        </View>

        {/* Profile Details Section */}
        <View style={styles.detailsSection}>
            {/* Title */}
            <Text style={styles.title}>
              {safeName || 'Unknown'}, {safeAge}
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
            {safeProfession && (
              <View style={styles.infoRow}>
                <Icon name="briefcase-outline" size={wp(18)} color="#FFFFFF" />
                <Text style={styles.infoText}>{safeProfession}</Text>
              </View>
            )}

            {safeEducation && (
              <View style={styles.infoRow}>
                <Icon name="school-outline" size={wp(18)} color="#FFFFFF" />
                <Text style={styles.infoText}>{safeEducation}</Text>
              </View>
            )}

            {safeLocation && (
              <View style={styles.infoRow}>
                <Icon name="location-outline" size={wp(18)} color="#FFFFFF" />
                <Text style={styles.infoText}>{safeLocation}</Text>
              </View>
            )}

            {typeof safeDistance === 'number' && safeDistance > 0 && (
              <View style={styles.infoRow}>
                <Icon name="location" size={wp(18)} color="#FFFFFF" />
                <Text style={styles.infoText}>{safeDistance} km away</Text>
              </View>
            )}

            {/* Connection Status */}
            {connectionStatus && connectionStatus !== 'none' && (
              <View style={styles.infoRow}>
                <Icon 
                  name={connectionStatus === 'connected' ? 'checkmark-circle' : 'time-outline'} 
                  size={wp(18)} 
                  color="#FFFFFF" 
                />
                <Text style={styles.infoText}>
                  {connectionStatus === 'connected' ? 'Connected' : 
                   connectionStatus === 'requested' ? 'Request Sent' :
                   connectionStatus === 'incoming_request' ? 'Request Received' : ''}
                </Text>
              </View>
            )}
          </View>

          {/* Hobbies/Interests Section */}
          {hobbiesArray.length > 0 && (
            <View style={styles.interestsSection}>
              <Text style={styles.sectionTitle}>Hobbies & Interests</Text>
              {hobbiesObject ? (
                // Display hobbies by category if it's an object
                <View style={{ paddingHorizontal: wp(20) }}>
                  {Object.entries(hobbiesObject).map(([category, items]: [string, any]) => (
                    <View key={category} style={{ marginBottom: hp(16) }}>
                      <Text style={[styles.sectionTitle, { fontSize: wp(18), marginBottom: hp(8), textTransform: 'capitalize', paddingHorizontal: 0 }]}>
                        {category}
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {Array.isArray(items) && items
                          .filter((item) => typeof item === 'string')
                          .map((item: string, idx: number) => (
                            <View key={idx} style={styles.hobbyTag}>
                              <Text style={styles.hobbyText}>{item}</Text>
                            </View>
                          ))}
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                // Display as simple list if it's an array
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: wp(20) }}>
                  {hobbiesArray
                    .filter((hobby) => typeof hobby === 'string')
                    .map((hobby: string, idx: number) => (
                      <View key={idx} style={styles.hobbyTag}>
                        <Text style={styles.hobbyText}>{hobby}</Text>
                      </View>
                    ))}
                </View>
              )}
            </View>
          )}

          {/* Photos Section */}
          {profile.images && profile.images.length > 0 && (
            <View style={styles.interestsSection}>
              <Text style={styles.sectionTitle}>Photos</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.interestsScrollContent}
              >
                {profile.images.map((imageUri: string, index: number) => (
                  <View key={index} style={styles.interestItem}>
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.interestImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.interestRole} numberOfLines={1}>
                      Photo {index + 1}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

export default ProfileDetailsScreen;