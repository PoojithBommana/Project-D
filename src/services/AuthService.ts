import { GoogleAuthProvider, FacebookAuthProvider, getAuth, signInWithCredential, FirebaseAuthTypes } from '@react-native-firebase/auth';
import { authController, SocialLoginResponse } from '../controllers/AuthController';
import { storeToken, storeRefreshToken } from '../utils/tokenStorage';

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

export type {
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from '../controllers/AuthController';

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

  async signInWithGoogle(): Promise<GoogleSignInResponse> {
    try {
      if (!GoogleSignin) {
        return {
          success: false,
          error: 'Google Sign-In module is not available. Please rebuild the app.',
        };
      }

      this.configureGoogleSignIn();
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

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
          if (backendResponse.access) {
            await storeToken(backendResponse.access);
          }
          if (backendResponse.refresh) {
            await storeRefreshToken(backendResponse.refresh);
          }
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
          if (backendResponse.access) {
            await storeToken(backendResponse.access);
          }
          if (backendResponse.refresh) {
            await storeRefreshToken(backendResponse.refresh);
          }
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
