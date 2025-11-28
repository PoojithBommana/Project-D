// API Endpoints
export const API_ENDPOINTS:any = {
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
