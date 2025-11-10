import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Profile } from '../types/Profile';
import styles from '../styles/ProfileCardStyles';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;

interface ProfileCardProps {
  profile: Profile;
  onActionPress?: (action: 'like' | 'pass' | 'superlike') => void;
}

/**
 * ProfileCard Component
 * 
 * Displays a single user profile card with image, name, age, and action buttons.
 * Designed to be used within a swipeable deck.
 * 
 * Features:
 * - Profile image display
 * - User name and age
 * - Action buttons (like, super like, pass)
 * - Future-ready for additional profile information
 */
const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onActionPress }) => {
  const primaryImage = profile.images && profile.images.length > 0 ? profile.images[0] : null;

  return (
    <View style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
      {/* Profile Image */}
      {primaryImage ? (
        <View style={styles.profileImage} pointerEvents="none">
          <Image 
            source={{ uri: primaryImage }} 
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View style={styles.placeholderImage} pointerEvents="none">
          <Icon name="user" size={80} color="#CCCCCC" />
        </View>
      )}

      {/* Gradient Overlay for better text readability */}
      <View style={styles.gradientOverlay} pointerEvents="none" />

      {/* Profile Info Overlay */}
      <View style={styles.infoContainer} pointerEvents="none">
        {/* New Here Badge */}
        {profile.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>New here</Text>
          </View>
        )}
        
        {/* Name and Age */}
        <View style={styles.nameAgeContainer}>
          <Text style={styles.nameText}>
            {profile.name.split(' ')[0]}, {profile.age}
          </Text>
          {profile.verified && (
            <Icon name="check-circle" size={20} color="#FFFFFF" style={styles.verifiedIcon} />
          )}
        </View>
        
        {/* Job */}
        {profile.job && (
          <View style={styles.infoRow}>
            <Icon name="briefcase" size={14} color="#FFFFFF" style={styles.infoIcon} />
            <Text style={styles.infoText}>{profile.job}</Text>
          </View>
        )}
        
        {/* Education */}
        {profile.education && (
          <View style={styles.infoRow}>
            <Icon name="graduation-cap" size={14} color="#FFFFFF" style={styles.infoIcon} />
            <Text style={styles.infoText}>{profile.education}</Text>
          </View>
        )}
        
        {/* Distance */}
        {profile.distance && (
          <Text style={styles.distanceText}>
            {profile.distance} km away
          </Text>
        )}
      </View>

      {/* Upload/Share Button (Top Right) */}
      <TouchableOpacity
        style={styles.uploadButton}
        activeOpacity={0.7}
      >
        <Icon name="arrow-up" size={20} color="#000000" />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileCard;

