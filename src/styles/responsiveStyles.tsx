/**
 * Responsive Styles Helper
 * 
 * Provides responsive style utilities and common responsive styles
 */

import { StyleSheet, Platform } from 'react-native';
import { wp, hp, rf, rs, isTablet, isSmallScreen, getScreenWidth, getScreenHeight } from '../utils/responsive';

/**
 * Common responsive spacing values
 */
export const spacing = {
  xs: rs(4),
  sm: rs(8),
  md: rs(16),
  lg: rs(24),
  xl: rs(32),
  xxl: rs(48),
};

/**
 * Common responsive font sizes
 */
export const fontSizes = {
  xs: rf(10),
  sm: rf(12),
  md: rf(14),
  lg: rf(16),
  xl: rf(18),
  xxl: rf(24),
  xxxl: rf(32),
  huge: rf(48),
};

/**
 * Common responsive border radius
 */
export const borderRadius = {
  sm: rs(4),
  md: rs(8),
  lg: rs(12),
  xl: rs(16),
  xxl: rs(24),
  round: rs(999),
};

/**
 * Responsive button styles
 */
export const buttonStyles = {
  small: {
    paddingVertical: rs(8),
    paddingHorizontal: rs(16),
    borderRadius: rs(20),
    fontSize: rf(14),
  },
  medium: {
    paddingVertical: rs(12),
    paddingHorizontal: rs(24),
    borderRadius: rs(25),
    fontSize: rf(16),
  },
  large: {
    paddingVertical: rs(16),
    paddingHorizontal: rs(32),
    borderRadius: rs(30),
    fontSize: rf(18),
  },
};

/**
 * Responsive container styles
 */
export const containerStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: getScreenWidth(),
    paddingHorizontal: isTablet() ? wp(40) : wp(20),
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: spacing.md,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
});

/**
 * Responsive text styles
 */
export const textStyles = StyleSheet.create({
  h1: {
    fontSize: fontSizes.huge,
    lineHeight: fontSizes.huge * 1.2,
  },
  h2: {
    fontSize: fontSizes.xxxl,
    lineHeight: fontSizes.xxxl * 1.2,
  },
  h3: {
    fontSize: fontSizes.xxl,
    lineHeight: fontSizes.xxl * 1.2,
  },
  body: {
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * 1.5,
  },
  caption: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * 1.4,
  },
  small: {
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * 1.4,
  },
});

/**
 * Helper function to create responsive styles
 */
export const createResponsiveStyle = (baseStyle: any) => {
  return StyleSheet.create({
    ...baseStyle,
    // Add responsive adjustments here if needed
  });
};

