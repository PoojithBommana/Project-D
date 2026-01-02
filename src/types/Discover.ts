/**
 * Discover Types
 * 
 * Type definitions for the Discover screen and discovery-related features.
 * Extends Profile interface with discovery-specific fields.
 */

import { Profile } from './Profile';

export interface DiscoverProfile extends Profile {
  snixxedCount?: number;
  statusBadge?: 'trending' | 'growing' | 'popular';
  isActive?: boolean;
  lastActive?: string;
  styleMatch?: number; // Percentage (0-100)
  vibeTags?: string[];
  joinedDate?: string;
  styleTags?: string[]; // e.g., "Casual Chic", "Streetwear"
  conversationStarterAnswer?: string;
}

export interface VibeCategory {
  id: string;
  name: string;
  icon: string; // Icon name or emoji
  gradient: string[]; // Color gradient array
  description?: string;
}

export interface ConversationStarter {
  id: string;
  question: string;
  icon?: string; // Emoji or icon name
  options?: string[]; // e.g., ["Beach", "Mountains"]
}

export interface MoodOption {
  id: string;
  label: string;
  icon: string; // Icon name or emoji
}

export interface DiscoveryContext {
  source: 'top_snixxed' | 'ai_picks' | 'vibe' | 'nearby' | 'style_match' | 'conversation_starter' | 'new_users' | 'search';
  vibeId?: string;
  conversationStarterId?: string;
  searchQuery?: string;
}

