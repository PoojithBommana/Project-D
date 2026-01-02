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
import styles from '../../../styles/PasswordSecurityScreenStyles';

interface Props {
  navigation?: NativeStackNavigationProp<SettingsStackParamList, 'PasswordSecurityScreen'>;
}

export default function PasswordSecurityScreen({ navigation }: Props) {
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
          <Text style={styles.headerTitle}>Password and security</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* White Card Container */}
          <View style={styles.cardContainer}>
            {/* Login & Recovery Section */}
            <View style={styles.section}>
            <Text style={styles.sectionHeader}>Login & recovery</Text>
            <Text style={styles.sectionDescription}>
              Manage your passwords, login preferences and recovery methods.
            </Text>

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation?.navigate('ChangePasswordScreen')}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <Icon name="lock-closed-outline" size={24} color="#000000" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>Change password</Text>
                <Text style={styles.listItemSubtitle}>Updated 08/09/2025</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#666666" style={styles.listItemArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation?.navigate('TwoFactorAuthScreen')}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <Icon name="shield-checkmark-outline" size={24} color="#000000" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>Two-factor authentication</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#666666" style={styles.listItemArrow} />
            </TouchableOpacity>
          </View>

          {/* Security Checks Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Security checks</Text>
            <Text style={styles.sectionDescription}>
              Review security issues by running checks across apps, devices and emails sent.
            </Text>

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation?.navigate('LoginActivityScreen')}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <Icon name="phone-portrait-outline" size={24} color="#000000" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>Where you're logged in</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#666666" style={styles.listItemArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation?.navigate('LoginAlertsScreen')}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <Icon name="notifications-outline" size={24} color="#000000" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>Login alerts</Text>
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

