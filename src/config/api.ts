/**
 * API Configuration
 * 
 * Centralized API configuration for the application
 */

// Base API URL - Update this with your actual backend URL
// For Android Emulator: Use 'http://10.0.2.2:PORT' for localhost
// For iOS Simulator: Use 'http://localhost:PORT' or 'http://127.0.0.1:PORT'
// For Physical Device: Use your computer's IP address 'http://YOUR_IP:PORT'
export const API_BASE_URL = __DEV__ 
  ? 'https://api.dilmil.com' // Development - Update with your backend URL
  : 'https://api.dilmil.com'; // Production

// Enable/disable backend API calls (useful for development when backend is not available)
export const ENABLE_BACKEND_API = true; // Set to false to skip backend calls

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    GOOGLE_LOGIN: '/auth/google-login',
    FACEBOOK_LOGIN: '/auth/facebook-login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  // Profile endpoints
  PROFILE: {
    GET_PROFILES: '/profiles',
    GET_PROFILE: '/profiles/:id',
    UPDATE_PROFILE: '/profiles/:id',
    SWIPE_ACTION: '/profiles/swipe',
    GET_MATCHES: '/profiles/matches',
  },
};

// API Timeout (in milliseconds)
export const API_TIMEOUT = 30000; // 30 seconds

// Default headers
export const getDefaultHeaders = (): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

// Headers with authentication token
export const getAuthHeaders = (token?: string): Record<string, string> => {
  const headers = getDefaultHeaders();
  if (token) {
    return {
      ...headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  return headers;
};

