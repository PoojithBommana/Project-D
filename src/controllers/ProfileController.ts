/**
 * ProfileController
 * 
 * Controller for all profile-related API calls.
 * Handles communication with backend profile endpoints.
 * 
 * Features:
 * - Fetch profiles
 * - Get profile by ID
 * - Update profile
 * - Submit swipe actions
 * - Get matches
 */

import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders, API_TIMEOUT, ENABLE_BACKEND_API } from '../config/api';
import { Profile, SwipeAction } from '../types/Profile';

// Request Interfaces
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

// Response Interfaces
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

/**
 * ProfileController Class
 * 
 * Handles all profile API operations
 */
class ProfileController {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Makes an API request with timeout and error handling
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log(`[API] Making request to: ${url}`);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...getAuthHeaders(token),
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your internet connection.');
      }
      
      // Network errors
      if (error.message?.includes('Network request failed') || 
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('NetworkError')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection or ensure the backend server is running.');
      }
      
      // Re-throw with better message
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Fetches available profiles for swiping
   * GET /profiles?page=1&limit=10
   */
  async fetchProfiles(
    request: FetchProfilesRequest = {},
    token?: string
  ): Promise<FetchProfilesResponse> {
    // Skip backend call if disabled
    if (!ENABLE_BACKEND_API) {
      console.log('[API] Backend API disabled. Returning empty profiles.');
      return {
        success: false,
        error: 'Backend API is disabled',
        profiles: [],
      };
    }

    try {
      const { page = 1, limit = 10, filters } = request;
      
      // Build query string
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters) {
        if (filters.ageMin) params.append('ageMin', filters.ageMin.toString());
        if (filters.ageMax) params.append('ageMax', filters.ageMax.toString());
        if (filters.location) params.append('location', filters.location);
        if (filters.distance) params.append('distance', filters.distance.toString());
      }

      const response = await this.makeRequest<FetchProfilesResponse>(
        `${API_ENDPOINTS.PROFILE.GET_PROFILES}?${params.toString()}`,
        {
          method: 'GET',
        },
        token
      );
      return response;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profiles',
        profiles: [], // Return empty array on error
      };
    }
  }

  /**
   * Gets a specific profile by ID
   * GET /profiles/:id
   */
  async getProfile(profileId: string, token?: string): Promise<GetProfileResponse> {
    try {
      const endpoint = API_ENDPOINTS.PROFILE.GET_PROFILE.replace(':id', profileId);
      const response = await this.makeRequest<GetProfileResponse>(
        endpoint,
        {
          method: 'GET',
        },
        token
      );
      return response;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      };
    }
  }

  /**
   * Updates user profile
   * PUT /profiles/:id
   */
  async updateProfile(
    profileId: string,
    request: UpdateProfileRequest,
    token?: string
  ): Promise<UpdateProfileResponse> {
    try {
      const endpoint = API_ENDPOINTS.PROFILE.UPDATE_PROFILE.replace(':id', profileId);
      const response = await this.makeRequest<UpdateProfileResponse>(
        endpoint,
        {
          method: 'PUT',
          body: JSON.stringify(request),
        },
        token
      );
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      };
    }
  }

  /**
   * Submits a swipe action (like, pass, superlike)
   * POST /profiles/swipe
   */
  async submitSwipeAction(
    action: SwipeAction,
    token?: string
  ): Promise<SubmitSwipeResponse> {
    try {
      const response = await this.makeRequest<SubmitSwipeResponse>(
        API_ENDPOINTS.PROFILE.SWIPE_ACTION,
        {
          method: 'POST',
          body: JSON.stringify(action),
        },
        token
      );
      return response;
    } catch (error) {
      console.error('Error submitting swipe action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit swipe action',
      };
    }
  }

  /**
   * Gets user's matches
   * GET /profiles/matches
   */
  async getMatches(token?: string): Promise<GetMatchesResponse> {
    try {
      const response = await this.makeRequest<GetMatchesResponse>(
        API_ENDPOINTS.PROFILE.GET_MATCHES,
        {
          method: 'GET',
        },
        token
      );
      return response;
    } catch (error) {
      console.error('Error fetching matches:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch matches',
      };
    }
  }
}

// Export singleton instance
export const profileController = new ProfileController();

