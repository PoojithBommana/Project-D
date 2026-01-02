/**
 * Discover Service
 * 
 * Service for fetching discovery-related data.
 * Currently uses mock data, ready for API integration.
 */

import { DiscoverProfile, VibeCategory, ConversationStarter, MoodOption } from '../types/Discover';
import { Profile } from '../types/Profile';

class DiscoverService {
  /**
   * Transform user data to DiscoverProfile
   */
  private transformToDiscoverProfile(user: any, additionalData?: Partial<DiscoverProfile>): DiscoverProfile {
    const baseProfile: Profile = {
      id: user.id?.toString() || user.user_id?.toString() || Math.random().toString(),
      name: user.name || user.first_name || user.username || 'Unknown',
      age: user.age || 25,
      images: user.images || user.photos || (user.profile_photo ? [user.profile_photo] : []),
      bio: user.bio || user.about,
      location: user.location || user.city,
      distance: user.distance,
      verified: user.is_verified || user.verified || false,
      interests: user.interests || [],
      education: user.education,
      profession: user.profession,
      job: user.job || user.occupation,
      isNew: user.is_new || false,
      rawData: user,
    };

    return {
      ...baseProfile,
      ...additionalData,
    };
  }

  /**
   * Get top Snixxed profiles in user's region
   */
  async getTopSnixxedProfiles(): Promise<DiscoverProfile[]> {
    // Mock data - replace with API call
    const mockUsers = [
      {
        id: '1',
        name: 'Alex',
        age: 28,
        images: ['https://i.pravatar.cc/300?img=1'],
        location: 'San Francisco',
        snixxedCount: 124,
        statusBadge: 'trending' as const,
      },
      {
        id: '2',
        name: 'Sofia',
        age: 26,
        images: ['https://i.pravatar.cc/300?img=2'],
        location: 'Los Angeles',
        snixxedCount: 98,
        statusBadge: 'growing' as const,
      },
      {
        id: '3',
        name: 'Marcus',
        age: 30,
        images: ['https://i.pravatar.cc/300?img=3'],
        location: 'New York',
        snixxedCount: 156,
        statusBadge: 'popular' as const,
      },
      {
        id: '4',
        name: 'Emma',
        age: 24,
        images: ['https://i.pravatar.cc/300?img=4'],
        location: 'Chicago',
        snixxedCount: 87,
        statusBadge: 'trending' as const,
      },
    ];

    return mockUsers.map(user => this.transformToDiscoverProfile(user, {
      snixxedCount: user.snixxedCount,
      statusBadge: user.statusBadge,
    }));
  }

  /**
   * Get AI-picked profiles based on user's vibe
   */
  async getAIPicks(): Promise<DiscoverProfile[]> {
    // Mock data
    const mockUsers = [
      {
        id: '5',
        name: 'Maya',
        age: 24,
        images: ['https://i.pravatar.cc/300?img=5'],
        location: 'San Francisco',
        interests: ['Art', 'Coffee'],
      },
      {
        id: '6',
        name: 'Ryan',
        age: 26,
        images: ['https://i.pravatar.cc/300?img=6'],
        location: 'Los Angeles',
        interests: ['Music', 'Travel'],
      },
      {
        id: '7',
        name: 'Luna',
        age: 25,
        images: ['https://i.pravatar.cc/300?img=7'],
        location: 'Seattle',
        interests: ['Photography', 'Yoga'],
      },
    ];

    return mockUsers.map(user => this.transformToDiscoverProfile(user, {
      vibeTags: user.interests,
    }));
  }

  /**
   * Get profiles matching a specific vibe
   */
  async getVibeProfiles(vibeId: string): Promise<DiscoverProfile[]> {
    // Mock data - would filter by vibe in real implementation
    const mockUsers = [
      {
        id: '8',
        name: 'Jake',
        age: 27,
        images: ['https://i.pravatar.cc/300?img=8'],
        location: 'Portland',
        vibeTags: ['Chill Vibes'],
      },
      {
        id: '9',
        name: 'Zoe',
        age: 23,
        images: ['https://i.pravatar.cc/300?img=9'],
        location: 'Austin',
        vibeTags: ['Coffee Dates'],
      },
    ];

    return mockUsers.map(user => this.transformToDiscoverProfile(user, {
      vibeTags: user.vibeTags,
    }));
  }

