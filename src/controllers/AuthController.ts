/**
 * AuthController
 * 
 * Controller for all authentication-related API calls.
 * Handles communication with backend authentication endpoints.
 * 
 * Features:
 * - Send OTP
 * - Verify OTP
 * - Resend OTP
 * - Google Login
 * - Facebook Login
 * - Logout
 */

import { API_BASE_URL, API_ENDPOINTS, getDefaultHeaders, getAuthHeaders, API_TIMEOUT, ENABLE_BACKEND_API } from '../config/endpoints';

// Request Interfaces
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

export interface GoogleLoginRequest {
  idToken: string;        // Google ID token for backend verification
  uid: string;            // Firebase User UID (REQUIRED - primary identifier)
  email?: string;          // User email from Firebase
  name?: string;          // User display name from Firebase
  photoURL?: string;      // User profile photo URL from Firebase
}

export interface FacebookLoginRequest {
  accessToken: string;
  email?: string;
  name?: string;
  photoURL?: string;
  uid?: string;
}

// Response Interfaces
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

/**
 * AuthController Class
 * 
 * Handles all authentication API operations
 */
class AuthController {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Makes an API request with timeout and error handling
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log(`[API] Making request to: ${url}`);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...getDefaultHeaders(),
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your internet connection.');
      }
      
      // Network errors
      if (error.message?.includes('Network request failed') || 
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('NetworkError')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection or ensure the backend server is running.');
      }
      
      // Re-throw with better message
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Sends OTP to the provided phone number
   */
  async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    try {
      const response = await this.makeRequest<SendOTPResponse>(
        API_ENDPOINTS.AUTH.SEND_OTP,
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );
      return response;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send OTP',
      };
    }
  }

  /**
   * Verifies the OTP code
   */
  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    try {
      const response = await this.makeRequest<VerifyOTPResponse>(
        API_ENDPOINTS.AUTH.VERIFY_OTP,
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );
      return response;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify OTP',
      };
    }
  }

  /**
   * Resends OTP to the provided phone number
   */
  async resendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    try {
      const response = await this.makeRequest<SendOTPResponse>(
        API_ENDPOINTS.AUTH.RESEND_OTP,
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );
      return response;
    } catch (error) {
      console.error('Error resending OTP:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resend OTP',
      };
    }
  }

  /**
   * Sends Google login data to backend
   * POST /auth/google-login
   * 
   * Sends:
   * - idToken: Google ID token for verification
   * - uid: Firebase User UID (primary identifier - matches Firebase Console)
   * - email, name, photoURL: User profile data
   * 
   * Returns success: false if backend is unavailable, but doesn't throw
   */
  async googleLogin(request: GoogleLoginRequest): Promise<GoogleLoginResponse> {
    // Skip backend call if disabled
    if (!ENABLE_BACKEND_API) {
      console.log('[API] Backend API disabled. Skipping Google login API call.');
      return {
        success: false,
        error: 'Backend API is disabled',
      };
    }

    // Validate required fields
    if (!request.uid) {
      console.error('[API] Firebase UID is required for Google login');
      return {
        success: false,
        error: 'Firebase UID is required',
      };
    }

    try {
      console.log('[API] Sending Google login to backend:', {
        uid: request.uid,
        email: request.email,
        hasIdToken: !!request.idToken,
      });
      
      const response = await this.makeRequest<GoogleLoginResponse>(
        API_ENDPOINTS.AUTH.GOOGLE_LOGIN,
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );
      return response;
    } catch (error) {
      console.error('Error in Google login API:', error);
      
      // Return graceful failure - Firebase auth still succeeded
      // Backend sync can happen later
      return {
        success: false,
        error: error instanceof Error 
          ? error.message 
          : 'Backend server unavailable. Firebase authentication succeeded, but data sync failed.',
        // Note: Firebase auth still works, just backend sync failed
      };
    }
  }

  /**
   * Sends Facebook login data to backend
   * POST /auth/facebook-login
   */
  async facebookLogin(request: FacebookLoginRequest): Promise<FacebookLoginResponse> {
    try {
      const response = await this.makeRequest<FacebookLoginResponse>(
        API_ENDPOINTS.AUTH.FACEBOOK_LOGIN,
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );
      return response;
    } catch (error) {
      console.error('Error in Facebook login:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to login with Facebook',
      };
    }
  }

  /**
   * Logs out the user
   */
  async logout(token: string): Promise<LogoutResponse> {
    try {
      const response = await this.makeRequest<LogoutResponse>(
        API_ENDPOINTS.AUTH.LOGOUT,
        {
          method: 'POST',
          headers: getAuthHeaders(token),
        }
      );
      return response;
    } catch (error) {
      console.error('Error logging out:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to logout',
      };
    }
  }

  /**
   * Refreshes the authentication token
   */
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const response = await this.makeRequest<{ token: string; refreshToken: string }>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        }
      );
      return response;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authController = new AuthController();

