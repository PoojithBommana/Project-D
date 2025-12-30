import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../../navigation/SettingsStackNavigator';
import styles from '../../../styles/SettingsScreenStyles';

interface Props {
  navigation?: NativeStackNavigationProp<SettingsStackParamList, 'PrivacyPolicyScreen'>;
}

export default function PrivacyPolicyScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* White Card Container */}
          <View style={styles.cardContainer}>
            <View style={styles.section}>
            <Text style={styles.sectionHeader}>Privacy Policy</Text>
            <Text style={styles.sectionDescription}>
              Our privacy policy explains how we collect, use, and protect your personal information.
            </Text>
            <Text style={styles.sectionDescription}>
              Content coming soon...
            </Text>
          </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

