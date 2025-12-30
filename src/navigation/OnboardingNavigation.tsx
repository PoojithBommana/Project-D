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
import HeightScreen from '../screen/OnboardingUser/HeightScreen';
import LifestyleHabitsScreen from '../screen/OnboardingUser/LifestyleHabitsScreen';
import InterestsSelectionV2Screen from '../screen/OnboardingUser/InterestsSelectionV2Screen';
import ValuesScreen from '../screen/OnboardingUser/ValuesScreen';
import BeliefsScreen from '../screen/OnboardingUser/BeliefsScreen';
import CausesCommunitiesScreen from '../screen/OnboardingUser/CausesCommunitiesScreen';
import OnboardingStep3 from '../screen/OnboardingUser/OnboardingStep3';
import OnboardingStep4 from '../screen/OnboardingUser/OnboardingStep4';
import PromptsScreen from '../screen/OnboardingUser/PromptsScreen';
import DatingPreferencesScreen from '../screen/OnboardingUser/DatingPreferencesScreen';
import LocationPermissionScreen from '../screen/OnboardingUser/LocationPermissionScreen';
import InterestsSelectionScreen from '../screen/OnboardingUser/InterestsSelectionScreen';
import DevicePermissionsScreen from '../screen/OnboardingUser/DevicePermissionsScreen';
import LivePhotoScreen from '../screen/OnboardingUser/LivePhotoScreen';
import UsernameInputScreen from '../screen/OnboardingUser/UsernameInputScreen';

