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
import styles from '../../../styles/PrivacyPermissionsScreenStyles';

interface Props {
  navigation?: NativeStackNavigationProp<SettingsStackParamList, 'PrivacyPermissionsScreen'>;
}

export default function PrivacyPermissionsScreen({ navigation }: Props) {
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
          <Text style={styles.headerTitle}>Privacy and permissions</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* White Card Container */}
          <View style={styles.cardContainer}>
            {/* Information and Permissions Section */}
            <View style={styles.section}>
            <Text style={styles.sectionHeader}>Your information and permissions</Text>
            <Text style={styles.sectionDescription}>
              Control how your information is used and shared across the platform.
            </Text>

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <Icon name="document-text-outline" size={24} color="#000000" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>Your information and permissions</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#666666" style={styles.listItemArrow} />
            </TouchableOpacity>
          </View>

          {/* Ad Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Ad preferences</Text>
            <Text style={styles.sectionDescription}>
              Manage how ads are personalized for you.
            </Text>

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <Icon name="megaphone-outline" size={24} color="#000000" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>Ad preferences</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#666666" style={styles.listItemArrow} />
            </TouchableOpacity>
          </View>

          {/* Privacy Center Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Privacy center</Text>
            <Text style={styles.sectionDescription}>
              Learn more about privacy and how we protect your information.
            </Text>

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <Icon name="shield-checkmark-outline" size={24} color="#000000" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>Privacy Centre</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#666666" style={styles.listItemArrow} />
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

