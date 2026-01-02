import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../../navigation/SettingsStackNavigator';
import { Checkicon } from '../../../assets';
import { wp, hp, rf, rs } from '../../../utils/responsive';

interface Props {
  navigation?: NativeStackNavigationProp<SettingsStackParamList, 'ChangePasswordScreen'>;
}

export default function ChangePasswordScreen({ navigation }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [logOutOtherDevices, setLogOutOtherDevices] = useState(false);

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
    inputContainer: {
      marginBottom: hp(20),
    },
    inputLabel: {
      fontSize: rf(14),
      fontFamily: 'GTMaruBold',
      color: '#000000',
      marginBottom: hp(8),
    },
    inputField: {
      width: '100%',
      height: hp(56),
      backgroundColor: '#FFFFFF',
      borderRadius: rs(12),
      borderWidth: 2,
      borderColor: 'grey',
      paddingHorizontal: wp(16),
      fontSize: rf(16),
      fontFamily: 'GTMaruBold',
      color: '#000000',
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    passwordInput: {
      flex: 1,
      fontSize: rf(16),
      fontFamily: 'GTMaruBold',
      color: '#000000',
    },
    eyeIcon: {
      padding: wp(8),
    },
    linkText: {
      fontSize: rf(14),
      fontFamily: 'GTMaruBold',
      color: '#fdda0d',
      marginTop: hp(8),
    },
    checkboxContainer: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      marginTop: hp(16),
      marginBottom: hp(32),
    },
    checkbox: {
      width: rs(20),
      height: rs(20),
      borderRadius: rs(4),
      borderWidth: rs(2),
      borderColor: 'black',
      marginRight: wp(12),
      marginTop: rs(2),
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      overflow: 'visible' as const,
    },
    checkboxChecked: {
      backgroundColor: '#FEFFAF',
    },
    checkboxUnchecked: {
      backgroundColor: 'transparent',
    },
    checkboxIcon: {
      width: rf(37),
      height: rf(30),
      marginLeft: wp(5),
    },
    checkboxText: {
      flex: 1,
      fontSize: rf(15),
      fontFamily: 'GTMaruBold',
      color: '#000000',
      lineHeight: rf(22),
    },
    button: {
      width: '100%',
      height: hp(56),
      backgroundColor: '#FDFF8E',
      borderRadius: rs(12),
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonText: {
      fontSize: rf(18),
      fontFamily: 'GTMaruBold',
      color: 'black',
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
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* White Card Container */}
          <View style={styles.cardContainer}>
            <Text style={styles.title}>Change password</Text>
          <Text style={styles.description}>
            Your password must be at least 6 characters and should include a combination of numbers, letters and special characters (!$@%).
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Current password (Updated 08/09/2025)</Text>
            <View style={styles.inputField}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter current password"
                placeholderTextColor="#999999"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Icon
                  name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#666666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New password</Text>
            <View style={styles.inputField}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter new password"
                placeholderTextColor="#999999"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Icon
                  name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#666666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Retype new password</Text>
            <View style={styles.inputField}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Retype new password"
                placeholderTextColor="#999999"
                value={retypePassword}
                onChangeText={setRetypePassword}
                secureTextEntry={!showRetypePassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowRetypePassword(!showRetypePassword)}
              >
                <Icon
                  name={showRetypePassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#666666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.linkText}>Forgotten your password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setLogOutOtherDevices(!logOutOtherDevices)}
            activeOpacity={1}
          >
            <View
              style={[
                styles.checkbox,
                logOutOtherDevices ? styles.checkboxChecked : styles.checkboxUnchecked,
              ]}
            >
              {logOutOtherDevices && (
                <Image
                  source={Checkicon}
                  style={styles.checkboxIcon}
                  resizeMode="contain"
                />
              )}
            </View>
            <Text style={styles.checkboxText}>
              Log out of other devices. Choose this if someone else used your account.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

