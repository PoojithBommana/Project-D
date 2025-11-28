# 📱 Responsive Design Guide for React Native

## Overview
This guide explains how to make your React Native app responsive across different screen sizes.

---

## 🛠️ Responsive Utility Functions

**Location**: `src/utils/responsive.ts`

### Available Functions

#### 1. **`wp(size)` - Width Percentage**
Scales width-based dimensions proportionally to screen width.

```typescript
import { wp } from '../utils/responsive';

// Example: 20% of screen width
paddingHorizontal: wp(20)
```

#### 2. **`hp(size)` - Height Percentage**
Scales height-based dimensions proportionally to screen height.

```typescript
import { hp } from '../utils/responsive';

// Example: 40px scaled to screen height
paddingTop: hp(40)
```

#### 3. **`rf(size, factor?)` - Responsive Font**
Scales font sizes with moderate scaling (prevents text from being too large/small).

```typescript
import { rf } from '../utils/responsive';

// Example: Font size that scales moderately
fontSize: rf(16)  // factor defaults to 0.5
fontSize: rf(16, 0.3)  // less aggressive scaling
```

#### 4. **`rs(size, factor?)` - Responsive Size**
General purpose scaling for any dimension (margins, padding, borders, etc.).

```typescript
import { rs } from '../utils/responsive';

// Example: Border radius that scales
borderRadius: rs(30)
marginTop: rs(20)
```

#### 5. **Helper Functions**

```typescript
import { 
  isSmallScreen, 
  isLargeScreen, 
  isTablet,
  getScreenWidth,
  getScreenHeight 
} from '../utils/responsive';

// Check device type
if (isTablet()) {
  // Tablet-specific styles
}

// Get screen dimensions
const width = getScreenWidth();
const height = getScreenHeight();
```

---

## 📐 Usage Examples

### Before (Fixed Sizes)
```typescript
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 16,
  },
});
```

### After (Responsive)
```typescript
import { wp, hp, rf, rs } from '../utils/responsive';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(20),  // Scales with width
    paddingTop: hp(40),          // Scales with height
  },
  title: {
    fontSize: rf(24),            // Responsive font
    marginBottom: hp(16),        // Scales with height
  },
  button: {
    borderRadius: rs(30),       // Responsive size
    paddingVertical: hp(16),     // Scales with height
  },
});
```

---

## 🎯 Best Practices

### 1. **Use `wp()` for Horizontal Dimensions**
- Padding horizontal
- Margin horizontal
- Width
- Left/Right positioning

```typescript
paddingHorizontal: wp(20)
width: wp(300)
marginLeft: wp(10)
```

### 2. **Use `hp()` for Vertical Dimensions**
- Padding vertical
- Margin vertical
- Height
- Top/Bottom positioning

```typescript
paddingTop: hp(40)
height: hp(200)
marginBottom: hp(20)
```

### 3. **Use `rf()` for Font Sizes**
- All text sizes
- Line heights (usually fontSize * 1.2 or 1.5)

```typescript
fontSize: rf(16)
lineHeight: rf(24)  // or fontSize * 1.5
```

### 4. **Use `rs()` for Other Sizes**
- Border radius
- Border width
- Icon sizes
- Small spacing

```typescript
borderRadius: rs(30)
borderWidth: rs(2)
iconSize: rs(24)
```

### 5. **Conditional Styling for Different Devices**

```typescript
import { isTablet, isSmallScreen } from '../utils/responsive';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: isTablet() ? wp(40) : wp(20),
    fontSize: isSmallScreen() ? rf(14) : rf(16),
  },
});
```

---

## 📱 Screen Size Breakpoints

The utility automatically detects:

- **Small Screen**: Width < 375px (iPhone SE, small Android)
- **Normal Screen**: Width 375px - 414px (Most phones)
- **Large Screen**: Width > 414px (iPhone Pro Max, large Android)
- **Tablet**: Width >= 768px (iPad, Android tablets)

---

## 🔄 Migration Guide

### Step 1: Import Responsive Functions
```typescript
import { wp, hp, rf, rs } from '../utils/responsive';
```

### Step 2: Replace Fixed Values

| Old | New |
|-----|-----|
| `paddingHorizontal: 20` | `paddingHorizontal: wp(20)` |
| `paddingTop: 40` | `paddingTop: hp(40)` |
| `fontSize: 16` | `fontSize: rf(16)` |
| `borderRadius: 30` | `borderRadius: rs(30)` |
| `marginBottom: 15` | `marginBottom: hp(15)` |

### Step 3: Test on Different Devices
- Small phone (iPhone SE)
- Normal phone (iPhone 14)
- Large phone (iPhone Pro Max)
- Tablet (iPad)

---

## 📊 Common Responsive Values

### Spacing
```typescript
import { spacing } from '../styles/responsiveStyles';

padding: spacing.md  // 16px scaled
margin: spacing.lg   // 24px scaled
```

### Font Sizes
```typescript
import { fontSizes } from '../styles/responsiveStyles';

fontSize: fontSizes.lg   // 16px scaled
fontSize: fontSizes.xl   // 18px scaled
```

### Border Radius
```typescript
import { borderRadius } from '../styles/responsiveStyles';

borderRadius: borderRadius.lg  // 12px scaled
borderRadius: borderRadius.round  // Fully rounded
```

---

## ⚠️ Important Notes

1. **Design Base**: The utility uses iPhone 14 Pro (393x852) as base design
   - Adjust `DESIGN_WIDTH` and `DESIGN_HEIGHT` in `responsive.ts` if needed

2. **Font Scaling**: `rf()` uses moderate scaling (factor 0.5) to prevent text from being too large on tablets

3. **Percentage vs Fixed**: 
   - Use `wp()`/`hp()` for layout dimensions
   - Use `rs()` for small fixed values (borders, icons)

4. **Performance**: These calculations are fast and don't impact performance

---

## 🎨 Example: Complete Responsive Style File

```typescript
import { StyleSheet } from 'react-native';
import { wp, hp, rf, rs, isTablet } from '../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(20),
    paddingTop: hp(40),
  },
  title: {
    fontSize: rf(24),
    marginBottom: hp(16),
    paddingHorizontal: wp(10),
  },
  button: {
    width: '100%',
    borderRadius: rs(30),
    paddingVertical: hp(16),
    paddingHorizontal: wp(32),
  },
  buttonText: {
    fontSize: rf(18),
    textAlign: 'center',
  },
  card: {
    width: isTablet() ? wp(400) : wp(350),
    height: hp(500),
    borderRadius: rs(20),
    marginBottom: hp(20),
  },
});
```

---

## ✅ Checklist for Responsive Design

- [ ] Import responsive utilities
- [ ] Replace fixed padding with `wp()`/`hp()`
- [ ] Replace fixed font sizes with `rf()`
- [ ] Replace fixed border radius with `rs()`
- [ ] Test on small screen
- [ ] Test on large screen
- [ ] Test on tablet (if supported)
- [ ] Check text readability on all sizes
- [ ] Verify buttons are tappable on all sizes

---

**Last Updated**: Responsive utilities implementation
**Status**: ✅ Responsive utilities ready to use

