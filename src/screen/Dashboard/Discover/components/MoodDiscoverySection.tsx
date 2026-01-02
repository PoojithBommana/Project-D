import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import discoverService from '../../../../services/DiscoverService';
import { MoodOption } from '../../../../types/Discover';
import { wp, hp, rf } from '../../../../utils/responsive';

interface MoodDiscoverySectionProps {
  selectedMood: string | null;
  onMoodChange: (moodId: string | null) => void;
}

export default function MoodDiscoverySection({
  selectedMood,
  onMoodChange,
}: MoodDiscoverySectionProps) {
  const moods = discoverService.getMoodOptions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What are you looking for today?</Text>
      <View style={styles.moodsContainer}>
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.id;
          return (
            <TouchableOpacity
              key={mood.id}
              style={[styles.moodButton, isSelected && styles.moodButtonSelected]}
              onPress={() => onMoodChange(isSelected ? null : mood.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.moodIcon}>{mood.icon}</Text>
              <Text style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(24),
    paddingHorizontal: wp(20),
    backgroundColor: '#FFFCF1',
  },
  title: {
    fontSize: rf(22),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#000000',
    marginBottom: hp(16),
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
  moodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: wp(12),
  },
  moodButton: {
    width: wp(80),
    height: wp(80),
    borderRadius: wp(40),
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FEFFAF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  moodButtonSelected: {
    backgroundColor: '#FDFF8D',
    borderColor: '#FDFF8D',
    shadowColor: '#FDFF8D',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  moodIcon: {
    fontSize: rf(24),
    marginBottom: hp(4),
  },
  moodLabel: {
    fontSize: rf(12),
    fontFamily: 'GTMaruMedium',
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    includeFontPadding: false,
  },
  moodLabelSelected: {
    color: '#000000',
    fontFamily: 'GTMaruBold',
    includeFontPadding: false,
  },
});

