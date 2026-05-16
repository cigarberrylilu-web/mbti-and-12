import { motion } from "motion/react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Download, Sparkles, Heart, Briefcase, Users, ArrowUpCircle, AlertTriangle, Music, Film, BookOpen, Quote, Gift, X, Star, MessageCircle, CheckCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { reportData as allReportData } from "../data/reportData";

export function ResultPage({ data, onBack }: { data: { mbti: string; zodiac: string }, onBack: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const report = allReportData[data.mbti]?.[data.zodiac];

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;
    try {
      setIsDownloading(true);
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#020617",
      });
      if (!blob) throw new Error("生成图片失败");

      // Use FileReader to convert blob to base64 for more reliable download
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const link = document.createElement("a");
        link.download = `我的灵魂报告-${data.mbti}-${data.zodiac}.png`;
        link.href = base64;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsDownloading(false);
      };
      reader.onerror = () => {
        console.error("FileReader failed");
        alert("生成长图失败，请稍后重试。");
        setIsDownloading(false);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("生成长图失败:", error);
      alert("生成长图失败，请稍后重试。");
      setIsDownloading(false);
    }
  };

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
           <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
           <h2 className="text-xl font-bold text-slate-100 mb-2">深度报告加急编写中</h2>
           <p className="text-slate-400 text-sm mb-6">「{data.zodiac} + {data.mbti}」的专属命运轨迹正在被星象仪解读，请稍后再来探索。</p>
           <button onClick={onBack} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-all">
             返回重新测试
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans sm:py-10">
      
      {/* Header controls outside the "share card" */}
      <div className="max-w-2xl mx-auto px-4 mb-4 flex justify-between items-center">
        <button onClick={onBack} className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
          ← 重新测试
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-slate-900 sm:rounded-[2.5rem] shadow-2xl shadow-purple-900/10 overflow-hidden border border-slate-800 relative">

        <div className="relative z-10 px-6 sm:px-10 py-12 space-y-16" ref={cardRef}>
          {/* Background Gradients */}
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/30 to-transparent pointer-events-none" />
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-fuchsia-600/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
          
          {/* Module 1: Personality Tag Card */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>核心人格档案</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {report.title}
              </h1>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {report.tags.map((tag, i) => (
                <div key={i} className="px-4 py-2 rounded-full bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700/50 text-fuchsia-100/90 tracking-wide shadow-sm">
                  {tag}
                </div>
              ))}
            </div>

            {/* Portrait Image */}
            <div className="relative w-full max-w-xs sm:max-w-sm mx-auto aspect-square rounded-3xl bg-slate-800 border border-slate-700/50 overflow-hidden group shadow-2xl">
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/40 via-slate-800 to-slate-900 animate-pulse flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-slate-600 animate-pulse" />
                </div>
              )}
              <img
                src={report.image}
                alt={`${data.zodiac}${data.mbti} 专属灵魂具象化`}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="eager"
                onLoad={() => setImgLoaded(true)}
              />
            </div>
          </motion.section>

          {/* Module 2: Radar Chart */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-800/30 rounded-3xl p-6 sm:p-8 border border-slate-700/30"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center justify-center space-x-2 text-center text-slate-100">
              <span className="text-emerald-400">⚡</span>
              <span>人格能量雷达图</span>
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={report.radarData}>
                  <PolarGrid stroke="#475569" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#cbd5e1', fontSize: 13, fontWeight: 500 }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar 
                    name="Energy" 
                    dataKey="A" 
                    stroke="#a855f7" 
                    strokeWidth={2}
                    fill="#a855f7" 
                    fillOpacity={0.3} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-slate-400 mt-2 font-medium">{report.radarDesc}</p>
          </motion.section>

          {/* Module 3: Core Analysis */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 text-2xl font-bold text-slate-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-white text-sm">🔥</span>
              </div>
              <h2>你的内核解析</h2>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-3xl p-6 sm:p-8 border border-slate-700/50 text-slate-300 leading-relaxed text-[15px] sm:text-base space-y-6 shadow-sm">
              {report.coreIntro}
              
              <div className="bg-slate-900/60 rounded-2xl p-6 mt-6 border border-slate-700/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/10 blur-2xl rounded-full" />
                <h3 className="text-purple-300 font-bold mb-3 flex items-center space-x-2 text-lg">
                  <Quote className="w-5 h-5 text-purple-400" />
                  <span>{report.hiddenFace.title}</span>
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {report.hiddenFace.desc}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Module 4: Scenarios */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span>四大人生场景应用</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl hover:bg-slate-800/80 transition-colors group">
                <h3 className="flex items-center text-pink-400 font-bold mb-4 text-lg">
                  <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> 爱情
                </h3>
                <ul className="text-[14px] text-slate-300 space-y-3">
                  <li className="leading-relaxed"><strong className="text-white block mb-1">引力法则：</strong>{report.scenarios.love.rule}</li>
                  <li className="leading-relaxed"><strong className="text-white block mb-1">致命踩坑：</strong>{report.scenarios.love.trap}</li>
                  <li className="leading-relaxed"><strong className="text-white block mb-1">高配星座：</strong>{report.scenarios.love.match}</li>
                </ul>
              </div>
              
              <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl hover:bg-slate-800/80 transition-colors group">
                <h3 className="flex items-center text-amber-400 font-bold mb-4 text-lg">
                  <Briefcase className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> 事业 & 学习
                </h3>
                <ul className="text-[14px] text-slate-300 space-y-3">
                  <li className="leading-relaxed"><strong className="text-white block mb-1">天命赛道：</strong>{report.scenarios.career.track}</li>
                  <li className="leading-relaxed"><strong className="text-white block mb-1">易倦怠点：</strong>{report.scenarios.career.burnout}</li>
                </ul>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl hover:bg-slate-800/80 transition-colors group">
                <h3 className="flex items-center text-sky-400 font-bold mb-4 text-lg">
                  <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> 人际关系
                </h3>
                <ul className="text-[14px] text-slate-300 space-y-3">
                  <li className="leading-relaxed"><strong className="text-white block mb-1">相处真相：</strong>{report.scenarios.social.truth}</li>
                  <li className="leading-relaxed"><strong className="text-white block mb-1">他者视角：</strong>{report.scenarios.social.others}</li>
                </ul>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl hover:bg-slate-800/80 transition-colors group">
                <h3 className="flex items-center text-emerald-400 font-bold mb-4 text-lg">
                  <ArrowUpCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> 自我成长
                </h3>
                <ul className="text-[14px] text-slate-300 space-y-3">
                  <li className="leading-relaxed"><strong className="text-white block mb-1">核心警惕：</strong>{report.scenarios.growth.alert}</li>
                  <li className="leading-relaxed"><strong className="text-white block mb-1">破局之法：</strong>{report.scenarios.growth.breakthrough}</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Module 5: Shadow */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-700/80 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <span>人格阴影与破解咒语</span>
            </h2>
            
            <div className="space-y-4">
              {report.shadows.map((item, i) => (
                <div key={i} className="bg-slate-800/60 rounded-[2rem] p-5 sm:p-6 sm:pb-7 flex flex-col gap-4 border border-slate-700/50 relative overflow-hidden group hover:border-slate-600 transition-colors">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500/50 to-purple-500/50 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="pl-2">
                    <div className="font-bold text-lg text-slate-100 mb-2 flex items-center">
                      <span className="text-slate-500 text-sm font-mono mr-3">0{i+1}</span>
                      {item.shadow}
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      {item.desc}
                    </p>
                    <div className="bg-indigo-950/40 border border-indigo-500/20 text-indigo-200 text-[14px] py-3 px-4 rounded-2xl flex items-start leading-relaxed">
                      <span className="mr-2 shrink-0">✨</span> 
                      <span className="font-medium">{item.spell}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Module 6: 2026 Fortune */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-[#1e1b4b] to-[#31103f] rounded-[2.5rem] p-6 sm:p-8 sm:px-10 border border-indigo-400/20 overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none transform translate-x-12 -translate-y-12">
              <div className="w-64 h-64 border-[40px] border-indigo-500/10 rounded-full blur-2xl" />
            </div>
            
            <h2 className="text-2xl font-bold text-fuchsia-200 mb-2 flex items-center">
              <span className="text-2xl mr-2">🎁</span> 2026 年度独家运势提示
            </h2>
            <p className="text-sm text-indigo-200/80 mb-8 font-medium">宇宙星象正为你铺设一条蜕变之路</p>
            
            <ul className="space-y-6 relative z-10">
              <li className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 group">
                <div className="bg-indigo-900/50 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 mt-0.5 border border-indigo-500/30">上半年</div>
                <div className="text-slate-200 text-[15px] leading-relaxed">
                  <strong className="text-indigo-300 block mb-1">{report.fortune.h1.title}</strong>
                  {report.fortune.h1.desc}
                </div>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 group">
                <div className="bg-indigo-900/50 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 mt-0.5 border border-indigo-500/30">年 中</div>
                <div className="text-slate-200 text-[15px] leading-relaxed">
                  <strong className="text-indigo-300 block mb-1">{report.fortune.mid.title}</strong>
                  {report.fortune.mid.desc}
                </div>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 group">
                <div className="bg-fuchsia-900/40 text-fuchsia-300 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 mt-0.5 border border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.3)]">下半年</div>
                <div className="text-slate-200 text-[15px] leading-relaxed">
                  <strong className="text-fuchsia-300 block mb-1">{report.fortune.h2.title}</strong>
                  {report.fortune.h2.desc}
                </div>
              </li>
            </ul>
          </motion.section>

          {/* Module 7: BGM/Poem */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 bg-slate-800/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-slate-700/30">
              <Music className="w-6 h-6 text-fuchsia-400 mb-3" />
              <div className="text-xs text-slate-400 mb-1">你的人格 BGM</div>
              <div className="font-semibold text-slate-200">{report.media.bgm}</div>
            </div>
            <div className="flex-1 bg-slate-800/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-slate-700/30">
              <Film className="w-6 h-6 text-blue-400 mb-3" />
              <div className="text-xs text-slate-400 mb-1">灵魂契合电影</div>
              <div className="font-semibold text-slate-200">{report.media.movie}</div>
            </div>
            <div className="flex-1 bg-slate-800/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-slate-700/30">
              <BookOpen className="w-6 h-6 text-emerald-400 mb-3" />
              <div className="text-xs text-slate-400 mb-1">人格关键词诗</div>
              <div className="font-semibold text-slate-200">{report.media.poem}</div>
            </div>
          </motion.section>

        </div>
      </div>
      
      {/* Module 8: Share Actions (Floating or bottom) */}
      <div className="max-w-2xl mx-auto mt-6 px-4 pb-12 space-y-3">
        <button
          className="w-full flex items-center justify-center space-x-2 bg-white text-slate-900 hover:bg-slate-100 font-semibold py-4 px-8 rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span>{isDownloading ? '生成中...' : '保存精美分享长图'}</span>
        </button>

        <button
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-400 hover:to-rose-400 font-semibold py-4 px-8 rounded-2xl shadow-lg shadow-pink-500/20 transition-all"
          onClick={() => setShowReward(true)}
        >
          <Gift className="w-5 h-5" />
          <span>好评返现</span>
        </button>
      </div>

      {/* Reward Modal */}
      {showReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowReward(false); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-pink-500/10 to-rose-500/10 p-6 pb-4">
              <button
                onClick={() => setShowReward(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-2 mb-2">
                <Gift className="w-6 h-6 text-pink-400" />
                <h2 className="text-xl font-bold text-white">好评返现</h2>
              </div>
              <p className="text-sm text-slate-400">完成以下步骤可获得返现 / 赠品</p>
            </div>

            {/* Steps */}
            <div className="p-6 space-y-5">
              {/* Step 1 */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
                  <span className="text-xs font-bold text-pink-400">1</span>
                </div>
                <h3 className="font-bold text-slate-100 mb-2 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>发布五星好评</span>
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-400">
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2 mt-0.5">•</span>
                    <span>附 2-3 张报告内页截图</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2 mt-0.5">•</span>
                    <span>15 字以上真实使用感受</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2 mt-0.5">•</span>
                    <span>不要匿名发布</span>
                  </li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
                  <span className="text-xs font-bold text-pink-400">2</span>
                </div>
                <h3 className="font-bold text-slate-100 mb-2 flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4 text-sky-400" />
                  <span>私信审核</span>
                </h3>
                <p className="text-sm text-slate-400">
                  将好评截图通过小红书私信发送给我审核
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
                  <span className="text-xs font-bold text-pink-400">3</span>
                </div>
                <h3 className="font-bold text-slate-100 mb-2 flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>审核通过后任选其一</span>
                </h3>
                <div className="space-y-2">
                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                      <span className="text-red-400 text-xs font-bold">红包</span>
                    </div>
                    <span className="text-sm text-slate-200">红包返现 2 元</span>
                  </div>
                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm text-slate-200">免费获得店内另一种测试题的报告码（价值 4.9）</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-800 pt-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">注意事项</h4>
                <ul className="space-y-1.5 text-xs text-slate-500">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-1.5">×</span>
                    <span>每订单仅可参与一次</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-1.5">×</span>
                    <span>截图请勿包含好评返现卡内容</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-1.5">×</span>
                    <span>匿名评价无法审核通过</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-1.5">×</span>
                    <span>复制网上评论不通过</span>
                  </li>
                </ul>
              </div>

              {/* Footer */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  客服在线：9:00 - 23:00
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
