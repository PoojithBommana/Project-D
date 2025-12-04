import { musicController, FeaturedPlaylistsResponse, Playlist } from '../controllers/MusicController';

/**
 * MusicService
 * 
 * Service layer for music-related operations
 * - Fetches featured playlists
 * 
 * Uses MusicController for API calls
 */
class MusicService {
  /**
   * Fetches featured playlists
   * Uses MusicController for API call
   */
  async fetchFeaturedPlaylists(): Promise<FeaturedPlaylistsResponse> {
    return musicController.fetchFeaturedPlaylists();
  }
}

// Export singleton instance
export const musicService = new MusicService();
export type { FeaturedPlaylistsResponse, Playlist };

