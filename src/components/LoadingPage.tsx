import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function LoadingPage({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("正在连接星群数据...");

  useEffect(() => {
    const duration = 2500; // 2.5 seconds total loading
    const interval = 50; 
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = (currentStep / steps) * 100;
      setProgress(currentProgress);

      if (currentProgress > 80) {
        setText("生成最终报告...");
      } else if (currentProgress > 50) {
        setText("解码灵魂特质...");
      } else if (currentProgress > 20) {
        setText("重组 MBTI 与星盘能量...");
      }

      if (currentStep >= steps) {
        clearInterval(timer);
        onComplete();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm w-full flex flex-col items-center space-y-6"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 blur-xl opacity-30 animate-pulse rounded-full" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            className="relative bg-slate-900 border border-slate-800 p-4 rounded-full"
          >
            <Sparkles className="w-8 h-8 text-purple-400" />
          </motion.div>
        </div>
        
        <div className="w-full space-y-3 text-center">
          <motion.h2 
            key={text}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-medium text-slate-200"
          >
            {text}
          </motion.h2>
          
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-xs text-slate-500 font-mono">
            {Math.round(progress)}%
          </p>
        </div>
      </motion.div>
    </div>
  );
}
