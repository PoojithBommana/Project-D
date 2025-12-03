import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './src/navigation/MainNavigation';

export type RootStackParamList = {
  Launch: undefined;
  RegisterScreen: undefined;
  VerifyPhoneNumberScreen: {
    countryCode: string;
    phoneNumber: string;
  };
  Home: undefined;
  AccountNotFound: undefined;
  OnboardingNavigation: undefined;
  TabNavigation: undefined;
};
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  );
};

export default AppNavigator;

