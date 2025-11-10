/**
 * Profile Types
 * 
 * Type definitions for user profiles in the dating app.
 * Future-ready structure for profile data management.
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
  // Future fields can be added here
  interests?: string[];
  education?: string;
  profession?: string;
  job?: string;
  isNew?: boolean;
}

export interface SwipeAction {
  type: 'like' | 'pass' | 'superlike';
  profileId: string;
  timestamp: number;
}

