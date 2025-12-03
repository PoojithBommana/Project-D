import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountSelectionScreen from '../screen/OnboardingUser/AccountSelectionScreen';
import ProfileSetupIntroScreen from '../screen/OnboardingUser/ProfileSetupIntroScreen';
import UserOnboarding from '../screen/OnboardingUser/UserOnboarding';
import OnboardingStep2 from '../screen/OnboardingUser/OnboardingStep2';
import OnboardingStep3 from '../screen/OnboardingUser/OnboardingStep3';
import OnboardingStep4 from '../screen/OnboardingUser/OnboardingStep4';
import OnboardingStep5 from '../screen/OnboardingUser/OnboardingStep5';

export type OnboardingStackParamList = {
  AccountSelectionScreen: undefined;
  ProfileSetupIntroScreen: undefined;
  UserOnboarding: undefined;
  OnboardingStep2: { firstName: string; showOnlyFirstLetter: boolean };
  OnboardingStep3: { firstName: string; age: number; showOnlyFirstLetter: boolean };
  OnboardingStep4: { firstName: string; age: number; location: string; showOnlyFirstLetter: boolean };
  OnboardingStep5: { firstName: string; age: number; location: string; photo?: string; showOnlyFirstLetter: boolean };
};

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigation() {
  return (
    <OnboardingStack.Navigator
      initialRouteName="AccountSelectionScreen"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <OnboardingStack.Screen name="AccountSelectionScreen" component={AccountSelectionScreen} />
      <OnboardingStack.Screen name="ProfileSetupIntroScreen" component={ProfileSetupIntroScreen} />
      <OnboardingStack.Screen name="UserOnboarding" component={UserOnboarding} />
      <OnboardingStack.Screen name="OnboardingStep2" component={OnboardingStep2} />
      <OnboardingStack.Screen name="OnboardingStep3" component={OnboardingStep3} />
      <OnboardingStack.Screen name="OnboardingStep4" component={OnboardingStep4} />
      <OnboardingStack.Screen name="OnboardingStep5" component={OnboardingStep5} />
    </OnboardingStack.Navigator>
  );
}

