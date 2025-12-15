import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import styles from '../../styles/BeliefsScreenStyles';

type Props = {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'BeliefsScreen'>;
  route?: {
    params: OnboardingStackParamList['BeliefsScreen'];
  };
};

const RELIGION_OPTIONS = [
  'Agnostic',
  'Atheist',
  'Buddhist',
  'Catholic',
  'Christian',
  'Hindu',
  'Jain',
  'Jewish',
  'Mormon',
  'Latter-day Saint',
  'Muslim',
  'Zoroastrian',
  'Sikh',
  'Spiritual',
  'Other',
] as const;

const POLITICS_OPTIONS = ['Apolitical', 'Moderate', 'Left', 'Right', 'Other'] as const;

export default function BeliefsScreen({ navigation, route }: Props) {
  const [religion, setReligion] = useState<string[]>(
    route?.params?.beliefs?.religion || [],
  );
  const [politics, setPolitics] = useState<string[]>(
    route?.params?.beliefs?.politics || [],
  );

  const progress = 90;

  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter(v => v !== value) : [...list, value];

  const handleNext = () => {
    navigation?.navigate('CausesCommunitiesScreen', {
      ...route?.params,
      beliefs: { religion, politics },
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
          <Text style={styles.heading}>What’s important in your life?</Text>
          <Text style={styles.subheading}>
            This is sensitive information that’ll be on your profile. It helps you find people,
            and people find you. It’s totally optional.
          </Text>
          <Text style={styles.linkText}>Why we’re asking</Text>

          <Text style={styles.sectionTitle}>Religion</Text>
          <View style={styles.pillsRow}>
            {RELIGION_OPTIONS.map(option => {
              const selected = religion.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.pill, selected && styles.pillSelected]}
                  onPress={() => setReligion(prev => toggleInList(prev, option))}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Politics</Text>
          <View style={styles.pillsRow}>
            {POLITICS_OPTIONS.map(option => {
              const selected = politics.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.pill, selected && styles.pillSelected]}
                  onPress={() => setPolitics(prev => toggleInList(prev, option))}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleNext} activeOpacity={0.8} style={styles.nextButton}>
            <Text style={styles.nextIcon}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}


