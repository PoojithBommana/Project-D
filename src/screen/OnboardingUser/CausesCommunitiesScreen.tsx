import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import styles from '../../styles/CausesCommunitiesScreenStyles';

type Props = {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'CausesCommunitiesScreen'>;
  route?: {
    params: OnboardingStackParamList['CausesCommunitiesScreen'];
  };
};

const CAUSES = [
  'Black Lives Matter',
  'Disability rights',
  'End religious hate',
  'Environmentalism',
  'Feminism',
  'Human rights',
  'Immigrant rights',
  'Indigenous rights',
  'LGBTQ+ rights',
  'Neurodiversity',
  'Reproductive rights',
  'Stop Asian Hate',
  'Trans rights',
  'Volunteering',
  'Voter rights',
] as const;

const MAX_SELECTION = 3;

export default function CausesCommunitiesScreen({ navigation, route }: Props) {
  const [selected, setSelected] = useState<string[]>(route?.params?.causes || []);
  const progress = 92;

  const toggleCause = (label: string) => {
    setSelected(current => {
      if (current.includes(label)) {
        return current.filter(c => c !== label);
      }
      if (current.length >= MAX_SELECTION) return current;
      return [...current, label];
    });
  };

  const handleNext = () => {
    navigation?.navigate('OnboardingStep3', {
      ...route?.params,
      causes: selected,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" translucent={false} />
      <View style={styles.container}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.heading}>How about causes and communities?</Text>
          <Text style={styles.subheading}>
            Choose up to 3 options close to your heart.
          </Text>

          <Text style={styles.sectionLabel}>Causes and communities</Text>
          <View style={styles.chipsContainer}>
            {CAUSES.map(label => {
              const isSelected = selected.includes(label);
              return (
                <TouchableOpacity
                  key={label}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => toggleCause(label)}
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
              selected.length === 0 && styles.nextButtonDisabled,
            ]}
            disabled={selected.length === 0}
          >
            <Text style={styles.nextIcon}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}


