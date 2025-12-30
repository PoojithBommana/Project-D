import { GoogleAuthProvider, FacebookAuthProvider, getAuth, signInWithCredential, FirebaseAuthTypes, PhoneAuthProvider } from '@react-native-firebase/auth';
import { Platform, AppState } from 'react-native';
import { authController, SocialLoginResponse } from '../controllers/AuthController';
import { postApiCall } from '../config/apiCall';
import { API_ENDPOINTS } from '../config/endpoints';

let GoogleSignin: any;
try {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
} catch (error) {
  console.warn('Google Sign-In module not available:', error);
}

let LoginManager: any;
let AccessToken: any;
try {
  const FBSDK = require('react-native-fbsdk-next');
  LoginManager = FBSDK.LoginManager;
  AccessToken = FBSDK.AccessToken;
} catch (error) {
  
  console.warn('Facebook SDK module not available:', error);

}




export interface SocialSignInResponse {
  success: boolean;
  user?: FirebaseAuthTypes.User;
  backendResponse?: SocialLoginResponse | null;
  error?: string;
}

export interface GoogleSignInResponse extends SocialSignInResponse {
  backendResponse?: SocialLoginResponse | null;
}

export interface FacebookSignInResponse extends SocialSignInResponse {
  backendResponse?: SocialLoginResponse | null;
}

class AuthService {
  private webClientId: string = '168980396946-p9ad718oc5bjl5ino2u07b2bh4spgfb1.apps.googleusercontent.com';
  private googleSignInConfigured: boolean = false;
  private phoneVerificationId: string | null = null;

