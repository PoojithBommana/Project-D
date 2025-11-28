# 🚨 Facebook Login - Quick Fix (5 Minutes)

## The Problem
You're seeing: **"App not active: This app is not accessible right now"**

This happens because your Facebook app is in **Development Mode** and you're not added as a tester.

## ✅ Quick Fix (5 Steps - 5 Minutes)

### Step 1: Open Facebook Developer Console
Go to: https://developers.facebook.com/

### Step 2: Select Your App
- Click on **"My Apps"** (top right)
- Find and click on your app (App ID: **1586110712740100**)
- If you don't see it, you may need to create it first

### Step 3: Add Yourself as Tester
1. In your app dashboard, click **Settings** (left sidebar)
2. Scroll down to **User Roles** section
3. Click **Add People**
4. Enter your Facebook email address
5. Select role: **Developer** or **Tester**
6. Click **Add**

### Step 4: Accept Invitation
1. Check your email (the one you used for Facebook)
2. Look for invitation from Facebook Developers
3. Click **Accept** in the email

### Step 5: Try Again
1. Log out of Facebook on your device (if logged in)
2. Clear app cache (optional)
3. Try logging in with Facebook again
4. ✅ Should work now!

---

## 🔍 Can't Find Your App?

If you don't see the app in Facebook Developer Console:

1. **Create a new app:**
   - Go to https://developers.facebook.com/
   - Click **"Create App"**
   - Choose **"Consumer"** or **"Business"**
   - Enter app name: **ProjectD**
   - Click **Create App**

2. **Add Facebook Login:**
   - In app dashboard, click **"Add Product"**
   - Find **"Facebook Login"**
   - Click **Set Up**

3. **Configure Settings:**
   - Go to **Settings → Basic**
   - Add **App Domains** (if needed)
   - Add **Privacy Policy URL** (required for production)
   - Save changes

4. **Update Your Code:**
   - Copy the new **App ID** and **Client Token**
   - Update `android/app/src/main/res/values/strings.xml`
   - Update `ios/ProjectD/Info.plist` (if using iOS)
   - Rebuild the app

---

## ⚠️ Still Not Working?

### Check These:

1. **Did you accept the invitation email?**
   - Must accept via email link

2. **Are you using the correct Facebook account?**
   - Must be the same account you added as tester

3. **Is the app in Development mode?**
   - Go to Settings → Basic
   - Check "App Mode" - should say "Development"
   - In Development mode, only testers can login

4. **Try logging out and back in:**
   - Log out of Facebook app on your device
   - Clear app data/cache
   - Try again

---

## 🚀 For Production (Later)

When ready for production:

1. Go to **App Review** → **Permissions and Features**
2. Request review for `email` permission
3. Once approved, switch to **Live Mode**
4. All users can then login

---

## 📱 Current App Configuration

**App ID:** `1586110712740100`  
**Client Token:** `573f36003a315c01a4a29c5e1f7bfb3f`

**Files configured:**
- ✅ `android/app/src/main/res/values/strings.xml`
- ✅ `android/app/src/main/AndroidManifest.xml`
- ⚠️ `ios/ProjectD/Info.plist` (if using iOS)

---

**Time needed:** 5 minutes  
**Difficulty:** Easy  
**Result:** Facebook login will work! ✅

