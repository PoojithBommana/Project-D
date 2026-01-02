import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { SettingsStackParamList } from '../../../navigation/SettingsStackNavigator';
import { wp, hp, rf, rs } from '../../../utils/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiCall } from '../../../config/apiCall';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Props {
  navigation?: NativeStackNavigationProp<SettingsStackParamList, 'LoginAlertsScreen'>;
}

interface Device {
  id: string;
  name: string;
  deviceType: 'iphone' | 'android' | 'mac' | 'windows' | 'unknown';
  loginTime: string; // ISO timestamp
  location?: string;
  isCurrentDevice: boolean;
  osVersion?: string;
}

export default function LoginAlertsScreen({ navigation }: Props) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getCurrentDeviceName = (): string => {
    if (Platform.OS === 'ios') {
      return Platform.select({
        ios: 'iPhone',
        default: 'iOS Device',
      }) || 'iOS Device';
    } else if (Platform.OS === 'android') {
      return 'Android Device';
    }
    return 'Unknown Device';
  };

  const getDeviceType = (): 'iphone' | 'android' | 'mac' | 'windows' | 'unknown' => {
    if (Platform.OS === 'ios') {
      return 'iphone';
    } else if (Platform.OS === 'android') {
      return 'android';
    }
    return 'unknown';
  };

  const formatLoginTime = (timestamp: string): string => {
    const loginDate = dayjs(timestamp);
    const now = dayjs();
    const diffInMinutes = now.diff(loginDate, 'minute');

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 10080) {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return loginDate.format('MMM DD, YYYY [at] HH:mm');
    }
  };

  const fetchLoginDevices = useCallback(async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const legacyToken = await AsyncStorage.getItem('authToken');
      const token = accessToken || legacyToken;

      if (!token) {
        // If no token, show current device only
        const currentDevice: Device = {
          id: 'current',
          name: getCurrentDeviceName(),
          deviceType: getDeviceType(),
          loginTime: new Date().toISOString(),
          isCurrentDevice: true,
          osVersion: Platform.Version.toString(),
        };
        setDevices([currentDevice]);
        setLoading(false);
        return;
      }

      // TODO: Replace with actual API endpoint when available
      // const response = await getApiCall('AUTH', 'GET_LOGIN_DEVICES', token);
      
      // For now, simulate with current device and some mock data
      // This will be replaced with real API call
      const currentDevice: Device = {
        id: 'current',
        name: getCurrentDeviceName(),
        deviceType: getDeviceType(),
        loginTime: new Date().toISOString(),
        isCurrentDevice: true,
        osVersion: Platform.Version.toString(),
      };

      // Mock other devices - replace with API response
      const mockDevices: Device[] = [
        {
          id: '1',
          name: 'iPhone 13',
          deviceType: 'iphone',
          loginTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          location: 'Hyderabad, India',
          isCurrentDevice: false,
        },
        {
          id: '2',
          name: 'MacBook Pro',
          deviceType: 'mac',
          loginTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
          location: 'Chanda Nagar, India',
          isCurrentDevice: false,
        },
        {
          id: '3',
          name: 'Samsung Galaxy',
          deviceType: 'android',
          loginTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          location: 'Singapore',
          isCurrentDevice: false,
        },
      ];

      setDevices([currentDevice, ...mockDevices]);
    } catch (error) {
      console.error('Error fetching login devices:', error);
      // On error, at least show current device
      const currentDevice: Device = {
        id: 'current',
        name: getCurrentDeviceName(),
        deviceType: getDeviceType(),
        loginTime: new Date().toISOString(),
        isCurrentDevice: true,
        osVersion: Platform.Version.toString(),
      };
      setDevices([currentDevice]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLoginDevices();
    }, [fetchLoginDevices])
  );

  // Refresh data every 30 seconds when screen is focused
  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        fetchLoginDevices();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [loading, fetchLoginDevices]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLoginDevices();
  }, [fetchLoginDevices]);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'iphone':
        return 'phone-portrait-outline';
      case 'android':
        return 'phone-portrait-outline';
      case 'mac':
        return 'desktop-outline';
      case 'windows':
        return 'laptop-outline';
      default:
        return 'device-desktop-outline';
    }
  };

  const styles = {
    safeArea: {
      flex: 1,
      backgroundColor: '#FFFCF1',
    },
    container: {
      flex: 1,
      backgroundColor: '#FFFCF1',
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: wp(20),
      paddingTop: hp(24),
      paddingBottom: hp(16),
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5E5',
    },
    backButton: {
      width: wp(40),
      height: hp(40),
      justifyContent: 'center' as const,
      alignItems: 'flex-start' as const,
    },
    headerTitle: {
      fontSize: rf(22),
      fontFamily: 'GTMaruBold',
      color: '#000000',
      textAlign: 'left' as const,
      marginLeft: wp(12),
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: hp(24),
      paddingBottom: hp(40),
    },
    cardContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: rs(16),
      paddingVertical: hp(20),
      paddingHorizontal: wp(20),
      marginHorizontal: wp(20),
      marginBottom: hp(32),
    },
    title: {
      fontSize: rf(22),
      fontFamily: 'GTMaruBold',
      color: '#000000',
      marginBottom: hp(8),
    },
    subtitle: {
      fontSize: rf(14),
      fontFamily: 'GTMaruRegular',
      color: '#666666',
      marginBottom: hp(24),
    },
    deviceCard: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: '#FFFFFF',
      borderRadius: rs(12),
      paddingVertical: hp(16),
      paddingHorizontal: wp(16),
      marginBottom: hp(12),
      borderWidth: 1,
      borderColor: '#E5E5E5',
    },
    deviceIcon: {
      width: wp(40),
      height: hp(40),
      marginRight: wp(12),
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    deviceContent: {
      flex: 1,
    },
    deviceName: {
      fontSize: rf(16),
      fontFamily: 'GTMaruBold',
      color: '#000000',
      marginBottom: hp(4),
    },
    deviceInfo: {
      fontSize: rf(14),
      fontFamily: 'GTMaruRegular',
      color: '#666666',
    },
    currentDeviceBadge: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginTop: hp(4),
    },
    currentDeviceDot: {
      width: rs(8),
      height: rs(8),
      borderRadius: rs(4),
      backgroundColor: '#4CAF50',
      marginRight: wp(6),
    },
    currentDeviceText: {
      fontSize: rf(14),
      fontFamily: 'GTMaruBold',
      color: '#4CAF50',
    },
    loadingText: {
      fontSize: rf(14),
      fontFamily: 'GTMaruRegular',
      color: '#666666',
      textAlign: 'center' as const,
      marginTop: hp(20),
    },
  };

  const renderDevice = (device: Device) => (
    <View key={device.id} style={styles.deviceCard}>
      <View style={styles.deviceIcon}>
        <Icon
          name={getDeviceIcon(device.deviceType)}
          size={32}
          color="#000000"
        />
      </View>
      <View style={styles.deviceContent}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceInfo}>
          {device.location ? `${device.location} • ` : ''}
          {formatLoginTime(device.loginTime)}
        </Text>
        {device.isCurrentDevice && (
          <View style={styles.currentDeviceBadge}>
            <View style={styles.currentDeviceDot} />
            <Text style={styles.currentDeviceText}>This device</Text>
          </View>
        )}
      </View>
    </View>
  );

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
          <Text style={styles.headerTitle}>Login alerts</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FDDA0D"
            />
          }
        >
          {/* White Card Container */}
          <View style={styles.cardContainer}>
            <Text style={styles.title}>Active login sessions</Text>
          <Text style={styles.subtitle}>
            Track all devices where you're currently logged in and their login times.
          </Text>

          {loading ? (
            <Text style={styles.loadingText}>Loading devices...</Text>
          ) : devices.length === 0 ? (
            <Text style={styles.loadingText}>No active sessions found</Text>
          ) : (
            devices.map(renderDevice)
          )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

