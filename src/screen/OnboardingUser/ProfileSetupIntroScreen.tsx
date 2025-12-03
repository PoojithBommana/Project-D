import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/ProfileSetupIntroStyles';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'ProfileSetupIntroScreen'>;
}

export default function ProfileSetupIntroScreen({ navigation }: Props) {
  const progress = 25;

  const handleContinue = () => {
    navigation?.navigate('UserOnboarding');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#90CAF9" />
      
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Let's set up your DilMil profile!</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImagePlaceholder}>
              <Icon name="user" size={rf(80)} color="#4A90E2" />
            </View>
          </View>

          <View style={styles.bubblesContainer}>
            <View style={[styles.bubble, styles.bubbleTopLeft]}>
              <Icon name="briefcase" size={rf(20)} color="#4A90E2" />
              <Text style={styles.bubbleText}>Work</Text>
            </View>

            <View style={[styles.bubble, styles.bubbleTopRight]}>
              <Icon name="graduation-cap" size={rf(20)} color="#4A90E2" />
              <Text style={styles.bubbleText}>College</Text>
            </View>

            <View style={[styles.bubble, styles.bubbleLeft]}>
              <Icon name="venus-mars" size={rf(20)} color="#4A90E2" />
              <Text style={styles.bubbleText}>Gender</Text>
            </View>

            <View style={[styles.bubble, styles.bubbleRight]}>
              <Icon name="birthday-cake" size={rf(20)} color="#4A90E2" />
              <Text style={styles.bubbleText}>DOB</Text>
            </View>

            <View style={[styles.bubble, styles.bubbleBottomLeft]}>
              <Icon name="music" size={rf(20)} color="#4A90E2" />
              <Text style={styles.bubbleText}>Playlist</Text>
            </View>

            <View style={[styles.bubble, styles.bubbleBottomRight]}>
              <Icon name="film" size={rf(20)} color="#4A90E2" />
              <Text style={styles.bubbleText}>Movies</Text>
            </View>
          </View>

         
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

