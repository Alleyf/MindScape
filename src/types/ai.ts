// AI Service Types

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: ClaudeMessage[];
  system?: string;
  stream?: boolean;
}

export interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text?: string;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence: null | number;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface AIModelConfig {
  model: string;
  maxTokens: number;
  temperature: number;
}

export const AI_MODELS = {
  SONNET: 'claude-sonnet-4-20250514',
  HAIKU: 'claude-haiku-4-20250514',
} as const;

export const DEFAULT_MODEL_CONFIG: AIModelConfig = {
  model: AI_MODELS.SONNET,
  maxTokens: 1024,
  temperature: 0.7,
};

// AI Operation Types
export type AIOperationType =
  | 'summary'
  | 'keywords'
  | 'connections'
  | 'chat';

export interface AICacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// AI Response Types
export interface SummaryResult {
  summary: string;
  keywords: string[];
  improvedTitle?: string;
}

export interface ConnectionResult {
  sourceId: string;
  targetId: string;
  score: number;
  reason: string;
}

// Error Types
export enum AIErrorType {
  API_KEY_MISSING = 'API_KEY_MISSING',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
}

export class AIError extends Error {
  constructor(
    public type: AIErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AIError';
  }
}

// API Configuration
export const CLAUDE_API_CONFIG = {
  baseUrl: 'https://api.anthropic.com/v1',
  messagesEndpoint: '/messages',
  apiVersion: '2023-06-01',
} as const;

// Environment-based configuration
export function getAIConfig() {
  return {
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY || '',
    baseUrl: import.meta.env.VITE_AI_API_BASE_URL || CLAUDE_API_CONFIG.baseUrl,
    model: import.meta.env.VITE_AI_MODEL || AI_MODELS.SONNET,
  };
}
