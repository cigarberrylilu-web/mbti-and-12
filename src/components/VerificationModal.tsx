import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Unlock, Sparkles } from 'lucide-react';
import { VALID_CODES } from '../data/codes';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
}

// Track used codes in memory (resets on page refresh)
// In production, this should be server-side
const usedCodes = new Set<string>();

export function VerificationModal({ isOpen, onClose, onVerify }: VerificationModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('请输入验证码');
      return;
    }

    setVerifying(true);
    setError('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const normalizedCode = code.trim().toUpperCase();

    if (!VALID_CODES.includes(normalizedCode)) {
      setError('验证码无效，请检查后重试');
      setVerifying(false);
      return;
    }

    if (usedCodes.has(normalizedCode)) {
      setError('该验证码已被使用');
      setVerifying(false);
      return;
    }

    // Mark as used
    usedCodes.add(normalizedCode);

    // Store verification in localStorage with timestamp
    localStorage.setItem('mbti_report_verified', JSON.stringify({
      code: normalizedCode,
      timestamp: Date.now(),
    }));

    setVerified(true);
    setTimeout(() => {
      onVerify();
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="bg-slate-900 w-full max-w-md rounded-3xl p-8 space-y-6 relative border border-slate-700/50 shadow-2xl shadow-purple-900/20"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center">
            <motion.div
              animate={verified ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                verified
                  ? 'bg-emerald-500/20 border border-emerald-500/30'
                  : 'bg-purple-500/10 border border-purple-500/20'
              }`}
            >
              {verified ? (
                <Unlock className="w-8 h-8 text-emerald-400" />
              ) : (
                <Lock className="w-8 h-8 text-purple-400" />
              )}
            </motion.div>
          </div>

          {/* Content */}
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-white">
              {verified ? '验证成功' : '解锁完整报告'}
            </h3>
            <p className="text-sm text-slate-400">
              {verified
                ? '正在为你解锁深层分析内容...'
                : '输入验证码查看详细角色分析、疗愈处方和专属推荐'}
            </p>
          </div>

          {/* Input */}
          {!verified && (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={code}
                  onChange={e => {
                    setCode(e.target.value);
                    setError('');
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="请输入验证码"
                  className="w-full px-4 py-4 bg-slate-800 border border-slate-700/50 rounded-xl text-center text-lg tracking-widest uppercase text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  disabled={verifying}
                  autoFocus
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-2 text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerify}
                disabled={verifying}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold tracking-wider uppercase rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-purple-900/30"
              >
                {verifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    验证中...
                  </span>
                ) : (
                  '立即解锁'
                )}
              </motion.button>

              <div className="text-center space-y-2 pt-2">
                <p className="text-xs text-slate-500">
                  没有验证码？
                </p>
                <p className="text-sm text-purple-400 font-medium">
                  在小红书店铺购买后自动发货
                </p>
              </div>
            </div>
          )}

          {/* Success state */}
          {verified && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
