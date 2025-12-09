import api from '../config/apiCall';
import { API_ENDPOINTS } from '../config/endpoints';

interface OnboardingUpdateResult {
  success: boolean;
  data?: any;
  error?: string;
}

export const submitOnboardingUpdate = async (
  payload: Record<string, any>,
  accessToken?: string,
): Promise<OnboardingUpdateResult> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await api.patch(API_ENDPOINTS.ONBOARDING.UPDATE, payload, {
      headers,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    if (error?.response) {
      console.error(
        '[OnboardingUpdate] Failed with status',
        error?.response?.status,
        'data:',
        error?.response?.data,
      );
      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.response?.detail ||
          'Failed to update onboarding',
      };
    }

    if (error?.request) {
      console.error('[OnboardingUpdate] Network error: No response received');
      return {
        success: false,
        error: 'Network error: Unable to reach server',
      };
    }

    console.error('[OnboardingUpdate] Unknown error:', error?.message || error);
    return {
      success: false,
      error: error?.message || 'Unknown error occurred',
    };
  }
};
