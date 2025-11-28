# 📡 API Structure Documentation

## Overview
This document explains the new API structure with **Controllers** handling all backend API calls, and **Services** managing business logic and Firebase authentication.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         UI Components (Screens)         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Services Layer                   │
│  - AuthService                          │
│  - ProfileService                       │
│  (Business Logic + Firebase Auth)       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Controllers Layer                │
│  - AuthController                       │
│  - ProfileController                     │
│  (Backend API Calls)                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Backend API                     │
│  (Node.js / Express / etc.)             │
└─────────────────────────────────────────┘
```

---

## 📁 File Structure

```
src/
├── config/
│   └── api.ts                    # API configuration & endpoints
├── controllers/
│   ├── AuthController.ts         # Auth API calls
│   └── ProfileController.ts      # Profile API calls
└── services/
    ├── AuthService.ts            # Auth business logic + Firebase
    └── ProfileService.ts         # Profile business logic
```

---

## 🔐 AuthController

**Location**: `src/controllers/AuthController.ts`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/send-otp` | Send OTP to phone number |
| POST | `/auth/verify-otp` | Verify OTP code |
| POST | `/auth/resend-otp` | Resend OTP |
| **POST** | **`/auth/google-login`** | **Send Google login data to backend** |
| POST | `/auth/facebook-login` | Send Facebook login data to backend |
| POST | `/auth/logout` | Logout user |
| POST | `/auth/refresh-token` | Refresh authentication token |

### Google Login API Implementation

**Endpoint**: `POST /auth/google-login`

**Request Body**:
```typescript
{
  idToken: string;        // Google ID token
  email?: string;         // User email
  name?: string;          // User display name
  photoURL?: string;      // User profile photo
  uid?: string;          // Firebase UID
}
```

**Response**:
```typescript
{
  success: boolean;
  message?: string;
  token?: string;         // Backend JWT token
  refreshToken?: string;  // Refresh token
  user?: {
    id: string;
    email: string;
    name: string;
    photoURL?: string;
    phoneNumber?: string;
  };
  error?: string;
}
```

**Usage Example**:
```typescript
import { authController } from '../controllers/AuthController';

const response = await authController.googleLogin({
  idToken: 'google-id-token-here',
  email: 'user@example.com',
  name: 'John Doe',
  photoURL: 'https://...',
  uid: 'firebase-uid',
});
```

---

## 👤 ProfileController

**Location**: `src/controllers/ProfileController.ts`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profiles?page=1&limit=10` | Fetch profiles with pagination |
| GET | `/profiles/:id` | Get profile by ID |
| PUT | `/profiles/:id` | Update profile |
| POST | `/profiles/swipe` | Submit swipe action |
| GET | `/profiles/matches` | Get user's matches |

---

## 🔄 Service Layer Updates

### AuthService

**Changes**:
- ✅ All API calls now use `AuthController`
- ✅ Google Sign-In now sends data to backend after Firebase auth
- ✅ Maintains Firebase authentication logic
- ✅ Simplified methods (delegates to controller)

**Flow for Google Login**:
```
1. User clicks "Continue with Google"
2. AuthService.signInWithGoogle() called
3. Firebase authentication (Google Sign-In SDK)
4. Get Firebase user credentials
5. Send Google login data to backend via AuthController.googleLogin()
6. Return both Firebase user and backend response
```

### ProfileService

**Changes**:
- ✅ All API calls now use `ProfileController`
- ✅ Simplified methods (delegates to controller)
- ✅ Maintains type safety

---

## 📝 API Configuration

**Location**: `src/config/api.ts`

### Configuration Options

```typescript
// Base URL
API_BASE_URL = 'https://api.dilmil.com'

// Timeout
API_TIMEOUT = 30000 // 30 seconds

// Headers
getDefaultHeaders()  // Content-Type, Accept
getAuthHeaders(token) // Includes Authorization header
```

### Endpoints

All endpoints are centralized in `API_ENDPOINTS` object:
```typescript
API_ENDPOINTS.AUTH.GOOGLE_LOGIN = '/auth/google-login'
API_ENDPOINTS.PROFILE.GET_PROFILES = '/profiles'
// etc.
```

---

## 🚀 Implementation Details

### Google Login Complete Flow

```typescript
// 1. In AuthService.signInWithGoogle()
async signInWithGoogle() {
  // Step 1: Firebase Authentication
  const firebaseUser = await signInWithCredential(...);
  
  // Step 2: Prepare data for backend
  const googleLoginData = {
    idToken: idToken,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    uid: firebaseUser.uid,
  };
  
  // Step 3: Send to backend API
  const backendResponse = await authController.googleLogin(googleLoginData);
  
  // Step 4: Return both Firebase user and backend response
  return {
    success: true,
    user: firebaseUser,
    backendResponse: backendResponse,
  };
}
```

### Error Handling

All controllers include:
- ✅ Request timeout handling (30 seconds)
- ✅ HTTP error status handling
- ✅ Network error handling
- ✅ Try-catch blocks
- ✅ User-friendly error messages

---

## 📋 Backend API Requirements

### Google Login Endpoint

**Expected Backend Implementation**:

```javascript
// POST /auth/google-login
app.post('/auth/google-login', async (req, res) => {
  const { idToken, email, name, photoURL, uid } = req.body;
  
  // 1. Verify Google ID token (optional, if needed)
  // 2. Check if user exists in database
  // 3. Create/Update user record
  // 4. Generate JWT token
  // 5. Return user data and tokens
  
  res.json({
    success: true,
    token: 'jwt-token-here',
    refreshToken: 'refresh-token-here',
    user: {
      id: 'user-id',
      email: email,
      name: name,
      photoURL: photoURL,
    }
  });
});
```

---

## ✅ Benefits of New Structure

1. **Separation of Concerns**
   - Controllers: API communication
   - Services: Business logic + Firebase

2. **Centralized API Management**
   - All endpoints in one place
   - Easy to update base URL
   - Consistent error handling

3. **Type Safety**
   - TypeScript interfaces for all requests/responses
   - Compile-time error checking

4. **Maintainability**
   - Clear structure
   - Easy to add new endpoints
   - Consistent patterns

5. **Testability**
   - Controllers can be mocked
   - Services can be tested independently

---

## 🔧 Usage Examples

### Using AuthController Directly

```typescript
import { authController } from '../controllers/AuthController';

// Send OTP
const otpResponse = await authController.sendOTP({
  countryCode: '+91',
  phoneNumber: '9876543210',
});

// Google Login
const googleResponse = await authController.googleLogin({
  idToken: 'token-here',
  email: 'user@example.com',
  name: 'User Name',
});
```

### Using AuthService (Recommended)

```typescript
import { authService } from '../services/AuthService';

// Google Sign-In (handles Firebase + Backend)
const result = await authService.signInWithGoogle();
if (result.success) {
  console.log('Firebase User:', result.user);
  console.log('Backend Response:', result.backendResponse);
}
```

---

## 📝 Next Steps

1. ✅ **Update backend** to implement `/auth/google-login` endpoint
2. ✅ **Test API calls** with actual backend
3. ✅ **Add token storage** (AsyncStorage) for authentication
4. ✅ **Implement token refresh** logic
5. ✅ **Add request interceptors** for automatic token injection

---

**Last Updated**: Controller structure implementation
**Status**: ✅ Controllers created | ✅ Google Login API implemented

