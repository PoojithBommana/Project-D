/**
 * Validation Utilities
 * 
 * Centralized validation functions for form inputs and data.
 * Provides reusable validation logic across the application.
 */

import { t } from '../config/i18n';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates phone number format
 */
export const validatePhoneNumber = (phoneNumber: string, countryCode?: string): ValidationResult => {
  if (!phoneNumber || !phoneNumber.trim()) {
    return {
      isValid: false,
      error: t('PhoneNumberRequired'),
    };
  }

  // Remove spaces and special characters
  const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');

  // Basic validation - should be numeric and have reasonable length
  if (!/^\d+$/.test(cleaned)) {
    return {
      isValid: false,
      error: t('PhoneNumberDigitsOnly'),
    };
  }

  // Length validation based on country code
  const minLength = countryCode === '+1' ? 10 : 8;
  const maxLength = 15;

  if (cleaned.length < minLength) {
    return {
      isValid: false,
      error: t('PhoneNumberMinLength').replace('{minLength}', minLength.toString()),
    };
  }

  if (cleaned.length > maxLength) {
    return {
      isValid: false,
      error: t('PhoneNumberMaxLength').replace('{maxLength}', maxLength.toString()),
    };
  }

  return { isValid: true };
};

/**
 * Validates OTP code
 */
export const validateOTP = (otp: string): ValidationResult => {
  if (!otp || !otp.trim()) {
    return {
      isValid: false,
      error: t('OTPRequired'),
    };
  }

  if (!/^\d{6}$/.test(otp)) {
    return {
      isValid: false,
      error: t('OTPInvalid'),
    };
  }

  return { isValid: true };
};

/**
 * Validates country code
 */
export const validateCountryCode = (countryCode: string): ValidationResult => {
  if (!countryCode || !countryCode.startsWith('+')) {
    return {
      isValid: false,
      error: t('InvalidCountryCode'),
    };
  }

  return { isValid: true };
};

