# 🔐 Authentication Flow Documentation

## Overview
This document explains the complete authentication flow for both **Google** and **Facebook** sign-in using Firebase Authentication.

---

## 📱 Authentication Methods

### 1. **Google Sign-In Flow**

#### Location: `src/services/AuthService.ts` → `signInWithGoogle()`

#### Flow Diagram:
```
User clicks "Continue with Google" button
    ↓
LoginScreen.handleGoogleSignIn() called
    ↓
AuthService.signInWithGoogle() executes:
    1. Checks if GoogleSignin module is available
    2. Configures Google Sign-In (lazy initialization)
    3. Checks Google Play Services availability
    4. Opens Google Sign-In dialog
    5. User selects Google account
    6. Gets ID token from Google
    7. Creates Firebase credential
    8. Signs in with Firebase
    ↓
Success → Navigate to Home screen
Error → Show error alert
```

#### Implementation Details:

**Step 1: Configuration**
```typescript
// In AuthService constructor (lazy initialization)
GoogleSignin.configure({
  webClientId: '168980396946-p9ad718oc5bjl5ino2u07b2bh4spgfb1.apps.googleusercontent.com'
});
```

**Step 2: Sign-In Process**
```typescript
// 1. Check Play Services
await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

// 2. Get user's Google account
const signInResult = await GoogleSignin.signIn();

// 3. Extract ID token (supports both old and new API formats)
let idToken = signInResult.data?.idToken || signInResult.idToken;

// 4. Create Firebase credential
const googleCredential = GoogleAuthProvider.credential(idToken);

// 5. Sign in with Firebase
const userCredential = await signInWithCredential(getAuth(), googleCredential);
```

**Step 3: Success Handling**
```typescript
// Returns Firebase User object with:
- user.uid
- user.email
- user.displayName
- user.photoURL
```

#### Error Handling:
- ✅ Module not available → Returns error message
- ✅ User cancellation → Silent (no error shown)
- ✅ Network errors → Shows error alert
- ✅ Invalid token → Throws error with message

---

### 2. **Facebook Sign-In Flow**

#### Location: `src/screen/Auth/LoginScreen.tsx` → `onFacebookButtonPress()`

#### Flow Diagram:
```
User clicks "Continue with Facebook" button
    ↓
LoginScreen.onFacebookButtonPress() called
    ↓
Facebook Sign-In process:
    1. Opens Facebook login dialog
    2. User grants permissions (email)
    3. Gets Facebook access token
    4. Creates Firebase credential
    5. Signs in with Firebase
    ↓
Success → Navigate to Home screen
Error → Exception thrown (needs try-catch)
```

#### Implementation Details:

**Step 1: Login with Permissions**
```typescript
// Request email permission
const result = await LoginManager.logInWithPermissions(['email']);

// Check if user cancelled
if (result.isCancelled) {
  throw 'User cancelled the login process';
}
```

**Step 2: Get Access Token**
```typescript
// Get current access token from Facebook
const data = await AccessToken.getCurrentAccessToken();

if (!data) {
  throw 'Something went wrong obtaining access token';
}
```

**Step 3: Create Firebase Credential**
```typescript
// Create Facebook credential for Firebase
const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

// Sign in with Firebase
return auth().signInWithCredential(facebookCredential);
```

#### Configuration:
- **App ID**: `1586110712740100` (in `android/app/src/main/res/values/strings.xml`)
- **Client Token**: `573f36003a315c01a4a29c5e1f7bfb3f`
- **Manifest**: Configured in `AndroidManifest.xml`

---

## 🔄 Complete User Journey

### Login Screen (`LoginScreen.tsx`)

