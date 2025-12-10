import  { useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreenController() {

  const navigation: any = useNavigation();
  
  const checkUserStatus = useCallback(async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const legacyToken = await AsyncStorage.getItem('authToken'); // backward compatibility
      const onboardingComplete = await AsyncStorage.getItem('onboarding_complete');

      const hasToken = Boolean(accessToken || legacyToken);
      const isOnboardingDone = onboardingComplete === 'true';

      if (!hasToken) {
        navigation.navigate('AuthNavigation');
        return;
      }

      if (isOnboardingDone) {
        navigation.navigate('TabNavigation');
        return;
      }

      // Token exists but onboarding not complete: force re-auth
      navigation.navigate('AuthNavigation');
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