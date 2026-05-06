import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Compass, MapPin, Star, Sparkles, Loader2, Heart, ArrowRight, User, Lock, CheckCircle2, X } from 'lucide-react';
import workBg from './assets/work_bg.png';
import moneyBg from './assets/money_bg.png';
import loveBg from './assets/love_bg.png';
import { motion, AnimatePresence } from 'framer-motion';
import Map from './components/Map';

// Backend API URL — ใช้ VITE_API_URL จาก .env สำหรับ Production, fallback เป็น localhost
const API_URL = import.meta.env.VITE_API_URL || '${API_URL}';


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

// --- Star Rating Component ---
const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-125 focus:outline-none"
        >
          <Star
            size={32}
            className={`transition-colors ${star <= (hovered || value)
              ? 'text-faith-gold fill-faith-gold'
              : 'text-gray-600'
              }`}
          />
        </button>
      ))}
    </div>
  );
};

// --- Rating Modal Component ---
const RatingModal = ({
  place,
  userId,
  onSubmit,
  onClose,
}: {
  place: { id: string; name: string };
  userId: string;
  onSubmit: (ratings: { work: number; finance: number; love: number }) => void;
  onClose: () => void;
}) => {
  const [work, setWork] = useState(0);
  const [finance, setFinance] = useState(0);
  const [love, setLove] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // At least 1 category must be rated to submit (all are optional individually)
  const hasAny = work > 0 || finance > 0 || love > 0;

  const handleSubmit = async () => {
    if (!hasAny) return;
    setSubmitting(true);
    try {
      await axios.post('${import.meta.env.VITE_API_URL || '${API_URL}'}/api/rating', {
        user_id: Number(userId),
        attraction_id: Number(place.id),
        work,
        finance,
        love,
      });
    } catch (e) {
      console.error('Rating save failed:', e);
    } finally {
      setSubmitting(false);
      onSubmit({ work, finance, love });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-[#1A0404] border border-faith-gold/40 rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-faith-gold/20 border border-faith-gold/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="text-faith-gold fill-faith-gold" size={32} />
          </div>
          <h3 className="text-2xl font-black text-white gold-gradient-text mb-1">เนเธซเนเธเธฐเนเธเธเธชเธ–เธฒเธเธ—เธตเน</h3>
          <p className="text-gray-400 text-sm">{place.name}</p>
          <p className="text-gray-500 text-xs mt-2">เนเธซเนเธเธฐเนเธเธเนเธเธซเธกเธงเธ”เธ—เธตเนเธ•เนเธญเธเธเธฒเธฃ (เนเธกเนเธเธฑเธเธเธฑเธเธ—เธธเธเธซเธกเธงเธ”)</p>
        </div>

        {/* Rating Rows */}
        <div className="space-y-6 mb-8">
          {([
            { label: 'เธเธฒเธฃเธเธฒเธ', icon: '๐’ผ', value: work, onChange: setWork },
            { label: 'เธเธฒเธฃเน€เธเธดเธ', icon: '๐’ฐ', value: finance, onChange: setFinance },
            { label: 'เธเธงเธฒเธกเธฃเธฑเธ', icon: 'โค๏ธ', value: love, onChange: setLove },
          ] as const).map(({ label, icon, value, onChange }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-24 shrink-0">
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-bold text-white">{label}</span>
              </div>
              <StarRating value={value} onChange={onChange} />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={hasAny ? { scale: 1.02 } : {}}
          whileTap={hasAny ? { scale: 0.98 } : {}}
          onClick={handleSubmit}
          disabled={!hasAny || submitting}
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${hasAny
            ? 'bg-faith-gold text-[#1A0404] shadow-lg shadow-amber-700/30 hover:bg-amber-400'
            : 'bg-white/10 text-gray-500 cursor-not-allowed'
            }`}
        >
          {submitting ? <Loader2 className="animate-spin" size={22} /> : <><Star size={20} />เธชเนเธเธเธฐเนเธเธ</>}
        </motion.button>
        <button
          onClick={onClose}
          className="w-full mt-3 py-3 rounded-2xl text-gray-500 hover:text-gray-300 text-sm font-bold transition-colors"
        >
          เธเนเธฒเธกเธเธฑเนเธเธ•เธญเธเธเธตเน
        </button>
      </motion.div>
    </motion.div>
  );
};

// --- Profile Modal Component ---
const ProfileModal = ({
  userId,
  userName,
  initialAvatar,
  onClose,
  onNameUpdated,
  onAvatarUpdated,
}: {
  userId: string;
  userName: string;
  initialAvatar: string;
  onClose: () => void;
  onNameUpdated: (newName: string) => void;
  onAvatarUpdated: (src: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'history'>('profile');
  const [ratingHistory, setRatingHistory] = useState<{ id: number; attraction_id: number; attraction_name: string; attraction_image: string; work: number; finance: number; love: number; created_at: string }[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'history' && userId) {
      setHistoryLoading(true);
      axios.get(`${import.meta.env.VITE_API_URL || '${API_URL}'}/user/${userId}/ratings`)
        .then(res => { if (res.data.status === 'success') setRatingHistory(res.data.ratings); })
        .catch(() => { })
        .finally(() => setHistoryLoading(false));
    }
  }, [activeTab, userId]);
  const [newName, setNewName] = useState(userName);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>(initialAvatar || '');
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const compressImage = (file: File, maxPx = 300, quality = 0.7): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = url;
    });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImage(file).then(async (compressed) => {
      setAvatarPreview(compressed);
      onAvatarUpdated(compressed);
      try {
        const res = await axios.put(`${import.meta.env.VITE_API_URL || '${API_URL}'}/user/${userId}/image`, { image_base64: compressed });
        if (res.data.status === 'success') {
          setMsg({ text: 'เธเธฑเธเธ—เธถเธเธฃเธนเธเนเธเธฃเนเธเธฅเนเนเธฅเนเธง', ok: true });
        } else {
          setMsg({ text: res.data.message, ok: false });
        }
      } catch {
        setMsg({ text: 'เธเธฑเธเธ—เธถเธเธฃเธนเธเนเธกเนเธชเธณเน€เธฃเนเธ', ok: false });
      }
    }).catch(() => setMsg({ text: 'เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธเธฃเธฐเธกเธงเธฅเธเธฅเธฃเธนเธเนเธ”เน', ok: false }));
  };

  const handleNameSave = async () => {
    if (!newName.trim() || newName.trim() === userName) return;
    setLoading(true); setMsg(null);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL || '${API_URL}'}/user/${userId}/name`, { new_name: newName.trim() });
      if (res.data.status === 'success') {
        localStorage.setItem('faith_userName', res.data.user_name);
        onNameUpdated(res.data.user_name);
        setMsg({ text: 'เน€เธเธฅเธตเนเธขเธเธเธทเนเธญเธชเธณเน€เธฃเนเธ', ok: true });
      } else {
        setMsg({ text: res.data.message, ok: false });
      }
    } catch {
      setMsg({ text: 'เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”', ok: false });
    } finally { setLoading(false); }
  };

  const handlePasswordSave = async () => {
    if (newPassword !== confirmPassword) { setMsg({ text: 'เธฃเธซเธฑเธชเธเนเธฒเธเนเธซเธกเนเนเธกเนเธ•เธฃเธเธเธฑเธ', ok: false }); return; }
    setLoading(true); setMsg(null);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL || '${API_URL}'}/user/${userId}/password`, { old_password: oldPassword, new_password: newPassword });
      if (res.data.status === 'success') {
        setMsg({ text: 'เน€เธเธฅเธตเนเธขเธเธฃเธซเธฑเธชเธเนเธฒเธเธชเธณเน€เธฃเนเธ', ok: true });
        setOldPassword(''); setNewPassword(''); setConfirmPassword('');
      } else {
        setMsg({ text: res.data.message, ok: false });
      }
    } catch {
      setMsg({ text: 'เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”', ok: false });
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-[#1A0404] border border-faith-gold/30 rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <label htmlFor="avatar-upload" className="cursor-pointer group relative">
            <div className="w-24 h-24 rounded-full border-2 border-faith-gold/60 overflow-hidden bg-faith-gold/10 flex items-center justify-center shadow-lg shadow-amber-900/30">
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                : <User size={40} className="text-faith-gold" />}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-bold">เน€เธเธฅเธตเนเธขเธเธฃเธนเธ</span>
            </div>
          </label>
          <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <p className="text-gray-400 text-xs mt-2">เธเธ”เธ—เธตเนเธฃเธนเธเน€เธเธทเนเธญเน€เธเธฅเธตเนเธขเธเธฃเธนเธเนเธเธฃเนเธเธฅเน</p>
          <p className="text-gray-600 text-[10px] mt-1">เนเธเธฐเธเธณ: เธ เธฒเธเธชเธตเนเน€เธซเธฅเธตเนเธขเธกเธเธฑเธ•เธธเธฃเธฑเธช ยท เธเธเธฒเธ”เนเธกเนเน€เธเธดเธ 5MB<br />เธฃเธฐเธเธเธเธฐเธเธฃเธฑเธเธเธเธฒเธ”เนเธฅเธฐเธเธตเธเธญเธฑเธ”เนเธซเนเธญเธฑเธ•เนเธเธกเธฑเธ•เธด</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-full bg-black/40 border border-white/10">
          {(['profile', 'password', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setMsg(null); }}
              className={`flex-1 py-2 rounded-full text-xs font-black transition-all ${activeTab === tab ? 'bg-faith-gold text-[#1A0404]' : 'text-gray-400 hover:text-white'}`}
            >
              {tab === 'profile' ? 'โ๏ธ เธเธทเนเธญ' : tab === 'password' ? '๐”’ เธฃเธซเธฑเธชเธเนเธฒเธ' : 'โญ เธเธฃเธฐเธงเธฑเธ•เธด'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-faith-gold uppercase tracking-wider mb-1 block">เธเธทเนเธญเธเธนเนเนเธเนเนเธซเธกเน</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="เธเธทเนเธญเธเธนเนเนเธเน"
                  className="w-full bg-black/60 border border-white/20 rounded-2xl py-3.5 pl-11 pr-4 focus:border-faith-gold outline-none text-white text-sm transition-all"
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleNameSave}
              disabled={loading || !newName.trim() || newName.trim() === userName}
              className="w-full py-3.5 rounded-2xl font-black text-sm bg-faith-gold text-[#1A0404] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : '๐’พ เธเธฑเธเธ—เธถเธเธเธทเนเธญ'}
            </motion.button>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="space-y-3">
            {[
              { label: 'เธฃเธซเธฑเธชเธเนเธฒเธเน€เธ”เธดเธก', value: oldPassword, setter: setOldPassword, placeholder: 'เธฃเธซเธฑเธชเธเนเธฒเธเธเธฑเธเธเธธเธเธฑเธ' },
              { label: 'เธฃเธซเธฑเธชเธเนเธฒเธเนเธซเธกเน', value: newPassword, setter: setNewPassword, placeholder: 'เธญเธขเนเธฒเธเธเนเธญเธข 8 เธ•เธฑเธง, เธเธถเนเธเธ•เนเธเธ”เนเธงเธขเธ•เธฑเธงเธเธดเธกเธเนเนเธซเธเน' },
              { label: 'เธขเธทเธเธขเธฑเธเธฃเธซเธฑเธชเธเนเธฒเธเนเธซเธกเน', value: confirmPassword, setter: setConfirmPassword, placeholder: 'เธเธดเธกเธเนเธฃเธซเธฑเธชเธเนเธฒเธเนเธซเธกเนเธญเธตเธเธเธฃเธฑเนเธ' },
            ].map(({ label, value, setter, placeholder }) => (
              <div key={label}>
                <label className="text-xs font-black text-faith-gold uppercase tracking-wider mb-1 block">{label}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-black/60 border border-white/20 rounded-2xl py-3.5 pl-11 pr-4 focus:border-faith-gold outline-none text-white text-sm transition-all"
                  />
                </div>
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handlePasswordSave}
              disabled={loading || !oldPassword || !newPassword || !confirmPassword}
              className="w-full py-3.5 rounded-2xl font-black text-sm bg-faith-gold text-[#1A0404] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : '๐” เน€เธเธฅเธตเนเธขเธเธฃเธซเธฑเธชเธเนเธฒเธ'}
            </motion.button>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {historyLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-faith-gold" size={28} /></div>
            ) : ratingHistory.length === 0 ? (
              <div className="text-center text-gray-500 py-8 text-sm">เธขเธฑเธเนเธกเนเธกเธตเธเธฃเธฐเธงเธฑเธ•เธดเธเธฒเธฃเนเธซเนเธเธฐเนเธเธ</div>
            ) : ratingHistory.map((r) => (
              <div key={r.id} className="flex items-center gap-3 bg-black/40 rounded-2xl p-3 border border-white/10">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-faith-gold/10 flex-shrink-0">
                  {r.attraction_image
                    ? <img src={r.attraction_image.startsWith('/') ? `http://localhost:5173${r.attraction_image}` : r.attraction_image} alt={r.attraction_name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-faith-gold">๐•</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold truncate">{r.attraction_name}</p>
                  <div className="flex gap-3 mt-1">
                    {r.love > 0 && <span className="text-pink-400 text-xs">โค๏ธ {r.love}</span>}
                    {r.finance > 0 && <span className="text-yellow-400 text-xs">๐’ฐ {r.finance}</span>}
                    {r.work > 0 && <span className="text-blue-400 text-xs">๐’ผ {r.work}</span>}
                  </div>
                </div>
                <span className="text-gray-600 text-[10px] flex-shrink-0">{r.created_at.slice(0, 10)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message */}
        {msg && (
          <motion.p
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-center text-sm font-bold py-2.5 rounded-2xl ${msg.ok ? 'text-green-400 bg-green-950/40 border border-green-800/50' : 'text-red-400 bg-red-950/40 border border-red-900/50'}`}
          >
            {msg.ok ? 'โ… ' : 'โ ๏ธ '}{msg.text}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

function App() {
  const [step, setStep] = useState<Step>('selection');
  // const [selectedInterests, setSelectedInterests] = useState<string[]>([]); // Removed selection logic
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentBg] = useState(2);
  const backgrounds = [workBg, moneyBg, loveBg];


  const [rememberMe, setRememberMe] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Recommendation | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  // ratingTargetPlace: the place the user went to see on Google Maps
  const [ratingTargetPlace, setRatingTargetPlace] = useState<Recommendation | null>(null);
  // awaitingReturn: true while user is in Google Maps tab
  const [awaitingReturn, setAwaitingReturn] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: 'เนเธกเนเธฃเธฐเธเธธ'
  });

  useEffect(() => {
    const savedId = localStorage.getItem('faith_userId');
    const savedName = localStorage.getItem('faith_userName');
    if (savedId && savedName) {
      setUserId(savedId);
      setUserName(savedName);
      // Fetch profile image from DB on auto-restore
      axios.get(`${import.meta.env.VITE_API_URL || '${API_URL}'}/user/${savedId}/image`)
        .then(res => { if (res.data.profile_image) setAvatarSrc(res.data.profile_image); })
        .catch(() => { });
      setFormData(prev => ({ ...prev, name: savedName }));
      setRememberMe(true);
      fetchRecommendations(savedId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detect when user returns to the tab after opening Google Maps
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && awaitingReturn) {
        setAwaitingReturn(false);
        setShowRatingModal(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [awaitingReturn]);


  const fetchRecommendations = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || '${API_URL}'}/recommend/${id}`);
      if (response.data.error) {
        setError(response.data.error);
        setRecommendations([]);
        setStep('results'); // still go to results page to show error with retry
      } else {
        setRecommendations(response.data.recommendations);
        setStep('results');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[fetchRecommendations] Error:', err);
      setError(`เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เน€เธเธทเนเธญเธกเธ•เนเธญเธเธฑเธเน€เธเธดเธฃเนเธเน€เธงเธญเธฃเน AI เนเธ”เน (${msg})`);
      setStep('results');
    } finally {
      setLoading(false);
    }
  };

  // Helper: เธเธฑเธเธ—เธถเธ activity log เนเธเธขเธฑเธ backend
  const logActivity = (place: Recommendation, action: 'view' | 'maps_open') => {
    if (!userId) return;
    axios.post('${import.meta.env.VITE_API_URL || '${API_URL}'}/api/activity-log', {
      user_id: Number(userId),
      attraction_id: Number(place.id),
      attraction_name: place.name,
      lat: place.lat,
      lng: place.lng,
      action,
    }).catch(() => { /* silent fail */ });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('เธฃเธซเธฑเธชเธเนเธฒเธเนเธกเนเธ•เธฃเธเธเธฑเธ');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('${import.meta.env.VITE_API_URL || '${API_URL}'}/register', {
        user_name: formData.name,
        password: formData.password,
        age: formData.age ? parseInt(formData.age) : 0,
        gender: formData.gender
      });
      if (response.data.status === 'success') {
        const uId = response.data.user_id;
        setUserId(uId);
        setUserName(response.data.user_name);
        if (rememberMe) {
          localStorage.setItem('faith_userId', uId);
          localStorage.setItem('faith_userName', response.data.user_name);
        }
        fetchRecommendations(uId);
      } else {
        setError(response.data.message);
      }
    } catch {
      setError('เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”เนเธเธเธฒเธฃเธฅเธเธ—เธฐเน€เธเธตเธขเธ');
    } finally {
      setLoading(false);
    }
  };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('${import.meta.env.VITE_API_URL || '${API_URL}'}/login', {
        user_name: formData.name || userId,
        password: formData.password
      });
      if (response.data.status === 'success') {
        const uId = response.data.user_id;
        setUserId(uId);
        setUserName(response.data.user_name);
        const img = response.data.profile_image || '';
        setAvatarSrc(img);
        if (rememberMe) {
          localStorage.setItem('faith_userId', uId);
          localStorage.setItem('faith_userName', response.data.user_name);
        } else {
          localStorage.removeItem('faith_userId');
          localStorage.removeItem('faith_userName');
        }
        fetchRecommendations(uId);
      } else {
        setError(response.data.message);
      }
    } catch {
      setError('เธเธทเนเธญเธเธนเนเนเธเนเธซเธฃเธทเธญเธฃเธซเธฑเธชเธเนเธฒเธเนเธกเนเธ–เธนเธเธ•เนเธญเธ');
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
            className="w-full max-w-7xl mx-auto px-6 sm:px-8 relative z-10 h-screen bg-transparent flex flex-col justify-center items-center overflow-hidden"
          >
            {/* Top Left Navigation (Login removed) */}
            {/* Top Right Navigation */}


            <div className="flex flex-col justify-center items-center text-center relative z-20 w-full h-full py-4">
              <div className="mb-4 sm:mb-8 flex justify-center items-center gap-3">
                <span className="text-faith-gold font-black tracking-widest text-xs sm:text-sm">NPRU Information Technology</span>
              </div>

              <motion.h1
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-5xl sm:text-6xl md:text-9xl font-black mb-4 sm:mb-6 gold-gradient-text tracking-tight leading-[1.1] drop-shadow-2xl overflow-visible w-full"
              >
                เน€เธชเนเธเธ—เธฒเธเธกเธนเน€เธ•เธฅเธนเนเธเธเธเธฃเธเธเธก
                <br />
                <span className="text-white text-4xl sm:text-5xl md:text-6xl opacity-90 tracking-widest block mt-2 sm:mt-4 pb-2 sm:pb-6 leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">เธเธเธฃเธเธเธก</span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-sm sm:text-lg md:text-2xl text-faith-gold font-bold mb-4 sm:mb-6 tracking-wide drop-shadow-md w-full px-2 lg:px-0"
              >
                "เธกเธนเนเธซเนเธชเธธเธ” เนเธฅเนเธงเธซเธขเธธเธ”เธ—เธตเนเธเธงเธฒเธกเธเธฑเธ... เน€เธชเนเธเธ—เธฒเธเธเธญเธเธฃเธ—เธตเนเธเธฑเธ”เธกเธฒเน€เธเธทเนเธญเธเธธเธ“เนเธ”เธขเน€เธเธเธฒเธฐ"
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-gray-300 w-full max-w-4xl text-sm sm:text-base md:text-lg font-light leading-relaxed mb-6 sm:mb-12 drop-shadow-md mx-auto px-2 lg:px-0 text-justify"
              >
                เธเนเธเธเธเธชเธ–เธฒเธเธ—เธตเนเธจเธฑเธเธ”เธดเนเธชเธดเธ—เธเธดเนเนเธเธเธเธฃเธเธเธกเธ—เธตเนเน€เธซเธกเธฒเธฐเธเธฑเธเธเธธเธ“ เธ”เนเธงเธข<span className="text-faith-gold font-medium"> เธฃเธฐเธเธเนเธเธฐเธเธณเธ•เธฒเธกเธเธนเนเนเธเน</span> เธ—เธตเนเธเธฑเธ”เธชเธฃเธฃเธเธดเธเธฑเธ”เธกเธเธเธฅเธ•เธฒเธกเธเธงเธฒเธกเธ•เนเธญเธเธเธฒเธฃเธเธญเธเธเธธเธ“ เนเธกเนเธงเนเธฒเธเธฐเธเธญเธเธฃเธ”เนเธฒเธเธเธงเธฒเธกเธฃเธฑเธ เธเธฒเธฃเธเธฒเธ เธซเธฃเธทเธญเนเธเธเธฅเธฒเธ  เนเธซเนเน€เธฃเธฒเธเธฒเธเธธเธ“เน€เธ”เธดเธเธ—เธฒเธเธญเธขเนเธฒเธเธกเธตเธเธธเธ”เธซเธกเธฒเธข
              </motion.p>

              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-4 sm:mt-8 w-full sm:w-auto mx-auto justify-center shrink-0 px-2 lg:px-0">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('login')}
                  className="bg-transparent border-2 border-faith-gold hover:bg-faith-gold/10 text-faith-gold px-8 py-3.5 sm:px-12 sm:py-5 rounded-full font-black text-base sm:text-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  เน€เธเนเธฒเธชเธนเนเธฃเธฐเธเธ
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('register')}
                  className="bg-faith-gold hover:bg-amber-400 text-[#1A0404] px-8 py-3.5 sm:px-12 sm:py-5 rounded-full font-black text-base sm:text-xl shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all flex items-center justify-center gap-2 w-full sm:w-auto group"
                >
                  เธชเธกเธฑเธเธฃเธชเธกเธฒเธเธดเธ
                </motion.button>
              </div>

            </div>
          </motion.div>
        )}

        {(step === 'register' || step === 'login') && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-xl md:max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-20 relative z-10"
          >
            <div className="glass-card rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-xl">
              <div className="text-center mb-8 sm:mb-12">
                <motion.div
                  initial={{ rotateY: 0 }} animate={{ rotateY: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-faith-gold rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-xl shadow-amber-500/30 text-[#1A0404]"
                >
                  {step === 'register' ? <User size={32} className="sm:w-10 sm:h-10" /> : <Compass size={32} className="sm:w-10 sm:h-10" />}
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3 gold-gradient-text uppercase tracking-tight">{step === 'register' ? 'เธฅเธเธ—เธฐเน€เธเธตเธขเธ' : 'เธขเธดเธเธ”เธตเธ•เนเธญเธเธฃเธฑเธเธเธฅเธฑเธเธกเธฒ'}</h2>
                <p className="text-gray-300 text-sm sm:text-base font-medium">เธฃเนเธงเธกเน€เธ”เธดเธเธ—เธฒเธเธชเธนเนเน€เธชเนเธเธ—เธฒเธเนเธซเนเธเธจเธฃเธฑเธ—เธเธฒ</p>
              </div>

              <form onSubmit={step === 'register' ? handleRegister : handleLogin} className="space-y-6 sm:space-y-7">
                <div className="space-y-2">
                  <label className="text-sm sm:text-base font-black text-faith-gold uppercase tracking-wider pl-1">เธเธทเนเธญ / เธเธทเนเธญเธเธนเนเนเธเน</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text" required placeholder="เธเธทเนเธญเธเธญเธเธเธธเธ“"
                      className="w-full bg-black/60 border border-white/20 rounded-2xl py-4 sm:py-5 pl-14 pr-6 focus:border-faith-gold transition-all outline-none text-base sm:text-lg text-white"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm sm:text-base font-black text-faith-gold uppercase tracking-wider pl-1">เธฃเธซเธฑเธชเธเนเธฒเธ</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"} required placeholder="เธฃเธซเธฑเธชเธเนเธฒเธเธเธญเธเธเธธเธ“"
                      className="w-full bg-black/60 border border-white/20 rounded-2xl py-4 sm:py-5 pl-14 pr-6 focus:border-faith-gold transition-all outline-none text-base sm:text-lg text-white"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                {step === 'register' && (
                  <>
                  <div className="space-y-2">
                    <label className="text-sm sm:text-base font-black text-faith-gold uppercase tracking-wider pl-1">เธขเธทเธเธขเธฑเธเธฃเธซเธฑเธชเธเนเธฒเธ</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type={showPassword ? "text" : "password"} required placeholder="เธขเธทเธเธขเธฑเธเธฃเธซเธฑเธชเธเนเธฒเธ"
                        className="w-full bg-black/60 border border-white/20 rounded-2xl py-4 sm:py-5 pl-14 pr-6 focus:border-faith-gold transition-all outline-none text-base sm:text-lg text-white"
                        value={formData.confirmPassword}
                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm sm:text-base font-black text-faith-gold uppercase tracking-wider pl-1">เธญเธฒเธขเธธ</label>
                      <input
                        type="number" min="1" max="150" required placeholder="เธญเธฒเธขเธธ"
                        className="w-full bg-black/60 border border-white/20 rounded-2xl py-4 sm:py-5 px-6 focus:border-faith-gold transition-all outline-none text-base sm:text-lg text-white"
                        value={formData.age}
                        onChange={e => setFormData({ ...formData, age: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm sm:text-base font-black text-faith-gold uppercase tracking-wider pl-1">เน€เธเธจ</label>
                      <select
                        className="w-full bg-black/60 border border-white/20 rounded-2xl py-4 sm:py-5 px-6 focus:border-faith-gold transition-all outline-none text-base sm:text-lg text-white appearance-none"
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                      >
                        <option value="เนเธกเนเธฃเธฐเธเธธ" className="bg-[#1A0404] text-white">เนเธกเนเธฃเธฐเธเธธ</option>
                        <option value="เธเธฒเธข" className="bg-[#1A0404] text-white">เธเธฒเธข</option>
                        <option value="เธซเธเธดเธ" className="bg-[#1A0404] text-white">เธซเธเธดเธ</option>
                        <option value="เธญเธทเนเธเน" className="bg-[#1A0404] text-white">เธญเธทเนเธเน</option>
                      </select>
                    </div>
                  </div>
                  </>
                )}

                <div className="flex items-center gap-3 px-1 cursor-pointer group" onClick={() => setShowPassword(!showPassword)}>
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center transition-all ${showPassword ? 'bg-faith-gold border-faith-gold' : 'border-white/30 group-hover:border-faith-gold/50'}`}>
                    {showPassword && <CheckCircle2 size={16} className="text-[#1A0404]" />}
                  </div>
                  <span className="text-sm sm:text-base text-gray-300 font-bold group-hover:text-white transition-colors">เนเธชเธ”เธเธฃเธซเธฑเธชเธเนเธฒเธ</span>
                </div>

                <div className="flex items-center gap-3 px-1 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-faith-gold border-faith-gold' : 'border-white/30 group-hover:border-faith-gold/50'}`}>
                    {rememberMe && <CheckCircle2 size={16} className="text-[#1A0404]" />}
                  </div>
                  <span className="text-sm sm:text-base text-gray-300 font-bold group-hover:text-white transition-colors">เธเธ”เธเธณเธเธฑเธเธเธตเนเธเธญเธธเธเธเธฃเธ“เนเธเธตเน</span>
                </div>

                {error && <p className="text-red-400 text-sm sm:text-base text-center font-bold bg-red-950/40 py-3 sm:py-4 rounded-2xl border border-red-900/50">{error}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={loading}
                  className="w-full bg-faith-gold hover:bg-amber-400 text-[#1A0404] py-4 sm:py-5 rounded-full font-black text-lg sm:text-xl transition-all shadow-xl shadow-amber-600/20 flex items-center justify-center gap-3 mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : (
                    <>{step === 'register' ? 'เธฅเธเธ—เธฐเน€เธเธตเธขเธ' : 'เน€เธเนเธฒเธชเธนเนเธฃเธฐเธเธ'} <ArrowRight size={20} className="sm:w-6 sm:h-6" /></>
                  )}
                </motion.button>
              </form>

              <div className="mt-8 sm:mt-10 pt-6 border-t border-white/10 flex flex-col items-center gap-4">
                <p className="text-center text-sm sm:text-base text-gray-400 font-medium">
                  {step === 'register' ? 'เธกเธตเธเธฑเธเธเธตเธญเธขเธนเนเนเธฅเนเธง?' : 'เน€เธเธดเนเธเน€เธเธขเธกเธฒเธ—เธตเนเธเธตเนเธเธฃเธฑเนเธเนเธฃเธ?'}
                </p>
                <button
                  type="button"
                  onClick={() => setStep(step === 'register' ? 'login' : 'register')}
                  className="w-full py-4 border-2 border-faith-gold/50 text-faith-gold hover:bg-faith-gold/10 hover:border-faith-gold rounded-full font-black text-base sm:text-lg transition-all"
                >
                  {step === 'register' ? 'เนเธเธซเธเนเธฒเน€เธเนเธฒเธชเธนเนเธฃเธฐเธเธ' : 'เธเธฅเธดเธเน€เธเธทเนเธญเธชเธกเธฑเธเธฃเธชเธกเธฒเธเธดเธ'}
                </button>
              </div>
            </div>
          </motion.div>
        )}


        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full relative z-10 font-outfit min-h-screen flex flex-col"
          >
            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 md:px-12 py-6 absolute w-full z-50">
              {/* Left: User Profile - Click to open modal */}
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setShowProfileModal(true)}
              >
                <div className="w-10 h-10 rounded-full bg-faith-gold/20 border-2 border-faith-gold/60 overflow-hidden flex items-center justify-center shadow-lg shadow-amber-900/30 group-hover:border-faith-gold transition-colors">
                  {avatarSrc
                    ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                    : <User size={20} className="text-faith-gold" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-bold leading-none mb-0.5">เธเธนเนเนเธเนเธเธฒเธ</span>
                  <span className="text-sm sm:text-base font-black text-white gold-gradient-text leading-none group-hover:text-faith-gold transition-colors">{userName || formData.name || `user#${userId}` || 'เนเธกเนเธฃเธฐเธเธธ'}</span>
                </div>
              </div>


              {/* Right: Logout */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { localStorage.removeItem('faith_userId'); localStorage.removeItem('faith_userName'); setStep('selection'); }}
                className="px-5 py-2.5 bg-transparent hover:bg-faith-gold/10 text-faith-gold rounded-full text-xs font-black tracking-widest transition-all border border-faith-gold/50 hover:border-faith-gold backdrop-blur-sm"
              >
                เธญเธญเธเธเธฒเธเธฃเธฐเธเธ
              </motion.button>
            </nav>


            <main className="max-w-[1600px] mx-auto px-6 pt-24 pb-10 w-full relative z-20 flex-1">

              {/* Page Header */}
              <div className="mb-8">
                <h3 className="text-2xl md:text-4xl font-black tracking-tight">
                  <span className="text-faith-gold">เธชเธ–เธฒเธเธ—เธตเน</span> <span className="text-white">เนเธเธฐเธเธณเธชเธณเธซเธฃเธฑเธเธเธธเธ“</span>
                </h3>
                <p className="text-gray-400 text-sm mt-1">เธเธฑเธ”เธชเธฃเธฃเธเธดเธเธฑเธ”เธกเธเธเธฅเธ•เธฒเธกเธซเธกเธงเธ”เธซเธกเธนเนเธ—เธตเนเน€เธซเธกเธฒเธฐเธเธฑเธเธเธธเธ“</p>
              </div>

              {/* Error State with Retry */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="w-20 h-20 bg-red-950/50 rounded-full flex items-center justify-center mb-6 border border-red-800/50">
                    <span className="text-4xl">โ ๏ธ</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เนเธซเธฅเธ”เธเธณเนเธเธฐเธเธณเนเธ”เน</h3>
                  <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">{error}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => fetchRecommendations(userId)}
                    disabled={loading}
                    className="bg-faith-gold hover:bg-amber-400 text-[#1A0404] px-10 py-4 rounded-full font-black text-base shadow-lg flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    เธฅเธญเธเนเธซเธกเนเธญเธตเธเธเธฃเธฑเนเธ
                  </motion.button>
                </motion.div>
              )}

              {/* Shopee-style: Category Sections */}
              {!error && (
                <div className="flex flex-col gap-10">
                  {[
                    { key: 'LOVE', label: 'เธเธงเธฒเธกเธฃเธฑเธ', icon: 'โค๏ธ', cat: 'เธเธงเธฒเธกเธฃเธฑเธ' },
                    { key: 'WEALTH', label: 'เธเธฒเธฃเน€เธเธดเธ', icon: '๐’ฐ', cat: 'เธเธฒเธฃเน€เธเธดเธ' },
                    { key: 'CAREER', label: 'เธเธฒเธฃเธเธฒเธ', icon: '๐’ผ', cat: 'เธเธฒเธฃเธเธฒเธ' },
                  ].map(({ key, label, icon, cat }) => {
                    const items = recommendations.filter(r => r.category === cat).slice(0, 5);
                    if (items.length === 0) return null;
                    return (
                      <motion.section
                        key={key}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        {/* Section Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-faith-gold/20 border border-faith-gold/40 flex items-center justify-center text-xl shrink-0">
                            {icon}
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-white leading-tight">{label}</h4>
                            <p className="text-xs text-gray-500">เธชเธ–เธฒเธเธ—เธตเนเนเธเธฐเธเธณ {items.length} เนเธซเนเธ</p>
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-faith-gold/30 to-transparent ml-4" />
                        </div>

                        {/* 5-card Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                          {items.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.07 }}
                              whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(212,175,55,0.25)" }}
                              className="glass-card rounded-2xl overflow-hidden flex flex-col border border-white/10 hover:border-faith-gold/50 cursor-pointer transition-all"
                              onClick={() => { setSelectedPlace(item); logActivity(item, 'view'); }}
                            >
                              {/* Image */}
                              <div className="h-36 relative overflow-hidden group/img">
                                <div
                                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/img:scale-110"
                                  style={{ backgroundImage: `url(${item.image || workBg})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0404] via-[#1A0404]/20 to-transparent" />
                              </div>

                              {/* Body */}
                              <div className="p-3 flex-1 flex flex-col">
                                <h5 className="text-sm font-black text-white mb-1.5 line-clamp-1">{item.name}</h5>

                                <div className="flex items-center gap-1.5 mb-2">
                                  <Star size={10} className="text-faith-gold fill-faith-gold" />
                                  <span className="text-xs font-bold text-faith-gold font-mono">{item.score.toFixed(1)}</span>
                                  <span className="text-[10px] text-gray-500">เธเธฐเนเธเธ</span>
                                </div>

                                <p className="text-[11px] text-gray-400 mb-3 flex-1 line-clamp-2 leading-relaxed">
                                  {item.sacred_object && item.sacred_object !== "-"
                                    ? `เธชเธดเนเธเธจเธฑเธเธ”เธดเนเธชเธดเธ—เธเธดเน: ${item.sacred_object}`
                                    : item.offerings && item.offerings !== "-"
                                      ? `เธเธญเธเนเธซเธงเน: ${item.offerings}`
                                      : "เธชเธ–เธฒเธเธ—เธตเนเธจเธฑเธเธ”เธดเนเธชเธดเธ—เธเธดเนเน€เธเธตเนเธขเธกเธชเธดเธฃเธดเธกเธเธเธฅ"}
                                </p>

                                <button className="w-full bg-white/5 hover:bg-faith-gold text-white hover:text-[#1A0404] py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1.5 border border-white/10 hover:border-transparent mt-auto">
                                  <Sparkles size={11} className="text-faith-gold group-hover:text-[#1A0404]" /> เธฃเธฑเธเน€เธชเนเธเธ—เธฒเธ
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.section>
                    );
                  })}
                </div>
              )}
            </main>

            {/* Footer */}
            <footer className="w-full bg-black/40 pt-16 pb-8 border-t border-white/10 mt-auto backdrop-blur-lg">
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between mb-12 gap-10">
                <div className="max-w-sm text-center md:text-left">
                  <p className="text-xs text-gray-400 leading-relaxed max-w-xs mb-6 font-light">
                    เธเนเธเธเธเธเธฅเธฑเธเนเธซเนเธเธเธดเธ•เธงเธดเธเธเธฒเธ“เนเธซเนเธเธเธเธฃเธเธเธก เธเธณเธเธงเธฒเธกเธชเธเธเธชเธธเธเนเธฅเธฐเธเธงเธฒเธกเน€เธเนเธเธชเธดเธฃเธดเธกเธเธเธฅเธกเธฒเธชเธนเนเธเธตเธงเธดเธ•เธเนเธฒเธเธเธฒเธฃเนเธเธฐเธเธณเธชเธ–เธฒเธเธ—เธตเนเธจเธฑเธเธ”เธดเนเธชเธดเธ—เธเธดเน
                  </p>
                </div>
                <div className="flex flex-wrap justify-center md:justify-end gap-12 md:gap-24 opacity-80">
                  <div className="flex flex-col gap-4 items-center md:items-start">
                    <h5 className="text-faith-gold text-xs font-black uppercase tracking-[0.2em] mb-2">เนเธเธฅเธ•เธเธญเธฃเนเธก</h5>
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">เน€เธฃเธดเนเธกเธ•เนเธเธเธฒเธฃเน€เธ”เธดเธเธ—เธฒเธ</a>
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">เธชเธณเธฃเธงเธเนเธเธเธ—เธตเน</a>
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">เธชเธ–เธฒเธเธ—เธตเนเธจเธฑเธเธ”เธดเนเธชเธดเธ—เธเธดเน</a>
                  </div>
                  <div className="flex flex-col gap-4 items-center md:items-start">
                    <h5 className="text-faith-gold text-xs font-black uppercase tracking-[0.2em] mb-2">เธเนเธญเธกเธนเธฅเธ—เธฒเธเธเธเธซเธกเธฒเธข</h5>
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">เธเนเธขเธเธฒเธขเธเธงเธฒเธกเน€เธเนเธเธชเนเธงเธเธ•เธฑเธง</a>
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">เน€เธเธทเนเธญเธเนเธเธเธฒเธฃเนเธซเนเธเธฃเธดเธเธฒเธฃ</a>
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">เธ•เธดเธ”เธ•เนเธญเธเนเธฒเธขเธชเธเธฑเธเธชเธเธธเธ</a>
                  </div>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col items-center">
                <div className="w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-faith-gold/30 to-transparent mb-6" />
                <span className="text-[10px] text-gray-600 tracking-widest uppercase">ยฉ 2026 Nakornpathom Faith Experience</span>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <ProfileModal
            userId={userId}
            userName={userName || formData.name}
            initialAvatar={avatarSrc}
            onClose={() => setShowProfileModal(false)}
            onAvatarUpdated={(src) => setAvatarSrc(src)}
            onNameUpdated={(newName) => {
              setUserName(newName);
            }}
          />
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
                    <span className="text-faith-gold/30 font-black text-4xl">เนเธกเนเธกเธตเธฃเธนเธเธ เธฒเธ</span>
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
                {/* Score Section */}
                <div className="relative overflow-hidden rounded-2xl border border-faith-gold/30 bg-gradient-to-br from-faith-gold/10 via-amber-900/10 to-black/40 p-5">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-faith-gold/10 via-transparent to-transparent pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-faith-gold/20 rounded-lg">
                        <Star size={14} className="text-faith-gold fill-faith-gold" />
                      </div>
                      <span className="text-faith-gold font-black text-xs uppercase tracking-[0.2em]">เธเธฐเนเธเธเนเธเธฐเธเธณ</span>
                    </div>

                  </div>
                  <div className="flex items-end gap-3 mb-3">
                    <span className="text-5xl font-black text-white leading-none tracking-tighter">{selectedPlace.score.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm mb-1">/ 5</span>
                  </div>
                  {/* Score bar */}
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-600 via-faith-gold to-amber-300"
                      style={{ width: `${Math.min((selectedPlace.score / 5) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-faith-gold/10 rounded-xl text-faith-gold shrink-0">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">เธชเธดเนเธเธจเธฑเธเธ”เธดเนเธชเธดเธ—เธเธดเน</h3>
                      <p className="text-gray-400 leading-relaxed">{selectedPlace.sacred_object || "เนเธกเนเธฃเธฐเธเธธเธเนเธญเธกเธนเธฅ"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-faith-gold/10 rounded-xl text-faith-gold shrink-0">
                      <Heart size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">เธเธญเธเนเธซเธงเน</h3>
                      <p className="text-gray-400 leading-relaxed">{selectedPlace.offerings || "เนเธกเนเธฃเธฐเธเธธเธเนเธญเธกเธนเธฅ"}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full h-64 rounded-2xl overflow-hidden mb-4 border border-faith-gold/30">
                  <Map recommendations={[selectedPlace]} className="h-full" />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Save which place the user visited so we can show the rating modal on return
                    setRatingTargetPlace(selectedPlace);
                    setAwaitingReturn(true);
                    logActivity(selectedPlace, 'maps_open');

                    const { lat, lng, name } = selectedPlace;
                    const ua = navigator.userAgent || navigator.vendor || '';
                    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as Record<string, unknown>)['MSStream'];
                    const isAndroid = /android/i.test(ua);
                    const isMobile = isIOS || isAndroid;

                    if (isMobile) {
                      if (isIOS) {
                        // iOS: เธฅเธญเธเน€เธเธดเธ” Google Maps App เธเนเธญเธ เธ–เนเธฒเนเธกเนเธกเธตเธเน fallback เนเธ Apple Maps
                        const gmapsApp = `comgooglemaps://?q=${lat},${lng}&zoom=15`;
                        const appleMaps = `maps://maps.apple.com/?q=${encodeURIComponent(name)}&ll=${lat},${lng}`;
                        const timeout = setTimeout(() => {
                          window.location.href = appleMaps;
                        }, 1200);
                        window.location.href = gmapsApp;
                        // เธ–เนเธฒเนเธญเธเน€เธเธดเธ”เนเธ”เน เธขเธเน€เธฅเธดเธ timeout
                        window.addEventListener('pagehide', () => clearTimeout(timeout), { once: true });
                        window.addEventListener('blur', () => clearTimeout(timeout), { once: true });
                      } else {
                        // Android: เนเธเน geo: URI เธเธถเนเธ Android เธเธฐเน€เธเธดเธ” Google Maps App เนเธ”เธขเธ•เธฃเธ
                        window.location.href = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(name)})`;
                      }
                    } else {
                      // Desktop: เน€เธเธดเธ”เน€เธงเนเธ Google Maps เนเธเนเธ—เนเธเนเธซเธกเนเธ•เธฒเธกเน€เธ”เธดเธก
                      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                      window.open(mapUrl, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-faith-gold text-[#1A0404] font-black rounded-xl hover:bg-amber-400 transition-colors"
                >
                  <MapPin size={20} />
                  <span>เน€เธเธดเธ”เนเธเนเธเธเธ—เธตเน GOOGLE MAPS</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Rating Modal โ€” shows after user returns from Google Maps */}
      <AnimatePresence>
        {showRatingModal && ratingTargetPlace && (
          <RatingModal
            place={{ id: ratingTargetPlace.id, name: ratingTargetPlace.name }}
            userId={userId}
            onClose={() => setShowRatingModal(false)}
            onSubmit={() => {
              setShowRatingModal(false);
              setRatingTargetPlace(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

