import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screen/Auth/SplashScreen';
import AuthNavigation from './AuthNavigation';
// import ProfileScreen from '../screen/Dashboard/ProfileScreen';
import TabNavigation from './TabNavigation';
import OnboardingNavigation from './OnboardingNavigation';

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName='TabNavigation'
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
      <Stack.Screen name="OnboardingNavigation" component={OnboardingNavigation} />
      <Stack.Screen name='TabNavigation' component={TabNavigation} />
    </Stack.Navigator>
  );
}