import { View, Text, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { postApiCall } from '../config/apiCall';
import { hasToken, isOnboardingComplete } from '../utils/tokenStorage';

export default function SplashScreenController() {
  const [isLoading, setIsLoading] = useState();

  const navigation: any = useNavigation();
  const checkUserStatus = async () => {
    try {
      const tokenExists = await hasToken();
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (tokenExists || authToken) {
        const onboardingComplete = await isOnboardingComplete();
        
        if (onboardingComplete) {
          navigation.navigate('TabNavigation');
        } else {
          navigation.navigate('OnboardingNavigation');
        }
      } else {
        navigation.navigate('AuthNavigation');
      }
    } catch (error) {
      navigation.navigate('AuthNavigation');
    }
  };
  
  useEffect(() => {
    setTimeout(() => {
      checkUserStatus();
    }, 3000);
  }, []);
  //   const apiCall = async () => {
  //     const params = {};
  //     const apiResponse: any = postApiCall('GET', 'AUTH', 'SEND_OTP', params);

  //     if (apiResponse?.response?.ResponseCode == 'Success') {
  //       console.log(apiResponse, '---apiResponse');
  //     } else if (apiResponse?.response?.ResponseCode == 'Fail') {
  //       // this.setState({ loading: false });
  //       Alert.alert('', apiResponse?.response?.ResponseMessage);
  //     } else if (apiResponse?.error) {
  //       if (apiResponse?.response?.Message !== '') {
  //         // this.setState({ loading: false });
  //         Alert.alert('', apiResponse?.response?.Message);
  //       }
  //     } else {
  //       // this.setState({ loading: false });
  //     }
  //   };
  return {};
}
