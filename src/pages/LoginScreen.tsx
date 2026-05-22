import { LOGO } from '@/lib/images';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Building2 } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface LoginScreenProps {
  onLogin: (user: { id: string; name: string; phone: string; role: 'employee' | 'leadership' }) => void;
}

/* ===== CINEMATIC 3D FLOATING ORBS ===== */
function CinematicOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large gold orb - slow float */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.03) 40%, transparent 70%)',
          left: '-10%',
          top: '10%',
          animation: 'orb-float-1 20s ease-in-out infinite',
          filter: 'blur(40px)',
        }}
      />
      {/* Medium blue-gold orb */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(59,130,246,0.04) 50%, transparent 70%)',
          right: '-5%',
          top: '50%',
          animation: 'orb-float-2 15s ease-in-out infinite',
          filter: 'blur(50px)',
        }}
      />
      {/* Small accent orb */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(244,208,63,0.1) 0%, transparent 60%)',
          left: '40%',
          bottom: '10%',
          animation: 'orb-float-3 18s ease-in-out infinite',
          filter: 'blur(30px)',
        }}
      />
      {/* Grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [phone, setPhone] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const login = useStore((s) => s.login);

  const formatPhone = (input: string) => {
    const cleaned = input.replace(/\D/g, '').slice(0, 10);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  };

  const handleSendOTP = () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) { setError('Enter a valid 10-digit phone number'); return; }
    setError(''); setShowOTP(true);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp]; newOtp[index] = value; setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    if (newOtp.every((d) => d !== '')) setTimeout(() => handleVerify(newOtp.join('')), 300);
  };

  const handleVerify = (_code: string) => {
    const user = login('+1-416-555-0101');
    if (user) onLogin(user);
  };

  const handleQuickLogin = (demoPhone: string) => {
    const user = login(demoPhone);
    if (user) onLogin(user);
  };

  return (
    <div className="min-h-screen bg-cinematic relative overflow-hidden">
      <CinematicOrbs />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* ===== LEFT: CINEMATIC 3D BRANDING ===== */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center"
          >
            {/* 3D Logo with cinematic glow */}
            <motion.div
              className="relative mb-8"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ perspective: 1000 }}
            >
              <div className="absolute inset-0 bg-gold-gradient rounded-3xl blur-3xl opacity-30 scale-150" />
              <motion.div
                className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-3xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg, rgba(17,24,39,0.9), rgba(6,9,18,0.95))',
                  border: '1px solid rgba(212,175,55,0.15)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
                  transformStyle: 'preserve-3d',
                }}
                whileHover={{ rotateY: 10, rotateX: -5, scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <img src={LOGO} alt="OmniTask" className="w-20 h-20 lg:w-28 lg:h-28 object-contain" style={{ transform: 'translateZ(20px)' }} />
              </motion.div>
            </motion.div>

            {/* Brand name with gold gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-display text-4xl lg:text-6xl font-bold text-gold-gradient tracking-tight"
            >
              OmniTask
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-white/30 text-xs lg:text-sm mt-3 tracking-[0.3em] uppercase font-medium"
            >
              Precision Operations
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 mt-5 text-white/20 text-xs"
            >
              <Building2 size={13} />
              <span>Give and Go IM2 — Facility</span>
            </motion.div>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent mt-6"
            />
          </motion.div>
        </div>

        {/* ===== RIGHT: CINEMATIC LOGIN PANEL ===== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={showOTP ? 'otp' : 'login'}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="lg:w-[480px] relative z-10"
          >
            <div
              className="h-full rounded-t-[2rem] lg:rounded-none lg:rounded-l-[2rem] px-6 pt-8 pb-10 lg:px-10 lg:flex lg:flex-col lg:justify-center"
              style={{
                background: 'rgba(6, 9, 18, 0.7)',
                backdropFilter: 'blur(40px) saturate(150%)',
                WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                borderTop: '1px solid rgba(212,175,55,0.06)',
                borderLeft: '1px solid rgba(212,175,55,0.04)',
                boxShadow: '-20px 0 60px rgba(0,0,0,0.3)',
              }}
            >
              {!showOTP ? (
                <div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <h2 className="font-display text-2xl font-bold text-white mb-1">Welcome Back</h2>
                    <p className="text-sm text-white/30 mb-8">Sign in with your phone number</p>
                  </motion.div>

                  {/* Phone Input - Cinematic */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-5">
                    <label className="text-[10px] font-semibold text-white/30 mb-2 block tracking-[0.2em] uppercase">Phone Number</label>
                    <div
                      className="rounded-2xl px-4 h-14 flex items-center transition-all duration-300 focus-within:shadow-gold-sm"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <span className="text-gold-500 font-bold mr-3 text-sm border-r border-white/10 pr-3">+1</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => { setPhone(formatPhone(e.target.value)); setError(''); }}
                        placeholder="(416) 555-0100"
                        className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-white/15 font-medium"
                      />
                    </div>
                    {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 mt-2">{error}</motion.p>}
                  </motion.div>

                  {/* Cinematic Gold Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    onClick={handleSendOTP}
                    disabled={phone.replace(/\D/g, '').length !== 10}
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-14 bg-gold-gradient text-navy-900 font-bold rounded-2xl shadow-button disabled:opacity-30 disabled:shadow-none flex items-center justify-center gap-2 text-sm tracking-wide transition-all"
                  >
                    Send OTP <ArrowRight size={18} />
                  </motion.button>

                  {/* Demo Cards - Cinematic 3D */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
                      <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-semibold">Pilot Access</p>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
                    </div>

                    <div className="space-y-3">
                      {/* Supervisor - 3D Card */}
                      <motion.button
                        onClick={() => handleQuickLogin('+1-416-555-0201')}
                        whileHover={{ scale: 1.02, y: -3, rotateX: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 rounded-2xl text-left transition-all duration-300 group"
                        style={{
                          background: 'linear-gradient(145deg, rgba(212,175,55,0.06), rgba(17,24,39,0.5))',
                          border: '1px solid rgba(212,175,55,0.1)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-gold-500/20 group-hover:ring-gold-500/50 transition-all">
                            <img src="/avatars/avatar-leader-1.jpg" alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white group-hover:text-gold-light transition-colors">Supervisor Portal</p>
                            <p className="text-xs text-white/30">Robert Hayes — Team Leader</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-white/20">Active</span>
                          </div>
                        </div>
                      </motion.button>

                      {/* Employee - 3D Card */}
                      <motion.button
                        onClick={() => handleQuickLogin('+1-416-555-0101')}
                        whileHover={{ scale: 1.02, y: -3, rotateX: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 rounded-2xl text-left transition-all duration-300 group"
                        style={{
                          background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(17,24,39,0.3))',
                          border: '1px solid rgba(255,255,255,0.05)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/5 group-hover:ring-gold-500/30 transition-all">
                            <img src="/avatars/avatar-employee-1.jpg" alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white group-hover:text-gold-light transition-colors">Employee Portal</p>
                            <p className="text-xs text-white/30">Raj Patel — Morning Shift</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-white/20">Active</span>
                          </div>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div>
                  <button onClick={() => { setShowOTP(false); setOtp(['', '', '', '', '', '']); }} className="text-sm text-gold-500 font-medium mb-4 hover:text-gold-light">Back</button>
                  <h2 className="font-display text-2xl font-bold text-white mb-1">Enter OTP</h2>
                  <p className="text-sm text-white/30 mb-8">Code sent to +1 {phone}</p>
                  <div className="flex gap-3 mb-6 justify-center">
                    {otp.map((digit, i) => (
                      <input
                        key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        className="w-14 h-16 rounded-2xl text-center text-2xl font-bold text-white focus:shadow-gold-sm outline-none transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CSS for orb animations */}
      <style>{`
        @keyframes orb-float-1 { 0%,100%{transform:translate(0,0)scale(1);opacity:.4} 33%{transform:translate(30px,-40px)scale(1.1);opacity:.6} 66%{transform:translate(-20px,-60px)scale(.9);opacity:.3} }
        @keyframes orb-float-2 { 0%,100%{transform:translate(0,0)scale(1);opacity:.3} 33%{transform:translate(-40px,30px)scale(1.2);opacity:.5} 66%{transform:translate(30px,20px)scale(.8);opacity:.2} }
        @keyframes orb-float-3 { 0%,100%{transform:translate(0,0)scale(1);opacity:.2} 50%{transform:translate(50px,-30px)scale(1.3);opacity:.4} }
      `}</style>
    </div>
  );
}
