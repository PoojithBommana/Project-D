import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import discoverService from '../../../../services/DiscoverService';
import { VibeCategory } from '../../../../types/Discover';
import { wp, hp, rf } from '../../../../utils/responsive';

interface VibeDiscoverySectionProps {
  onVibePress: (vibeId: string) => void;
}

export default function VibeDiscoverySection({ onVibePress }: VibeDiscoverySectionProps) {
  const vibes = discoverService.getVibeCategories();

  const renderVibeCard = ({ item }: { item: VibeCategory }) => {
    return (
      <TouchableOpacity
        style={styles.vibeCard}
        onPress={() => onVibePress(item.id)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={item.gradient}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.vibeIcon}>{item.icon}</Text>
          <Text style={styles.vibeName}>{item.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover by Vibe</Text>
      <FlatList
        data={vibes}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderVibeCard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(24),
    backgroundColor: '#FFFCF1',
  },
  title: {
    fontSize: rf(22),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#000000',
    paddingHorizontal: wp(20),
    marginBottom: hp(12),
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
  listContent: {
    paddingHorizontal: wp(20),
  },
  vibeCard: {
    width: wp(120),
    height: hp(140),
    marginRight: wp(12),
    borderRadius: rf(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(16),
  },
  vibeIcon: {
    fontSize: rf(32),
    marginBottom: hp(8),
  },
  vibeName: {
    fontSize: rf(14),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    includeFontPadding: false,
  },
});

