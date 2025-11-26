/**
 * Error Handler Utilities
 * 
 * Centralized error handling and user-friendly error messages.
 * Provides consistent error handling across the application.
 */

import { Alert } from 'react-native';
import { t } from '../config/i18n';

export interface AppError {
  code?: string;
  message: string;
  details?: any;
}

/**
 * Shows user-friendly error alert
 */
export const showErrorAlert = (error: string | AppError, title: string = t('Error')) => {
  const message = typeof error === 'string' ? error : error.message;
  Alert.alert(title, message, [{ text: t('OK') }]);
};

/**
 * Shows success alert
 */
export const showSuccessAlert = (message: string, title: string = t('Success')) => {
  Alert.alert(title, message, [{ text: t('OK') }]);
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
    return t('AuthenticationFailed');
  }

  if (error?.response?.status === 403) {
    return t('NoPermission');
  }

  if (error?.response?.status === 404) {
    return t('ResourceNotFound');
  }

  if (error?.response?.status >= 500) {
    return t('ServerError');
  }

  if (error?.code === 'NETWORK_ERROR') {
    return t('NetworkError');
  }

  return t('UnexpectedError');
};

