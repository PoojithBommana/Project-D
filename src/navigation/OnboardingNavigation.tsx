import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountSelectionScreen from '../screen/OnboardingUser/AccountSelectionScreen';
import ProfileSetupIntroScreen from '../screen/OnboardingUser/ProfileSetupIntroScreen';
import UserOnboarding from '../screen/OnboardingUser/UserOnboarding';
import GenderSelectionScreen from '../screen/OnboardingUser/GenderSelectionScreen';
import OnboardingStep2 from '../screen/OnboardingUser/BirthdateScreen';
import NotificationPermissionScreen from '../screen/OnboardingUser/NotificationPermissionScreen';
import ActivitySelectionScreen from '../screen/OnboardingUser/ActivitySelectionScreen';
import MusicArtistsScreen from '../screen/OnboardingUser/MusicArtistsScreen';
import OnboardingStep3 from '../screen/OnboardingUser/OnboardingStep3';
import OnboardingStep4 from '../screen/OnboardingUser/OnboardingStep4';
import PromptsScreen from '../screen/OnboardingUser/PromptsScreen';
import DatingPreferencesScreen from '../screen/OnboardingUser/DatingPreferencesScreen';
import OnboardingStep5 from '../screen/OnboardingUser/OnboardingStep5';
import LocationPermissionScreen from '../screen/OnboardingUser/LocationPermissionScreen';
import InterestsSelectionScreen from '../screen/OnboardingUser/InterestsSelectionScreen';
import DevicePermissionsScreen from '../screen/OnboardingUser/DevicePermissionsScreen';

export type OnboardingStackParamList = {
  AccountSelectionScreen: undefined;
  ProfileSetupIntroScreen: undefined;
  UserOnboarding: undefined;
  GenderSelectionScreen: { firstName: string; lastName: string; username?: string; showOnlyFirstLetter: boolean };
  OnboardingStep2: { firstName: string; lastName: string; username?: string; gender: string; showOnlyFirstLetter: boolean };
  NotificationPermissionScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; showOnlyFirstLetter: boolean };
  ActivitySelectionScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; showOnlyFirstLetter: boolean };
  MusicArtistsScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; showOnlyFirstLetter: boolean };
  OnboardingStep3: { firstName: string; lastName: string; username?: string; gender: string; age: number; showOnlyFirstLetter: boolean };
  OnboardingStep4: { firstName: string; lastName: string; username?: string; gender: string; age: number; location: string; showOnlyFirstLetter: boolean };
  PromptsScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; location: string; photos?: string[]; showOnlyFirstLetter: boolean };
  DatingPreferencesScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; location: string; photo?: string; photos?: string[]; showOnlyFirstLetter: boolean };
  OnboardingStep5: { firstName: string; lastName: string; username?: string; gender: string; age: number; location: string; photo?: string; photos?: string[]; showOnlyFirstLetter: boolean };
  LocationPermissionScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; location: string; photo?: string; photos?: string[]; datingGoal: string; showOnlyFirstLetter: boolean };
  InterestsSelectionScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; location: string; photo?: string; photos?: string[]; datingGoal: string; showOnlyFirstLetter: boolean };
  DevicePermissionsScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; location: string; photo?: string; photos?: string[]; datingGoal: string; showOnlyFirstLetter: boolean };
};

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigation() {
  return (
    <OnboardingStack.Navigator
      initialRouteName="AccountSelectionScreen"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 350,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        contentStyle: {
          backgroundColor: '#FFFCF1',
        },
      }}
    >
      <OnboardingStack.Screen 
        name="AccountSelectionScreen" 
        component={AccountSelectionScreen}
        options={{
          animation: 'fade',
          animationDuration: 300,
        }}
      />
      <OnboardingStack.Screen 
        name="ProfileSetupIntroScreen" 
        component={ProfileSetupIntroScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="UserOnboarding" 
        component={UserOnboarding}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="GenderSelectionScreen" 
        component={GenderSelectionScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="OnboardingStep2" 
        component={OnboardingStep2}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="NotificationPermissionScreen" 
        component={NotificationPermissionScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="ActivitySelectionScreen" 
        component={ActivitySelectionScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="MusicArtistsScreen" 
        component={MusicArtistsScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="OnboardingStep3" 
        component={OnboardingStep3}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="OnboardingStep4" 
        component={OnboardingStep4}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="PromptsScreen" 
        component={PromptsScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="DatingPreferencesScreen" 
        component={DatingPreferencesScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="OnboardingStep5" 
        component={OnboardingStep5}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="LocationPermissionScreen" 
        component={LocationPermissionScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="InterestsSelectionScreen" 
        component={InterestsSelectionScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="DevicePermissionsScreen" 
        component={DevicePermissionsScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
    </OnboardingStack.Navigator>
  );
}

