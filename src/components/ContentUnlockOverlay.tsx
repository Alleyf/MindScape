// 公众号解锁引导遮罩组件 - 渐进式解锁版

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, AlertCircle, ChevronRight, MessageCircleQuestion, X } from 'lucide-react';

interface ContentUnlockOverlayProps {
  isVisible: boolean;
  isUnlocked: boolean;
  onUnlock: (key: string) => boolean;
  onClose?: () => void;
  articleTitle: string;
  wechatQrCode?: string;
}

export function ContentUnlockOverlay({
  isVisible,
  isUnlocked,
  onUnlock,
  onClose,
  articleTitle,
  wechatQrCode,
}: ContentUnlockOverlayProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  // ESC to close
  useEffect(() => {
    if (!isVisible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isVisible, onClose]);

  // Reset state when hidden
  useEffect(() => {
    if (!isVisible) {
      setInputValue('');
      setError(false);
      setIsSubmitting(false);
      setShowQrCode(false);
    }
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsSubmitting(true);
    setError(false);

    setTimeout(() => {
      const success = onUnlock(inputValue.trim());
      if (!success) {
        setError(true);
        setInputValue('');
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleClose = () => {
    // Scroll to top of article
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    onClose?.();
  };

  if (isUnlocked) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="unlock-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 遮罩背景 */}
          <div className="unlock-backdrop" onClick={handleClose} />

          {/* 解锁卡片 */}
          <motion.div
            className="unlock-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* 关闭按钮 */}
            <button
              type="button"
              onClick={handleClose}
              className="unlock-close-btn"
              aria-label="关闭"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 锁图标 */}
            <div className="unlock-icon-wrapper">
              <div className="unlock-icon-bg">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* 标题 */}
            <h2 className="unlock-title">此文章已锁定</h2>
            <p className="unlock-description">
              输入验证码即可解锁完整内容
            </p>

            {/* 切换二维码/输入 */}
            {!showQrCode ? (
              <>
                {/* 输入表单 */}
                <form onSubmit={handleSubmit} className="unlock-form">
                  <div className="unlock-input-wrapper">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        if (error) setError(false);
                      }}
                      placeholder="请输入验证码"
                      className={`unlock-input ${error ? 'unlock-input-error' : ''}`}
                      autoFocus
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* 错误提示 */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        className="unlock-error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>验证码错误，请重试</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 提交按钮 */}
                  <button
                    type="submit"
                    className="unlock-button"
                    disabled={!inputValue.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="unlock-spinner" />
                    ) : (
                      <>
                        <span>解锁文章</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* 查看二维码按钮 */}
                <button
                  type="button"
                  onClick={() => setShowQrCode(true)}
                  className="unlock-qr-button"
                >
                  <MessageCircleQuestion className="w-4 h-4" />
                  <span>如何获取验证码？</span>
                </button>
              </>
            ) : (
              <>
                {/* 二维码展示 */}
                <div className="unlock-qr-section">
                  <div className="unlock-qr-wrapper">
                    {wechatQrCode ? (
                      <img
                        src={wechatQrCode}
                        alt="公众号二维码"
                        className="unlock-qr-image"
                      />
                    ) : (
                      <div className="unlock-qr-placeholder">
                        <MessageCircleQuestion className="w-12 h-12 text-nebula-accent" />
                        <p>二维码加载失败</p>
                      </div>
                    )}
                  </div>
                  <p className="unlock-qr-hint">
                    扫码关注 <strong>微信公众号</strong><br />
                    查看「<strong>公众号名称</strong>」即为验证码
                  </p>
                </div>

                {/* 返回输入按钮 */}
                <button
                  type="button"
                  onClick={() => setShowQrCode(false)}
                  className="unlock-qr-button"
                >
                  <span>已有验证码</span>
                </button>
              </>
            )}

            {/* 底部提示 */}
            <p className="unlock-hint">
              解锁后即可阅读完整内容
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
