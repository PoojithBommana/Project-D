import { API_ENDPOINTS } from '../config/endpoints';
import { postApiCall } from '../config/apiCall';
import { Profile, SwipeAction } from '../types/Profile';

const ENABLE_BACKEND_API = true;

export interface FetchProfilesRequest {
  page?: number;
  limit?: number;
  filters?: {
    ageMin?: number;
    ageMax?: number;
    location?: string;
    distance?: number;
  };
}

export interface UpdateProfileRequest {
  name?: string;
  age?: number;
  bio?: string;
  location?: string;
  job?: string;
  education?: string;
  images?: string[];
}

export interface FetchProfilesResponse {
  success: boolean;
  profiles?: Profile[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  error?: string;
}

export interface GetProfileResponse {
  success: boolean;
  profile?: Profile;
  error?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  profile?: Profile;
  error?: string;
}

export interface SubmitSwipeResponse {
  success: boolean;
  message?: string;
  isMatch?: boolean;
  matchData?: {
    userId: string;
    userName: string;
    userPhoto?: string;
  };
  error?: string;
}

export interface GetMatchesResponse {
  success: boolean;
  matches?: Array<{
    id: string;
    userId: string;
    userName: string;
    userPhoto?: string;
    matchedAt: string;
    lastMessage?: string;
  }>;
  error?: string;
}

class ProfileController {
  async fetchProfiles(
    request: FetchProfilesRequest = {}
  ): Promise<FetchProfilesResponse> {
    if (!ENABLE_BACKEND_API) {
      console.log('[API] Backend API disabled. Returning empty profiles.');
      return {
        success: false,
        error: 'Backend API is disabled',
        profiles: [],
      };
    }

    try {
      const apiResponse: any = await postApiCall('GET', 'PROFILE', 'GET_PROFILES', request);

      if (apiResponse?.response?.ResponseCode == 'Success') {
        return {
          success: true,
          profiles: apiResponse?.response?.profiles,
          pagination: apiResponse?.response?.pagination,
        };
      } else if (apiResponse?.response?.ResponseCode == 'Fail') {
        return {
          success: false,
          error: apiResponse?.response?.ResponseMessage || 'Failed to fetch profiles',
          profiles: [],
        };
      } else if (apiResponse?.error) {
        return {
          success: false,
          error: apiResponse?.response?.Message || 'Failed to fetch profiles',
          profiles: [],
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch profiles',
          profiles: [],
        };
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profiles',
        profiles: [],
      };
    }
  }

  async getProfile(profileId: string): Promise<GetProfileResponse> {
    try {
      const apiResponse: any = await postApiCall('GET', 'PROFILE', 'GET_PROFILE', { id: profileId });

      if (apiResponse?.response?.ResponseCode == 'Success') {
        return {
          success: true,
          profile: apiResponse?.response?.profile,
        };
      } else if (apiResponse?.response?.ResponseCode == 'Fail') {
        return {
          success: false,
          error: apiResponse?.response?.ResponseMessage || 'Failed to fetch profile',
        };
      } else if (apiResponse?.error) {
        return {
          success: false,
          error: apiResponse?.response?.Message || 'Failed to fetch profile',
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch profile',
        };
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      };
    }
  }

  async updateProfile(
    profileId: string,
    request: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    try {
      const apiResponse: any = await postApiCall('PUT', 'PROFILE', 'UPDATE_PROFILE', { id: profileId, ...request });

      if (apiResponse?.response?.ResponseCode == 'Success') {
        return {
          success: true,
          message: apiResponse?.response?.ResponseMessage,
          profile: apiResponse?.response?.profile,
        };
      } else if (apiResponse?.response?.ResponseCode == 'Fail') {
        return {
          success: false,
          error: apiResponse?.response?.ResponseMessage || 'Failed to update profile',
        };
      } else if (apiResponse?.error) {
        return {
          success: false,
          error: apiResponse?.response?.Message || 'Failed to update profile',
        };
      } else {
        return {
          success: false,
          error: 'Failed to update profile',
        };
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      };
    }
  }

  async submitSwipeAction(
    action: SwipeAction
  ): Promise<SubmitSwipeResponse> {
    try {
      const apiResponse: any = await postApiCall('POST', 'PROFILE', 'SWIPE_ACTION', action);

      if (apiResponse?.response?.ResponseCode == 'Success') {
        return {
          success: true,
          message: apiResponse?.response?.ResponseMessage,
          isMatch: apiResponse?.response?.isMatch,
          matchData: apiResponse?.response?.matchData,
        };
      } else if (apiResponse?.response?.ResponseCode == 'Fail') {
        return {
          success: false,
          error: apiResponse?.response?.ResponseMessage || 'Failed to submit swipe action',
        };
      } else if (apiResponse?.error) {
        return {
          success: false,
          error: apiResponse?.response?.Message || 'Failed to submit swipe action',
        };
      } else {
        return {
          success: false,
          error: 'Failed to submit swipe action',
        };
      }
    } catch (error) {
      console.error('Error submitting swipe action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit swipe action',
      };
    }
  }

  async getMatches(): Promise<GetMatchesResponse> {
    try {
      const apiResponse: any = await postApiCall('GET', 'PROFILE', 'GET_MATCHES', {});

      if (apiResponse?.response?.ResponseCode == 'Success') {
        return {
          success: true,
          matches: apiResponse?.response?.matches,
        };
      } else if (apiResponse?.response?.ResponseCode == 'Fail') {
        return {
          success: false,
          error: apiResponse?.response?.ResponseMessage || 'Failed to fetch matches',
        };
      } else if (apiResponse?.error) {
        return {
          success: false,
          error: apiResponse?.response?.Message || 'Failed to fetch matches',
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch matches',
        };
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch matches',
      };
    }
  }
}

export const profileController = new ProfileController();
