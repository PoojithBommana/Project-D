import React, { useState } from 'react';
import { StatusBar, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import styles from '../../styles/InterestsSelectionV2ScreenStyles';
import { hp } from '../../utils/responsive';

type Props = {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'InterestsSelectionV2Screen'>;
  route?: {
    params: OnboardingStackParamList['InterestsSelectionV2Screen'];
  };
};

const SUGGESTED_INTERESTS = [
  'Art',
  'Tennis',
  'Camping',
  'R&B',
  'Hiking trips',
  'Vegetarian',
  'Gardening',
  'Skiing',
  'LGBTQ+ rights',
  'Crafts',
  'Wine',
  'Country',
  'Writing',
  'Museums & galleries',
] as const;

const MAX_SELECTION = 5;

export default function InterestsSelectionV2Screen({ navigation, route }: Props) {
  const [selected, setSelected] = useState<string[]>(route?.params?.interests || []);

  const progress = 82;

  const toggleInterest = (label: string) => {
    setSelected(current => {
      if (current.includes(label)) {
        return current.filter(i => i !== label);
      }
      if (current.length >= MAX_SELECTION) {
        return current;
      }
      return [...current, label];
    });
  };

  const handleNext = () => {
    navigation?.navigate('ValuesScreen', {
      ...route?.params,
      interests: selected,
    });
  };

  const handleSkip = () => {
    navigation?.navigate('ValuesScreen', {
      ...route?.params,
      interests: route?.params?.interests,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" translucent={false} />
      <View style={styles.container}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: hp(40) }]}>
          <Text style={styles.heading}>Choose 5 things you’re really into</Text>
          <Text style={styles.subheading}>
            Add interests to your profile to help you match with people who love them too.
          </Text>

          <View style={styles.searchBar}>
            <Text style={styles.searchPlaceholder}>What are you into?</Text>
          </View>

          <Text style={styles.sectionLabel}>You might like…</Text>
          <View style={styles.chipsContainer}>
            {SUGGESTED_INTERESTS.map(label => {
              const isSelected = selected.includes(label);
              return (
                <TouchableOpacity
                  key={label}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => toggleInterest(label)}
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


