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
  navigation?: NativeStackNavigationProp<SettingsStackParamList, 'TwoFactorAuthScreen'>;
}

export default function TwoFactorAuthScreen({ navigation }: Props) {
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
      marginBottom: hp(16),
    },
    description: {
      fontSize: rf(14),
      fontFamily: 'GTMaruRegular',
      color: '#666666',
      marginBottom: hp(24),
      lineHeight: rf(20),
    },
    linkText: {
      fontSize: rf(14),
      fontFamily: 'GTMaruBold',
      color: '#FDDA0D',
      marginBottom: hp(24),
    },
    section: {
      marginBottom: hp(32),
    },
    sectionHeader: {
      fontSize: rf(18),
      fontFamily: 'GTMaruBold',
      color: '#000000',
      marginBottom: hp(16),
    },
    listItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: '#FFFFFF',
      borderRadius: rs(12),
      paddingVertical: hp(16),
      paddingHorizontal: wp(16),
      marginBottom: hp(8),
      borderWidth: 1,
      borderColor: '#E5E5E5',
    },
    listItemIcon: {
      width: wp(24),
      height: hp(24),
      marginRight: wp(12),
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    listItemContent: {
      flex: 1,
    },
    listItemTitle: {
      fontSize: rf(16),
      fontFamily: 'GTMaruBold',
      color: '#000000',
      marginBottom: hp(4),
    },
    listItemSubtitle: {
      fontSize: rf(14),
      fontFamily: 'GTMaruRegular',
      color: '#666666',
    },
    listItemArrow: {
      marginLeft: wp(8),
    },
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
          <Text style={styles.headerTitle}>Two-factor authentication</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* White Card Container */}
          <View style={styles.cardContainer}>
            <Text style={styles.title}>Two-factor authentication is on</Text>
          <Text style={styles.description}>
            We'll now ask for a login code whenever you log in on a device that we don't recognise.{' '}
            <Text style={styles.linkText}>Learn more</Text>
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>How you get login codes</Text>

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <Icon name="phone-portrait-outline" size={24} color="#000000" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>Authentication app</Text>
                <Text style={styles.listItemSubtitle}>
                  You'll get a login code from your authentication app.
                </Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#666666" style={styles.listItemArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <Icon name="chatbubble-outline" size={24} color="#000000" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>SMS or WhatsApp</Text>
                <Text style={styles.listItemSubtitle}>
                  We'll send a code to ****** ***73.
                </Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#666666" style={styles.listItemArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <Icon name="add-circle-outline" size={24} color="#000000" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>Additional methods</Text>
                <Text style={styles.listItemSubtitle}>
                  See how to log in securely even if your other methods aren't available.
                </Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#666666" style={styles.listItemArrow} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Add a backup method</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Authorised logins</Text>

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <Icon name="phone-portrait-outline" size={24} color="#000000" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>Trusted devices</Text>
                <Text style={styles.listItemSubtitle}>
                  Take a look at your list of the familiar devices we remember at login.
                </Text>
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

