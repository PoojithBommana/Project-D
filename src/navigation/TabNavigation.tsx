import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screen/Dashboard/PeopleScreen';
import PeopleScreen from '../screen/Dashboard/PeopleScreen';
import LikesScreen from '../screen/Dashboard/LikesScreen';
import WardrobeFeature from '../screen/Dashboard/AiCloset/WardrobeFeature';
import ChatScreen from '../screen/Dashboard/ChatScreen';
import ProfileScreen from '../screen/Dashboard/ProfileScreen';
import CustomTabBar from '../components/CustomTabBar';


const TabNavigator = createBottomTabNavigator()

export default function TabNavigation() {
  return (
    <TabNavigator.Navigator 
      initialRouteName='People' 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 0,
        },
        tabBarLabelStyle: {
          fontFamily: 'GTMaruMedium',
          fontSize: 10,
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
        <TabNavigator.Screen 
          name='People' 
          component={PeopleScreen}
          options={{
            tabBarLabel: 'People',
            tabBarIcon: ({ color, size }) => (
              <Icon name="account-group" size={size} color={color} />
            ),
          }}
        />
        <TabNavigator.Screen 
          name='Likes' 
          component={LikesScreen}
          options={{
            tabBarLabel: 'Likes',
            tabBarIcon: ({ color, size }) => (
              <Icon name="heart" size={size} color={color} />
            ),
          }}
        />
        <TabNavigator.Screen 
          name='AI' 
          component={WardrobeFeature}
          options={{
            tabBarLabel: 'AI',
            tabBarIcon: ({ color, size }) => (
              <Icon name="hanger" size={size} color={color} />
            ),
          }}
        />
        <TabNavigator.Screen 
          name='Chat' 
          component={ChatScreen}
          options={{
            tabBarLabel: 'Chat',
            tabBarIcon: ({ color, size }) => (
              <Icon name="message-text" size={size} color={color} />
            ),
          }}
        />
        <TabNavigator.Screen 
          name='Profile' 
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Icon name="account-circle" size={size} color={color} />
            ),
          }}
        />
    </TabNavigator.Navigator>
  )
}