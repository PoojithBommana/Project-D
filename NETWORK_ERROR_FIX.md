# 🔧 Network Error Fix Guide

## Problem
Getting "Network request failed" errors when making API calls.

## Common Causes & Solutions

### 1. **Backend Server Not Running**
**Solution**: Start your backend server
```bash
# Make sure your Node.js/Express backend is running
npm start
# or
node server.js
```

### 2. **Wrong API URL for Local Development**

#### For Android Emulator:
- ❌ Don't use: `http://localhost:3000`
- ❌ Don't use: `http://127.0.0.1:3000`
- ✅ Use: `http://10.0.2.2:3000` (Android emulator's special IP for host machine)

#### For iOS Simulator:
- ✅ Use: `http://localhost:3000`
- ✅ Use: `http://127.0.0.1:3000`

#### For Physical Device:
- ✅ Use your computer's IP address: `http://192.168.x.x:3000`
- Find your IP: 
  - Windows: `ipconfig` (look for IPv4)
  - Mac/Linux: `ifconfig` or `ip addr`

### 3. **Update API URL in Code**

**File**: `src/config/api.ts`

```typescript
// For Android Emulator (local development)
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000' // Your backend port
  : 'https://api.dilmil.com';

// For iOS Simulator (local development)
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000' // Your backend port
  : 'https://api.dilmil.com';

// For Physical Device (local development)
export const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.100:3000' // Your computer's IP
  : 'https://api.dilmil.com';
```

### 4. **Temporarily Disable Backend API**

If backend is not ready yet, you can disable API calls:

**File**: `src/config/api.ts`

```typescript
export const ENABLE_BACKEND_API = false; // Set to false to skip backend calls
```

This will:
- ✅ Allow Firebase authentication to work
- ✅ Skip backend API calls gracefully
- ✅ App continues to function

### 5. **Check Network Permissions**

**Android**: Already configured in `AndroidManifest.xml`
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

**iOS**: Already configured in `Info.plist`

### 6. **Firewall/Antivirus Blocking**

- Check if firewall is blocking the connection
- Temporarily disable to test
- Add exception for your backend port

---

## Current Implementation

### ✅ Graceful Error Handling

The app now handles network errors gracefully:

1. **Google Login**:
   - ✅ Firebase authentication still works
   - ⚠️ Backend sync fails but doesn't block user
   - ✅ User can continue using the app

2. **Profile Fetching**:
   - ✅ Returns empty array on error
   - ✅ Falls back to mock data (if implemented)
   - ✅ Doesn't crash the app

### Error Messages

- **Network Error**: "Network error: Unable to connect to server. Please check your internet connection or ensure the backend server is running."
- **Timeout**: "Request timeout. Please check your internet connection."

---

## Testing Steps

1. **Check Backend is Running**:
   ```bash
   curl http://localhost:3000/health
   # or
   curl http://10.0.2.2:3000/health  # For Android emulator
   ```

2. **Test API Endpoint**:
   ```bash
   curl -X POST http://localhost:3000/auth/google-login \
     -H "Content-Type: application/json" \
     -d '{"idToken":"test"}'
   ```

3. **Check Logs**:
   - Look for `[API] Making request to: ...` in console
   - Check error messages for specific issues

---

## Quick Fix Checklist

- [ ] Backend server is running
- [ ] API URL is correct for your device/emulator
- [ ] Port number matches backend server
- [ ] Firewall not blocking connection
- [ ] Internet connection is active
- [ ] Backend CORS is configured (if needed)

---

## Development Mode

For development when backend is not available:

1. Set `ENABLE_BACKEND_API = false` in `api.ts`
2. Firebase authentication will still work
3. App will function without backend
4. Backend can be added later

---

**Last Updated**: Network error handling improvements
**Status**: ✅ Graceful error handling implemented

