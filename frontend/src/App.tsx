import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Compass, MapPin, Star, Sparkles, Loader2, Heart, Coins, Briefcase, ArrowRight, User, Calendar, Lock, LogIn, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import workBg from './assets/work_bg.png';
import moneyBg from './assets/money_bg.png';
import loveBg from './assets/love_bg.png';
import Map from './components/Map';

interface Recommendation {
  id: string;
  name: string;
  type: string;
  category: string;
  lat: number;
  lng: number;
  score: number;
  image?: string;
  sacred_object?: string;
  offerings?: string;
}

type Step = 'selection' | 'register' | 'login' | 'results';

// Mystical Mandala Component
const MysticalMandala = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-20">
      {/* Outer Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute w-[800px] h-[800px] border border-faith-gold/30 rounded-full flex items-center justify-center"
      >
        <div className="absolute w-[90%] h-[90%] border border-faith-gold/20 rounded-full border-dashed" />
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-faith-gold/40 rounded-full"
            style={{
              transform: `rotate(${i * 30}deg) translate(400px)`,
            }}
          />
        ))}
      </motion.div>

      {/* Middle Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] border border-faith-gold/30 rounded-full flex items-center justify-center"
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-32 h-32 border border-faith-gold/20 rounded-full"
            style={{
              transform: `rotate(${i * 45}deg) translate(150px)`,
            }}
          />
        ))}
      </motion.div>

      {/* Inner Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute w-[400px] h-[400px] border border-faith-gold/30 rounded-full flex items-center justify-center opacity-50"
      >
        <div className="w-full h-full border-4 border-faith-gold/10 rounded-full" />
        {[...Array(6)].map((_, i) => (
          <Star
            key={i}
            size={24}
            className="absolute text-faith-gold/40"
            style={{
              transform: `rotate(${i * 60}deg) translate(200px) rotate(-${i * 60}deg)`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

// Animated Background Component
const DivineBackground = ({ currentBgIndex, backgrounds }: { currentBgIndex: number, backgrounds: string[] }) => {
  const particles = useMemo(() => {
    return [...Array(30)].map(() => ({
      left: Math.random() * 100 + "%",
      top: (Math.random() * 50 + 50) + "%",
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 8,
      x: (Math.random() - 0.5) * 60
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#1A0404]">
      {/* Background Image Carousel */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentBgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgrounds[currentBgIndex]})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A0404] via-[#1A0404]/80 to-[#1A0404]" />

      {/* Moving Blobs */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -40, 80, 0],
          scale: [1, 1.1, 0.95, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
        className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-600/10 blur-[120px] rounded-full"
      />
      <motion.div
        animate={{
          x: [0, -80, 40, 0],
          y: [0, 80, -40, 0],
          scale: [1, 1.05, 0.9, 1]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
        className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-800/15 blur-[100px] rounded-full"
      />

      {/* Divine Sparks (Floating Particles) */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{
            left: p.left,
            top: p.top,
            opacity: 0,
            scale: 0
          }}
          animate={{
            y: [0, -400],
            x: [0, p.x],
            opacity: [0, 0.7, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          style={{ willChange: "transform, opacity" }}
          className="absolute w-1 h-1 bg-faith-gold rounded-full shadow-[0_0_12px_#D4AF37]"
        />
      ))}

      <MysticalMandala />
    </div>
  );
};

function App() {
  const [step, setStep] = useState<Step>('selection');
  // const [selectedInterests, setSelectedInterests] = useState<string[]>([]); // Removed selection logic
  const [selectedInterests] = useState<string[]>([]); // Keep empty array for compatibility with results page
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentBg, setCurrentBg] = useState(2);
  const backgrounds = [workBg, moneyBg, loveBg];

  const [activeCategory, setActiveCategory] = useState<string>('LOVE');
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Recommendation | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const savedId = localStorage.getItem('faith_userId');
    const savedName = localStorage.getItem('faith_userName');
    if (savedId && savedName) {
      setUserId(savedId);
      setUserName(savedName);
      setFormData(prev => ({ ...prev, name: savedName }));
      setRememberMe(true);
    }
  }, []);

  const interests = [
    { id: 'work', label: 'การงาน', sub: 'ความก้าวหน้า เลื่อนตำแหน่ง สอบติด', icon: <Briefcase size={28} />, bg: workBg },
    { id: 'finance', label: 'การเงิน', sub: 'โชคลาภ ค้าขาย ร่ำรวย', icon: <Coins size={28} />, bg: moneyBg },
    { id: 'love', label: 'ความรัก', sub: 'คู่ครอง ครอบครัว มิตรภาพ', icon: <Heart size={28} />, bg: loveBg }
  ];

  const fetchRecommendations = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/recommend/${id}`);
      if (response.data.error) {
        setError(response.data.error);
        setRecommendations([]);
      } else {
        setRecommendations(response.data.recommendations);
        setStep('results');
      }
    } catch {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ AI ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/register', {
        name: formData.name,
        birth_date: formData.birthDate,
        password: formData.password
      });
      if (response.data.status === 'success') {
        const uId = response.data.user_id;
        setUserId(uId);
        setUserName(response.data.name);
        if (rememberMe) {
          localStorage.setItem('faith_userId', uId);
          localStorage.setItem('faith_userName', response.data.name);
        }
        fetchRecommendations(uId);
      } else {
        setError(response.data.message);
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการลงทะเบียน');
    } finally {
      setLoading(false);
    }
  };

  const logActivity = (attractionId: string, actionType: string) => {
    if (!userId || isNaN(Number(userId))) return;
    axios.post('http://127.0.0.1:8000/api/activity', {
      user_id: Number(userId),
      attraction_id: Number(attractionId),
      action_type: actionType
    }).catch(err => console.error("Failed to log activity:", err));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/login', {
        name: formData.name || userId,
        password: formData.password
      });
      if (response.data.status === 'success') {
        const uId = response.data.user_id;
        setUserId(uId);
        setUserName(response.data.name);
        if (rememberMe) {
          localStorage.setItem('faith_userId', uId);
          localStorage.setItem('faith_userName', response.data.name);
        } else {
          localStorage.removeItem('faith_userId');
          localStorage.removeItem('faith_userName');
        }
        fetchRecommendations(uId);
      } else {
        setError(response.data.message);
      }
    } catch {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white selection:bg-faith-gold/30 font-outfit overflow-x-hidden">
      <DivineBackground currentBgIndex={currentBg} backgrounds={backgrounds} />

      <AnimatePresence mode="wait">
        {step === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-6 py-10 relative z-10 min-h-screen flex flex-col"
          >
            {/* Top Left Navigation (Login removed) */}
            {/* Top Right Navigation */}
            <nav className="flex justify-end items-center gap-4 mb-10">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setStep('login')}
                className="bg-white/10 text-white px-6 py-2.5 rounded-full font-bold border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-md"
              >
                <LogIn size={18} /> เข้าสู่ระบบ
              </motion.button>
            </nav>

            <div className="flex-1 flex flex-col justify-center items-center text-center relative z-20">
              <div className="mb-8 flex justify-center items-center gap-3">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="text-faith-gold" size={24} />
                </motion.div>
                <span className="text-faith-gold font-black tracking-[0.3em] text-sm uppercase">Faith Nokonpathom</span>
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="text-faith-gold" size={24} />
                </motion.div>
              </div>

              <motion.h1
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-6xl md:text-9xl font-black mb-6 gold-gradient-text tracking-tight leading-normal drop-shadow-2xl overflow-visible"
              >
                สถานที่สายมูในนครปฐม
                <br />
                <span className="text-white text-4xl md:text-6xl opacity-90 tracking-widest block mt-4 pb-6 leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">นครปฐม</span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-lg md:text-2xl text-faith-gold font-bold mb-6 tracking-wide drop-shadow-md"
              >
                "ค้นพบเส้นทางสายมูที่ใช่ ในแบบที่เป็นคุณ"
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-gray-300 max-w-3xl text-lg font-light leading-relaxed mb-12 drop-shadow-md mx-auto"
              >
                แพลตฟอร์มแนะนำการท่องเที่ยวเชิงความเชื่อในจังหวัดนครปฐม ที่รวมรวบข้อมูลสถานที่ศักดิ์สิทธิ์และแหล่งท่องเที่ยวสำคัญทั่วจังหวัด โดยใช้ระบบ <span className="text-faith-gold font-medium">Recommendation System</span> มาเป็นผู้ช่วยส่วนตัวในการวิเคราะห์และนำเสนอสถานที่ที่ตรงกับความสนใจของคุณ เพื่อให้ทุกการเดินทางเปี่ยมไปด้วยความหมายและสิริมงคล
              </motion.p>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(212, 175, 55, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep('register')}
                className="bg-faith-gold hover:bg-amber-400 text-[#1A0404] px-12 py-5 rounded-full font-black text-xl shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all flex items-center gap-3 mb-20 group"
              >
                <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                เริ่มต้นเส้นทางศรัทธา
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Features Section Removed */}
            </div>
          </motion.div>
        )}

        {(step === 'register' || step === 'login') && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="max-w-md mx-auto px-6 py-20 relative z-10"
          >
            <div className="glass-card rounded-[3rem] p-12 border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ rotateY: 0 }} animate={{ rotateY: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 bg-faith-gold rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-500/30 text-[#1A0404]"
                >
                  {step === 'register' ? <User size={40} /> : <LogIn size={40} />}
                </motion.div>
                <h2 className="text-3xl font-black mb-3 gold-gradient-text uppercase tracking-tight">{step === 'register' ? 'ลงทะเบียน' : 'ยินดีต้อนรับกลับมา'}</h2>
                <p className="text-gray-400 text-sm font-medium">ร่วมเดินทางสู่เส้นทางแห่งศรัทธา</p>
              </div>

              <form onSubmit={step === 'register' ? handleRegister : handleLogin} className="space-y-7">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-faith-gold/70 uppercase tracking-[.25em] pl-1">ชื่อ / ชื่อผู้ใช้</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text" required placeholder="ชื่อของคุณ"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-faith-gold transition-all outline-none backdrop-blur-xl"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                {step === 'register' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-faith-gold/70 uppercase tracking-[.25em] pl-1">วันเกิด</label>
                    <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="date" required
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-faith-gold transition-all outline-none dark:[color-scheme:dark]"
                        value={formData.birthDate}
                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-faith-gold/70 uppercase tracking-[.25em] pl-1">รหัสผ่าน</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type={showPassword ? "text" : "password"} required placeholder="รหัสผ่านของคุณ"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-faith-gold transition-all outline-none backdrop-blur-xl"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                {step === 'register' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-faith-gold/70 uppercase tracking-[.25em] pl-1">ยืนยันรหัสผ่าน</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type={showPassword ? "text" : "password"} required placeholder="ยืนยันรหัสผ่าน"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-faith-gold transition-all outline-none backdrop-blur-xl"
                        value={formData.confirmPassword}
                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 px-1 cursor-pointer group" onClick={() => setShowPassword(!showPassword)}>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${showPassword ? 'bg-faith-gold border-faith-gold' : 'border-white/20'}`}>
                    {showPassword && <CheckCircle2 size={12} className="text-black" />}
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold group-hover:text-white transition-colors uppercase tracking-widest">แสดงรหัสผ่าน</span>
                </div>

                <div className="flex items-center gap-3 px-1 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-faith-gold border-faith-gold' : 'border-white/20'}`}>
                    {rememberMe && <CheckCircle2 size={16} className="text-black" />}
                  </div>
                  <span className="text-[11px] text-gray-400 font-bold group-hover:text-white transition-colors uppercase tracking-widest">จดจำบัญชีในอุปกรณ์นี้</span>
                </div>

                {error && <p className="text-red-400 text-xs text-center font-bold bg-red-950/40 py-3 rounded-2xl border border-red-900/50">{error}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={loading}
                  className="w-full bg-faith-gold hover:bg-amber-400 text-[#1A0404] py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-amber-600/30 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : (
                    <>{step === 'register' ? 'ลงทะเบียน' : 'เข้าสู่ระบบ'} <ArrowRight size={20} /></>
                  )}
                </motion.button>
              </form>

              <p className="mt-10 text-center text-xs text-gray-500 font-bold tracking-widest">
                {step === 'register' ? 'มีบัญชีอยู่แล้ว?' : 'เพิ่งเคยมาที่นี่ครั้งแรก?'} <button onClick={() => setStep(step === 'register' ? 'login' : 'register')} className="text-faith-gold hover:underline underline-offset-4 ml-1">เปลี่ยนโหมด</button>
              </p>
            </div>

            <button
              onClick={() => setStep('selection')}
              className="mt-10 text-gray-600 hover:text-faith-gold text-[10px] w-full transition-all uppercase tracking-[0.4em] font-black"
            >
              ← ยกเลิกและกลับหน้าหลัก
            </button>
          </motion.div>
        )}

        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full relative z-10 font-outfit min-h-screen pb-10 flex flex-col"
          >
            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 md:px-12 py-6 absolute w-full z-50">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setStep('selection')}>
                <motion.div whileHover={{ rotate: 180 }} className="p-2 bg-faith-gold rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  <Compass className="text-[#1A0404]" size={20} />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-xl font-black gold-gradient-text tracking-tighter uppercase leading-none">ศรัทธา AI</span>
                  <span className="text-[8px] text-gray-400 tracking-widest uppercase">ผู้นำทางจิตวิญญาณ</span>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-10">
                {['หน้าแรก', 'สถานที่ศักดิ์สิทธิ์', 'แผนที่', 'บทสวดมนต์', 'เกี่ยวกับ'].map((link) => (
                  <a key={link} href="#" className="text-white hover:text-faith-gold text-xs font-bold uppercase tracking-widest transition-colors">
                    {link}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button onClick={() => { localStorage.removeItem('faith_userId'); localStorage.removeItem('faith_userName'); setStep('selection'); }}
                  className="px-6 py-2 bg-white/10 hover:bg-faith-gold text-white hover:text-[#1A0404] rounded-full text-xs font-black uppercase tracking-widest transition-all backdrop-blur-md border border-white/20 hover:border-faith-gold group"
                >
                  <span className="hidden sm:inline">{userName ? `ผู้ใช้: ${userName.substring(0, 8)}` : 'ออกจากระบบ'}</span>
                  <LogIn size={14} className="inline sm:hidden" />
                </button>
              </div>
            </nav>

            {/* Large Hero Area */}
            <header className="w-full h-[45vh] md:h-[60vh] relative flex flex-col items-center justify-center overflow-hidden mb-10 md:mb-16">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                style={{ backgroundImage: `url(${backgrounds[currentBg]})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#1A0404]/80 via-[#1A0404]/60 to-[#1A0404]" />

              <div className="relative z-10 text-center px-4 w-full flex flex-col items-center justify-center flex-1 pt-12">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                  className="text-5xl md:text-8xl font-black mb-0 gold-gradient-text tracking-tighter drop-shadow-2xl pb-6 leading-normal overflow-visible"
                >
                  สถานที่สายมูในนครปฐม
                </motion.h2>

                {/* Mimic the black bar from wireframe as an elegant search or separator */}

              </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 mb-24 flex-1 w-full relative z-20">
              <div className="flex flex-col mb-12 gap-6 w-full items-center">
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight flex flex-col md:flex-row gap-2 text-center md:text-left">
                  <span className="text-faith-gold">สถานที่</span> <span className="text-white">แนะนำสำหรับคุณ</span>
                </h3>

                {/* Filter Buttons */}
                <div className="flex items-center w-[85%] sm:w-auto justify-between sm:justify-center overflow-x-auto no-scrollbar gap-1 sm:gap-4 p-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-md">
                  <button
                    onClick={() => { setActiveCategory('LOVE'); setCurrentBg(2); }}
                    className={`flex-1 sm:flex-none px-4 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-sm font-black uppercase tracking-widest transition-colors whitespace-nowrap ${activeCategory === 'LOVE' ? 'bg-faith-gold text-[#1A0404]' : 'text-white hover:text-faith-gold'}`}>
                    ความรัก
                  </button>
                  <button
                    onClick={() => { setActiveCategory('WEALTH'); setCurrentBg(1); }}
                    className={`flex-1 sm:flex-none px-4 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-sm font-black uppercase tracking-widest transition-colors whitespace-nowrap ${activeCategory === 'WEALTH' ? 'bg-faith-gold text-[#1A0404]' : 'text-white hover:text-faith-gold'}`}>
                    การเงิน
                  </button>
                  <button
                    onClick={() => { setActiveCategory('CAREER'); setCurrentBg(0); }}
                    className={`flex-1 sm:flex-none px-4 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-sm font-black uppercase tracking-widest transition-colors whitespace-nowrap ${activeCategory === 'CAREER' ? 'bg-faith-gold text-[#1A0404]' : 'text-white hover:text-faith-gold'}`}>
                    การงาน
                  </button>
                </div>
              </div>

              {/* Grid 3 top, 2 bottom centered */}
              <div className="flex flex-wrap justify-center gap-6">
                {recommendations
                  .filter(item => {
                    const mapping: Record<string, string> = { 'WEALTH': 'การเงิน', 'LOVE': 'ความรัก', 'CAREER': 'การงาน' };
                    return item.category === mapping[activeCategory];
                  })
                  .slice(0, 5)
                  .map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(212,175,55,0.25)" }}
                      className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] glass-card rounded-[2rem] overflow-hidden flex flex-col border border-white/10 hover:border-faith-gold/50 cursor-pointer transition-all"
                      onClick={() => setSelectedPlace(item)}
                    >
                      {/* Card Image Area */}
                      <div className="h-56 relative overflow-hidden group/img">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/img:scale-110"
                          style={{ backgroundImage: `url(${item.image || workBg})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0404] via-[#1A0404]/40 to-transparent" />


                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h4 className="text-xl font-black text-white mb-3 line-clamp-1 group-hover:text-faith-gold transition-colors">{item.name}</h4>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-1.5 bg-faith-gold/20 rounded border border-faith-gold/30">
                            <Star size={12} className="text-faith-gold fill-faith-gold" />
                          </div>
                          <span className="text-sm font-bold text-gray-300 tracking-wider font-mono">
                            {item.score.toFixed(1)} <span className="text-gray-500 font-sans tracking-normal font-medium text-xs ml-1">(คะแนนความเข้ากัน)</span>
                          </span>
                        </div>

                        <p className="text-sm text-gray-400 mb-8 flex-1 line-clamp-2 leading-relaxed font-light">
                          {item.sacred_object && item.sacred_object !== "-" ? `สิ่งศักดิ์สิทธิ์: ${item.sacred_object}` : (item.offerings && item.offerings !== "-" ? `ของไหว้: ${item.offerings}` : "สถานที่ศักดิ์สิทธิ์ที่เปี่ยมไปด้วยสิริมงคลและพลังวิเศษ")}
                        </p>

                        <button className="w-full bg-white/5 hover:bg-faith-gold text-white hover:text-[#1A0404] py-4 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-transparent group/btn mt-auto">
                          <Sparkles size={16} className="text-faith-gold group-hover/btn:text-[#1A0404]" /> รับเส้นทางการเดินทาง
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </main>

            {/* Footer matching wireframe */}
            <footer className="w-full bg-black/40 pt-16 pb-8 border-t border-white/10 mt-auto backdrop-blur-lg">
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between mb-12 gap-10">
                <div className="max-w-sm">
                  <div className="flex items-center gap-3 mb-6 opacity-60">
                    <Compass size={32} className="text-faith-gold" />
                    <span className="text-xl font-black tracking-widest text-white">ศรัทธา AI</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-xs mb-6 font-light">
                    ค้นพบพลังแห่งจิตวิญญาณแห่งนครปฐม นำความสงบสุขและความเป็นสิริมงคลมาสู่ชีวิตผ่านการแนะนำสถานที่ศักดิ์สิทธิ์
                  </p>
                </div>

                <div className="flex flex-wrap gap-12 md:gap-24 opacity-80">
                  <div className="flex flex-col gap-4">
                    <h5 className="text-faith-gold text-xs font-black uppercase tracking-[0.2em] mb-2">แพลตฟอร์ม</h5>
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">เริ่มต้นการเดินทาง</a>
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">สำรวจแผนที่</a>
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">สถานที่ศักดิ์สิทธิ์</a>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h5 className="text-faith-gold text-xs font-black uppercase tracking-[0.2em] mb-2">ข้อมูลทางกฎหมาย</h5>
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a>
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">เงื่อนไขการให้บริการ</a>
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">ติดต่อฝ่ายสนับสนุน</a>
                  </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col items-center">
                <div className="w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-faith-gold/30 to-transparent mb-6" />
                <span className="text-[10px] text-gray-600 tracking-widest uppercase">
                  © 2026 Nakornpathom Faith Experience
                </span>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedPlace(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A0404] border border-faith-gold/30 rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-gray-400 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="relative h-64 md:h-80">
                {selectedPlace.image ? (
                  <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-faith-gold/10 flex items-center justify-center">
                    <span className="text-faith-gold/30 font-black text-4xl">ไม่มีรูปภาพ</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0404] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex gap-2 mb-2">
                    <span className="px-3 py-1 bg-faith-gold/20 text-faith-gold text-xs font-bold rounded-full border border-faith-gold/20 uppercase tracking-wider backdrop-blur-md">
                      {selectedPlace.type}
                    </span>
                    <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full border border-white/10 uppercase tracking-wider backdrop-blur-md">
                      {selectedPlace.category}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white leading-none drop-shadow-lg">{selectedPlace.name}</h2>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 mb-2 text-faith-gold">
                      <Star size={18} />
                      <span className="font-bold text-xs uppercase tracking-widest">Score</span>
                    </div>
                    <span className="text-2xl font-black text-white">{selectedPlace.score.toFixed(2)}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 mb-2 text-faith-gold">
                      <Compass size={18} />
                      <span className="font-bold text-xs uppercase tracking-widest">พิกัดสถานที่</span>
                    </div>
                    <span className="text-sm font-mono text-gray-400">{selectedPlace.lat.toFixed(4)}, {selectedPlace.lng.toFixed(4)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-faith-gold/10 rounded-xl text-faith-gold shrink-0">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">สิ่งศักดิ์สิทธิ์ (Sacred Object)</h3>
                      <p className="text-gray-400 leading-relaxed">{selectedPlace.sacred_object || "ไม่ระบุข้อมูล"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-faith-gold/10 rounded-xl text-faith-gold shrink-0">
                      <Heart size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">ของไหว้ (Offerings)</h3>
                      <p className="text-gray-400 leading-relaxed">{selectedPlace.offerings || "ไม่ระบุข้อมูล"}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full h-64 rounded-2xl overflow-hidden mb-4 border border-faith-gold/30">
                  <Map recommendations={[selectedPlace]} className="h-full" />
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedPlace.lat},${selectedPlace.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => logActivity(selectedPlace.id, 'view_map')}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-faith-gold text-[#1A0404] font-black rounded-xl hover:bg-amber-400 transition-colors"
                >
                  <MapPin size={20} />
                  <span>เปิดในแผนที่ GOOGLE MAPS</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Branding */}
      <footer className="py-12 text-center text-[10px] font-black tracking-[0.6em] text-gray-700 uppercase relative z-10 pointer-events-none">
        © 2026 Nakornpathom Faith Experience • AI Recommendation System
      </footer>
    </div>
  );
}

export default App;
