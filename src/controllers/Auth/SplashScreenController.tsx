import { useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getApiCall } from '../../config/apiCall';

export default function SplashScreenController() {
  const navigation: any = useNavigation();

  const resetSessionAndGoToAuth = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'authToken', 'onboarding_complete']);
    } catch (e) {
      // Ignore storage errors – we still navigate to auth
    }
    navigation.navigate('AuthNavigation');
  }, [navigation]);

  const checkUserStatus = useCallback(async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const legacyToken = await AsyncStorage.getItem('authToken'); // backward compatibility
      const onboardingComplete = await AsyncStorage.getItem('onboarding_complete');

      const token = accessToken || legacyToken;
      const hasToken = Boolean(token);
      const isOnboardingDoneFlag = onboardingComplete === 'true';

      // If no local token, go to auth flow
      if (!hasToken) {
        navigation.navigate('AuthNavigation');
        return;
      }

      // We have a token – verify it with backend profile API
      const profileResponse = await getApiCall('AUTH', 'GET_PROFILE', token || undefined);

      if (profileResponse?.error) {
        // Token invalid / user not found / other auth error
        await resetSessionAndGoToAuth();
        return;
      }

      const profile = profileResponse?.response?.profile || profileResponse?.response;
      const isOnboardingCompleteBackend =
        profile?.is_onboarding_complete === true ||
        profile?.onboarding_complete === true;

      const isOnboardingDone = isOnboardingDoneFlag || isOnboardingCompleteBackend;

      if (isOnboardingDone) {
        // Valid token and onboarding complete → go to main app
        navigation.navigate('TabNavigation');
      } else {
        // Valid token but onboarding not finished → go to onboarding flow
        navigation.navigate('OnboardingNavigation');
      }
    } catch (error) {
      console.warn('[SplashScreenController] Error checking user status:', JSON.stringify(error));
      // On any unexpected error, fall back to auth flow
      navigation.navigate('AuthNavigation');
    }
  }, [navigation, resetSessionAndGoToAuth]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkUserStatus();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [checkUserStatus]);

  return null;
}