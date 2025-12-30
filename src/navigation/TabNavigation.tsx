import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PeopleStackNavigator from './PeopleStackNavigator';
import LikesScreen from '../screen/Dashboard/LikesScreen';
import ChatScreen from '../screen/Dashboard/ChatScreen';
import ProfileScreen from '../screen/Dashboard/ProfileScreen';
import DiscoverScreen from '../screen/Dashboard/DiscoverScreen';
import CustomBottomTabBar from './CustomBottomTabBar';

const TabNavigator = createBottomTabNavigator()

export default function TabNavigation() {
  return (
    <TabNavigator.Navigator 
      initialRouteName='People' 
      tabBar={(props) => <CustomBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <TabNavigator.Screen 
        name='Profile' 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <TabNavigator.Screen 
        name='Discover' 
        component={DiscoverScreen}
        options={{
          tabBarLabel: 'Discover',
        }}
      />
      <TabNavigator.Screen 
        name='People' 
        component={PeopleStackNavigator}
        options={{
          tabBarLabel: 'People',
        }}
      />
      <TabNavigator.Screen 
        name='Likes' 
        component={LikesScreen}
        options={{
          tabBarLabel: 'Liked You',
        }}
      />
      <TabNavigator.Screen 
        name='Chat' 
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chats',
        }}
      />
    </TabNavigator.Navigator>
  )
}