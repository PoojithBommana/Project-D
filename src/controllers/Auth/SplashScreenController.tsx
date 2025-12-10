import  { useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreenController() {

  const navigation: any = useNavigation();
  
  const checkUserStatus = useCallback(async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken !== null) {
        navigation.navigate('TabNavigation');
      } else {
        navigation.navigate('AuthNavigation');
      }
    } catch (error) {
      console.warn(JSON.stringify(error))
    }
  }, [navigation]);
  
  useEffect(() => {
    setTimeout(() => {
      checkUserStatus();
    }, 3000);
  }, [checkUserStatus]);
  return {};
}