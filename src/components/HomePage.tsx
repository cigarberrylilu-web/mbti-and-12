import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { reportData } from "../data/reportData";

export function HomePage({ onComplete }: { onComplete: (data: { mbti: string; zodiac: string }) => void }) {
  const [mbti, setMbti] = useState("INFJ");
  const [zodiac, setZodiac] = useState("白羊座");

  const mbtiOptions = ["INFJ", "INTJ", "INFP", "INTP", "ENFJ", "ENTJ", "ENFP", "ENTP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];
  const zodiacOptions = ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"];

  const hasData = !!reportData[mbti]?.[zodiac];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans text-slate-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-purple-600/20 blur-3xl rounded-full" />
        
        <div className="relative text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-4 text-purple-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight">星格解析档案</h1>
          <p className="text-slate-400 text-sm">解读你的隐藏灵魂代码</p>
        </div>

        <div className="space-y-6 relative">
          <div className="space-y-2 relative z-10">
            <label className="text-sm font-medium text-slate-300 ml-1">你的 MBTI 性格</label>
            <div className="relative">
              <select 
                value={mbti}
                onChange={(e) => setMbti(e.target.value)}
                className="w-full appearance-none bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
              >
                {mbtiOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
            {mbti !== "INFJ" && (
              <p className="text-xs text-amber-500 mt-1 ml-1">* 测试版目前主要支持 INFJ 结果展示</p>
            )}
          </div>

          <div className="space-y-2 relative z-10">
            <label className="text-sm font-medium text-slate-300 ml-1">你的星座</label>
            <div className="relative">
              <select 
                value={zodiac}
                onChange={(e) => setZodiac(e.target.value)}
                className="w-full appearance-none bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
              >
                {zodiacOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
            {!hasData && mbti === "INFJ" && (
              <p className="text-xs text-amber-500 mt-1 ml-1">* 该星座的深度报告正在加急编写中</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ mbti, zodiac })}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-4 rounded-xl shadow-lg shadow-purple-500/25 transition-all mt-4 relative z-10"
          >
            生成我的解析报告
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
