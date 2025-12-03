# 📱 DilMil Dating App - Complete Codebase Overview

## 🏗️ Architecture Overview

This is a **React Native dating application** built with TypeScript, following a **layered architecture** pattern with clear separation of concerns.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (Screens)                    │
│  - LoginScreen, PeopleScreen, ChatScreen, etc.          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Services Layer                              │
│  - AuthService (Firebase + Business Logic)             │
│  - ProfileService (Business Logic)                     │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│            Controllers Layer                             │
│  - AuthController (Backend API Calls)                   │
│  - ProfileController (Backend API Calls)                │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│            Configuration Layer                          │
│  - apiCall.ts (Axios instance & interceptors)           │
│  - endpoints.ts (API endpoint definitions)              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Backend API                                 │
│  - Base URL: https://api.dilmil.com                     │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ProjectD/
├── src/
│   ├── assets/                    # Images, fonts, videos
│   │   ├── fonts/                  # OpenSans font family
│   │   ├── videos/                 # Background videos
│   │   └── *.png                   # App icons and images
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── CustomButton.tsx        # Custom button component
│   │   └── ProfileCard.tsx         # Profile card for swiping
│   │
│   ├── config/                     # Configuration files
│   │   ├── apiCall.ts              # Axios instance & API helper
│   │   ├── endpoints.ts            # API endpoint definitions
│   │   ├── i18n.ts                 # Internationalization setup
│   │   └── locales/                # Translation files
│   │       ├── en.json
│   │       └── hi.json
│   │
│   ├── constants/                   # App constants
│   │   ├── AuthKeys.ts             # Authentication keys
│   │   └── CountryCodes.ts         # Country code list
│   │
│   ├── controllers/                 # API controllers
│   │   ├── AuthController.ts       # Auth API calls
│   │   ├── ProfileController.ts    # Profile API calls
│   │   └── SplashScreenController.tsx
│   │
│   ├── navigation/                  # Navigation setup
│   │   ├── MainNavigation.tsx      # Root navigator
│   │   ├── AuthNavigation.tsx      # Auth flow navigator
│   │   └── TabNavigation.tsx       # Bottom tab navigator
│   │
│   ├── screen/                      # Screen components
│   │   ├── Auth/                    # Authentication screens
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── VerifyPhoneNumberScreen.tsx
│   │   │   ├── SplashScreen.tsx
│   │   │   └── AccountDetailsNotFound.tsx
│   │   └── Dashboard/               # Main app screens
│   │       ├── PeopleScreen.tsx     # Swipe cards screen
│   │       ├── LikesScreen.tsx      # Likes received
│   │       ├── AIScreen.tsx         # AI features
│   │       ├── ChatScreen.tsx       # Chat (CometChat)
│   │       └── ProfileScreen.tsx   # User profile
│   │
│   ├── services/                    # Business logic layer
│   │   ├── AuthService.ts           # Auth business logic + Firebase
│   │   └── ProfileService.ts       # Profile business logic
│   │
│   ├── styles/                      # Style files
│   │   ├── LoginScreenStyles.tsx
│   │   ├── HomeScreenStyles.tsx
│   │   ├── ProfileCardStyles.tsx
│   │   └── ...
│   │
│   ├── types/                       # TypeScript type definitions
│   │   └── Profile.ts              # Profile interface
│   │
│   └── utils/                       # Utility functions
│       ├── tokenStorage.ts          # Token management (AsyncStorage)
│       ├── tokenRefresh.ts          # Token refresh logic
│       ├── ErrorHandler.ts          # Error handling utilities
│       ├── responsive.ts            # Responsive design helpers
│       ├── Validation.ts            # Form validation
│       ├── permission.ts            # Permission handling
│       └── Types.ts                 # Shared type definitions
│
├── android/                         # Android native code
├── ios/                             # iOS native code
├── App.tsx                          # Root component
├── package.json                     # Dependencies
└── Documentation files              # API_STRUCTURE.md, etc.
```

---

## 🔐 Authentication Flow

### Authentication Methods

1. **Google Sign-In**
   - Uses `@react-native-google-signin/google-signin`
   - Firebase Authentication
   - Backend API integration via `socialLogin()`

2. **Facebook Sign-In**
   - Uses `react-native-fbsdk-next`
   - Firebase Authentication
   - Backend API integration via `socialLogin()`

3. **Phone Number (OTP)**
   - OTP-based authentication
   - Send OTP → Verify OTP flow

### Authentication Flow Diagram

```
User Opens App
    ↓
