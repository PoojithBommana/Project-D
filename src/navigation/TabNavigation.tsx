import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/Dashboard/PeopleScreen';
import PeopleScreen from '../screen/Dashboard/PeopleScreen';
import LikesScreen from '../screen/Dashboard/LikesScreen';
import AIScreen from '../screen/Dashboard/AIScreen';
import ChatScreen from '../screen/Dashboard/ChatScreen';
import ProfileScreen from '../screen/Dashboard/ProfileScreen';


const TabNavigator = createBottomTabNavigator()

export default function TabNavigation() {
  return (
    <TabNavigator.Navigator initialRouteName='People' screenOptions={{headerShown:false}}>
        <TabNavigator.Screen name='People' component={PeopleScreen}  />
        <TabNavigator.Screen name='Likes' component={LikesScreen}  />
        <TabNavigator.Screen name='AI' component={AIScreen}  />
        <TabNavigator.Screen name='Chat' component={ChatScreen}  />
        <TabNavigator.Screen name='Profile' component={ProfileScreen}  />
    </TabNavigator.Navigator>
  )
}