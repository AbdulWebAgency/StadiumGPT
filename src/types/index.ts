export type TextScale = 'sm' | 'md' | 'lg' | 'xl';
export type AccessibilityNeeds = 'wheelchair' | 'stroller' | 'sensory' | 'none';
export type NavigationStyle = 'stair-free' | 'low-crowd' | 'standard';
export type DietaryPreference = 'vegan' | 'halal' | 'gluten-free' | 'none';

export interface AccessibilitySettings {
  highContrast: boolean;
  textScale: TextScale;
  audioHelp: boolean;
}

export interface UserMemory {
  language: string;
  accessibility: AccessibilityNeeds;
  groupSize: number;
  dietary: DietaryPreference;
  navigationStyle: NavigationStyle;
  favoriteFoods: string[];
}

export interface UserPreferences {
  isOnboarded: boolean;
  isGuest: boolean;
  displayName: string | null;
  email: string | null;
  uid: string | null;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  reasoning?: string; // Explicit reasoning explaining personalization
}

export interface LostFoundReport {
  id: string;
  type: 'lost' | 'found';
  item: string;
  color: string;
  location: string;
  description: string;
  timestamp: number;
  status: 'active' | 'claimed';
  reportedBy: string; // user uid or 'guest'
}

export interface Facility {
  id: string;
  name: string;
  type: 'food' | 'water' | 'restroom' | 'medical' | 'quiet' | 'exit';
  location: string; // e.g. "Gate A, Section 102"
  gate: 'A' | 'B' | 'C' | 'D';
  details: string; // e.g. "Gluten-Free options, Halal hotdogs"
  wheelchairAccessible: boolean;
  strollerFriendly: boolean;
  sensoryFriendly: boolean;
  crowdLevel: 'low' | 'medium' | 'high';
}
