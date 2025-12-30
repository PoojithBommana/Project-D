/**
 * Profile Types
 * 
 * Type definitions for user profiles in the dating app.
 */

export interface Profile {
  id: string;
  name: string;
  age: number;
  images: string[]; // Array of image URLs
  bio?: string;
  location?: string;
  distance?: number; // Distance in km
  verified?: boolean;
  interests?: string[];
  education?: string;
  profession?: string;
  job?: string;
  isNew?: boolean;
  rawData?: any; // Raw backend payload for detail screen access
}

export interface SwipeAction {
  type: 'like' | 'pass' | 'superlike';
  profileId: string;
  timestamp: number;
}

