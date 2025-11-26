import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './src/navigation/MainNavigation';

export type RootStackParamList = {
  Launch: undefined;
  PhoneNumberLogin: undefined;
  VerifyPhoneNumber: {
    countryCode: string;
    phoneNumber: string;
  };
  Home: undefined;
  AccountNotFound: undefined;
};
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  );
};

export default AppNavigator;

