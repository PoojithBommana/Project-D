export const API_ENDPOINTS: any = {
  AUTH: {
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    SOCIAL_LOGIN: '/auth/login/',
    USE_EXISTING_ACCOUNT: '/auth/account/existing/',
    CREATE_NEW_ACCOUNT: '/auth/account/new/',
    LOGOUT: '/auth/logout/',
    REFRESH_TOKEN: '/token/refresh/',
    GET_PROFILE: '/auth/profile/',
    VERIFY_FACE: '/auth/verify-face/',
    USERNAME_CHECK: '/auth/username/check/',
  },
  SWIPE: {
    GET_USERS: '/auth/swipe/users/',
    ACTION: '/auth/swipe/action/',
  },
  ONBOARDING: {
    UPDATE: '/auth/onboarding-update/',
    MUSIC_SEARCH: '/auth/onboarding/music/search/',
  },
  CONNECTIONS: {
    SEND: '/auth/connections/send/',
  },
  WARDROBE: {
    COLLECTION_ITEMS: '/wardrobe/collection-items/',
  },
};
