export const API_ENDPOINTS: any = {
  AUTH: {
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    SOCIAL_LOGIN: '/login/',
    USE_EXISTING_ACCOUNT: '/use-existing-account/',
    CREATE_NEW_ACCOUNT: '/create-new-account/',
    LOGOUT: '/logout/',
    REFRESH_TOKEN: '/token/refresh/',
    GET_PROFILE: '/profile/',
  },
  SWIPE: {
    GET_USERS: '/swipe/users/',
    ACTION: '/swipe/action/',
  },
  MUSIC: {
    FEATURED_PLAYLISTS: 'https://apis2.ccbp.in/spotify-clone/featured-playlists',
  },
  ONBOARDING: {
    UPDATE: '/onboarding/update/',
  },
};