SplashScreen (checks authToken)
    ↓
┌─────────────────┬─────────────────┐
│ Has Token?      │ No Token?       │
│ Navigate to     │ Navigate to     │
│ TabNavigation   │ AuthNavigation  │
└─────────────────┴─────────────────┘
    ↓
LoginScreen
    ↓
User selects auth method:
    ├─ Google Sign-In
    │   ├─ AuthService.signInWithGoogle()
    │   ├─ Firebase Auth
    │   ├─ AuthController.socialLogin()
    │   └─ Store tokens → Navigate to TabNavigation
    │
    ├─ Facebook Sign-In
    │   ├─ AuthService.signInWithFacebook()
    │   ├─ Firebase Auth
    │   ├─ AuthController.socialLogin()
    │   └─ Store tokens → Navigate to TabNavigation
    │
    └─ Phone Number
        ├─ RegisterScreen
        ├─ VerifyPhoneNumberScreen
        ├─ AuthController.verifyOTP()
        └─ Store tokens → Navigate to TabNavigation
```

---

## 🌐 API Structure

### Base Configuration

- **Base URL**: `https://api.dilmil.com`
- **API Client**: Axios instance in `apiCall.ts`
- **Method**: All requests use `POST` with method header
- **Response Format**: 
  ```typescript
  {
    ResponseCode: 'Success' | 'Fail',
    ResponseMessage: string,
    // ... other data
  }
  ```

### API Endpoints

#### Authentication Endpoints (`/auth/*`)

| Method | Endpoint | Controller Method | Description |
|--------|----------|-------------------|-------------|
| POST | `/auth/send-otp` | `sendOTP()` | Send OTP to phone number |
| POST | `/auth/verify-otp` | `verifyOTP()` | Verify OTP code |
| POST | `/auth/resend-otp` | `resendOTP()` | Resend OTP |
| POST | `/api/auth/social-login/` | `socialLogin()` | Social login (Google/Facebook) |
| POST | `/auth/logout` | `logout()` | Logout user |
| POST | `/api/token/refresh/` | `refreshToken()` | Refresh access token |

#### Profile Endpoints (`/profiles/*`)

| Method | Endpoint | Controller Method | Description |
|--------|----------|-------------------|-------------|
| GET | `/profiles` | `fetchProfiles()` | Get profiles with pagination |
| GET | `/profiles/:id` | `getProfile()` | Get profile by ID |
| PUT | `/profiles/:id` | `updateProfile()` | Update profile |
| POST | `/profiles/swipe` | `submitSwipeAction()` | Submit swipe (like/pass/superlike) |
| GET | `/profiles/matches` | `getMatches()` | Get user's matches |

### API Request Flow

```
Screen Component
    ↓
Service Layer (AuthService/ProfileService)
    ↓
Controller Layer (AuthController/ProfileController)
    ↓
apiCall.ts (postApiCall helper)
    ↓
Axios Instance
    ↓
Backend API
```

### Token Management

- **Storage**: AsyncStorage (`@auth_token`, `@refresh_token`)
- **Auto-refresh**: Token refresh logic in `tokenRefresh.ts`
- **JWT Decoding**: Custom JWT decoder for expiration checking
- **Token Injection**: Manual token handling (can be improved with interceptors)

---

## 🎨 UI/UX Structure

### Navigation Structure

```
MainNavigation (Stack Navigator)
├── SplashScreen
├── AuthNavigation (Stack Navigator)
│   ├── LoginScreen
│   ├── RegisterScreen
│   ├── VerifyPhoneNumberScreen
│   └── AccountDetailsNotFound
└── TabNavigation (Bottom Tab Navigator)
    ├── People (PeopleScreen) - Swipe cards
    ├── Likes (LikesScreen) - Likes received
    ├── AI (AIScreen) - AI features
    ├── Chat (ChatScreen) - CometChat integration
    └── Profile (ProfileScreen) - User profile
```

### Key Screens

1. **LoginScreen**
   - Background video
   - Quick sign-in button
   - Dropdown with Google/Facebook/Mobile options
   - Animated dropdown

