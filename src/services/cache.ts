// AI Caching Service using localStorage

import { AICacheEntry } from '../types/ai';

const CACHE_PREFIX = 'mindscape-ai:';
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

export class AICache {
  /**
   * Get cached data
   */
  static get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;

      const entry: AICacheEntry<T> = JSON.parse(raw);
      const now = Date.now();

      // Check if expired
      if (entry.timestamp + entry.ttl < now) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }

  /**
   * Set cached data
   */
  static set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
    try {
      const entry: AICacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch (e) {
      // Storage full or unavailable
      console.warn('AI Cache: Failed to save to localStorage', e);
    }
  }

  /**
   * Remove cached data
   */
  static remove(key: string): void {
    localStorage.removeItem(CACHE_PREFIX + key);
  }

  /**
   * Clear all AI cache
   */
  static clear(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  }

  /**
   * Get cache stats
   */
  static getStats(): { count: number; size: string } {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    let totalSize = 0;

    keys.forEach(k => {
      const value = localStorage.getItem(k);
      if (value) {
        totalSize += k.length + value.length;
      }
    });

    return {
      count: keys.length,
      size: `${(totalSize / 1024).toFixed(1)} KB`,
    };
  }
}