  private async clearGoogleSession(): Promise<void> {
    if (!GoogleSignin) return;
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.warn('Google signOut failed (continuing):', error);
    }
    try {
      if (GoogleSignin.revokeAccess) {
        await GoogleSignin.revokeAccess();
      }
    } catch (error) {
      console.warn('Google revokeAccess failed (continuing):', error);
    }
  }

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

  async sendOTP(request: { countryCode: string; phoneNumber: string }) {
    return authController.sendOTP(request);
  }

  async verifyOTP(request: { otp: string; countryCode: string; phoneNumber: string; sessionId?: string }) {
    return authController.verifyOTP(request);
  }

  async resendOTP(request: { countryCode: string; phoneNumber: string }) {
    return authController.resendOTP(request);
  }

  /**
   * Start Firebase phone number verification.
   * Returns verificationId which must be used later with the OTP code.
   */
  async startPhoneVerification(fullPhoneNumber: string): Promise<{ success: boolean; verificationId?: string; error?: string }> {
    try {
      const auth = getAuth();
      const confirmationResult = await auth.signInWithPhoneNumber(fullPhoneNumber);
      this.phoneVerificationId = confirmationResult.verificationId;
      return {
        success: true,
        verificationId: confirmationResult.verificationId,
      };
    } catch (error: any) {
      console.error('[AuthService] startPhoneVerification error:', error);
      let message = 'Failed to send verification code';
      if (error?.code === 'auth/invalid-phone-number') {
        message = 'Invalid phone number format';
      } else if (error?.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.';
      }
      return {
        success: false,
        error: message,
      };
    }
  }

  /**
   * Confirm OTP code with Firebase and then login/register with backend using Firebase ID token.
   */
  async verifyPhoneCodeAndLogin(
    code: string,
    phone: string,
  ): Promise<{
    success: boolean;
    firebaseUser?: FirebaseAuthTypes.User;
    backendResponse?: SocialLoginResponse | null;
    error?: string;
  }> {
    try {
      const auth = getAuth();

      if (!this.phoneVerificationId) {
        return {
          success: false,
          error: 'Verification ID is missing. Please request a new code.',
        };
      }

      const credential = PhoneAuthProvider.credential(this.phoneVerificationId, code);
      const userCredential = await auth.signInWithCredential(credential);
      const firebaseUser = userCredential.user;
      const firebaseIdToken = await firebaseUser.getIdToken();

      // Call backend VERIFY_OTP (or dedicated phone login) endpoint with Firebase token + phone
      let backendResponse: SocialLoginResponse | null = null;
      try {
        const payload = {
          id_token: firebaseIdToken,
          phone,
        };
        const apiResponse: any = await postApiCall('POST', 'AUTH', 'VERIFY_OTP', payload);
        const data = apiResponse?.response;

        if (data) {
          backendResponse = {
            account_exists: data.account_exists,
            existing_user: data.existing_user,
            can_create_new_account: data.can_create_new_account,
            is_new: data.is_new,
            uid: data.uid,
            phone: data.phone,
            next: data.next,
            access: data.access,
            refresh: data.refresh,
            user_id: data.user_id,
            onboarding_complete: data.onboarding_complete,
            next_step: data.next_step,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            selfie_photo: data.selfie_photo,
            message: data.message,
          };
        }
      } catch (error) {
        console.warn('[AuthService] Backend phone verify API failed (non-blocking):', error);
        backendResponse = null;
      }

      return {
        success: true,
        firebaseUser,
        backendResponse,
      };
    } catch (error: any) {
      console.error('[AuthService] verifyPhoneCodeAndLogin error:', error);
      let message = 'Failed to verify code';
      if (error?.code === 'auth/invalid-verification-code') {
        message = 'Invalid verification code';
      } else if (error?.code === 'auth/session-expired') {
        message = 'Verification code has expired. Please request a new one.';
      }
      return {
        success: false,
        error: message,
      };
    }
  }

  async signInWithGoogle(): Promise<GoogleSignInResponse> {
    try {
      if (!GoogleSignin) {
        return {
          success: false,
          error: 'Google Sign-In module is not available. Please rebuild the app.',
        };
      }

      this.configureGoogleSignIn();
      await this.clearGoogleSession();
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Ensure app is active and Activity is ready (Android)
      if (Platform.OS === 'android') {
        // Wait for app to be in foreground
        if (AppState.currentState !== 'active') {
          await new Promise<void>((resolve) => {
            const subscription = AppState.addEventListener('change', (nextAppState) => {
              if (nextAppState === 'active') {
                subscription.remove();
                resolve();
              }
            });
            // Timeout after 2 seconds
            setTimeout(() => {
              subscription.remove();
              resolve();
            }, 2000);
          });
        }
        
        // Wait for Activity to be ready using requestAnimationFrame
        await new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTimeout(() => resolve(), 500);
            });
          });
        });
      }
      
      // Retry mechanism for Android Activity null error
      let signInResult;
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        try {
          signInResult = await GoogleSignin.signIn();
          break; // Success, exit loop
        } catch (error: any) {
          if (error?.message?.includes('activity is null') && Platform.OS === 'android' && retries < maxRetries - 1) {
            retries++;
            // Wait longer before retry
            await new Promise<void>(resolve => {
              requestAnimationFrame(() => {
                setTimeout(() => resolve(), 200 * retries);
              });
            });
            continue;
          }
          throw error; // Re-throw if not activity null error or max retries reached
        }
      }

      let idToken = signInResult.data?.idToken;
      
      if (!idToken) {
        idToken = (signInResult as any).idToken;
      }
      
      if (!idToken && GoogleSignin.getTokens) {
        try {
          const tokens = await GoogleSignin.getTokens();
          idToken = tokens.idToken;
        } catch (error) {
          console.log('getTokens() failed:', error);
        }
      }

      if (!idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(getAuth(), googleCredential);
      const firebaseUser = userCredential.user;
      const firebaseIdToken = await firebaseUser.getIdToken();

      let backendResponse: SocialLoginResponse | null = null;
      try {
        backendResponse = await authController.socialLogin(firebaseIdToken);
        
        if (!backendResponse) {
          console.warn('Backend social login failed (non-blocking): Backend server unavailable');
        } else {
          // if (backendResponse.access) {
          //   await storeToken(backendResponse.access);
          // }
          // if (backendResponse.refresh) {
          //   await storeRefreshToken(backendResponse.refresh);
          // }
        }
      } catch (error) {
        console.warn('Backend API call failed (non-blocking):', error);
        backendResponse = null;
      }

      return {
        success: true,
        user: firebaseUser,
        backendResponse: backendResponse,
      };
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      
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

  async signInWithFacebook(): Promise<FacebookSignInResponse> {
    try {
      if (!LoginManager || !AccessToken) {
        return {
          success: false,
          error: 'Facebook Sign-In module is not available. Please rebuild the app.',
        };
      }

      let result;
      try {
        result = await LoginManager.logInWithPermissions(['email', 'public_profile']);
      } catch (loginError: any) {
        const errorMessage = loginError?.message || loginError?.toString() || String(loginError);
        console.error('Facebook LoginManager error:', errorMessage);
        
        if (errorMessage.includes('App not active') || 
            errorMessage.includes('not accessible') ||
            errorMessage.includes('app is not accessible')) {
          return {
            success: false,
            error: 'Facebook app is not active. Please add yourself as a tester in Facebook Developer Console (Settings → User Roles) or contact the app developer.',
          };
        }
        
        throw loginError;
      }

      if (result.isCancelled) {
        return {
          success: false,
          error: 'Sign in was cancelled',
        };
      }

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

      const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
      const userCredential = await signInWithCredential(getAuth(), facebookCredential);
      const firebaseUser = userCredential.user;
      const firebaseIdToken = await firebaseUser.getIdToken();

      let backendResponse: SocialLoginResponse | null = null;
      try {
        backendResponse = await authController.socialLogin(firebaseIdToken);

        if (!backendResponse) {
          console.warn('Backend social login failed (non-blocking): Backend server unavailable');
        } else {
          // if (backendResponse.access) {
          //   await storeToken(backendResponse.access);
          // }
          // if (backendResponse.refresh) {
          //   await storeRefreshToken(backendResponse.refresh);
          // }
        }
      } catch (error) {
        console.warn('Backend API call failed (non-blocking):', error);
        backendResponse = null;
      }

      return {
        success: true,
        user: firebaseUser,
        backendResponse: backendResponse,
      };
    } catch (error: any) {
      console.error('Error signing in with Facebook:', error);
      
      const errorMessage = error?.message || 
                          error?.toString() || 
                          error?.error?.message ||
                          String(error);

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

export const authService = new AuthService();