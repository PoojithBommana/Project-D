import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import discoverService from '../../../../services/DiscoverService';
import { ConversationStarter } from '../../../../types/Discover';
import { wp, hp, rf } from '../../../../utils/responsive';

interface ConversationStartersSectionProps {
  onStarterPress: (starterId: string) => void;
}

export default function ConversationStartersSection({
  onStarterPress,
}: ConversationStartersSectionProps) {
  const [starters, setStarters] = useState<ConversationStarter[]>([]);

  useEffect(() => {
    const loadStarters = async () => {
      const data = await discoverService.getConversationStarters();
      setStarters(data);
    };
    loadStarters();
  }, []);

  if (starters.length === 0) {
    return null;
  }

  const renderStarterCard = ({ item }: { item: ConversationStarter }) => {
    return (
      <TouchableOpacity
        style={styles.starterCard}
        onPress={() => onStarterPress(item.id)}
        activeOpacity={0.8}
      >
        <Text style={styles.question}>{item.question}</Text>
        {item.icon && <Text style={styles.icon}>{item.icon}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Break the Ice</Text>
        <Text style={styles.headerIcon}>🧊</Text>
      </View>
      <FlatList
        data={starters}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderStarterCard}
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
    marginBottom: hp(12),
  },
  title: {
    fontSize: rf(22),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
  headerIcon: {
    fontSize: rf(20),
  },
  listContent: {
    paddingHorizontal: wp(20),
  },
  starterCard: {
    paddingVertical: hp(16),
    paddingHorizontal: wp(20),
    borderRadius: rf(16),
    backgroundColor: '#FFFFFF',
    marginRight: wp(12),
    minWidth: wp(160),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FEFFAF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  question: {
    fontSize: rf(15),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#000000',
    marginBottom: hp(8),
    textAlign: 'center',
    includeFontPadding: false,
  },
  icon: {
    fontSize: rf(20),
  },
});

