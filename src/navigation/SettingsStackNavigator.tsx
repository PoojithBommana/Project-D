import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screen/Dashboard/SettingsScreen';
import PasswordSecurityScreen from '../screen/Dashboard/Settings/PasswordSecurityScreen';
import AccountManagementScreen from '../screen/Dashboard/Settings/AccountManagementScreen';
import PrivacyPermissionsScreen from '../screen/Dashboard/Settings/PrivacyPermissionsScreen';
import PrivacyPolicyScreen from '../screen/Dashboard/Settings/PrivacyPolicyScreen';
import ChangePasswordScreen from '../screen/Dashboard/Settings/ChangePasswordScreen';
import TwoFactorAuthScreen from '../screen/Dashboard/Settings/TwoFactorAuthScreen';
import LoginActivityScreen from '../screen/Dashboard/Settings/LoginActivityScreen';
import LoginAlertsScreen from '../screen/Dashboard/Settings/LoginAlertsScreen';
import ProfileDetailsScreen from '../screen/Dashboard/Settings/ProfileDetailsScreen';
import BlockedAccountsScreen from '../screen/Dashboard/Settings/BlockedAccountsScreen';

export type SettingsStackParamList = {
  SettingsScreen: undefined;
  PasswordSecurityScreen: undefined;
  AccountManagementScreen: undefined;
  PrivacyPermissionsScreen: undefined;
  PrivacyPolicyScreen: undefined;
  ChangePasswordScreen: undefined;
  TwoFactorAuthScreen: undefined;
  LoginActivityScreen: undefined;
  LoginAlertsScreen: undefined;
  ProfileDetailsScreen: undefined;
  BlockedAccountsScreen: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 350,
        contentStyle: {
          backgroundColor: '#FFFCF1',
        },
      }}
      initialRouteName="SettingsScreen"
    >
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="PasswordSecurityScreen" component={PasswordSecurityScreen} />
      <Stack.Screen name="AccountManagementScreen" component={AccountManagementScreen} />
      <Stack.Screen name="PrivacyPermissionsScreen" component={PrivacyPermissionsScreen} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
      <Stack.Screen name="TwoFactorAuthScreen" component={TwoFactorAuthScreen} />
      <Stack.Screen name="LoginActivityScreen" component={LoginActivityScreen} />
      <Stack.Screen name="LoginAlertsScreen" component={LoginAlertsScreen} />
      <Stack.Screen name="ProfileDetailsScreen" component={ProfileDetailsScreen} />
      <Stack.Screen name="BlockedAccountsScreen" component={BlockedAccountsScreen} />
    </Stack.Navigator>
  );
}

