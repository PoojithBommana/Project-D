import { API_ENDPOINTS } from '../config/endpoints';
import { getExternalApiCall } from '../config/apiCall';

export interface Playlist {
  id: string;
  name: string;
  description: string;
  images: Array<{
    height: number | null;
    url: string;
    width: number | null;
  }>;
  tracks: {
    href: string;
    total: number;
  };
  owner: {
    display_name: string;
    id: string;
  };
  external_urls: {
    spotify: string;
  };
}

export interface FeaturedPlaylistsResponse {
  success: boolean;
  playlists?: Playlist[];
  message?: string;
  total?: number;
  error?: string;
}

class MusicController {
  /**
   * Fetches featured playlists from Spotify API
   */
  async fetchFeaturedPlaylists(): Promise<FeaturedPlaylistsResponse> {
    try {
      const apiResponse: any = await getExternalApiCall(
        API_ENDPOINTS.MUSIC.FEATURED_PLAYLISTS
      );

      // Log the entire raw API response
      console.log('=== Raw API Response (MusicController) ===');
      console.log(JSON.stringify(apiResponse, null, 2));
      console.log('===========================================');

      if (apiResponse?.error) {
        return {
          success: false,
          error: apiResponse?.response?.Message || 'Failed to fetch playlists',
          playlists: [],
        };
      }

      // Handle the API response structure
      const playlistsData = apiResponse?.response?.playlists;
      
      if (playlistsData?.items && Array.isArray(playlistsData.items)) {
        return {
          success: true,
          playlists: playlistsData.items,
          message: apiResponse?.response?.message || 'Popular Playlists',
          total: playlistsData.total || playlistsData.items.length,
        };
      }

      return {
        success: false,
        error: 'Invalid response format',
        playlists: [],
      };
    } catch (error) {
      console.error('Error fetching featured playlists:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch playlists',
        playlists: [],
      };
    }
  }
}

export const musicController = new MusicController();

