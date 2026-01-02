import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { wp, hp, rf } from '../../../../utils/responsive';

interface DiscoveryPromptBannerProps {
  onActionPress: (action: 'friend' | 'date' | 'nearby' | 'new') => void;
}

export default function DiscoveryPromptBanner({ onActionPress }: DiscoveryPromptBannerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>Who do you want to meet today?</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onActionPress('friend')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>A friend</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onActionPress('date')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>A date</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onActionPress('nearby')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>Someone nearby</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onActionPress('new')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>Someone new</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(20),
    paddingVertical: hp(16),
    marginBottom: hp(8),
    backgroundColor: '#FFFCF1',
  },
  question: {
    fontSize: rf(20),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#000000',
    marginBottom: hp(12),
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(8),
  },
  actionButton: {
    paddingVertical: hp(8),
    paddingHorizontal: wp(16),
    borderRadius: rf(20),
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FEFFAF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruMedium',
    fontWeight: '500',
    color: '#000000',
    includeFontPadding: false,
  },
});

