/**
 * Validation Utilities
 * 
 * Centralized validation functions for form inputs and data.
 * Provides reusable validation logic across the application.
 */

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
      error: 'Phone number is required',
    };
  }

  // Remove spaces and special characters
  const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');

  // Basic validation - should be numeric and have reasonable length
  if (!/^\d+$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Phone number should contain only digits',
    };
  }

  // Length validation based on country code
  const minLength = countryCode === '+1' ? 10 : 8;
  const maxLength = 15;

  if (cleaned.length < minLength) {
    return {
      isValid: false,
      error: `Phone number should be at least ${minLength} digits`,
    };
  }

  if (cleaned.length > maxLength) {
    return {
      isValid: false,
      error: `Phone number should not exceed ${maxLength} digits`,
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
      error: 'OTP code is required',
    };
  }

  if (!/^\d{6}$/.test(otp)) {
    return {
      isValid: false,
      error: 'OTP must be exactly 6 digits',
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
      error: 'Invalid country code format',
    };
  }

  return { isValid: true };
};

