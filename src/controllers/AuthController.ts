import { API_ENDPOINTS } from '../config/endpoints';
import { postApiCall } from '../config/apiCall';

const ENABLE_BACKEND_API = true;

export interface SendOTPRequest {
  countryCode: string;
  phoneNumber: string;
}

export interface VerifyOTPRequest {
  otp: string;
  countryCode: string;
  phoneNumber: string;
  sessionId?: string;
}

export interface SocialLoginRequest {
  id_token: string;
}

export interface SocialLoginResponse {
  access: string;
  refresh: string;
  user_id: number;
}

export interface SendOTPResponse {
  success: boolean;
  message?: string;
  sessionId?: string;
  error?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    phoneNumber: string;
    email?: string;
    name?: string;
  };
  error?: string;
}

export interface GoogleLoginRequest {
  idToken: string;
  firebaseIdToken?: string;
  uid: string;
  email?: string;
  name?: string;
  photoURL?: string;
}

export interface FacebookLoginRequest {
  accessToken: string;
  email?: string;
  name?: string;
  photoURL?: string;
  uid?: string;
}

export interface GoogleLoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    photoURL?: string;
    phoneNumber?: string;
  };
  error?: string;
}

export interface FacebookLoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email?: string;
    name?: string;
    photoURL?: string;
    phoneNumber?: string;
  };
  error?: string;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class AuthController {
  async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    try {
      const apiResponse: any = await postApiCall('POST', 'AUTH', 'SEND_OTP', request);

      if (apiResponse?.response?.ResponseCode == 'Success') {
        return {
          success: true,
          message: apiResponse?.response?.ResponseMessage,
          sessionId: apiResponse?.response?.sessionId,
        };
      } else if (apiResponse?.response?.ResponseCode == 'Fail') {
        return {
          success: false,
          error: apiResponse?.response?.ResponseMessage || 'Failed to send OTP',
        };
      } else if (apiResponse?.error) {
        return {
          success: false,
          error: apiResponse?.response?.Message || 'Failed to send OTP',
        };
      } else {
        return {
          success: false,
          error: 'Failed to send OTP',
        };
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send OTP',
      };
    }
  }

  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    try {
      const apiResponse: any = await postApiCall('POST', 'AUTH', 'VERIFY_OTP', request);

      if (apiResponse?.response?.ResponseCode == 'Success') {
        return {
          success: true,
          message: apiResponse?.response?.ResponseMessage,
          token: apiResponse?.response?.token,
          refreshToken: apiResponse?.response?.refreshToken,
          user: apiResponse?.response?.user,
        };
      } else if (apiResponse?.response?.ResponseCode == 'Fail') {
        return {
          success: false,
          error: apiResponse?.response?.ResponseMessage || 'Failed to verify OTP',
        };
      } else if (apiResponse?.error) {
        return {
          success: false,
          error: apiResponse?.response?.Message || 'Failed to verify OTP',
        };
      } else {
        return {
          success: false,
          error: 'Failed to verify OTP',
        };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify OTP',
      };
    }
  }

  async resendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    try {
      const apiResponse: any = await postApiCall('POST', 'AUTH', 'RESEND_OTP', request);

      if (apiResponse?.response?.ResponseCode == 'Success') {
        return {
          success: true,
          message: apiResponse?.response?.ResponseMessage,
          sessionId: apiResponse?.response?.sessionId,
        };
      } else if (apiResponse?.response?.ResponseCode == 'Fail') {
        return {
          success: false,
          error: apiResponse?.response?.ResponseMessage || 'Failed to resend OTP',
        };
      } else if (apiResponse?.error) {
        return {
          success: false,
          error: apiResponse?.response?.Message || 'Failed to resend OTP',
        };
      } else {
        return {
          success: false,
          error: 'Failed to resend OTP',
        };
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resend OTP',
      };
    }
  }

  async socialLogin(firebaseIdToken: string): Promise<SocialLoginResponse | null> {
    if (!ENABLE_BACKEND_API) {
      console.log('[API] Backend API disabled. Skipping social login API call.');
      return null;
    }

    if (!firebaseIdToken || firebaseIdToken.trim().length === 0) {
      console.error('[API] Firebase ID token is required for social login');
      throw new Error('Firebase ID token is required');
    }

    try {
      const requestBody: SocialLoginRequest = {
        id_token: firebaseIdToken,
      };

      const apiResponse: any = await postApiCall('POST', 'AUTH', 'SOCIAL_LOGIN', requestBody);

      if (apiResponse?.response?.access && apiResponse?.response?.refresh) {
        return {
          access: apiResponse?.response?.access,
          refresh: apiResponse?.response?.refresh,
          user_id: apiResponse?.response?.user_id,
        };
      } else if (apiResponse?.error) {
        const errorMessage = apiResponse?.response?.Message || 
                           apiResponse?.response?.message || 
                           'Backend server unavailable';
        
        if (errorMessage.includes('Network') || errorMessage.includes('timeout') || errorMessage.includes('ECONNREFUSED')) {
          console.warn('[API] Social login failed (non-blocking):', errorMessage);
        } else {
          console.warn('[API] Social login error (non-blocking):', errorMessage);
        }
        return null;
      } else {
        console.warn('[API] Social login failed (non-blocking): Invalid response format');
        return null;
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      if (errorMessage.includes('Network') || errorMessage.includes('timeout') || errorMessage.includes('ECONNREFUSED')) {
        console.warn('[API] Social login network error (non-blocking):', errorMessage);
      } else {
        console.warn('[API] Social login error (non-blocking):', errorMessage);
      }
      return null;
    }
  }

  async googleLogin(request: GoogleLoginRequest): Promise<GoogleLoginResponse> {
    console.warn('[API] googleLogin() is deprecated. Use socialLogin() instead.');
    
    if (!ENABLE_BACKEND_API) {
      return {
        success: false,
        error: 'Backend API is disabled',
      };
    }

    if (!request.firebaseIdToken) {
      return {
        success: false,
        error: 'Firebase ID token is required',
      };
    }

    try {
      const response = await this.socialLogin(request.firebaseIdToken);
      
      if (!response) {
        return {
          success: false,
          error: 'Backend server unavailable',
        };
      }

      return {
        success: true,
        token: response.access,
        refreshToken: response.refresh,
        user: {
          id: response.user_id.toString(),
          email: request.email || '',
          name: request.name || '',
          photoURL: request.photoURL,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to login',
      };
    }
  }

  async facebookLogin(request: FacebookLoginRequest): Promise<FacebookLoginResponse> {
    console.warn('[API] facebookLogin() is deprecated. Use socialLogin() instead.');
    
    if (!ENABLE_BACKEND_API) {
      return {
        success: false,
        error: 'Backend API is disabled',
      };
    }

    return {
      success: false,
      error: 'Please use the new socialLogin() method with Firebase ID token',
    };
  }

  async logout(): Promise<LogoutResponse> {
    try {
      const apiResponse: any = await postApiCall('POST', 'AUTH', 'LOGOUT', {});

      if (apiResponse?.response?.ResponseCode == 'Success') {
        return {
          success: true,
          message: apiResponse?.response?.ResponseMessage,
        };
      } else if (apiResponse?.response?.ResponseCode == 'Fail') {
        return {
          success: false,
          error: apiResponse?.response?.ResponseMessage || 'Failed to logout',
        };
      } else if (apiResponse?.error) {
        return {
          success: false,
          error: apiResponse?.response?.Message || 'Failed to logout',
        };
      } else {
        return {
          success: false,
          error: 'Failed to logout',
        };
      }
    } catch (error) {
      console.error('Error logging out:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to logout',
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    try {
      const apiResponse: any = await postApiCall('POST', 'AUTH', 'REFRESH_TOKEN', { refresh: refreshToken });

      if (apiResponse?.response?.ResponseCode == 'Success') {
        return {
          access: apiResponse?.response?.access,
        };
      } else if (apiResponse?.response?.ResponseCode == 'Fail') {
        throw new Error(apiResponse?.response?.ResponseMessage || 'Failed to refresh token');
      } else if (apiResponse?.error) {
        throw new Error(apiResponse?.response?.Message || 'Failed to refresh token');
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
}

export const authController = new AuthController();

