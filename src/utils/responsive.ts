/**
 * Responsive Utility
 * 
 * Provides responsive sizing functions for React Native.
 * Helps create layouts that adapt to different screen sizes.
 */

import { Dimensions, PixelRatio, Platform } from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Design dimensions (base design - adjust to your design specs)
// These are typically the dimensions your designer used (e.g., iPhone 14 Pro)
const DESIGN_WIDTH = 393; // iPhone 14 Pro width
const DESIGN_HEIGHT = 852; // iPhone 14 Pro height

// Scale factor based on screen width
const scale = SCREEN_WIDTH / DESIGN_WIDTH;

// Scale factor based on screen height
const verticalScale = SCREEN_HEIGHT / DESIGN_HEIGHT;

// Moderate scale - less aggressive scaling
const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale - 1) * size * factor;
};

/**
 * Responsive width - scales based on screen width
 * @param size - Size in design units
 * @returns Scaled size
 */
export const wp = (size: number): number => {
  return (size / DESIGN_WIDTH) * SCREEN_WIDTH;
};

/**
 * Responsive height - scales based on screen height
 * @param size - Size in design units
 * @returns Scaled size
 */
export const hp = (size: number): number => {
  return (size / DESIGN_HEIGHT) * SCREEN_HEIGHT;
};

/**
 * Responsive font size - scales based on screen width with moderate scaling
 * @param size - Font size in design units
 * @param factor - Scaling factor (0-1), default 0.5
 * @returns Scaled font size
 */
export const rf = (size: number, factor: number = 0.5): number => {
  return moderateScale(size, factor);
};

/**
 * Responsive size - general purpose scaling
 * @param size - Size in design units
 * @param factor - Scaling factor (0-1), default 0.5
 * @returns Scaled size
 */
export const rs = (size: number, factor: number = 0.5): number => {
  return moderateScale(size, factor);
};

/**
 * Get screen width
 */
export const getScreenWidth = (): number => {
  return SCREEN_WIDTH;
};

/**
 * Get screen height
 */
export const getScreenHeight = (): number => {
  return SCREEN_HEIGHT;
};

/**
 * Check if device is small screen
 */
export const isSmallScreen = (): boolean => {
  return SCREEN_WIDTH < 375;
};

/**
 * Check if device is large screen
 */
export const isLargeScreen = (): boolean => {
  return SCREEN_WIDTH > 414;
};

/**
 * Check if device is tablet
 */
export const isTablet = (): boolean => {
  return SCREEN_WIDTH >= 768;
};

/**
 * Get responsive padding
 * @param base - Base padding value
 * @returns Responsive padding
 */
export const getResponsivePadding = (base: number): number => {
  if (isTablet()) {
    return base * 1.5;
  }
  if (isSmallScreen()) {
    return base * 0.8;
  }
  return base;
};

/**
 * Get responsive margin
 * @param base - Base margin value
 * @returns Responsive margin
 */
export const getResponsiveMargin = (base: number): number => {
  if (isTablet()) {
    return base * 1.5;
  }
  if (isSmallScreen()) {
    return base * 0.8;
  }
  return base;
};

/**
 * Get responsive font size based on screen size
 * @param base - Base font size
 * @returns Responsive font size
 */
export const getResponsiveFontSize = (base: number): number => {
  if (isTablet()) {
    return base * 1.2;
  }
  if (isSmallScreen()) {
    return base * 0.9;
  }
  return base;
};

/**
 * Pixel ratio aware size
 * @param size - Size in pixels
 * @returns Pixel ratio adjusted size
 */
export const pixelRatioSize = (size: number): number => {
  return PixelRatio.roundToNearestPixel(size);
};

/**
 * Platform specific size
 * @param iosSize - Size for iOS
 * @param androidSize - Size for Android
 * @returns Platform specific size
 */
export const platformSize = (iosSize: number, androidSize: number): number => {
  return Platform.OS === 'ios' ? iosSize : androidSize;
};

// Export screen dimensions for direct use
export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;

// Export scale factors
export { scale, verticalScale, moderateScale };

