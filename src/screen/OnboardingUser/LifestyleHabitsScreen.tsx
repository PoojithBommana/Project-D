import React, { useState } from 'react';
import { StatusBar, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import styles from '../../styles/LifestyleHabitsScreenStyles';

type Props = {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'LifestyleHabitsScreen'>;
  route?: {
    params: OnboardingStackParamList['LifestyleHabitsScreen'];
  };
};

const drinkingOptions = [
  'Yes, I drink',
  'I drink sometimes',
  'I rarely drink',
  "No, I don't drink",
  "I'm sober",
] as const;

const smokingOptions = [
  'I smoke sometimes',
  "No, I don't smoke",
  'Yes, I smoke',
  "I’m trying to quit",
] as const;

export default function LifestyleHabitsScreen({ navigation, route }: Props) {
  const [drinking, setDrinking] = useState<string | undefined>(
    route?.params?.habits?.drinking,
  );
  const [smoking, setSmoking] = useState<string | undefined>(
    route?.params?.habits?.smoking,
  );
  const [showError, setShowError] = useState(false);

  const progress = 80;

  const handleNext = () => {
    const hasSelection = !!drinking || !!smoking;
    if (!hasSelection) {
      setShowError(true);
      return;
    }

    navigation?.navigate('InterestsSelectionV2Screen', {
      firstName: route?.params?.firstName ?? '',
      lastName: route?.params?.lastName ?? '',
      username: route?.params?.username,
      gender: route?.params?.gender ?? '',
      age: route?.params?.age ?? 0,
      showOnlyFirstLetter: route?.params?.showOnlyFirstLetter ?? false,
      height: route?.params?.height,
      habits: { drinking, smoking },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" translucent={false} />
      <View style={styles.container}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.heading}>Let’s talk about your lifestyle and habits</Text>
          <Text style={styles.subheading}>
            Share as much about your habits as you’re comfortable with.
          </Text>

          <Text style={styles.sectionTitle}>Drinking</Text>
          <View style={styles.pillsRow}>
            {drinkingOptions.map(option => {
              const selected = drinking === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.pill, selected && styles.pillSelected]}
                  onPress={() => setDrinking(option)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Smoking</Text>
          <View style={styles.pillsRow}>
            {smokingOptions.map(option => {
              const selected = smoking === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.pill, selected && styles.pillSelected]}
                  onPress={() => setSmoking(option)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {showError && !drinking && !smoking && (
            <Text style={styles.errorText}>This field is required</Text>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleNext}
            style={styles.nextButton}
            activeOpacity={0.8}
          >
            <Text style={styles.nextIcon}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}


