import  { useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreenController() {

  const navigation: any = useNavigation();
  
  const checkUserStatus = useCallback(async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const legacyToken = await AsyncStorage.getItem('authToken'); // backward compatibility

      const hasToken = Boolean(accessToken || legacyToken);

      // If we have any session token, take user straight to the main app
      // (treat missing onboarding flag as completed to avoid getting stuck).
      if (hasToken) {
        navigation.navigate('OnboardingNavigation', { screen: 'ProfileSetupIntroScreen' });
        return;
      }

      // No session found: show auth flow
      navigation.navigate('OnboardingNavigation', { screen: 'ProfileSetupIntroScreen' });
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