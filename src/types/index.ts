/**
 * Type definitions for Templeman Scripture application
 * Following zero-slop principles with complete type definitions
 */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultTranslation: string;
  notificationsEnabled: boolean;
  reminderTime: string; // HH:mm format
}

export interface Verse {
  id: string;
  reference: string; // e.g., "John 3:16"
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  addedAt: Date;
  mastered: boolean;
  lastReviewedAt: Date | null;
  nextReviewAt: Date | null;
  reviewCount: number;
}

export interface Translation {
  id: string;
  abbreviation: string; // e.g., "KJV", "NIV"
  name: string; // e.g., "King James Version"
  language: string;
  copyright: string;
}

export interface Book {
  id: string;
  name: string;
  chapters: number;
  testament: 'OLD' | 'NEW';
}

export interface Chapter {
  bookId: string;
  chapter: number;
  verseCount: number;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface MemorizationProgress {
  verseId: string;
  userId: string;
  easinessFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
  lastReviewedDate: Date | null;
  masteryLevel: number; // 0-100
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: Date;
  icon: string;
}

export interface Church {
  id: string;
  name: string;
  ownerId: string;
  members: string[]; // Array of user IDs
  createdAt: Date;
  subscriptionActive: boolean;
}

export interface FamilyMember {
  id: string;
  parentId: string;
  name: string;
  age: number;
  avatar: string;
  progress: Record<string, MemorizationProgress>;
}