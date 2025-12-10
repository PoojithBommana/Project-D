import  { useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreenController() {

  const navigation: any = useNavigation();
  
<<<<<<< HEAD
  const checkUserStatus = async () => { 
=======
  const checkUserStatus = useCallback(async () => {
>>>>>>> 58bc6b7851b47c7227b8ca02a58841b60765c94c
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