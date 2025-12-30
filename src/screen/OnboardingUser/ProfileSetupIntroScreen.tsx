import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import styles from '../../styles/ProfileSetupIntroStyles';
import { Setupprofileimage } from '../../assets';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'ProfileSetupIntroScreen'>;
}

export default function ProfileSetupIntroScreen({ navigation }: Props) {
  const handleContinue = () => {
    navigation?.navigate('UserOnboarding');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FFFCF1" />
      
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Let's set up your Snixx profile!!!</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={Setupprofileimage} style={styles.girlimage} resizeMode="contain" />
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

