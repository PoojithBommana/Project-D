import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DiscoverProfile } from '../../../../types/Discover';
import { wp, hp, rf } from '../../../../utils/responsive';

const CARD_WIDTH = Dimensions.get('window').width * 0.75;
const CARD_HEIGHT = CARD_WIDTH * 1.3;

interface DiscoverProfileCardProps {
  profile: DiscoverProfile;
  onPress: () => void;
  variant?: 'default' | 'topSnixxed' | 'aiPick' | 'nearby' | 'styleMatch' | 'new';
}

export default function DiscoverProfileCard({
  profile,
  onPress,
  variant = 'default',
}: DiscoverProfileCardProps) {
  const primaryImage = profile.images && profile.images.length > 0 ? profile.images[0] : null;

  const getStatusBadge = () => {
    if (!profile.statusBadge) return null;

    const badges = {
      trending: { text: 'Trending Today', icon: '🔥', color: '#FDFF8D' },
      growing: { text: 'Fastest Growing', icon: '⚡', color: '#FDFF8D' },
      popular: { text: 'Popular This Week', icon: '🌟', color: '#FDFF8D' },
    };

    const badge = badges[profile.statusBadge];
    if (!badge) return null;

    return (
      <View style={[styles.statusBadge, { backgroundColor: badge.color }]}>
        <Text style={styles.statusBadgeIcon}>{badge.icon}</Text>
        <Text style={styles.statusBadgeText}>{badge.text}</Text>
      </View>
    );
  };

  const getAIPickBadge = () => {
    if (variant !== 'aiPick') return null;
    return (
      <View style={styles.aiPickBadge}>
        <Text style={styles.aiPickIcon}>✨</Text>
        <Text style={styles.aiPickText}>AI Pick</Text>
      </View>
    );
  };

  const getNewBadge = () => {
    if (variant !== 'new' || !profile.isNew) return null;
    return (
      <View style={styles.newBadge}>
        <Text style={styles.newBadgeIcon}>✨</Text>
        <Text style={styles.newBadgeText}>New</Text>
      </View>
    );
  };

  const getActiveIndicator = () => {
    if (variant !== 'nearby') return null;
    return (
      <View
        style={[
          styles.activeIndicator,
          { backgroundColor: profile.isActive ? '#10B981' : '#9CA3AF' },
        ]}
      />
    );
  };

  const getStyleMatchBadge = () => {
    if (variant !== 'styleMatch' || !profile.styleMatch) return null;
    return (
      <View style={styles.styleMatchBadge}>
        <Text style={styles.styleMatchText}>{profile.styleMatch}% Match</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {primaryImage ? (
        <Image source={{ uri: primaryImage }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholderImage}>
          <Icon name="person" size={60} color="#CCCCCC" />
        </View>
      )}

      <View style={styles.gradientOverlay} />

      {/* Badges */}
      {getStatusBadge()}
      {getAIPickBadge()}
      {getNewBadge()}
      {getActiveIndicator()}
      {getStyleMatchBadge()}

      {/* Profile Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {variant === 'aiPick' || variant === 'styleMatch'
            ? `${profile.name}, ${profile.age}`
            : profile.name}
        </Text>
        {profile.location && (
          <View style={styles.locationContainer}>
            <Icon name="location" size={14} color="#FFFFFF" />
            <Text style={styles.location}>{profile.location}</Text>
          </View>
        )}
        {variant === 'topSnixxed' && profile.snixxedCount !== undefined && (
          <Text style={styles.snixxedCount}>{profile.snixxedCount} SNIXXED</Text>
        )}
        {variant === 'nearby' && profile.distance !== undefined && (
          <View style={styles.distanceContainer}>
            <Icon name="paper-plane" size={12} color="#FFFFFF" />
            <Text style={styles.distance}>{profile.distance} km</Text>
          </View>
        )}
        {variant === 'aiPick' && profile.vibeTags && profile.vibeTags.length > 0 && (
          <View style={styles.tagsContainer}>
            {profile.vibeTags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        {variant === 'styleMatch' && profile.styleTags && profile.styleTags.length > 0 && (
          <View style={styles.styleTagContainer}>
            <Icon name="shirt" size={12} color="#FFFFFF" />
            <Text style={styles.styleTag}>{profile.styleTags[0]}</Text>
          </View>
        )}
        {variant === 'new' && profile.joinedDate && (
          <Text style={styles.joinedDate}>Joined {profile.joinedDate}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: rf(20),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginRight: wp(12),
    borderWidth: 2,
    borderColor: '#FEFFAF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  statusBadge: {
    position: 'absolute',
    top: hp(12),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: rf(20),
    gap: wp(4),
  },
  statusBadgeIcon: {
    fontSize: rf(14),
  },
  statusBadgeText: {
    fontSize: rf(12),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#000000',
    includeFontPadding: false,
  },
  aiPickBadge: {
    position: 'absolute',
    top: hp(12),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: rf(20),
    backgroundColor: '#FDFF8D',
    gap: wp(4),
  },
  aiPickIcon: {
    fontSize: rf(14),
  },
  aiPickText: {
    fontSize: rf(12),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#000000',
    includeFontPadding: false,
  },
  newBadge: {
    position: 'absolute',
    top: hp(12),
    left: wp(12),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(10),
    paddingVertical: hp(4),
    borderRadius: rf(12),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    gap: wp(4),
  },
  newBadgeIcon: {
    fontSize: rf(12),
  },
  newBadgeText: {
    fontSize: rf(11),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#000000',
    includeFontPadding: false,
  },
  activeIndicator: {
    position: 'absolute',
    top: hp(12),
    right: wp(12),
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  styleMatchBadge: {
    position: 'absolute',
    top: hp(12),
    right: wp(12),
    paddingHorizontal: wp(10),
    paddingVertical: hp(6),
    borderRadius: rf(16),
    backgroundColor: '#FDFF8D',
  },
  styleMatchText: {
    fontSize: rf(12),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#000000',
    includeFontPadding: false,
  },
  infoContainer: {
    position: 'absolute',
    bottom: hp(16),
    left: wp(16),
    right: wp(16),
  },
  name: {
    fontSize: rf(20),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: hp(4),
    includeFontPadding: false,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
    marginBottom: hp(4),
  },
  location: {
    fontSize: rf(13),
    fontFamily: 'GTMaruRegular',
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  snixxedCount: {
    fontSize: rf(12),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#FDFF8D',
    marginTop: hp(4),
    includeFontPadding: false,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
    marginTop: hp(4),
  },
  distance: {
    fontSize: rf(12),
    fontFamily: 'GTMaruRegular',
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(6),
    marginTop: hp(8),
  },
  tag: {
    paddingHorizontal: wp(10),
    paddingVertical: hp(4),
    borderRadius: rf(12),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tagText: {
    fontSize: rf(11),
    fontFamily: 'GTMaruMedium',
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  styleTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
    marginTop: hp(4),
  },
  styleTag: {
    fontSize: rf(12),
    fontFamily: 'GTMaruRegular',
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  joinedDate: {
    fontSize: rf(11),
    fontFamily: 'GTMaruRegular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: hp(4),
    includeFontPadding: false,
  },
});

