/**
 * AuthService
 * 
 * Service layer for authentication operations.
 * Combines Firebase authentication with backend API calls.
 * 
 * Features:
 * - Phone number OTP sending (via AuthController)
 * - OTP verification (via AuthController)
 * - OTP resend (via AuthController)
 * - Google Sign-In (Firebase + Backend API)
 * - Facebook Sign-In (Firebase + Backend API)
 * - Error handling
 * - Type safety
 */

import { GoogleAuthProvider, FacebookAuthProvider, getAuth, signInWithCredential, FirebaseAuthTypes } from '@react-native-firebase/auth';
import { authController, GoogleLoginRequest, GoogleLoginResponse, FacebookLoginRequest, FacebookLoginResponse } from '../controllers/AuthController';

// Lazy import GoogleSignin to avoid initialization errors
let GoogleSignin: any;
try {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
} catch (error) {
  console.warn('Google Sign-In module not available:', error);
}

// Lazy import Facebook SDK to avoid initialization errors
let LoginManager: any;
let AccessToken: any;
try {
  const FBSDK = require('react-native-fbsdk-next');
  LoginManager = FBSDK.LoginManager;
  AccessToken = FBSDK.AccessToken;
} catch (error) {
  console.warn('Facebook SDK module not available:', error);
}

// Re-export types from AuthController for convenience
export type {
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from '../controllers/AuthController';

export interface GoogleSignInResponse {
  success: boolean;
  user?: FirebaseAuthTypes.User;
  backendResponse?: GoogleLoginResponse;
  error?: string;
}

export interface FacebookSignInResponse {
  success: boolean;
  user?: FirebaseAuthTypes.User;
  backendResponse?: FacebookLoginResponse;
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
   * Uses AuthController for API call
   */
  async sendOTP(request: { countryCode: string; phoneNumber: string }) {
    return authController.sendOTP(request);
  }

  /**
   * Verifies the OTP code
   * Uses AuthController for API call
   */
  async verifyOTP(request: { otp: string; countryCode: string; phoneNumber: string; sessionId?: string }) {
    return authController.verifyOTP(request);
  }

  /**
   * Resends OTP to the provided phone number
   * Uses AuthController for API call
   */
  async resendOTP(request: { countryCode: string; phoneNumber: string }) {
    return authController.resendOTP(request);
  }

  /**
   * Signs in with Google
   * 1. Authenticates with Firebase
   * 2. Sends Google login data to backend API
   * Returns Firebase user and backend response on success
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
      
      // Debug: Log the full sign-in result to see structure
      console.log('========================================');
      console.log('🔍 GOOGLE SIGN-IN RESULT DEBUG');
      console.log('========================================');
      console.log('Full signInResult:', JSON.stringify(signInResult, null, 2));
      console.log('signInResult.data:', signInResult.data);
      console.log('signInResult.data?.idToken:', signInResult.data?.idToken);
      console.log('signInResult.idToken:', (signInResult as any).idToken);
      console.log('========================================');

      // Try the new style of google-sign in result, from v13+ of that module
      let idToken = signInResult.data?.idToken;
      
      // For compatibility with old and new google-signin result types, check both locations
      if (!idToken) {
        idToken = (signInResult as any).idToken;
      }
      
      // Also try to get token using getTokens() method if available
      if (!idToken && GoogleSignin.getTokens) {
        try {
          const tokens = await GoogleSignin.getTokens();
          idToken = tokens.idToken;
          console.log('✅ Got ID Token from getTokens() method');
        } catch (error) {
          console.log('⚠️ getTokens() failed:', error);
        }
      }

      if (!idToken) {
        console.error('❌ ERROR: No ID token found in signInResult');
        console.error('signInResult structure:', signInResult);
        throw new Error('No ID token found');
      }
      
      console.log('✅ ID Token found! Length:', idToken.length);
      console.log('✅ ID Token (first 50 chars):', idToken.substring(0, 50) + '...');

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with Firebase
      const userCredential = await signInWithCredential(getAuth(), googleCredential);
      const firebaseUser = userCredential.user;

      // Prepare Google login data for backend
      // Firebase UID is the unique identifier that backend will use to access user data
      // This UID matches what you see in Firebase Console (Users section)
      const googleLoginData: GoogleLoginRequest = {
        idToken: idToken,                    // Google ID token for backend verification
        uid: firebaseUser.uid,               // Firebase User UID (REQUIRED - primary identifier for backend)
        email: firebaseUser.email || undefined,
        name: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
      };
      
      // Console logs for debugging - visible in frontend
      console.log('========================================');
      console.log('🔐 GOOGLE LOGIN - USER DATA');
      console.log('========================================');
      console.log('📱 Firebase UID:', firebaseUser.uid);
      console.log('🎫 Google ID Token (FULL):', idToken);
      console.log('🎫 Google ID Token (Length):', idToken.length);
      console.log('🎫 Google ID Token (First 100 chars):', idToken.substring(0, 100));
      console.log('🎫 Google ID Token (Last 50 chars):', '...' + idToken.substring(idToken.length - 50));
      console.log('📧 Email:', firebaseUser.email);
      console.log('👤 Name:', firebaseUser.displayName);
      console.log('🖼️  Photo URL:', firebaseUser.photoURL);
      console.log('========================================');

      // Send Google login data to backend API
      // Note: Backend failure doesn't block Firebase auth
      let backendResponse: GoogleLoginResponse | undefined;
      try {
        backendResponse = await authController.googleLogin(googleLoginData);
        
        if (!backendResponse.success) {
          // Backend unavailable - Firebase auth still works
          console.warn('⚠️ Backend Google login failed (non-blocking):', backendResponse.error);
          console.log('✅ Firebase authentication succeeded. User can continue using the app.');
        } else {
          console.log('========================================');
          console.log('✅ BACKEND RESPONSE');
          console.log('========================================');
          console.log('🎫 Backend Token:', backendResponse.token || 'Not provided');
          console.log('🔄 Refresh Token:', backendResponse.refreshToken || 'Not provided');
          console.log('👤 Backend User ID:', backendResponse.user?.id || 'Not provided');
          console.log('========================================');
        }
      } catch (error) {
        // Even if backend call fails completely, Firebase auth succeeded
        console.warn('Backend API call failed (non-blocking):', error);
        backendResponse = {
          success: false,
          error: 'Backend server unavailable',
        };
      }

      // Always return success if Firebase auth succeeded
      // Backend sync can be retried later
      return {
        success: true,
        user: firebaseUser,
        backendResponse: backendResponse,
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
   * Signs in with Facebook
   * 1. Authenticates with Firebase
   * 2. Sends Facebook login data to backend API
   * Returns Firebase user and backend response on success
   */
  async signInWithFacebook(): Promise<FacebookSignInResponse> {
    try {
      // Check if Facebook SDK is available
      if (!LoginManager || !AccessToken) {
        return {
          success: false,
          error: 'Facebook Sign-In module is not available. Please rebuild the app.',
        };
      }

      // Attempt login with permissions
      let result;
      try {
        result = await LoginManager.logInWithPermissions(['email', 'public_profile']);
      } catch (loginError: any) {
        // Catch Facebook SDK errors (like "App not active")
        const errorMessage = loginError?.message || loginError?.toString() || String(loginError);
        console.error('Facebook LoginManager error:', errorMessage);
        
        // Check for "App not active" error
        if (errorMessage.includes('App not active') || 
            errorMessage.includes('not accessible') ||
            errorMessage.includes('app is not accessible')) {
          return {
            success: false,
            error: 'Facebook app is not active. Please add yourself as a tester in Facebook Developer Console (Settings → User Roles) or contact the app developer.',
          };
        }
        
        // Re-throw to be caught by outer catch
        throw loginError;
      }

      // Check if user cancelled
      if (result.isCancelled) {
        return {
          success: false,
          error: 'Sign in was cancelled',
        };
      }

      // Get access token
      let data;
      try {
        data = await AccessToken.getCurrentAccessToken();
      } catch (tokenError: any) {
        const errorMessage = tokenError?.message || tokenError?.toString() || String(tokenError);
        console.error('Facebook AccessToken error:', errorMessage);
        
        if (errorMessage.includes('App not active') || 
            errorMessage.includes('not accessible')) {
          return {
            success: false,
            error: 'Facebook app is not active. Please add yourself as a tester in Facebook Developer Console (Settings → User Roles) or contact the app developer.',
          };
        }
        
        return {
          success: false,
          error: 'Failed to obtain Facebook access token. Please try again.',
        };
      }
      
      if (!data || !data.accessToken) {
        return {
          success: false,
          error: 'Failed to obtain Facebook access token. Please try again.',
        };
      }

      // Create Facebook credential for Firebase
      const facebookCredential = FacebookAuthProvider.credential(data.accessToken);

      // Sign in with Firebase
      const userCredential = await signInWithCredential(getAuth(), facebookCredential);
      const firebaseUser = userCredential.user;

      // Console logs for debugging
      console.log('========================================');
      console.log('✅ FACEBOOK SIGN-IN SUCCESS');
      console.log('========================================');
      console.log('📱 Firebase UID:', firebaseUser.uid);
      console.log('📧 Email:', firebaseUser.email);
      console.log('👤 Display Name:', firebaseUser.displayName);
      console.log('🖼️  Photo URL:', firebaseUser.photoURL);
      console.log('========================================');

      // Prepare Facebook login data for backend
      const facebookLoginData: FacebookLoginRequest = {
        accessToken: data.accessToken,
        uid: firebaseUser.uid,
        email: firebaseUser.email || undefined,
        name: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
      };

      // Send Facebook login data to backend API
      // Note: Backend failure doesn't block Firebase auth
      let backendResponse: FacebookLoginResponse | undefined;
      try {
        backendResponse = await authController.facebookLogin(facebookLoginData);

        if (!backendResponse.success) {
          // Backend unavailable - Firebase auth still works
          console.warn('⚠️ Backend Facebook login failed (non-blocking):', backendResponse.error);
          console.log('✅ Firebase authentication succeeded. User can continue using the app.');
        } else {
          console.log('========================================');
          console.log('✅ BACKEND RESPONSE');
          console.log('========================================');
          console.log('🎫 Backend Token:', backendResponse.token || 'Not provided');
          console.log('🔄 Refresh Token:', backendResponse.refreshToken || 'Not provided');
          console.log('👤 Backend User ID:', backendResponse.user?.id || 'Not provided');
          console.log('========================================');
        }
      } catch (error) {
        // Even if backend call fails completely, Firebase auth succeeded
        console.warn('Backend API call failed (non-blocking):', error);
        backendResponse = {
          success: false,
          error: 'Backend server unavailable',
        };
      }

      // Always return success if Firebase auth succeeded
      // Backend sync can be retried later
      return {
        success: true,
        user: firebaseUser,
        backendResponse: backendResponse,
      };
    } catch (error: any) {
      console.error('Error signing in with Facebook:', error);
      
      // Extract error message from various possible formats
      const errorMessage = error?.message || 
                          error?.toString() || 
                          error?.error?.message ||
                          String(error);
      
      console.error('Full error details:', JSON.stringify(error, null, 2));

      // Handle specific Facebook errors
      if (errorMessage.includes('App not active') || 
          errorMessage.includes('not accessible') ||
          errorMessage.includes('app is not accessible') ||
          errorMessage.includes('app developer is aware')) {
        return {
          success: false,
          error: 'Facebook app is not active. To fix this:\n\n1. Go to https://developers.facebook.com/\n2. Select your app (ID: 1586110712740100)\n3. Go to Settings → Basic → User Roles\n4. Add yourself as a Developer or Tester\n5. Accept the invitation email\n6. Try logging in again',
        };
      }

      if (error?.code === 'auth/account-exists-with-different-credential') {
        return {
          success: false,
          error: 'An account already exists with the same email address but different sign-in credentials.',
        };
      }

      // Check for Firebase auth errors
      if (error?.code?.startsWith('auth/')) {
        return {
          success: false,
          error: `Firebase authentication error: ${error.message || error.code}`,
        };
      }

      return {
        success: false,
        error: errorMessage || 'Failed to sign in with Facebook. Please try again.',
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

  /**
   * Signs out from Facebook
   */
  async signOutFromFacebook(): Promise<void> {
    try {
      if (LoginManager) {
        await LoginManager.logOut();
      }
      await getAuth().signOut();
    } catch (error) {
      console.error('Error signing out from Facebook:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

