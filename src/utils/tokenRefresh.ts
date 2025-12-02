import { getToken, getRefreshToken, storeToken } from './tokenStorage';
import { authController } from '../controllers/AuthController';

interface DecodedToken {
  exp?: number;
  iat?: number;
}

const base64Decode = (base64: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = '';
  let i = 0;
  
  base64 = base64.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  
  while (i < base64.length) {
    const enc1 = chars.indexOf(base64.charAt(i++));
    const enc2 = chars.indexOf(base64.charAt(i++));
    const enc3 = chars.indexOf(base64.charAt(i++));
    const enc4 = chars.indexOf(base64.charAt(i++));
    
    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;
    
    str += String.fromCharCode(chr1);
    
    if (enc3 !== 64) str += String.fromCharCode(chr2);
    if (enc4 !== 64) str += String.fromCharCode(chr3);
  }
  
  return str;
};

const decodeJWT = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      base64Decode(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('[TokenRefresh] Error decoding JWT:', error);
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  const bufferTime = 60000;
  
  return currentTime >= (expirationTime - bufferTime);
};

let isRefreshing = false;

export const refreshTokenIfNeeded = async (): Promise<string | null> => {
  if (isRefreshing) {
    return null;
  }

  try {
    const accessToken = await getToken();
    if (!accessToken) {
      return null;
    }

    if (!isTokenExpired(accessToken)) {
      return accessToken;
    }

    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      console.warn('[TokenRefresh] No refresh token available');
      return null;
    }

    isRefreshing = true;
    console.log('[TokenRefresh] Access token expired, refreshing...');
    
    try {
      const response = await authController.refreshToken(refreshToken);

      if (response && response.access) {
        await storeToken(response.access);
        console.log('[TokenRefresh] Token refreshed successfully');
        return response.access;
      }
    } finally {
      isRefreshing = false;
    }

    return null;
  } catch (error) {
    isRefreshing = false;
    console.error('[TokenRefresh] Error refreshing token:', error);
    return null;
  }
};

export const getValidToken = async (): Promise<string | null> => {
  const refreshedToken = await refreshTokenIfNeeded();
  if (refreshedToken) {
    return refreshedToken;
  }

  const currentToken = await getToken();
  if (currentToken && !isTokenExpired(currentToken)) {
    return currentToken;
  }

  return null;
};

