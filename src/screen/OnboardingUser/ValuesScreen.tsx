import React, { useState } from 'react';
import { StatusBar, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import styles from '../../styles/ValuesScreenStyles';
import { hp } from '../../utils/responsive';

type Props = {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'ValuesScreen'>;
  route?: {
    params: OnboardingStackParamList['ValuesScreen'];
  };
};

const QUALITIES = [
  'Ambition',
  'Confidence',
  'Curiosity',
  'Emotional intelligence',
  'Empathy',
  'Generosity',
  'Gratitude',
  'Humility',
  'Humour',
  'Kindness',
  'Leadership',
  'Loyalty',
  'Openness',
  'Optimism',
  'Playfulness',
  'Sarcasm',
  'Sassiness',
] as const;

const MIN_SELECTION = 3;

export default function ValuesScreen({ navigation, route }: Props) {
  const [selected, setSelected] = useState<string[]>(route?.params?.values || []);
  const progress = 84;

  const toggleQuality = (label: string) => {
    setSelected(current =>
      current.includes(label)
        ? current.filter(q => q !== label)
        : [...current, label],
    );
  };

  const handleNext = () => {
    navigation?.navigate('BeliefsScreen', {
      ...route?.params,
      values: selected,
    });
  };

  const handleSkip = () => {
    navigation?.navigate('BeliefsScreen', route?.params || ({} as any));
  };

  const canContinue = selected.length >= MIN_SELECTION;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" translucent={false} />
      <View style={styles.container}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: hp(40) }]}>
          <Text style={styles.heading}>Tell us what you value in a person</Text>
          <Text style={styles.subheading}>
            Choose 3 qualities that matter most to you in a connection.
          </Text>

          <Text style={styles.sectionLabel}>Their qualities</Text>
          <View style={styles.chipsContainer}>
            {QUALITIES.map(label => {
              const isSelected = selected.includes(label);
              return (
                <TouchableOpacity
                  key={label}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => toggleQuality(label)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            style={[
              styles.nextButton,
              !canContinue && styles.nextButtonDisabled,
            ]}
            disabled={!canContinue}
          >
            <Text style={styles.nextIcon}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}


