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
import { SettingsStackParamList } from '../../../navigation/SettingsStackNavigator';
import styles from '../../../styles/BlockedAccountsScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiCall, postApiCall } from '../../../config/apiCall';
import { wp } from '../../../utils/responsive';

interface Props {
  navigation?: NativeStackNavigationProp<SettingsStackParamList, 'BlockedAccountsScreen'>;
}

interface BlockedUser {
  id: number;
  username?: string;
  name: string;
  profile_photo?: string;
  blocked_at?: string;
}

export default function BlockedAccountsScreen({ navigation }: Props) {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      setIsLoading(true);
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      const response = await getApiCall('AUTH', 'GET_BLOCKED_USERS', accessToken);
      if (!response?.error && response?.response) {
        const users = response.response.blocked_users || response.response || [];
        setBlockedUsers(users);
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      setBlockedUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockUser = async (userId: number) => {
    Alert.alert(
      'Unblock User',
      'Are you sure you want to unblock this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: async () => {
            try {
              const accessToken = await AsyncStorage.getItem('accessToken');
              if (!accessToken) {
                Alert.alert('Error', 'Please log in again.');
                return;
              }

              const response = await postApiCall('POST', 'AUTH', 'UNBLOCK_USER', { user_id: userId }, accessToken);
              if (!response?.error) {
                setBlockedUsers(prev => prev.filter(user => user.id !== userId));
                Alert.alert('Success', 'User unblocked successfully.');
              } else {
                Alert.alert('Error', response.response?.message || 'Failed to unblock user.');
              }
            } catch (error) {
              console.error('Error unblocking user:', error);
              Alert.alert('Error', 'Failed to unblock user. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handlePlusPress = () => {
    Alert.alert('Coming soon', 'Search users to block feature will be available soon.');
  };


  const renderBlockedUserItem = (user: BlockedUser) => {
    const displayUsername = user.username || user.name;
    const additionalText = user.username && user.name ? user.name : 'Includes other accounts they may have or create';
    
    return (
      <View key={user.id} style={styles.blockedUserItem}>
        <View style={styles.blockedUserInfo}>
          {user.profile_photo ? (
            <Image
              source={{ uri: user.profile_photo }}
              style={styles.blockedUserAvatar}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.blockedUserAvatar, { justifyContent: 'center', alignItems: 'center' }]}>
              <Icon name="person" size={wp(28)} color="#999999" />
            </View>
          )}
          <View style={styles.blockedUserDetails}>
            <Text style={styles.blockedUserName}>{displayUsername}</Text>
            <Text style={styles.blockedUserSubtext}>{additionalText}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.unblockButton}
          onPress={() => handleUnblockUser(user.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.unblockButtonText}>Unblock</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation?.goBack()}
              activeOpacity={0.7}
            >
              <Icon name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Blocked accounts</Text>
          </View>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={handlePlusPress}
            activeOpacity={0.7}
          >
            <Icon name="add" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* White Card Container */}
          <View style={styles.cardContainer}>
            {/* Blocked Users List */}
            <View style={styles.blockedUsersSection}>
              {isLoading ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Loading...</Text>
                </View>
              ) : blockedUsers.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No blocked users</Text>
                </View>
              ) : (
                blockedUsers.map(user => renderBlockedUserItem(user))
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

