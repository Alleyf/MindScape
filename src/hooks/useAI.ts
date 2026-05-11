// AI React Hooks

import { useState, useCallback, useEffect } from 'react';
import { aiClient, AIError, AIErrorType, SummaryResult } from '../services';
import { AICache } from '../services/cache';
import { createCacheKey } from '../utils/hash';
import { Note } from '../types';

// Hook state types
interface UseAISummaryState {
  summary: SummaryResult | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
}

interface UseAIChatState {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  loading: boolean;
  error: string | null;
}

// Hook: Generate summary for a note
export function useGenerateSummary(note: Note | null) {
  const [state, setState] = useState<UseAISummaryState>({
    summary: null,
    loading: false,
    error: null,
    isConfigured: aiClient.isConfigured(),
  });

  useEffect(() => {
    if (!note) {
      setState(prev => ({ ...prev, summary: null, error: null }));
      return;
    }

    if (!aiClient.isConfigured()) {
      setState({
        summary: null,
        loading: false,
        error: 'AI 功能未配置。请在 .env 文件中设置 VITE_CLAUDE_API_KEY',
        isConfigured: false,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    aiClient.generateSummary(note)
      .then(summary => {
        setState({ summary, loading: false, error: null, isConfigured: true });
      })
      .catch(err => {
        const message = err instanceof AIError
          ? getErrorMessage(err.type)
          : '生成摘要失败';
        setState(prev => ({ ...prev, loading: false, error: message, isConfigured: true }));
      });
  }, [note?.slug]);

  const refresh = useCallback(() => {
    if (note) {
      // Force refresh by clearing cache and re-fetching
      AICache.remove(createCacheKey('summary', note.slug + note.content));
      setState(prev => ({ ...prev, loading: true, error: null }));
      aiClient.generateSummary(note)
        .then(summary => {
          setState({ summary, loading: false, error: null, isConfigured: true });
        })
        .catch(() => {
          setState(prev => ({ ...prev, loading: false, error: '刷新失败', isConfigured: true }));
        });
    }
  }, [note]);

  return { ...state, refresh };
}

// Hook: Extract keywords
export function useExtractKeywords(note: Note | null) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!note || !aiClient.isConfigured()) {
      setKeywords([]);
      return;
    }

    setLoading(true);
    setError(null);

    aiClient.extractKeywords(note)
      .then(setKeywords)
      .catch(err => {
        setError('提取关键词失败');
        setKeywords([]);
      })
      .finally(() => setLoading(false));
  }, [note?.slug]);

  return { keywords, loading, error };
}

// Hook: AI Chat
export function useAIChat(note: Note | null) {
  const [state, setState] = useState<UseAIChatState>({
    messages: [],
    loading: false,
    error: null,
  });

  const sendMessage = useCallback(async (message: string) => {
    if (!note) {
      setState(prev => ({
        ...prev,
        error: '请先打开一篇笔记',
      }));
      return;
    }

    if (!aiClient.isConfigured()) {
      setState(prev => ({
        ...prev,
        error: 'AI 功能未配置',
      }));
      return;
    }

    // Add user message
    setState(prev => ({
      messages: [...prev.messages, { role: 'user', content: message }],
      loading: true,
      error: null,
    }));

    try {
      const response = await aiClient.chat(message, note);
      setState(prev => ({
        messages: [...prev.messages, { role: 'assistant', content: response }],
        loading: false,
        error: null,
      }));
    } catch (err) {
      const errorMessage = err instanceof AIError
        ? getErrorMessage(err.type)
        : 'AI 响应失败';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [note]);

  const clearMessages = useCallback(() => {
    setState({ messages: [], loading: false, error: null });
  }, []);

  return { ...state, sendMessage, clearMessages };
}

// Helper: Get user-friendly error message
function getErrorMessage(type: AIErrorType): string {
  switch (type) {
    case AIErrorType.API_KEY_MISSING:
      return '未配置 API Key。请在 .env 中设置 VITE_CLAUDE_API_KEY';
    case AIErrorType.NETWORK_ERROR:
      return '网络错误，请检查网络连接';
    case AIErrorType.RATE_LIMIT:
      return '请求过于频繁，请稍后再试';
    case AIErrorType.QUOTA_EXCEEDED:
      return 'API 配额已用尽';
    case AIErrorType.INVALID_RESPONSE:
      return 'AI 响应格式错误';
    default:
      return 'AI 服务暂时不可用';
  }
}
