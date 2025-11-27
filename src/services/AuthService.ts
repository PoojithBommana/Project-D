/**
 * AuthService
 * 
 * Service layer for authentication-related API calls.
 * Provides a clean interface for authentication operations.
 * 
 * Features:
 * - Phone number OTP sending
 * - OTP verification
 * - OTP resend
 * - Google Sign-In
 * - Error handling
 * - Type safety
 */

import { GoogleAuthProvider, getAuth, signInWithCredential, FirebaseAuthTypes } from '@react-native-firebase/auth';

// Lazy import GoogleSignin to avoid initialization errors
let GoogleSignin: any;
try {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
} catch (error) {
  console.warn('Google Sign-In module not available:', error);
}

export interface SendOTPRequest {
  countryCode: string;
  phoneNumber: string;
}

export interface SendOTPResponse {
  success: boolean;
  message?: string;
  sessionId?: string;
  error?: string;
}

export interface VerifyOTPRequest {
  otp: string;
  countryCode: string;
  phoneNumber: string;
  sessionId?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    phoneNumber: string;
  };
  error?: string;
}

export interface GoogleSignInResponse {
  success: boolean;
  user?: FirebaseAuthTypes.User;
  error?: string;
}

/**
 * AuthService Class
 * 
 * Handles all authentication-related API operations.
 * Future-ready for backend integration.
 */
class AuthService {
  private baseURL: string;
  private webClientId: string = '168980396946-p9ad718oc5bjl5ino2u07b2bh4spgfb1.apps.googleusercontent.com';
  private googleSignInConfigured: boolean = false;

  constructor() {
    // TODO: Replace with actual API base URL from environment config
    this.baseURL = 'https://api.dilmil.com'; // Placeholder
  }

  /**
   * Configures Google Sign-In (lazy initialization)
   */
  private configureGoogleSignIn(): void {
    if (!GoogleSignin) {
      throw new Error('Google Sign-In module is not available. Please ensure the native module is properly linked.');
    }
    
    if (!this.googleSignInConfigured) {
      GoogleSignin.configure({
        webClientId: this.webClientId,
      });
      this.googleSignInConfigured = true;
    }
  }

  /**
   * Sends OTP to the provided phone number
   */
  async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseURL}/auth/send-otp`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(request),
      // });
      // return await response.json();

      // Mock implementation for development
      console.log('Sending OTP to:', request.countryCode + request.phoneNumber);
      
      // Simulate API delay
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'OTP sent successfully',
        sessionId: `session_${Date.now()}`,
      };
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
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseURL}/auth/verify-otp`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(request),
      // });
      // return await response.json();

      // Mock implementation for development
      console.log('Verifying OTP:', request.otp);
      
      // Simulate API delay
      await new Promise<void>(resolve => setTimeout(resolve, 1500));
      
      // Mock validation - accept any 6-digit code for development
      if (request.otp.length === 6 && /^\d{6}$/.test(request.otp)) {
        return {
          success: true,
          message: 'OTP verified successfully',
          token: `token_${Date.now()}`,
          user: {
            id: 'user_123',
            phoneNumber: request.countryCode + request.phoneNumber,
          },
        };
      }
      
      return {
        success: false,
        error: 'Invalid OTP code',
      };
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
    return this.sendOTP(request);
  }

  /**
   * Signs in with Google
   * Returns Firebase user on success
   */
  async signInWithGoogle(): Promise<GoogleSignInResponse> {
    try {
      // Check if GoogleSignin is available
      if (!GoogleSignin) {
        return {
          success: false,
          error: 'Google Sign-In module is not available. Please rebuild the app.',
        };
      }

      // Configure Google Sign-In if not already configured
      this.configureGoogleSignIn();
      
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();

      // Try the new style of google-sign in result, from v13+ of that module
      let idToken = signInResult.data?.idToken;
      
      // For compatibility with old and new google-signin result types, check both locations
      if (!idToken) {
        idToken = (signInResult as any).idToken;
      }

      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(getAuth(), googleCredential);

      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      
      // Handle user cancellation
      if (error.code === 'SIGN_IN_CANCELLED') {
        return {
          success: false,
          error: 'Sign in was cancelled',
        };
      }
      
      return {
        success: false,
        error: error?.message || 'Failed to sign in with Google',
      };
    }
  }

  /**
   * Signs out from Google
   */
  async signOutFromGoogle(): Promise<void> {
    try {
      if (!GoogleSignin) {
        throw new Error('Google Sign-In module is not available');
      }
      await GoogleSignin.signOut();
      await getAuth().signOut();
    } catch (error) {
      console.error('Error signing out from Google:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