export type OnboardingStackParamList = {
  AccountSelectionScreen: { existingUser?: any; firebaseUid?: string; email?: string; phone?: string; canCreateNewAccount?: boolean } | undefined;
  ProfileSetupIntroScreen: undefined;
  UserOnboarding: undefined;
  UsernameInputScreen: { firstName: string; lastName: string; showOnlyFirstLetter: boolean };
  GenderSelectionScreen: { firstName: string; lastName: string; username?: string; showOnlyFirstLetter: boolean };
  OnboardingStep2: { firstName: string; lastName: string; username?: string; gender: string; showOnlyFirstLetter: boolean };
  NotificationPermissionScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; showOnlyFirstLetter: boolean };
  ActivitySelectionScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; showOnlyFirstLetter: boolean };
  MusicArtistsScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; showOnlyFirstLetter: boolean; currently?: string };
  HeightScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; showOnlyFirstLetter: boolean; height?: number; currently?: string; music_artist_ids?: string[]; music_genres?: string[] };
  LifestyleHabitsScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; showOnlyFirstLetter: boolean; height?: number; habits?: { drinking?: string; smoking?: string }; music_artist_ids?: string[]; music_genres?: string[] };
  InterestsSelectionV2Screen: { firstName: string; lastName: string; username?: string; gender: string; age: number; showOnlyFirstLetter: boolean; height?: number; habits?: { drinking?: string; smoking?: string }; interests?: string[]; music_artist_ids?: string[]; music_genres?: string[] };
  ValuesScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; showOnlyFirstLetter: boolean; height?: number; habits?: { drinking?: string; smoking?: string }; interests?: string[]; values?: string[]; music_artist_ids?: string[]; music_genres?: string[] };
  BeliefsScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; showOnlyFirstLetter: boolean; height?: number; habits?: { drinking?: string; smoking?: string }; interests?: string[]; values?: string[]; datingGoals?: string[]; beliefs?: { religion: string[]; politics: string[] }; music_artist_ids?: string[]; music_genres?: string[] };
  CausesCommunitiesScreen: { firstName: string; lastName: string; username?: string; gender: string; age: number; showOnlyFirstLetter: boolean; height?: number; habits?: { drinking?: string; smoking?: string }; interests?: string[]; values?: string[]; datingGoals?: string[]; beliefs?: { religion: string[]; politics: string[] } | undefined; causes?: string[]; music_artist_ids?: string[]; music_genres?: string[] };
  OnboardingStep3: { firstName: string; lastName: string; username?: string; gender: string; age: number; showOnlyFirstLetter: boolean; height?: number; habits?: { drinking?: string; smoking?: string }; interests?: string[]; values?: string[]; datingGoals?: string[]; beliefs?: { religion: string[]; politics: string[] } | undefined; causes?: string[] | undefined; openingMove?: { id: string; label: string; customText?: string }; music_artist_ids?: string[]; music_genres?: string[] };
  OnboardingStep4: {
    firstName: string;
    lastName: string;
    username?: string;
    gender: string;
    age: number;
    location: string;
    showOnlyFirstLetter: boolean;
    music_artist_ids?: string[];
    music_genres?: string[];
    beliefs?: { religion: string[]; politics: string[] };
    causes?: string[];
  };
  PromptsScreen: {
    firstName: string;
    lastName: string;
    username?: string;
    gender: string;
    age: number;
    location: string;
    city?: string;
    photos?: string[];
    showOnlyFirstLetter: boolean;
    bio?: string;
    birthday?: number;
    music_artist_ids?: string[];
    music_genres?: string[];
    beliefs?: { religion: string[]; politics: string[] };
    causes?: string[];
    fromLivePhotoRetry?: boolean;
  };
  DatingPreferencesScreen: {
    firstName: string;
    lastName: string;
    username?: string;
    gender: string;
    age: number;
    location: string;
    city?: string;
    photo?: string;
    photos?: string[];
    showOnlyFirstLetter: boolean;
    bio?: string;
    birthday?: number;
    music_artist_ids?: string[];
    music_genres?: string[];
    beliefs?: { religion: string[]; politics: string[] };
    causes?: string[];
  };
  LocationPermissionScreen: {
    firstName: string;
    lastName: string;
    username?: string;
    gender: string;
    age: number;
    location: string;
    photo?: string;
    photos?: string[];
    datingGoal: string;
    showOnlyFirstLetter: boolean;
    interested_in_genders: string[];
    interested_age_range: { min: number; max: number };
    bio?: string;
    birthday?: number;
    religion?: string;
    causes_communities?: string[];
    music_artist_ids?: string[];
    music_genres?: string[];
  };
  InterestsSelectionScreen: {
    firstName: string;
    lastName: string;
    username?: string;
    gender: string;
    age: number;
    location: string;
    photo?: string;
    photos?: string[];
    datingGoal: string;
    showOnlyFirstLetter: boolean;
    interested_in_genders: string[];
    interested_age_range: { min: number; max: number };
    bio?: string;
    birthday?: number;
    latitude?: number;
    longitude?: number;
    religion?: string;
    causes_communities?: string[];
    music_artist_ids?: string[];
    music_genres?: string[];
  };
  DevicePermissionsScreen: {
    firstName: string;
    lastName: string;
    username?: string;
    gender: string;
    age: number;
    location: string;
    photo?: string;
    photos?: string[];
    datingGoal: string;
    showOnlyFirstLetter: boolean;
    interested_in_genders: string[];
    interested_age_range: { min: number; max: number };
    hobbies: string[];
    currently?: string;
    known_languages?: string[];
    height_cm?: number;
    drinking?: string;
    smoking?: string;
    activity_interests?: string[];
    qualities?: string[];
    zodiac_sign?: string;
    music_genres?: string[];
    music_artist_ids?: string[];
    religion?: string;
    causes_communities?: string[];
    latitude?: number;
    longitude?: number;
    bio?: string;
    birthday?: number;
  };
  LivePhotoScreen: { firstName: string };
};

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigation() {
  return (
    <OnboardingStack.Navigator
      initialRouteName="ProfileSetupIntroScreen"
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
        name="UsernameInputScreen" 
        component={UsernameInputScreen}
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
        name="HeightScreen" 
        component={HeightScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="LifestyleHabitsScreen" 
        component={LifestyleHabitsScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="InterestsSelectionV2Screen" 
        component={InterestsSelectionV2Screen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="ValuesScreen" 
        component={ValuesScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="BeliefsScreen" 
        component={BeliefsScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
      <OnboardingStack.Screen 
        name="CausesCommunitiesScreen" 
        component={CausesCommunitiesScreen}
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
      <OnboardingStack.Screen 
        name="LivePhotoScreen" 
        component={LivePhotoScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      />
    </OnboardingStack.Navigator>
  );
}

