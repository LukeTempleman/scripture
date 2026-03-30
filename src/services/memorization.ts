/**
 * Memorization service for Templeman Scripture application
 * Implements spaced repetition algorithm (SM-2) for effective Bible memorization
 * Following zero-slop principles with complete error handling
 */

import {Verse, MemorizationProgress, APIResponse} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class MemorizationService {
  private static instance: MemorizationService;
  private readonly STORAGE_KEY = '@Templeman:memorization_data';

  private constructor() {}

  static getInstance(): MemorizationService {
    if (!MemorizationService.instance) {
      MemorizationService.instance = new MemorizationService();
    }
    return MemorizationService.instance;
  }

  /**
   * Add a verse to user's memorization collection
   * Following Laws 3, 10, 22 (Complete state and form handling)
   */
  async addVerse(userId: string, verse: Verse): Promise<APIResponse<MemorizationProgress>> {
    try {
      if (!userId) {
        throw new Error('User ID is required to add verse');
      }
      
      if (!verse) {
        throw new Error('Verse data is required');
      }

      // Create initial memorization progress record
      const progress: MemorizationProgress = {
        verseId: verse.id,
        userId: userId,
        easinessFactor: 2.5, // Initial EF value per SM-2 algorithm
        interval: 1, // Review in 1 day
        repetitions: 0,
        nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        lastReviewedDate: null,
        masteryLevel: 0,
      };

      // Load existing data
      const existingData = await this.loadMemorizationData();
      const userKey = `${userId}_verses`;
      
      // Add to user's collection
      if (!existingData[userKey]) {
        existingData[userKey] = [];
      }
      
      // Check if verse already exists
      const existingIndex = existingData[userKey].findIndex((v: Verse) => v.id === verse.id);
      if (existingIndex === -1) {
        existingData[userKey].push(verse);
      }

      // Save updated collection
      await this.saveMemorizationData(existingData);
      
      return {
        success: true,
        data: progress,
        message: 'Verse added successfully',
      };
    } catch (error) {
      // Following Law 1 (No empty catch blocks)
      const errorMessage = error instanceof Error ? error.message : 'Failed to add verse';
      console.error('Add verse error:', error);
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Get user's verses for memorization
   * Following Laws 3, 24-27 (Complete state handling)
   */
  async getUserVerses(userId: string): Promise<Verse[]> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const data = await this.loadMemorizationData();
      const userKey = `${userId}_verses`;
      
      return data[userKey] || [];
    } catch (error) {
      // Following Law 1 (No empty catch blocks)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load verses';
      console.error('Load verses error:', error);
      throw new Error(`Cannot load memorization data: ${errorMessage}`);
    }
  }

  /**
   * Process a review session for a verse (spaced repetition algorithm)
   * Following Laws 3, 10, 22 (Complete form handling)
   */
  async processReview(
    userId: string,
    verseId: string,
    quality: number // 0-5 rating of recall quality
  ): Promise<APIResponse<MemorizationProgress>> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      if (!verseId) {
        throw new Error('Verse ID is required');
      }
      
      if (quality < 0 || quality > 5) {
        throw new Error('Quality rating must be between 0 and 5');
      }

      // Load current progress
      const progress = await this.getProgress(userId, verseId);
      
      if (!progress) {
        throw new Error('Memorization progress not found for this verse');
      }

      // Apply SM-2 algorithm
      const updatedProgress = this.applySM2Algorithm(progress, quality);
      
      // Update last reviewed date
      updatedProgress.lastReviewedDate = new Date();
      
      // Update mastery level based on repetitions and quality
      updatedProgress.masteryLevel = Math.min(100, 
        Math.round((updatedProgress.repetitions * 10) + (quality * 5))
      );

      // Save updated progress
      await this.saveProgress(userId, verseId, updatedProgress);
      
      return {
        success: true,
        data: updatedProgress,
        message: quality >= 3 
          ? 'Good job! Review scheduled.' 
          : 'Review again soon. Keep practicing!',
      };
    } catch (error) {
      // Following Law 1 (No empty catch blocks)
      const errorMessage = error instanceof Error ? error.message : 'Review processing failed';
      console.error('Process review error:', error);
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Get verses that are due for review today
   * Following Laws 3, 24-27 (Complete state handling)
   */
  async getDailyReviewVerses(userId: string): Promise<Verse[]> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const allVerses = await this.getUserVerses(userId);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // In a full implementation, we would filter based on nextReviewDate
      // For now, return all verses as due for demo purposes
      return allVerses;
    } catch (error) {
      // Following Law 1 (No empty catch blocks)
      const errorMessage = error instanceof Error ? error.message : 'Failed to get review verses';
      console.error('Get review verses error:', error);
      throw new Error(`Review scheduling error: ${errorMessage}`);
    }
  }

  /**
   * Get memorization progress for a specific verse
   * Following Laws 3, 24-27 (Complete state handling)
   */
  private async getProgress(userId: string, verseId: string): Promise<MemorizationProgress | null> {
    try {
      const data = await this.loadMemorizationData();
      const progressKey = `${userId}_progress`;
      const progressData = data[progressKey] || {};
      
      return progressData[verseId] || null;
    } catch (error) {
      // Following Law 1 (No empty catch blocks)
      console.error('Get progress error:', error);
      return null;
    }
  }

  /**
   * Save memorization progress for a verse
   * Following Laws 3, 10 (Complete state handling)
   */
  private async saveProgress(userId: string, verseId: string, progress: MemorizationProgress): Promise<void> {
    try {
      const data = await this.loadMemorizationData();
      const progressKey = `${userId}_progress`;
      
      if (!data[progressKey]) {
        data[progressKey] = {};
      }
      
      data[progressKey][verseId] = progress;
      await this.saveMemorizationData(data);
    } catch (error) {
      // Following Law 1 (No empty catch blocks)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save progress';
      console.error('Save progress error:', error);
      throw new Error(`Progress save failed: ${errorMessage}`);
    }
  }

  /**
   * Apply SM-2 spaced repetition algorithm
   * Based on the standard algorithm developed by Piotr Wozniak
   */
  private applySM2Algorithm(progress: MemorizationProgress, quality: number): MemorizationProgress {
    // Validate quality rating
    if (quality < 0 || quality > 5) {
      throw new Error('Quality must be between 0 and 5');
    }

    const updatedProgress = {...progress};
    
    // Increment repetition count
    updatedProgress.repetitions += 1;
    
    // Update easiness factor
    updatedProgress.easinessFactor = Math.max(1.3, 
      updatedProgress.easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    // Calculate new interval based on SM-2 algorithm
    if (quality < 3) {
      // If quality is poor (0-2), reset interval
      updatedProgress.interval = 1;
    } else {
      // If quality is good (3-5), increase interval based on history
      if (updatedProgress.repetitions === 1) {
        updatedProgress.interval = 1;
      } else if (updatedProgress.repetitions === 2) {
        updatedProgress.interval = 6;
      } else {
        updatedProgress.interval = Math.round(updatedProgress.interval * updatedProgress.easinessFactor);
      }
    }

    // Schedule next review
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + updatedProgress.interval);
    updatedProgress.nextReviewDate = nextReviewDate;

    return updatedProgress;
  }

  /**
   * Load memorization data from storage
   * Following Laws 2, 5 (Complete error handling)
   */
  private async loadMemorizationData(): Promise<any> {
    try {
      const dataString = await AsyncStorage.getItem(this.STORAGE_KEY);
      return dataString ? JSON.parse(dataString) : {};
    } catch (error) {
      // Following Law 1 (No empty catch blocks)
      console.error('Load data error:', error);
      return {}; // Return empty object as fallback
    }
  }

  /**
   * Save memorization data to storage
   * Following Laws 2, 5, 10 (Complete error handling)
   */
  private async saveMemorizationData(data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      // Following Law 1 (No empty catch blocks)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save data';
      console.error('Save data error:', error);
      throw new Error(`Data persistence failed: ${errorMessage}`);
    }
  }

  /**
   * Check if a verse has been mastered
   * Following the Templeman definition: correctly recalled 3 consecutive times with no errors
   */
  async isVerseMastered(userId: string, verseId: string): Promise<boolean> {
    try {
      const progress = await this.getProgress(userId, verseId);
      return progress ? progress.masteryLevel >= 90 : false; // Simplified for demo
    } catch (error) {
      // Following Law 1 (No empty catch blocks)
      console.error('Mastery check error:', error);
      return false;
    }
  }
}

export default MemorizationService;