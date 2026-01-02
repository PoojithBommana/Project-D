import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiscoverScreen from '../screen/Dashboard/DiscoverScreen';
import DiscoverProfileDetailsScreen from '../screen/Dashboard/Discover/DiscoverProfileDetailsScreen';
import { DiscoverProfile } from '../types/Discover';

export type DiscoverStackParamList = {
  DiscoverScreen: undefined;
  DiscoverProfileDetailsScreen: {
    profile: DiscoverProfile;
    context?: {
      source: 'top_snixxed' | 'ai_picks' | 'vibe' | 'nearby' | 'style_match' | 'conversation_starter' | 'new_users' | 'search';
      vibeId?: string;
      conversationStarterId?: string;
      searchQuery?: string;
    };
  };
};

const Stack = createNativeStackNavigator<DiscoverStackParamList>();

export default function DiscoverStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName="DiscoverScreen"
    >
      <Stack.Screen name="DiscoverScreen" component={DiscoverScreen} />
      <Stack.Screen
        name="DiscoverProfileDetailsScreen"
        component={DiscoverProfileDetailsScreen}
        options={{
          animation: 'slide_from_bottom',
          animationDuration: 400,
          gestureEnabled: true,
          gestureDirection: 'vertical',
          presentation: 'transparentModal',
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
    </Stack.Navigator>
  );
}

