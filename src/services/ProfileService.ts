/**
 * ProfileService
 * 
 * Service layer for profile operations.
 * Uses ProfileController for API calls.
 * 
 * Features:
 * - Fetch profiles
 * - Get profile by ID
 * - Update profile
 * - Submit swipe actions
 * - Get matches
 * - Error handling
 * - Type safety
 */

import { Profile, SwipeAction } from '../types/Profile';
import { profileController } from '../controllers/ProfileController';

// Re-export types from ProfileController for convenience
export type {
  FetchProfilesResponse,
  GetProfileResponse,
  UpdateProfileResponse,
  SubmitSwipeResponse,
  GetMatchesResponse,
} from '../controllers/ProfileController';

/**
 * ProfileService Class
 * 
 * Handles all profile operations.
 * Uses ProfileController for API calls.
 */
class ProfileService {
  /**
   * Fetches available profiles for swiping
   * Uses ProfileController for API call
   */
  async fetchProfiles(
    page: number = 1,
    limit: number = 10,
    filters?: { ageMin?: number; ageMax?: number; location?: string; distance?: number },
    token?: string
  ) {
    return profileController.fetchProfiles({ page, limit, filters }, token);
  }

  /**
   * Gets a specific profile by ID
   * Uses ProfileController for API call
   */
  async getProfile(profileId: string, token?: string) {
    return profileController.getProfile(profileId, token);
  }

  /**
   * Updates user profile
   * Uses ProfileController for API call
   */
  async updateProfile(
    profileId: string,
    data: { name?: string; age?: number; bio?: string; location?: string; job?: string; education?: string; images?: string[] },
    token?: string
  ) {
    return profileController.updateProfile(profileId, data, token);
  }

  /**
   * Submits a swipe action (like, pass, superlike)
   * Uses ProfileController for API call
   */
  async submitSwipeAction(action: SwipeAction, token?: string) {
    return profileController.submitSwipeAction(action, token);
  }

  /**
   * Gets user's matches
   * Uses ProfileController for API call
   */
  async getMatches(token?: string) {
    return profileController.getMatches(token);
  }
}

// Export singleton instance
export const profileService = new ProfileService();

