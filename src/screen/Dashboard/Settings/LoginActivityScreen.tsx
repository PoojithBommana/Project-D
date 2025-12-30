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
import { wp, hp, rf, rs } from '../../../utils/responsive';

interface Props {
  navigation?: NativeStackNavigationProp<SettingsStackParamList, 'LoginActivityScreen'>;
}

interface Device {
  id: string;
  name: string;
  location: string;
  time: string;
  isCurrentDevice: boolean;
  type: 'iphone' | 'mac';
}

export default function LoginActivityScreen({ navigation }: Props) {
  const currentDevice: Device = {
    id: '1',
    name: 'iPhone 13',
    location: 'Hyderabad, India',
    time: 'Now',
    isCurrentDevice: true,
    type: 'iphone',
  };

  const otherDevices: Device[] = [
    {
      id: '2',
      name: 'Apple Macintosh',
      location: 'Chanda Nagar, India',
      time: '3 hours ago',
      isCurrentDevice: false,
      type: 'mac',
    },
    {
      id: '3',
      name: 'Apple Macintosh',
      location: 'Singapore, Singapore',
      time: 'at 05:19 on 12 November',
      isCurrentDevice: false,
      type: 'mac',
    },
    {
      id: '4',
      name: 'Apple Macintosh',
      location: 'Lingampalle, India',
      time: 'at 06:31 on 11 November',
      isCurrentDevice: false,
      type: 'mac',
    },
    {
      id: '5',
      name: 'Apple Macintosh',
      location: 'Chanda Nagar, India',
      time: 'at 09:53 on 30 October',
      isCurrentDevice: false,
      type: 'mac',
    },
  ];

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
    sectionHeader: {
      fontSize: rf(16),
      fontFamily: 'GTMaruBold',
      color: '#000000',
      marginTop: hp(24),
      marginBottom: hp(16),
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
    logoutButton: {
      marginTop: hp(16),
      paddingVertical: hp(16),
      alignItems: 'center' as const,
    },
    logoutButtonText: {
      fontSize: rf(16),
      fontFamily: 'GTMaruBold',
      color: '#FF3B30',
    },
  };

  const renderDevice = (device: Device) => (
    <View key={device.id} style={styles.deviceCard}>
      <View style={styles.deviceIcon}>
        <Icon
          name={device.type === 'iphone' ? 'phone-portrait-outline' : 'desktop-outline'}
          size={32}
          color="#000000"
        />
      </View>
      <View style={styles.deviceContent}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceInfo}>
          {device.location} • {device.time}
        </Text>
        {device.isCurrentDevice && (
          <View style={styles.currentDeviceBadge}>
            <View style={styles.currentDeviceDot} />
            <Text style={styles.currentDeviceText}>This device</Text>
          </View>
        )}
      </View>
      {!device.isCurrentDevice && (
        <Icon name="chevron-forward" size={20} color="#666666" />
      )}
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
          <Text style={styles.headerTitle}>Where you're logged in</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* White Card Container */}
          <View style={styles.cardContainer}>
            <Text style={styles.title}>Account login activity</Text>
          <Text style={styles.subtitle}>
            You're currently logged in on these devices:
          </Text>

          {renderDevice(currentDevice)}

          <Text style={styles.sectionHeader}>Logins on other devices</Text>

          {otherDevices.map(renderDevice)}

          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
            <Text style={styles.logoutButtonText}>Select devices to log out</Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

