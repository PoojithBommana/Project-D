import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RegisterScreen from '../screen/Auth/RegisterScreen'
import LoginScreen from '../screen/Auth/LoginScreen'
import AuthOptionsScreen from '../screen/Auth/AuthOptionsScreen'
import VerifyPhoneNumberScreen from '../screen/Auth/VerifyPhoneNumberScreen'
import AccountDetailsNotFound from '../screen/Auth/AccountDetailsNotFound'

export type AuthStackParamList = {
  LoginScreen: undefined;
  AuthOptionsScreen: undefined;
  RegisterScreen: undefined;
  VerifyPhoneNumberScreen: {
    countryCode?: string;
    phoneNumber?: string;
  } | undefined;
  AccountNotFound: undefined;
  Home:undefined
  TabNavigation:any
  People:undefined
  Likes:undefined
  AI:undefined
  Chat:undefined
  Profile:undefined
  UserOnboarding:undefined
};

const AuthNavigationStack = createNativeStackNavigator<AuthStackParamList>()
export default function AuthNavigation() {
  return (
    <AuthNavigationStack.Navigator initialRouteName='LoginScreen' screenOptions={{headerShown:false}}>
        <AuthNavigationStack.Screen name='LoginScreen' component={LoginScreen}/>
        <AuthNavigationStack.Screen name='RegisterScreen' component={RegisterScreen}/>
        <AuthNavigationStack.Screen name='AuthOptionsScreen' component={AuthOptionsScreen}/>
        <AuthNavigationStack.Screen name='VerifyPhoneNumberScreen' component={VerifyPhoneNumberScreen}/>
        <AuthNavigationStack.Screen name='AccountNotFound' component={AccountDetailsNotFound}/>
    </AuthNavigationStack.Navigator>
  )
}