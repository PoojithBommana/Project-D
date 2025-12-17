import { patchApiCall } from '../config/apiCall';

interface OnboardingUpdateResult {
  success: boolean;
  data?: any;
  error?: string;
  updated_fields?: string[];
  progress?: number;
  completed_required?: number;
  total_required?: number;
  remaining_required?: string[];
  optional_completed?: string[];
  next_step?: string;
  onboarding_complete?: boolean;
}

/**
 * Submit onboarding update using PATCH method
 * Supports partial updates - only send fields that need to be updated
 * 
 * Field mappings based on new API spec:
 * - first_name, last_name, gender, birthday (YYYY-MM-DD)
 * - height_cm (50-260)
 * - currently ("studying"/"working")
 * - drinking ("yes"/"sometimes"/"rarely"/"no"/"sober")
 * - smoking ("yes"/"sometimes"/"no"/"trying_to_quit")
 * - photos (array of URLs, deduped)
 * - live_photo (URL) - previously selfie_photo
 * - profile_photo (URL) - first photo from photos array
 * - username, bio
 * - hobbies (list or object; if list, at least 1)
 * - activity_interests (list, ≥3)
 * - known_languages (list, at least 1)
 * - qualities (list, ≥3)
 * - zodiac_sign (aries..pisces)
 * - connection_goal
 * - interested_in_genders (list)
 * - interested_age_range (object with min/max)
 * - music_artist_ids (list, 1-10) - previously favorite_artist
 * - music_genres (list, ≥1)
 * - religion (optional, predefined list)
 * - causes_communities (optional, list; can be empty)
 */
export const submitOnboardingUpdate = async (
  payload: Record<string, any>,
  accessToken?: string,
): Promise<OnboardingUpdateResult> => {
  try {
    const response = await patchApiCall('ONBOARDING', 'UPDATE', payload, accessToken);

    if (response?.error) {
      console.error(
        '[OnboardingUpdate] Failed with status',
        response?.statusCode,
        'data:',
        response?.response,
      );
      return {
        success: false,
        error:
          response?.response?.message ||
          response?.response?.error ||
          response?.response?.detail ||
          'Failed to update onboarding',
      };
    }

    // Extract response data
    const responseData = response?.response || {};
    
    return {
      success: true,
      data: responseData,
      updated_fields: responseData.updated_fields,
      progress: responseData.progress,
      completed_required: responseData.completed_required,
      total_required: responseData.total_required,
      remaining_required: responseData.remaining_required,
      optional_completed: responseData.optional_completed,
      next_step: responseData.next_step,
      onboarding_complete: responseData.onboarding_complete,
    };
  } catch (error: any) {
    console.error('[OnboardingUpdate] Unknown error:', error?.message || error);
    return {
      success: false,
      error: error?.message || 'Unknown error occurred',
    };
  }
};
