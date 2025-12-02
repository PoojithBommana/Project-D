import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@auth_token';
const REFRESH_TOKEN_KEY = '@refresh_token';

export const storeToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    console.log('[TokenStorage] Access token stored successfully');
  } catch (error) {
    console.error('[TokenStorage] Error storing token:', error);
    throw error;
  }
};

export const storeRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    console.log('[TokenStorage] Refresh token stored successfully');
  } catch (error) {
    console.error('[TokenStorage] Error storing refresh token:', error);
    throw error;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('[TokenStorage] Error getting token:', error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('[TokenStorage] Error getting refresh token:', error);
    return null;
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY]);
    console.log('[TokenStorage] All tokens cleared');
  } catch (error) {
    console.error('[TokenStorage] Error clearing tokens:', error);
    throw error;
  }
};

export const hasToken = async (): Promise<boolean> => {
  try {
    const token = await getToken();
    return token !== null && token.trim().length > 0;
  } catch (error) {
    console.error('[TokenStorage] Error checking token:', error);
    return false;
  }
};