```
┌─────────────────────────────────────┐
│         Login Screen                │
│  ┌─────────────────────────────┐   │
│  │   "Quick Sign In" Button    │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ "Continue with Other" Button│   │
│  └─────────────────────────────┘   │
│                                     │
│  [Dropdown Opens]                   │
│  ┌─────────────────────────────┐   │
│  │ "Continue with Google"      │   │ → handleGoogleSignIn()
│  │ "Continue with Facebook"    │   │ → onFacebookButtonPress()
│  │ "Continue with Mobile"      │   │ → handleContinueWithMobile()
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Authentication Flow Comparison

| Feature | Google | Facebook |
|---------|--------|----------|
| **Service Location** | AuthService.ts | LoginScreen.tsx (direct) |
| **Configuration** | Lazy init in AuthService | Direct in component |
| **Error Handling** | ✅ Comprehensive | ⚠️ Needs improvement |
| **User Object** | Firebase User | Firebase User |
| **Navigation** | ✅ To Home screen | ✅ To Home screen |
| **Success Alert** | ✅ Shows alert | ❌ No alert |

---

## 🎯 Key Components

### 1. **AuthService** (`src/services/AuthService.ts`)
- ✅ Centralized authentication logic
- ✅ Google Sign-In implementation
- ✅ OTP methods (send, verify, resend)
- ✅ Error handling
- ✅ Type-safe interfaces

### 2. **LoginScreen** (`src/screen/Auth/LoginScreen.tsx`)
- ✅ UI for all authentication methods
- ✅ Google Sign-In handler (uses AuthService)
- ✅ Facebook Sign-In handler (direct implementation)
- ✅ Mobile number navigation
- ✅ Animated dropdown

### 3. **Navigation** (`src/navigation/`)
```
MainNavigation
  ├── SplashScreen
  ├── AuthNavigation
  │     ├── LoginScreen
  │     ├── RegisterScreen
  │     └── VerifyPhoneNumberScreen
  └── Home (after successful auth)
```

---

## 🔧 Configuration Files

### Google Configuration
- **Package**: `@react-native-google-signin/google-signin`
- **Web Client ID**: `168980396946-p9ad718oc5bjl5ino2u07b2bh4spgfb1.apps.googleusercontent.com`
- **Location**: `google-services.json` (Firebase config)

### Facebook Configuration
- **Package**: `react-native-fbsdk-next`
- **App ID**: `1586110712740100`
- **Client Token**: `573f36003a315c01a4a29c5e1f7bfb3f`
- **Location**: `android/app/src/main/res/values/strings.xml`

---

## ⚠️ Current Issues & Recommendations

### 1. **Facebook Error Handling**
**Current State**: Direct exception throwing
```typescript
// Current - no try-catch wrapper
onFacebookButtonPress = async() => {
  // ... throws exceptions
}
```

**Recommendation**: Add proper error handling
```typescript
onFacebookButtonPress = async() => {
  try {
    // ... existing code
  } catch (error) {
    Alert.alert('Error', error.message || 'Failed to sign in with Facebook');
  }
}
```

### 2. **Code Organization**
**Current State**: Facebook logic in LoginScreen, Google in AuthService

**Recommendation**: Move Facebook to AuthService for consistency
- Create `signInWithFacebook()` method in AuthService
- Centralize all auth logic
- Better error handling
- Easier testing

### 3. **Success Feedback**
**Current State**: 
- Google: Shows success alert ✅
- Facebook: No feedback ❌

**Recommendation**: Add consistent success feedback for both

---

## 📝 Code Flow Summary

### Google Authentication
1. **User Action**: Clicks "Continue with Google"
2. **Handler**: `LoginScreen.handleGoogleSignIn()`
3. **Service**: `AuthService.signInWithGoogle()`
4. **SDK**: Google Sign-In SDK → Firebase Auth
5. **Result**: Firebase User object
6. **Navigation**: `navigation.navigate('Home')`
7. **Feedback**: Success alert shown

### Facebook Authentication
1. **User Action**: Clicks "Continue with Facebook"
2. **Handler**: `LoginScreen.onFacebookButtonPress()`
3. **SDK**: Facebook SDK → Firebase Auth
4. **Result**: Firebase User object
5. **Navigation**: `navigation.navigate('Home')`
6. **Feedback**: No alert (needs improvement)

---

## 🚀 Next Steps

1. ✅ **Move Facebook to AuthService** - Better code organization
2. ✅ **Add error handling** - Consistent error messages
3. ✅ **Add loading states** - Better UX during sign-in
4. ✅ **Add success alerts** - Consistent feedback
5. ✅ **Handle navigation** - Check auth state on app start
6. ✅ **Add logout functionality** - Complete auth flow

---

## 📚 Dependencies

```json
{
  "@react-native-firebase/app": "^23.5.0",
  "@react-native-firebase/auth": "^23.5.0",
  "@react-native-google-signin/google-signin": "^16.0.0",
  "react-native-fbsdk-next": "^13.0.0"
}
```

---

**Last Updated**: Current implementation review
**Status**: ✅ Google complete | ⚠️ Facebook needs improvements

