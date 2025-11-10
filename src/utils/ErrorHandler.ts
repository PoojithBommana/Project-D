/**
 * Error Handler Utilities
 * 
 * Centralized error handling and user-friendly error messages.
 * Provides consistent error handling across the application.
 */

import { Alert } from 'react-native';

export interface AppError {
  code?: string;
  message: string;
  details?: any;
}

/**
 * Shows user-friendly error alert
 */
export const showErrorAlert = (error: string | AppError, title: string = 'Error') => {
  const message = typeof error === 'string' ? error : error.message;
  Alert.alert(title, message, [{ text: 'OK' }]);
};

/**
 * Shows success alert
 */
export const showSuccessAlert = (message: string, title: string = 'Success') => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

/**
 * Handles API errors and returns user-friendly messages
 */
export const handleAPIError = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.status === 401) {
    return 'Authentication failed. Please try again.';
  }

  if (error?.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (error?.response?.status === 404) {
    return 'Resource not found.';
  }

  if (error?.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }

  if (error?.code === 'NETWORK_ERROR') {
    return 'Network error. Please check your internet connection.';
  }

  return 'An unexpected error occurred. Please try again.';
};

