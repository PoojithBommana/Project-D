import { View, Text, StyleSheet, Platform } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from '@react-native-community/blur';
import PeopleScreen from '../screen/Dashboard/SwipsScreen/PeopleScreen';
import LikesScreen from '../screen/Dashboard/LikesScreen';
import WardrobeFeature from '../screen/Dashboard/AiCloset/WardrobeFeature';
import ChatScreen from '../screen/Dashboard/ChatScreen';
import ProfileScreen from '../screen/Dashboard/ProfileScreen';
import { hp } from '../utils/responsive';

// Import icons - adjust based on your icon library
// Example using react-native-vector-icons
import Icon from 'react-native-vector-icons/Ionicons';

const TabNavigator = createBottomTabNavigator()

export default function TabNavigation() {
  return (
    <TabNavigator.Navigator 
      initialRouteName='People' 
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: 'transparent',
          borderRadius: 25,
          margin:hp(10),
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
          overflow: 'hidden',
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              blurType="light"
              blurAmount={10}
              style={StyleSheet.absoluteFill}
              reducedTransparencyFallbackColor="rgba(255, 255, 255, 0.8)"
            />
          ) : (
            <View style={styles.androidGlass} />
          )
        ),
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <TabNavigator.Screen 
        name='People' 
        component={PeopleScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? "people" : "people-outline"} size={size} color={color} />
          ),
        }}
      />
      <TabNavigator.Screen 
        name='Likes' 
        component={LikesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? "heart" : "heart-outline"} size={size} color={color} />
          ),
        }}
      />
      <TabNavigator.Screen 
        name='AI' 
        component={WardrobeFeature}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? "sparkles" : "sparkles-outline"} size={size} color={color} />
          ),
        }}
      />
      <TabNavigator.Screen 
        name='Chat' 
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? "chatbubble" : "chatbubble-outline"} size={size} color={color} />
          ),
        }}
      />
      <TabNavigator.Screen 
        name='Profile' 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? "person" : "person-outline"} size={size} color={color} />
          ),
        }}
      />
    </TabNavigator.Navigator>
  )
}

const styles = StyleSheet.create({
  androidGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});