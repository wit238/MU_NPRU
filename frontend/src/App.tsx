import { useState, useEffect } from 'react';
import axios from 'axios';
import { Compass, MapPin, Star, Sparkles, Loader2, Heart, Coins, Briefcase, ArrowRight, User, Calendar, Lock, LogIn, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import workBg from './assets/work_bg.png';
import moneyBg from './assets/money_bg.png';
import loveBg from './assets/love_bg.png';

interface Recommendation {
  id: string;
  name: string;
  type: string;
  category: string;
  lat: number;
  lng: number;
  score: number;
}

type Step = 'selection' | 'register' | 'login' | 'results';

// Animated Background Component
const DivineBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#1A0404]">
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
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            left: Math.random() * 100 + "%",
            top: (Math.random() * 50 + 50) + "%",
            opacity: 0,
            scale: 0
          }}
          animate={{
            y: [0, -400],
            x: [0, (Math.random() - 0.5) * 60],
            opacity: [0, 0.7, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear" // Linear is more efficient for large numbers of objects
          }}
          style={{ willChange: "transform, opacity" }} // Optimize for GPU
          className="absolute w-1 h-1 bg-faith-gold rounded-full shadow-[0_0_12px_#D4AF37]"
        />
      ))}
    </div>
  );
};

function App() {
  const [step, setStep] = useState<Step>('selection');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

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
    } catch (err) {
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
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการลงทะเบียน');
    } finally {
      setLoading(false);
    }
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
    } catch (err) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white selection:bg-faith-gold/30 font-outfit overflow-x-hidden">
      <DivineBackground />

      <AnimatePresence mode="wait">
        {step === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10"
          >
            <div className="mb-12 flex justify-center items-center gap-2">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="text-faith-gold" size={18} />
              </motion.div>
              <span className="text-faith-gold font-black tracking-[0.3em] text-xs uppercase">Faith Nokonpathom</span>
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="text-faith-gold" size={18} />
              </motion.div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 gold-gradient-text tracking-tight">คุณต้องการขอพรด้านใด?</h1>
            <p className="text-gray-400 mb-16 text-lg font-light">เลือกด้านที่คุณต้องการ เพื่อเปิดโอกาสให้ AI ค้นหาสิ่งที่ใช่สำหรับคุณ</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {interests.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -15, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedInterests(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])}
                  className={`relative cursor-pointer rounded-[2.5rem] p-10 h-[380px] flex flex-col justify-end items-start overflow-hidden border-2 transition-all group ${selectedInterests.includes(item.id) ? 'border-faith-gold shadow-[0_0_50px_rgba(212,175,55,0.3)]' : 'border-white/10'
                    } bg-black/40 backdrop-blur-md`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-70 transition-opacity"
                    style={{ backgroundImage: `url(${item.bg})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-60" />
                  <div className="relative z-10 w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-inner">
                    <span className="text-faith-gold">{item.icon}</span>
                  </div>
                  <h3 className="relative z-10 text-2xl font-black mb-3 uppercase tracking-wider">{item.label}</h3>
                  <p className="relative z-10 text-[11px] text-left text-gray-300 leading-relaxed font-normal tracking-wide">{item.sub}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-8">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setStep('register')}
                disabled={selectedInterests.length === 0}
                className="bg-faith-gold hover:bg-amber-400 text-[#1A0404] px-16 py-5 rounded-full font-black transition-all disabled:opacity-30 flex items-center gap-3 text-xl shadow-2xl shadow-amber-600/20"
              >
                เข้าสู่ประสบการณ์สายมู <ArrowRight size={24} />
              </motion.button>
              <button onClick={() => setStep('login')} className="text-faith-gold/60 hover:text-faith-gold font-bold flex items-center gap-2 transition-all border-b border-transparent hover:border-faith-gold/40 pb-1 text-sm tracking-widest uppercase">
                <LogIn size={16} /> กลับมาอีกครั้ง (Log In)
              </button>
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
                <h2 className="text-3xl font-black mb-3 gold-gradient-text uppercase tracking-tight">{step === 'register' ? 'Registering' : 'Welcome Back'}</h2>
                <p className="text-gray-400 text-sm font-medium">ร่วมเดินทางสู่เส้นทางแห่งศรัทธา</p>
              </div>

              <form onSubmit={step === 'register' ? handleRegister : handleLogin} className="space-y-7">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-faith-gold/70 uppercase tracking-[.25em] pl-1">Name / Username</label>
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
                    <label className="text-[10px] font-black text-faith-gold/70 uppercase tracking-[.25em] pl-1">Birth Date</label>
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
                  <label className="text-[10px] font-black text-faith-gold/70 uppercase tracking-[.25em] pl-1">Security Key</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="password" required placeholder="รหัสผ่านของคุณ"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-faith-gold transition-all outline-none backdrop-blur-xl"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                {step === 'register' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-faith-gold/70 uppercase tracking-[.25em] pl-1">Verify Key</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="password" required placeholder="ยืนยันรหัสผ่าน"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-faith-gold transition-all outline-none backdrop-blur-xl"
                        value={formData.confirmPassword}
                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 px-1 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-faith-gold border-faith-gold' : 'border-white/20'}`}>
                    {rememberMe && <CheckCircle2 size={16} className="text-black" />}
                  </div>
                  <span className="text-[11px] text-gray-400 font-bold group-hover:text-white transition-colors uppercase tracking-widest">Remember this vessel</span>
                </div>

                {error && <p className="text-red-400 text-xs text-center font-bold bg-red-950/40 py-3 rounded-2xl border border-red-900/50">{error}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={loading}
                  className="w-full bg-faith-gold hover:bg-amber-400 text-[#1A0404] py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-amber-600/30 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : (
                    <>{step === 'register' ? 'Register' : 'Authenticate'} <ArrowRight size={20} /></>
                  )}
                </motion.button>
              </form>

              <p className="mt-10 text-center text-xs text-gray-500 font-bold tracking-widest uppercase">
                {step === 'register' ? 'Already a member?' : 'First time here?'} <button onClick={() => setStep(step === 'register' ? 'login' : 'register')} className="text-faith-gold hover:underline underline-offset-4 ml-1">Switch Mode</button>
              </p>
            </div>

            <button
              onClick={() => setStep('selection')}
              className="mt-10 text-gray-600 hover:text-faith-gold text-[10px] w-full transition-all uppercase tracking-[0.4em] font-black"
            >
              ← Cancel Journey
            </button>
          </motion.div>
        )}

        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-6 py-12 relative z-10"
          >
            <nav className="flex justify-between items-center mb-20 px-6 py-4 glass-card rounded-full border border-white/10">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setStep('selection')}>
                <motion.div
                  whileHover={{ rotate: 180 }}
                  className="p-2.5 bg-faith-gold rounded-xl shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                >
                  <Compass className="text-[#1A0404]" size={22} />
                </motion.div>
                <span className="text-2xl font-black gold-gradient-text tracking-tighter uppercase">Faith AI</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="px-6 py-2.5 bg-black/40 rounded-full border border-white/10 text-xs font-black text-faith-gold flex items-center gap-3 shadow-inner">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  USER: {userName || 'QUEST'}
                </div>
                <button onClick={() => { localStorage.removeItem('faith_userId'); localStorage.removeItem('faith_userName'); setStep('selection'); }} className="text-[10px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-widest border-b border-transparent hover:border-white/40 pb-0.5">Logout</button>
              </div>
            </nav>

            <header className="mb-16 px-6">
              <motion.h2
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                className="text-5xl md:text-7xl font-black mb-6 tracking-tight gold-gradient-text"
              >
                Places of Power
              </motion.h2>
              <div className="flex flex-wrap items-center gap-4 text-gray-400">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                  <Sparkles size={16} className="text-faith-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest">Alignment:</span>
                </div>
                <div className="flex gap-2">
                  {selectedInterests.map(i => (
                    <span key={i} className="px-5 py-2 bg-faith-gold/10 text-faith-gold text-[10px] font-black rounded-full border border-faith-gold/20 uppercase tracking-widest shadow-lg shadow-amber-900/10">
                      {interests.find(int => int.id === i)?.label}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
              {recommendations.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="glass-card rounded-[3rem] p-9 hover:border-faith-gold/50 transition-all group border border-white/10 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-faith-gold/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-faith-gold/20 transition-colors" />

                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="p-4 bg-black/40 rounded-[1.25rem] group-hover:bg-faith-gold transition-colors border border-white/10">
                      <MapPin className="text-faith-gold group-hover:text-[#1A0404]" size={28} />
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full border border-white/10 mb-2">
                        <Star className="text-amber-500 fill-amber-500 shadow-amber-500/50" size={16} />
                        <span className="text-lg font-black tracking-tighter text-faith-gold leading-none">{item.score.toFixed(2)}</span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Sync Score</span>
                    </div>
                  </div>

                  <h3 className="text-3xl font-black mb-4 group-hover:text-faith-gold transition-colors leading-[1.1] relative z-10">{item.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-10 relative z-10">
                    <span className="px-4 py-1.5 bg-black/40 rounded-full text-[10px] uppercase font-black tracking-widest text-gray-400 border border-white/10">{item.type}</span>
                    <span className="px-5 py-2 bg-faith-gold/5 rounded-full text-[10px] uppercase font-black tracking-widest text-faith-gold border border-faith-gold/10">{item.category}</span>
                  </div>

                  <div className="pt-10 border-t border-white/10 flex items-center justify-between relative z-10">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-black text-gray-600 tracking-[.3em] mb-2 px-1">Location Data</span>
                      <div className="px-3 py-1.5 bg-black/20 rounded-lg border border-white/5 font-mono text-[11px] text-gray-500 tracking-tighter">
                        {item.lat.toFixed(5)} / {item.lng.toFixed(5)}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="bg-faith-gold/10 hover:bg-faith-gold p-4 rounded-[1.5rem] border border-faith-gold/30 hover:border-faith-gold transition-all"
                    >
                      <ArrowRight size={24} className="text-faith-gold group-hover:text-[#1A0404]" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              className="mt-32 p-20 rounded-[5rem] text-center glass-card border-x-2 border-faith-gold/20 mx-6 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-faith-gold/10 via-transparent to-red-950/20 opacity-40" />
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                <Compass className="text-faith-gold mx-auto mb-10 opacity-60" size={72} />
              </motion.div>
              <h3 className="text-4xl font-black mb-8 gold-gradient-text uppercase tracking-[.4em]">Divine Presence</h3>
              <p className="text-gray-400 max-w-2xl mx-auto text-base font-light leading-relaxed tracking-wide italic">"ขอให้แสงแห่งศรัทธานำพาคุณไปสู่หนทางที่ถูกต้อง ประสบความสำเร็จในทุกสิ่งที่ปรารถนา และพบเจอแต่สิ่งดีงามในการเดินทางครั้งนี้"</p>
              <div className="mt-12 flex justify-center gap-1 opacity-30">
                <span className="w-1.5 h-1.5 bg-faith-gold rounded-full" />
                <span className="w-24 h-[1px] bg-faith-gold my-auto" />
                <span className="w-1.5 h-1.5 bg-faith-gold rounded-full" />
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
