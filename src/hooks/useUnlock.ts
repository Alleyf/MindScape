// 解锁状态管理 Hook - 全局一次性解锁

import { useCallback } from 'react';

const STORAGE_KEY = 'mindscape_unlocked';

function getStore(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function saveStore(unlocked: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, unlocked ? 'true' : 'false');
  } catch {
    // localStorage might be full or disabled, fail silently
  }
}

export function useUnlock() {
  // 全局解锁状态 - 一次解锁，所有锁定笔记都解锁
  const isUnlocked = useCallback((): boolean => {
    return getStore();
  }, []);

  const unlock = useCallback((key: string, requiredKey: string): boolean => {
    if (key !== requiredKey) {
      return false;
    }
    saveStore(true);
    return true;
  }, []);

  const lock = useCallback((): void => {
    saveStore(false);
  }, []);

  return {
    isUnlocked,
    unlock,
    lock,
  };
}
