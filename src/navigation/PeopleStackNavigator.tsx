import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PeopleScreen from '../screen/Dashboard/SwipsScreen/PeopleScreen';
import ProfileDetailsScreen from '../screen/Dashboard/SwipsScreen/ProfileDetailsScreen';
import { Profile } from '../types/Profile';

export type PeopleStackParamList = {
  PeopleScreen: undefined;
  ProfileDetailsScreen: {
    profile: Profile;
  };
};

const Stack = createNativeStackNavigator<PeopleStackParamList>();

export default function PeopleStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
      }}
      initialRouteName="PeopleScreen"
    >
      <Stack.Screen name="PeopleScreen" component={PeopleScreen} />
      <Stack.Screen 
        name="ProfileDetailsScreen" 
        component={ProfileDetailsScreen}
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