  /**
   * Get nearby and active profiles
   */
  async getNearbyActive(): Promise<DiscoverProfile[]> {
    // Mock data
    const mockUsers = [
      {
        id: '10',
        name: 'Aria',
        age: 25,
        images: ['https://i.pravatar.cc/300?img=10'],
        location: 'San Francisco',
        distance: 0.8,
        isActive: true,
        lastActive: 'now',
      },
      {
        id: '11',
        name: 'Blake',
        age: 29,
        images: ['https://i.pravatar.cc/300?img=11'],
        location: 'Oakland',
        distance: 1.2,
        isActive: false,
        lastActive: '5 min ago',
      },
      {
        id: '12',
        name: 'Chloe',
        age: 26,
        images: ['https://i.pravatar.cc/300?img=12'],
        location: 'Berkeley',
        distance: 2.1,
        isActive: true,
        lastActive: 'now',
      },
    ];

    return mockUsers.map(user => this.transformToDiscoverProfile(user, {
      isActive: user.isActive,
      lastActive: user.lastActive,
      distance: user.distance,
    }));
  }

  /**
   * Get style-matched profiles
   */
  async getStyleMatches(): Promise<DiscoverProfile[]> {
    // Mock data
    const mockUsers = [
      {
        id: '13',
        name: 'Nina',
        age: 27,
        images: ['https://i.pravatar.cc/300?img=13'],
        location: 'San Francisco',
        styleMatch: 92,
        styleTags: ['Casual Chic'],
      },
      {
        id: '14',
        name: 'Oliver',
        age: 28,
        images: ['https://i.pravatar.cc/300?img=14'],
        location: 'Los Angeles',
        styleMatch: 87,
        styleTags: ['Streetwear'],
      },
      {
        id: '15',
        name: 'Isabella',
        age: 25,
        images: ['https://i.pravatar.cc/300?img=15'],
        location: 'New York',
        styleMatch: 85,
        styleTags: ['Minimalist'],
      },
    ];

    return mockUsers.map(user => this.transformToDiscoverProfile(user, {
      styleMatch: user.styleMatch,
      styleTags: user.styleTags,
    }));
  }

  /**
   * Get conversation starters
   */
  async getConversationStarters(): Promise<ConversationStarter[]> {
    return [
      {
        id: '1',
        question: 'Beach or Mountains?',
        icon: '🏖️⛰️',
        options: ['Beach', 'Mountains'],
      },
      {
        id: '2',
        question: 'Coffee or Night Drive?',
        icon: '☕🌙',
        options: ['Coffee', 'Night Drive'],
      },
      {
        id: '3',
        question: 'Movies or Music?',
        icon: '🎬🎵',
        options: ['Movies', 'Music'],
      },
      {
        id: '4',
        question: 'Street food or Fine dining?',
        icon: '🍜🍽️',
        options: ['Street food', 'Fine dining'],
      },
    ];
  }

  /**
   * Get profiles who answered a conversation starter
   */
  async getProfilesForConversationStarter(starterId: string): Promise<DiscoverProfile[]> {
    // Mock data
    const mockUsers = [
      {
        id: '16',
        name: 'David',
        age: 28,
        images: ['https://i.pravatar.cc/300?img=16'],
        location: 'San Francisco',
        conversationStarterAnswer: 'Beach',
      },
      {
        id: '17',
        name: 'Sarah',
        age: 26,
        images: ['https://i.pravatar.cc/300?img=17'],
        location: 'Los Angeles',
        conversationStarterAnswer: 'Mountains',
      },
    ];

    return mockUsers.map(user => this.transformToDiscoverProfile(user, {
      conversationStarterAnswer: user.conversationStarterAnswer,
    }));
  }

