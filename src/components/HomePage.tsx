import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Lock, Unlock } from "lucide-react";
import { reportData } from "../data/reportData";
import { getFingerprint, verifyStoredCode } from "../utils/fingerprint";

// Cloudflare Workers API endpoint
const API_BASE = "https://black-resonance-1c47.cigarberry.workers.dev";
 // 部署后替换为实际地址

export function HomePage({ onComplete }: { onComplete: (data: { mbti: string; zodiac: string }) => void }) {
  const [mbti, setMbti] = useState("");
  const [zodiac, setZodiac] = useState("");
  const [step, setStep] = useState<"verify" | "start" | "form">("verify");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      const isValid = await verifyStoredCode();
      if (isValid) {
        setStep("start");
      }
    };
    checkVerification();
  }, []);

  const handleVerify = async () => {
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      setError("请输入校验码");
      return;
    }

    setVerifying(true);
    setError("");

    try {
      // Step 1: Verify code is valid and not used
      const verifyRes = await fetch(`${API_BASE}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalizedCode }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.valid) {
        setError(
          verifyData.reason === "Already used"
            ? "该验证码已被使用"
            : "校验码无效，请检查后重试"
        );
        setVerifying(false);
        return;
      }

      // Step 2: Mark code as used
      const useRes = await fetch(`${API_BASE}/use`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalizedCode }),
      });
      const useData = await useRes.json();

      if (!useData.success) {
        setError("验证失败，请稍后重试");
        setVerifying(false);
        return;
      }

      // Step 3: Store locally with fingerprint
      const fingerprint = await getFingerprint();
      localStorage.setItem("soul_report_verified", JSON.stringify({
        code: normalizedCode,
        fingerprint,
        timestamp: Date.now(),
      }));

      setVerifying(false);
      setStep("start");
    } catch (err) {
      console.error("API error:", err);
      setError("网络错误，请检查连接后重试");
      setVerifying(false);
    }
  };

  const mbtiOptions = ["INFJ", "INTJ", "INFP", "INTP", "ENFJ", "ENTJ", "ENFP", "ENTP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];
  const zodiacOptions = ["白羊座", "狮子座", "射手座", "金牛座", "处女座", "摩羯座", "双子座", "天秤座", "水瓶座", "巨蟹座", "天蝎座", "双鱼座"];

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

        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            {step === "verify" && (
              <motion.div 
                key="verify"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6 absolute inset-0 flex flex-col justify-center"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">测试版校验码</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input 
                      type="text"
                      placeholder="请输入内部校验码"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        if (error) setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleVerify();
                      }}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium placeholder:text-slate-500"
                    />
                  </div>
                  {error && <p className="text-xs text-red-400 mt-1 ml-1">{error}</p>}
                </div>
                <motion.button
                  whileHover={{ scale: verifying ? 1 : 1.02 }}
                  whileTap={{ scale: verifying ? 1 : 0.98 }}
                  onClick={handleVerify}
                  disabled={verifying}
                  className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl shadow-lg transition-all border border-slate-700 flex items-center justify-center space-x-2"
                >
                  {verifying ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>验证中...</span>
                    </>
                  ) : (
                    <>
                      <span>开始验证</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {step === "start" && (
              <motion.div 
                key="start"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-8"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-full mb-4 text-green-400 border border-green-500/20">
                    <Unlock className="w-6 h-6" />
                  </div>
                  <p className="text-slate-200 font-medium">身份已验证</p>
                  <p className="text-sm text-slate-500">欢迎进入深层潜意识世界</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep("form")}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium px-10 py-4 rounded-full shadow-lg shadow-purple-500/25 transition-all text-lg"
                >
                  开始测试
                </motion.button>
              </motion.div>
            )}

            {step === "form" && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 absolute inset-0 flex flex-col justify-center"
              >
                <div className="space-y-2 relative z-10">
                  <label className="text-sm font-medium text-slate-300 ml-1">你的 MBTI 性格</label>
                  <div className="relative">
                    <select 
                      value={mbti}
                      onChange={(e) => setMbti(e.target.value)}
                      className={`w-full appearance-none bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium ${!mbti ? 'text-slate-400' : 'text-white'}`}
                    >
                      <option value="" disabled>请选择 MBTI</option>
                      {mbtiOptions.map(opt => (
                        <option key={opt} value={opt} className="text-white">{opt}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                      ▼
                    </div>
                  </div>
                  {mbti && mbti !== "INFJ" && (
                    <p className="text-xs text-amber-500 mt-1 ml-1">* 其他人格的深度报告正在加急解析中，本次抢先体验暂只开放 INFJ</p>
                  )}
                </div>

                <div className="space-y-2 relative z-10">
                  <label className="text-sm font-medium text-slate-300 ml-1">你的星座</label>
                  <div className="relative">
                    <select 
                      value={zodiac}
                      onChange={(e) => setZodiac(e.target.value)}
                      className={`w-full appearance-none bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium ${!zodiac ? 'text-slate-400' : 'text-white'}`}
                    >
                      <option value="" disabled>请选择星座</option>
                      {zodiacOptions.map(opt => (
                        <option key={opt} value={opt} className="text-white">{opt}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                      ▼
                    </div>
                  </div>
                  {!hasData && mbti === "INFJ" && zodiac && (
                    <p className="text-xs text-amber-500 mt-1 ml-1">* 该星座的深度报告正在加急编写中</p>
                  )}
                </div>

                <motion.button
                  whileHover={mbti && zodiac ? { scale: 1.02 } : {}}
                  whileTap={mbti && zodiac ? { scale: 0.98 } : {}}
                  onClick={() => onComplete({ mbti, zodiac })}
                  disabled={!mbti || !zodiac}
                  className={`w-full font-medium py-4 rounded-xl shadow-lg transition-all mt-4 relative z-10 ${mbti && zodiac ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/25 cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
                >
                  生成我的解析报告
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
