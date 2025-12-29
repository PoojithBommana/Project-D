<!-- a2555af4-b1c0-4a26-a189-691d7c6d5836 3f305010-5e73-4ea4-b3e4-4d9be4fda8bf -->
# Profile Screen UI Replication

## Overview

Replicate the profile screen UI from the image with pixel-perfect accuracy, including all visual elements, layout, colors, and styling.

## Implementation Details

### Files to Create/Modify

1. **src/screen/Dashboard/ProfileScreen.tsx** - Main profile screen component (currently placeholder)
2. **src/styles/ProfileScreenStyles.tsx** - New styles file for profile screen

### UI Components to Implement

#### 1. Header Section

- Back arrow icon (left)
- "Profile" title (center, bold)
- Bell/notification icon (right)
- White background
- Status bar with dark content

#### 2. Profile Information Section

- Horizontal layout with:
- "2.5M Followers" (left)
- Circular profile picture (center, ~80-100px diameter)
- "120 Following" (right)
- Below: Full name "Leslie Alexander" (bold)
- Below: Username "@leslie_alex007" (smaller, gray)

#### 3. Content Tabs

- Two pill-shaped buttons side by side:
- "Post" tab: White background, light gray border, "25" count
- "Reels" tab: Yellow background (#FFD700), "34" count in black circle badge
- Reels tab is active/selected

#### 4. "Videos in your drift" Section

- Horizontal row of 4 small circular profile pictures/avatars
- Text "24 videos in your drift"
- "Take a look" button (white pill with light gray border)

#### 5. Video Grid

- 3-column grid layout
- Each video thumbnail shows:
- Image/video preview
- Play icon overlay (bottom)
- View count (e.g., "20.5K", "45.9K", "534.4K")
- Grid fills available space with proper spacing

#### 6. Bottom Navigation (if needed)

- Note: Current CustomTabBar may need updates to match image (Home, Explore, Create, Messages, Profile icons)

### Styling Specifications

- Background: White (#FFFFFF)
- Primary accent: Yellow (#FFD700 or #f0f351)
- Text: Black for primary, gray for secondary
- Fonts: Use existing font families (GTMaruBold, GTMaruMedium, etc.)
- Spacing: Use responsive utilities (wp, hp, rf, rs)
- Border radius: Pill-shaped for tabs/buttons (~20-25px)
- Shadows: Subtle shadows for elevation

### Technical Implementation

- Use SafeAreaView for proper spacing
- Use StatusBar with dark-content
- Use FlatList or ScrollView for video grid
- Use react-native-vector-icons for icons (Ionicons or MaterialCommunityIcons)
- Use Image component for profile pictures and video thumbnails
- Implement proper responsive sizing using wp/hp utilities

### Data Structure

- Create placeholder/mock data for:
- User profile info (name, handle, followers, following)
- Post count (25)
- Reels count (34)
- Drift videos (24 videos, 4 avatars)
- Video grid items (with thumbnails, view counts)

## Questions to Clarify

1. Should the bottom navigation bar be updated to match the image (Home, Explore, Create, Messages, Profile) or keep current structure?
2. Use placeholder/mock data or integrate with existing user data/API?
3. Should video thumbnails be clickable/navigable or static for now?