2. **PeopleScreen**
   - Swipeable card deck (`react-native-deck-swiper`)
   - Profile cards with images
   - Like/Pass/Superlike actions
   - Match detection

3. **ChatScreen**
   - CometChat SDK integration
   - Chat UI initialization

### Components

- **CustomButton**: Reusable button with variants (primary, borderless, social)
- **ProfileCard**: Profile display card with image, name, age, job, education

---

## 🔧 Key Technologies & Dependencies

### Core
- **React Native**: 0.82.1
- **React**: 19.1.1
- **TypeScript**: 5.8.3
- **Navigation**: `@react-navigation/native` (v7)

### Authentication
- **Firebase Auth**: `@react-native-firebase/auth` (v23.5.0)
- **Google Sign-In**: `@react-native-google-signin/google-signin` (v16.0.0)
- **Facebook SDK**: `react-native-fbsdk-next` (v13.4.1)

### UI/UX
- **Swipe Cards**: `react-native-deck-swiper` (v2.0.19)
- **Video**: `react-native-video` (v6.17.0)
- **Animations**: `react-native-reanimated` (v4.1.3)
- **Icons**: `react-native-vector-icons` (v10.3.0)
- **Gradients**: `react-native-linear-gradient` (v2.8.3)

### Chat
- **CometChat**: `@cometchat/chat-uikit-react-native` (v5.2.3)

### Networking
- **Axios**: 1.13.2
- **Network Info**: `@react-native-community/netinfo` (v11.4.1)

### Storage
- **AsyncStorage**: `@react-native-async-storage/async-storage` (v1.24.0)

### Internationalization
- **i18n-js**: 4.5.1
- **Localize**: `react-native-localize` (v3.6.0)

---

## 📝 Code Patterns & Conventions

### 1. **Layered Architecture**
   - **Screens** → **Services** → **Controllers** → **API**
   - Clear separation of concerns
   - Easy to test and maintain

### 2. **TypeScript Usage**
   - Strong typing throughout
   - Interfaces for API requests/responses
   - Type safety in components

### 3. **Error Handling**
   - Centralized error handling in `ErrorHandler.ts`
   - User-friendly error messages
   - API error handling in controllers

### 4. **Token Management**
   - AsyncStorage for persistence
   - Automatic token refresh
   - JWT expiration checking

### 5. **Internationalization**
   - i18n setup with English and Hindi
   - Translation function `t()` used throughout

### 6. **Responsive Design**
   - Responsive utilities in `responsive.ts`
   - Screen size helpers (wp, hp, rf, rs)
   - Platform-specific sizing

---

## 🔄 Data Flow Examples

### Example 1: Google Sign-In Flow

```
1. User clicks "Continue with Google"
   ↓
2. LoginScreen.handleGoogleSignIn()
   ↓
3. AuthService.signInWithGoogle()
   ├─ Configure Google Sign-In
   ├─ Get Google ID token
   ├─ Create Firebase credential
   ├─ Sign in with Firebase
   ├─ Get Firebase ID token
   ↓
4. AuthController.socialLogin(firebaseIdToken)
   ├─ POST /api/auth/social-login/
   ├─ Returns: { access, refresh, user_id }
   ↓
5. Store tokens (AsyncStorage)
   ├─ storeToken(access)
   ├─ storeRefreshToken(refresh)
   ↓
6. Navigate to TabNavigation
```

### Example 2: Fetch Profiles Flow

```
1. PeopleScreen.componentDidMount()
   ↓
2. ProfileService.fetchProfiles(page, limit)
   ↓
3. ProfileController.fetchProfiles(request)
   ├─ POST /profiles (with pagination params)
   ├─ Returns: { success, profiles[], pagination }
   ↓
4. Update state with profiles
   ↓
5. Render Swiper with ProfileCards
```

### Example 3: Swipe Action Flow

```
1. User swipes card right (like)
   ↓
2. PeopleScreen.handleSwipe(cardIndex, 'right')
   ↓
3. Create SwipeAction object
   ├─ { type: 'like', profileId, timestamp }
   ↓
4. ProfileService.submitSwipeAction(action)
   ↓
5. ProfileController.submitSwipeAction(action)
   ├─ POST /profiles/swipe
   ├─ Returns: { success, isMatch, matchData }
   ↓
6. If isMatch === true
   ├─ Show "It's a Match!" alert
   ↓
7. Update local state (remove swiped card)
```

