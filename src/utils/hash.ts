// Simple hash utility for content-based caching

/**
 * Create a simple hash from string content
 * Uses a basic hash function for browser compatibility
 */
export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Create a cache key for AI operations
 * Format: mindscape-ai:{operation}:{content-hash}
 */
export function createCacheKey(operation: string, content: string): string {
  const hash = hashString(content);
  return `mindscape-ai:${operation}:${hash}`;
}

/**
 * Truncate content for cache key (use first N chars)
 * Useful for very long notes
 */
export function createTruncatedCacheKey(
  operation: string,
  content: string,
  maxLength: number = 5000
): string {
  const truncated = content.slice(0, maxLength);
  return createCacheKey(operation, truncated);
}
