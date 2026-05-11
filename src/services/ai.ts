// Claude API AI Service

import {
  ClaudeRequest,
  ClaudeResponse,
  AIModelConfig,
  DEFAULT_MODEL_CONFIG,
  CLAUDE_API_CONFIG,
  AI_MODELS,
  AIError,
  AIErrorType,
  SummaryResult,
} from '../types/ai';
import { AICache } from './cache';
import { createCacheKey } from '../utils/hash';
import { Note } from '../types';

// System prompts for different operations
const SYSTEM_PROMPTS = {
  summary: `你是一个知识摘要专家。请阅读以下笔记内容，然后生成：
1. 一个 2-3 句话的简洁摘要
2. 3-5 个关键词标签
3. （可选）一个改进的标题建议

请用中文回复，格式如下：
---
摘要：{摘要内容}
关键词：{关键词1}, {关键词2}, {关键词3}
改进标题：{可选的改进标题}
---`,

  keywords: `你是一个关键词提取专家。请从以下笔记内容中提取 3-5 个最重要的关键词/标签。
只返回关键词，用逗号分隔。`,

  connections: `你是一个知识图谱分析师。请分析以下笔记，找出它们之间的语义关联。
对于每对笔记，给出：
1. 关联强度分数（0-100）
2. 关联原因（为什么这两篇笔记相关）

以 JSON 格式返回：
[{"source":"笔记1标题","target":"笔记2标题","score":85,"reason":"..."}]`,

  chat: `你是一个知识助手中的 AI 伴侣。你正在帮助用户阅读和理解笔记内容。
请用友好、简洁的方式回答用户的问题。如果问题与当前笔记相关，请结合笔记内容回答。`,
};

// Rate limiting queue
interface QueuedRequest {
  resolve: (value: string) => void;
  reject: (error: Error) => void;
  request: ClaudeRequest;
}

class RateLimitQueue {
  private queue: QueuedRequest[] = [];
  private processing = false;
  private lastRequestTime = 0;
  private minInterval = 1000; // 1 second between requests

  async add<T>(request: ClaudeRequest): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, request });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue[0];

      // Rate limiting
      const now = Date.now();
      const waitTime = Math.max(0, this.lastRequestTime + this.minInterval - now);
      if (waitTime > 0) {
        await new Promise(r => setTimeout(r, waitTime));
      }

      try {
        const result = await this.executeRequest(item.request);
        this.queue.shift();
        item.resolve(result);
        this.lastRequestTime = Date.now();
      } catch (error) {
        this.queue.shift();
        item.reject(error as Error);
      }
    }

    this.processing = false;
  }

  private async executeRequest(request: ClaudeRequest): Promise<string> {
    const response = await fetch(CLAUDE_API_CONFIG.baseUrl + CLAUDE_API_CONFIG.messagesEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.getApiKey(),
        'anthropic-version': CLAUDE_API_CONFIG.apiVersion,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AIError(
        response.status === 401 ? AIErrorType.API_KEY_MISSING :
        response.status === 429 ? AIErrorType.RATE_LIMIT :
        AIErrorType.NETWORK_ERROR,
        errorData.error?.message || `API Error: ${response.status}`,
      );
    }

    const data: ClaudeResponse = await response.json();
    return data.content[0]?.text || '';
  }

  private getApiKey(): string {
    const key = import.meta.env.VITE_CLAUDE_API_KEY;
    if (!key) {
      throw new AIError(AIErrorType.API_KEY_MISSING, 'Claude API key is not configured. Please set VITE_CLAUDE_API_KEY in your .env file.');
    }
    return key;
  }
}

const rateLimitQueue = new RateLimitQueue();

// Retry logic with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on certain errors
      if (error instanceof AIError) {
        if (error.type === AIErrorType.API_KEY_MISSING) {
          throw error;
        }
      }

      // Exponential backoff
      if (i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
}

// Main AI Client
export class AIClient {
  private modelConfig: AIModelConfig;

  constructor(config: Partial<AIModelConfig> = {}) {
    this.modelConfig = { ...DEFAULT_MODEL_CONFIG, ...config };
  }

  setModel(model: string) {
    this.modelConfig.model = model;
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!import.meta.env.VITE_CLAUDE_API_KEY;
  }

  /**
   * Generate summary and keywords for a note
   */
  async generateSummary(note: Note): Promise<SummaryResult> {
    const cacheKey = createCacheKey('summary', note.slug + note.content);

    // Check cache first
    const cached = AICache.get<SummaryResult>(cacheKey);
    if (cached) {
      return cached;
    }

    const content = `标题：${note.title}\n\n内容：\n${note.content.slice(0, 8000)}`;

    const text = await this.callClaude(
      content,
      'summary'
    );

    // Parse response
    const result = this.parseSummaryResponse(text);
    AICache.set(cacheKey, result);

    return result;
  }

  /**
   * Extract keywords from note content
   */
  async extractKeywords(note: Note): Promise<string[]> {
    const cacheKey = createCacheKey('keywords', note.slug + note.content);

    const cached = AICache.get<string[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const content = `标题：${note.title}\n\n内容：\n${note.content.slice(0, 8000)}`;

    const text = await this.callClaude(content, 'keywords');

    const keywords = text.split(/[,，、]/).map(k => k.trim()).filter(Boolean);
    AICache.set(cacheKey, keywords);

    return keywords;
  }

  /**
   * Chat with AI about note content
   */
  async chat(message: string, note: Note): Promise<string> {
    const context = `当前笔记标题：${note.title}\n\n笔记内容摘要：\n${note.content.slice(0, 4000)}`;

    return this.callClaude(`${context}\n\n用户问题：${message}`, 'chat');
  }

  /**
   * Core method to call Claude API
   */
  private async callClaude(
    content: string,
    operation: keyof typeof SYSTEM_PROMPTS
  ): Promise<string> {
    const request: ClaudeRequest = {
      model: this.modelConfig.model,
      max_tokens: this.modelConfig.maxTokens,
      messages: [{ role: 'user', content }],
      system: SYSTEM_PROMPTS[operation],
    };

    return withRetry(() => rateLimitQueue.add(request));
  }

  /**
   * Parse summary response
   */
  private parseSummaryResponse(text: string): SummaryResult {
    const result: SummaryResult = {
      summary: '',
      keywords: [],
      improvedTitle: undefined,
    };

    // Extract summary
    const summaryMatch = text.match(/摘要[：:]\s*([\s\S]*?)(?=关键词|改进标题|$)/i);
    if (summaryMatch) {
      result.summary = summaryMatch[1].trim();
    }

    // Extract keywords
    const keywordsMatch = text.match(/关键词[：:]\s*([\s\S]*?)(?=改进标题|$)/i);
    if (keywordsMatch) {
      result.keywords = keywordsMatch[1]
        .split(/[,，、]/)
        .map(k => k.trim())
        .filter(Boolean);
    }

    // Extract improved title
    const titleMatch = text.match(/改进标题[：:]\s*(.+)/i);
    if (titleMatch) {
      result.improvedTitle = titleMatch[1].trim();
    }

    return result;
  }
}

// Singleton instance
export const aiClient = new AIClient();

// Export for direct use
export function createAIClient(config?: Partial<AIModelConfig>): AIClient {
  return new AIClient(config);
}
