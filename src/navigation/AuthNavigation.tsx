import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RegisterScreen from '../screen/Auth/RegisterScreen'
import LoginScreen from '../screen/Auth/LoginScreen'

const AuthNavigationStack = createNativeStackNavigator()
export default function AuthNavigation() {
  return (
    <AuthNavigationStack.Navigator initialRouteName='LoginScreen' screenOptions={{headerShown:false}}>
        <AuthNavigationStack.Screen name='LoginScreen' component={LoginScreen}/>
        <AuthNavigationStack.Screen name='RegisterScreen' component={RegisterScreen}/>
    </AuthNavigationStack.Navigator>
  )
}