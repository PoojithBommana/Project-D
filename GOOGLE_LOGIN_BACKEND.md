# 🔐 Google Login - Backend Integration Guide

## Overview
This document explains what data is sent to the backend when a user logs in with Google, specifically focusing on the **Firebase User UID** which is the primary identifier.

---

## 📋 Data Sent to Backend

### POST `/auth/google-login`

**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...",  // Google ID token
  "uid": "TFP9bBoPN4aOmdF5fLYdLhc...",            // Firebase User UID (PRIMARY IDENTIFIER)
  "email": "adiya032813@gmail.com",               // User email
  "name": "User Name",                             // User display name
  "photoURL": "https://lh3.googleusercontent.com/..." // Profile photo URL
}
```

### Key Fields Explained

#### 1. **`uid` (Firebase User UID)** - ⭐ PRIMARY IDENTIFIER
- **Type**: `string` (required)
- **Example**: `"TFP9bBoPN4aOmdF5fLYdLhc..."`
- **Description**: This is the Firebase User UID that appears in Firebase Console
- **Purpose**: Backend uses this to:
  - Identify the user uniquely
  - Link user data in your database
  - Access user information from Firebase Admin SDK
  - Match with Firebase Console user records

#### 2. **`idToken` (Google ID Token)**
- **Type**: `string` (required)
- **Description**: Google's ID token for verification
- **Purpose**: Backend can verify this token with Google to ensure authenticity

#### 3. **`email`**
- **Type**: `string` (optional)
- **Example**: `"adiya032813@gmail.com"`
- **Description**: User's email address from Google account

#### 4. **`name`**
- **Type**: `string` (optional)
- **Description**: User's display name from Google account

#### 5. **`photoURL`**
- **Type**: `string` (optional)
- **Description**: URL to user's profile photo

---

## 🔄 Complete Flow

```
1. User clicks "Continue with Google"
   ↓
2. Google Sign-In SDK opens account picker
   ↓
3. User selects Google account
   ↓
4. Google returns ID Token
   ↓
5. Firebase authenticates with ID Token
   ↓
6. Firebase returns User object with UID
   ↓
7. App extracts:
   - Firebase UID (TFP9bBoPN4aOmdF5fLYdLhc...)
   - Email (adiya032813@gmail.com)
   - Name, Photo URL
   ↓
8. POST /auth/google-login
   {
     "uid": "TFP9bBoPN4aOmdF5fLYdLhc...",
     "idToken": "...",
     "email": "adiya032813@gmail.com",
     ...
   }
   ↓
9. Backend receives UID and can:
   - Create/Update user record
   - Link to Firebase user
   - Generate JWT token
   - Return user data
```

---

## 🎯 Backend Implementation

### Expected Backend Endpoint

**POST** `/auth/google-login`

### Backend Should:

1. **Receive the UID**:
   ```javascript
   const { uid, idToken, email, name, photoURL } = req.body;
   ```

2. **Verify with Firebase Admin SDK** (optional but recommended):
   ```javascript
   const admin = require('firebase-admin');
   const decodedToken = await admin.auth().verifyIdToken(idToken);
   // decodedToken.uid should match the uid from request
   ```

3. **Use UID as Primary Key**:
   ```javascript
   // Check if user exists
   const user = await db.users.findOne({ firebaseUid: uid });
   
   if (!user) {
     // Create new user
     await db.users.create({
       firebaseUid: uid,
       email: email,
       name: name,
       photoURL: photoURL,
       createdAt: new Date(),
     });
   } else {
     // Update existing user
     await db.users.update(
       { firebaseUid: uid },
       { 
         email: email,
         name: name,
         photoURL: photoURL,
         lastLoginAt: new Date(),
       }
     );
   }
   ```

4. **Return Response**:
   ```javascript
   res.json({
     success: true,
     token: 'jwt-token-here',
     refreshToken: 'refresh-token-here',
     user: {
       id: user.id,
       firebaseUid: uid,
       email: email,
       name: name,
       photoURL: photoURL,
     }
   });
   ```

---

## 📊 Firebase Console Mapping

The **UID** sent to backend matches exactly what you see in Firebase Console:

| Firebase Console | Backend Receives |
|-----------------|------------------|
| User UID: `TFP9bBoPN4aOmdF5fLYdLhc...` | `uid: "TFP9bBoPN4aOmdF5fLYdLhc..."` |
| Identifier: `adiya032813@gmail.com` | `email: "adiya032813@gmail.com"` |
| Provider: Google | `idToken: "..."` (Google token) |

---

## ✅ Current Implementation

### Code Location

**File**: `src/services/AuthService.ts`

```typescript
// After Firebase authentication
const firebaseUser = userCredential.user;

// Prepare data with Firebase UID
const googleLoginData: GoogleLoginRequest = {
  idToken: idToken,
  uid: firebaseUser.uid,  // ⭐ This is the Firebase UID
  email: firebaseUser.email,
  name: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
};

// Send to backend
await authController.googleLogin(googleLoginData);
```

### Request Interface

**File**: `src/controllers/AuthController.ts`

```typescript
export interface GoogleLoginRequest {
  idToken: string;        // Google ID token
  uid: string;            // ⭐ Firebase User UID (REQUIRED)
  email?: string;
  name?: string;
  photoURL?: string;
}
```

---

## 🔍 Debugging

### Check What's Being Sent

Look for these console logs:
```
Sending to backend - Firebase UID: TFP9bBoPN4aOmdF5fLYdLhc...
Sending to backend - Email: adiya032813@gmail.com
[API] Sending Google login to backend: { uid: '...', email: '...', hasIdToken: true }
```

### Verify UID Matches Firebase Console

1. Check Firebase Console → Authentication → Users
2. Find the user by email
3. Copy the User UID
4. Compare with what's sent in API request

---

## ⚠️ Important Notes

1. **UID is Required**: The `uid` field is now required (not optional)
2. **UID is Unique**: Each Firebase user has a unique UID
3. **UID is Permanent**: UID doesn't change even if user updates email
4. **Backend Should Store UID**: Use UID as primary identifier in your database
5. **Firebase Admin SDK**: Backend can use UID with Firebase Admin SDK to access user data

---

## 🚀 Next Steps

1. ✅ **Backend receives UID** - Already implemented
2. ⏳ **Backend stores UID** - Implement in your backend
3. ⏳ **Backend uses UID for queries** - Use UID to fetch user data
4. ⏳ **Backend links to Firebase** - Use Firebase Admin SDK with UID

---

**Last Updated**: Firebase UID implementation
**Status**: ✅ UID is sent to backend as primary identifier

