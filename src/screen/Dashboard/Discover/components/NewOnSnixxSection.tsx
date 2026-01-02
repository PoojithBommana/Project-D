import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { DiscoverProfile } from '../../../../types/Discover';
import DiscoverProfileCard from './DiscoverProfileCard';
import { wp, hp, rf } from '../../../../utils/responsive';

interface NewOnSnixxSectionProps {
  profiles: DiscoverProfile[];
  loading: boolean;
  onProfilePress: (profile: DiscoverProfile) => void;
}

export default function NewOnSnixxSection({
  profiles,
  loading,
  onProfilePress,
}: NewOnSnixxSectionProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>New on Snixx</Text>
          <Text style={styles.icon}>✨</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FDFF8D" />
        </View>
      </View>
    );
  }

  if (profiles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New on Snixx</Text>
        <Text style={styles.icon}>✨</Text>
      </View>
      <Text style={styles.subtitle}>Fresh faces on Snixx</Text>
      <FlatList
        data={profiles}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <DiscoverProfileCard
            profile={item}
            onPress={() => onProfilePress(item)}
            variant="new"
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(24),
    backgroundColor: '#FFFCF1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(20),
    marginBottom: hp(8),
  },
  title: {
    fontSize: rf(22),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
  icon: {
    fontSize: rf(20),
  },
  subtitle: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    paddingHorizontal: wp(20),
    marginBottom: hp(12),
    includeFontPadding: false,
  },
  listContent: {
    paddingHorizontal: wp(20),
  },
  loadingContainer: {
    paddingVertical: hp(40),
    alignItems: 'center',
  },
});