---

## 🎯 Current Implementation Status

### ✅ Completed Features

- [x] Authentication (Google, Facebook, Phone OTP)
- [x] Firebase integration
- [x] Backend API integration
- [x] Token management
- [x] Profile fetching
- [x] Swipe functionality
- [x] Navigation structure
- [x] Internationalization (EN, HI)
- [x] Responsive design utilities
- [x] Error handling
- [x] CometChat SDK setup

### ⚠️ Areas for Improvement

1. **API Integration**
   - Token injection in API calls (currently manual)
   - Request interceptors for auto token injection
   - Response interceptors for token refresh

2. **Error Handling**
   - More comprehensive error messages
   - Network error handling
   - Retry logic for failed requests

3. **Code Organization**
   - Some duplicate type definitions (Profile.ts vs Types.ts)
   - Inconsistent token storage (AsyncStorage keys)
   - ProfileService methods have unused token parameters

4. **State Management**
   - No global state management (Redux/Zustand)
   - Component-level state only

5. **Testing**
   - No test files (except App.test.tsx)
   - Missing unit tests for services/controllers

---

## 📋 API Response Format

### Success Response
```typescript
{
  ResponseCode: 'Success',
  ResponseMessage: 'Operation successful',
  // ... data fields
}
```

### Error Response
```typescript
{
  ResponseCode: 'Fail',
  ResponseMessage: 'Error message',
  // or
  error: true,
  response: {
    Message: 'Error message'
  }
}
```

---

## 🔑 Key Configuration Values

### Google Sign-In
- **Web Client ID**: `168980396946-p9ad718oc5bjl5ino2u07b2bh4spgfb1.apps.googleusercontent.com`

### Facebook
- **App ID**: `1586110712740100`
- **Client Token**: `573f36003a315c01a4a29c5e1f7bfb3f`

### CometChat
- **App ID**: `16725997cf6bd98ab`
- **Auth Key**: `fd5561f7ff5fcdb8077204f03d206666d0e12a04`
- **Region**: `in`

### API
- **Base URL**: `https://api.dilmil.com`

---

## 🚀 Development Workflow

1. **Start Metro**: `npm start`
2. **Run Android**: `npm run android`
3. **Run iOS**: `npm run ios`

### Code Organization Principles

1. **Screens**: UI components only, minimal logic
2. **Services**: Business logic, Firebase operations
3. **Controllers**: API calls only, no business logic
4. **Utils**: Reusable utility functions
5. **Types**: Centralized type definitions

---

## 📚 Documentation Files

- `API_STRUCTURE.md` - API architecture documentation
- `AUTHENTICATION_FLOW.md` - Auth flow details
- `CODEBASE_OVERVIEW.md` - This file
- Other feature-specific docs

---

## 🎨 Design System

### Responsive Design
- Base design: iPhone 14 Pro (393x852)
- Responsive helpers: `wp()`, `hp()`, `rf()`, `rs()`
- Platform-specific sizing support

### Fonts
- **Primary**: OpenSans family (12 variants)
- Located in `src/assets/fonts/`

### Colors
- Defined in style files
- No centralized theme (can be improved)

---

## 🔐 Security Considerations

1. **Token Storage**: AsyncStorage (consider Keychain/Keystore)
2. **API Keys**: Some hardcoded (consider environment variables)
3. **Token Refresh**: Automatic refresh implemented
4. **Error Messages**: User-friendly, no sensitive data exposed

---

## 📝 Next Steps for Professional Development

1. **Implement proper token injection** in API calls
2. **Add request/response interceptors** for automatic token handling
3. **Consolidate type definitions** (remove duplicates)
4. **Add global state management** (Redux/Zustand)
5. **Implement comprehensive error handling**
6. **Add loading states** throughout the app
7. **Create centralized theme/colors**
8. **Add unit tests** for services and controllers
9. **Implement proper logging** system
10. **Add environment configuration** (dev/staging/prod)

---

**Last Updated**: Codebase analysis complete
**Status**: ✅ Architecture understood | Ready for professional development

