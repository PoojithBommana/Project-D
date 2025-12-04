export const API_ENDPOINTS: any = {
  AUTH: {
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    SOCIAL_LOGIN: '/api/auth/social-login/',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/api/token/refresh/',
  },
  PROFILE: {
    GET_PROFILES: '/profiles',
    GET_PROFILE: '/profiles/:id',
    UPDATE_PROFILE: '/profiles/:id',
    SWIPE_ACTION: '/profiles/swipe',
    GET_MATCHES: '/profiles/matches',
  },
  MUSIC: {
    FEATURED_PLAYLISTS: 'https://apis2.ccbp.in/spotify-clone/featured-playlists',
  },
};