  /**
   * Get newly joined users
   */
  async getNewUsers(): Promise<DiscoverProfile[]> {
    // Mock data
    const mockUsers = [
      {
        id: '18',
        name: 'Ruby',
        age: 24,
        images: ['https://i.pravatar.cc/300?img=18'],
        location: 'San Francisco',
        joinedDate: '2 days ago',
        isNew: true,
      },
      {
        id: '19',
        name: 'Sam',
        age: 27,
        images: ['https://i.pravatar.cc/300?img=19'],
        location: 'Los Angeles',
        joinedDate: '1 day ago',
        isNew: true,
      },
      {
        id: '20',
        name: 'Luna',
        age: 25,
        images: ['https://i.pravatar.cc/300?img=20'],
        location: 'Seattle',
        joinedDate: '3 days ago',
        isNew: true,
      },
    ];

    return mockUsers.map(user => this.transformToDiscoverProfile(user, {
      joinedDate: user.joinedDate,
      isNew: user.isNew,
    }));
  }

  /**
   * Search profiles by query
   */
  async searchProfiles(query: string): Promise<DiscoverProfile[]> {
    // Mock data - would filter by query in real implementation
    const allProfiles = [
      ...(await this.getTopSnixxedProfiles()),
      ...(await this.getAIPicks()),
      ...(await this.getNearbyActive()),
    ];

    if (!query || query.trim() === '') {
      return allProfiles;
    }

    const lowerQuery = query.toLowerCase();
    return allProfiles.filter(profile => {
      const nameMatch = profile.name?.toLowerCase().includes(lowerQuery);
      const locationMatch = profile.location?.toLowerCase().includes(lowerQuery);
      const interestMatch = profile.interests?.some(interest =>
        interest.toLowerCase().includes(lowerQuery)
      );
      const vibeMatch = profile.vibeTags?.some(vibe =>
        vibe.toLowerCase().includes(lowerQuery)
      );

      return nameMatch || locationMatch || interestMatch || vibeMatch;
    });
  }

  /**
   * Get vibe categories
   */
  getVibeCategories(): VibeCategory[] {
    return [
      {
        id: 'chill',
        name: 'Chill Vibes',
        icon: '🎧',
        gradient: ['#8B5CF6', '#EC4899'],
        description: 'Relaxed and laid-back',
      },
      {
        id: 'coffee',
        name: 'Coffee Dates',
        icon: '☕',
        gradient: ['#F97316', '#FBBF24'],
        description: 'Coffee lovers unite',
      },
      {
        id: 'movies',
        name: 'Movie Lovers',
        icon: '🎬',
        gradient: ['#3B82F6', '#8B5CF6'],
        description: 'Cinema enthusiasts',
      },
      {
        id: 'fitness',
        name: 'Fitness Freaks',
        icon: '🏋️',
        gradient: ['#10B981', '#3B82F6'],
        description: 'Active and healthy',
      },
      {
        id: 'creative',
        name: 'Creative Minds',
        icon: '🎨',
        gradient: ['#EC4899', '#8B5CF6'],
        description: 'Artists and creators',
      },
      {
        id: 'night',
        name: 'Night Owls',
        icon: '🌙',
        gradient: ['#1E293B', '#475569'],
        description: 'Late night vibes',
      },
    ];
  }

  /**
   * Get mood options
   */
  getMoodOptions(): MoodOption[] {
    return [
      {
        id: 'chatting',
        label: 'Just chatting',
        icon: '💬',
      },
      {
        id: 'friends',
        label: 'New friends',
        icon: '👋',
      },
      {
        id: 'dating',
        label: 'Dating',
        icon: '💕',
      },
      {
        id: 'exploring',
        label: 'Exploring',
        icon: '✨',
      },
    ];
  }
}

export const discoverService = new DiscoverService();
export default discoverService;

