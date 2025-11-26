import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ErrorBoundary from './src/components/ErrorBoundary';
import LaunchScreen from './src/screen/LaunchScreen';
import PhoneNumberLoginPage from './src/screen/PhoneNumberLoginPage';
import VerifyPhoneNumberScreen from './src/screen/VerifyPhoneNumberScreen';
import HomeScreen from './src/screen/HomeScreen';
import AccountDetailsNotFound from './src/screen/AccountDetailsNotFound';

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

const Stack = createNativeStackNavigator<RootStackParamList>();


const AppNavigator: React.FC = () => {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Launch"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen 
            name="Launch" 
            component={LaunchScreen} 
          />
          <Stack.Screen 
            name="PhoneNumberLogin" 
            component={PhoneNumberLoginPage} 
          />
          <Stack.Screen 
            name="VerifyPhoneNumber" 
            component={VerifyPhoneNumberScreen} 
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
          />
          <Stack.Screen 
            name="AccountNotFound" 
            component={AccountDetailsNotFound} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
};

export default AppNavigator;

