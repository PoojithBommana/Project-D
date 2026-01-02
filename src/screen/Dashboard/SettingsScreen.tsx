import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigation/SettingsStackNavigator';
import styles from '../../styles/SettingsScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiCall } from '../../config/apiCall';
import { Snixxappicon } from '../../assets';
import { CommonActions } from '@react-navigation/native';
import { wp } from '../../utils/responsive';

interface Props {
  navigation?: NativeStackNavigationProp<SettingsStackParamList, 'SettingsScreen'>;
}



export default function SettingsScreen({ navigation }: Props) {
  const [userEmail, setUserEmail] = useState<string>('');
  const [_isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [passwordLastUpdated, setPasswordLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      const profileResponse = await getApiCall('AUTH', 'GET_PROFILE', accessToken);
      if (!profileResponse?.error && profileResponse?.response) {
        const profile = profileResponse.response.profile || profileResponse.response;
        setUserEmail(profile.email || '');
        // Get user name for display
        const firstName = profile.first_name || profile.firstName || '';
        const lastName = profile.last_name || profile.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        setUserName(fullName || profile.name || '');
        // Get password last updated if available
        if (profile.password_updated_at || profile.passwordLastUpdated) {
          const date = new Date(profile.password_updated_at || profile.passwordLastUpdated);
          setPasswordLastUpdated(date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }));
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'authToken', 'userId', 'onboarding_complete']);
              const rootNavigation = navigation?.getParent()?.getParent();
              if (rootNavigation) {
                rootNavigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'AuthNavigation' }],
                  })
                );
              }
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete account functionality
            Alert.alert('Coming Soon', 'Account deletion feature will be available soon.');
          },
        },
      ]
    );
  };

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
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* White Card Container */}
          <View style={styles.cardContainer}>
            {/* Edit Profile Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Edit Profile</Text>
              <TouchableOpacity
                style={[styles.optionItem, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                onPress={() => navigation?.navigate('ProfileDetailsScreen')}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{userName || 'Edit your profile'}</Text>
                <Icon name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>

            {/* Login Method Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Login Method</Text>
              <Text style={styles.emailText}>{userEmail || 'Loading...'}</Text>
              <View style={styles.divider} />
            </View>

            {/* Password Change Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Password</Text>
              <TouchableOpacity
                style={styles.passwordRow}
                onPress={() => navigation?.navigate('ChangePasswordScreen')}
                activeOpacity={0.7}
              >
                <View style={styles.passwordInfo}>
                  <Text style={styles.passwordLabel}>Change password</Text>
                  {passwordLastUpdated && (
                    <Text style={styles.passwordSubtext}>Last updated: {passwordLastUpdated}</Text>
                  )}
                </View>
                <Icon name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>

            {/* Blocked Users Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Blocked Users</Text>
              <TouchableOpacity
                style={[styles.optionItem, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                onPress={() => navigation?.navigate('BlockedAccountsScreen')}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Icon name="ban-outline" size={20} color="#FDDA0D" style={{ marginRight: wp(12) }} />
                  <Text style={styles.optionText}>Manage blocked accounts</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>

            {/* Help Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Help</Text>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  // TODO: Navigate to Snixx guide
                  Alert.alert('Coming Soon', 'Snixx guide will be available soon.');
                }}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="book-outline" size={20} color="#FDDA0D" style={{ marginRight: wp(12) }} />
                  <Text style={styles.optionText}>Snixx guide</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  // TODO: Navigate to FAQ
                  Alert.alert('Coming Soon', 'FAQ will be available soon.');
                }}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="help-circle-outline" size={20} color="#FDDA0D" style={{ marginRight: wp(12) }} />
                <Text style={styles.optionText}>FAQ</Text>
            </View>
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>

            {/* Legal Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Legal</Text>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => navigation?.navigate('PrivacyPolicyScreen')}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="shield-checkmark-outline" size={20} color="#FDDA0D" style={{ marginRight: wp(12) }} />
                <Text style={styles.optionText}>Privacy Policy</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  // TODO: Navigate to Terms of use
                  Alert.alert('Coming Soon', 'Terms of use will be available soon.');
                }}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="document-text-outline" size={20} color="#FDDA0D" style={{ marginRight: wp(12) }} />
                <Text style={styles.optionText}>Terms of use</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>

            {/* Account Actions */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleSignOut}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="log-out-outline" size={20} color="#FDDA0D" style={{ marginRight: wp(12) }} />
                <Text style={styles.optionText}>Sign out</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleDeleteAccount}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="trash-outline" size={20} color="#FDDA0D" style={{ marginRight: wp(12) }} />
                <Text style={styles.deleteAccountText}>Delete Account</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Info Section */}
          <View style={styles.appInfoContainer}>
            <Image source={Snixxappicon} style={styles.appIcon} resizeMode="contain" />
            <Text style={styles.versionText}>Version 5.0.23</Text>
            <Text style={styles.taglineText}>Laugh your way to love</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

