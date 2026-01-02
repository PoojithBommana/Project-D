import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { DiscoverStackParamList } from '../../../navigation/DiscoverStackNavigator';
import { DiscoverProfile } from '../../../types/Discover';
import { hp, wp, rf } from '../../../utils/responsive';
import styles from '../../../styles/DiscoverProfileDetailsScreenStyles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  navigation: NativeStackNavigationProp<DiscoverStackParamList, 'DiscoverProfileDetailsScreen'>;
  route: {
    params: {
      profile: DiscoverProfile;
      context?: {
        source: 'top_snixxed' | 'ai_picks' | 'vibe' | 'nearby' | 'style_match' | 'conversation_starter' | 'new_users' | 'search';
        vibeId?: string;
        conversationStarterId?: string;
        searchQuery?: string;
      };
    };
  };
}

const DiscoverProfileDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { profile, context } = route.params;
  const [readMore, setReadMore] = useState(false);

  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const backgroundOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  useEffect(() => {
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
    : require('../../../assets/user.png');

  const getContextText = () => {
    if (!context) return null;

    const contextTexts = {
      top_snixxed: 'Found via Top Snixxed',
      ai_picks: 'Found via AI Picks',
      vibe: 'Found via Vibe Discovery',
      nearby: 'Found via Nearby & Active',
      style_match: 'Found via Style Matches',
      conversation_starter: 'Found via Conversation Starter',
      new_users: 'Found via New on Snixx',
      search: `Found via Search: "${context.searchQuery}"`,
    };

    return contextTexts[context.source] || null;
  };

  const handleSnixx = () => {
    // TODO: Implement SNIXX action
    Alert.alert('SNIXX', `You SNIXXED ${profile.name}!`);
    navigation.goBack();
  };

  const handlePass = () => {
    // TODO: Implement PASS action
    navigation.goBack();
  };

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

      <Animated.View style={[styles.scrollViewContainer, contentAnimatedStyle]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Navigation Bar */}
          <View style={styles.topNavBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Icon name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <Image source={primaryImage} style={styles.profileImage} resizeMode="cover" />
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfoContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {profile.name.split(' ')[0]}, {profile.age}
              </Text>
              {profile.verified && (
                <Icon name="checkmark-circle" size={24} color="#1DA1F2" style={styles.verifiedIcon} />
              )}
            </View>

            {profile.location && (
              <View style={styles.locationContainer}>
                <Icon name="location" size={16} color="#FFFFFF" />
                <Text style={styles.location}>{profile.location}</Text>
                {profile.distance && (
                  <Text style={styles.distance}> • {profile.distance} km away</Text>
                )}
              </View>
            )}

            {context && getContextText() && (
              <View style={styles.contextContainer}>
                <Text style={styles.contextText}>{getContextText()}</Text>
              </View>
            )}

            {/* Bio */}
            {profile.bio && (
              <View style={styles.bioContainer}>
                <Text style={styles.bio} numberOfLines={readMore ? undefined : 3}>
                  {profile.bio}
                </Text>
                {profile.bio.length > 100 && (
                  <TouchableOpacity onPress={() => setReadMore(!readMore)}>
                    <Text style={styles.readMoreText}>
                      {readMore ? 'Read less' : 'Read more'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Additional Info */}
            {profile.job && (
              <View style={styles.infoRow}>
                <Icon name="briefcase" size={18} color="#FFFFFF" />
                <Text style={styles.infoText}>{profile.job}</Text>
              </View>
            )}

            {profile.education && (
              <View style={styles.infoRow}>
                <Icon name="school" size={18} color="#FFFFFF" />
                <Text style={styles.infoText}>{profile.education}</Text>
              </View>
            )}

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <View style={styles.interestsContainer}>
                <Text style={styles.sectionTitle}>Interests</Text>
                <View style={styles.interestsList}>
                  {profile.interests.map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Style Tags */}
            {profile.styleTags && profile.styleTags.length > 0 && (
              <View style={styles.styleContainer}>
                <Text style={styles.sectionTitle}>Style</Text>
                <View style={styles.styleList}>
                  {profile.styleTags.map((style, index) => (
                    <View key={index} style={styles.styleTag}>
                      <Text style={styles.styleText}>{style}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.passButton]}
            onPress={handlePass}
            activeOpacity={0.8}
          >
            <Text style={styles.passButtonText}>PASS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.snixxButton]}
            onPress={handleSnixx}
            activeOpacity={0.8}
          >
            <Text style={styles.snixxButtonText}>SNIXX</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default DiscoverProfileDetailsScreen;

