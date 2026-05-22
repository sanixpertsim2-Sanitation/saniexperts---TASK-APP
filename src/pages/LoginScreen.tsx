import { LOGO } from '@/lib/images';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Building2, Shield, Droplets, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface LoginScreenProps {
  onLogin: (user: { id: string; name: string; phone: string; role: 'employee' | 'leadership' }) => void;
}

// Animated floating particles
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [phone, setPhone] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const login = useStore((s) => s.login);

  useEffect(() => { document.body.classList.add('overflow-hidden'); return () => document.body.classList.remove('overflow-hidden'); }, []);

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
    <div className="min-h-screen bg-mesh noise-overlay relative flex flex-col lg:flex-row overflow-hidden">
      <FloatingParticles />

      {/* Left Panel - Premium Branding */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-8 lg:py-0 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Glowing Logo Container */}
          <motion.div
            className="relative mb-6"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/20 rounded-3xl blur-2xl scale-125" />
            <div className="relative w-24 h-24 lg:w-32 lg:h-32 glass-card rounded-3xl flex items-center justify-center shadow-glow">
              <img src={LOGO} alt="SaniXperts" className="w-20 h-20 lg:w-28 lg:h-28 object-contain" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl lg:text-5xl font-extrabold text-gradient-primary tracking-tight"
          >
            SaniXperts
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-white/50 text-sm lg:text-base mt-3 text-center font-medium tracking-wide"
          >
            TASK MANAGEMENT SYSTEM
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-2 mt-5 text-white/40 text-xs lg:text-sm"
          >
            <Building2 size={14} className="text-primary/70" />
            <span>Give and Go IM2 — Facility</span>
          </motion.div>

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex items-center gap-4 mt-8"
          >
            {[
              { icon: Shield, label: 'Verified' },
              { icon: Droplets, label: 'Sanitation' },
              { icon: Sparkles, label: 'HACCP' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-light text-white/60 text-xs"
              >
                <item.icon size={12} className="text-primary" />
                {item.label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Right Panel - Premium Login Form */}
      <AnimatePresence mode="wait">
        <motion.div
          key={showOTP ? 'otp' : 'login'}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 lg:w-[500px]"
        >
          <div className="h-full glass rounded-t-[2rem] lg:rounded-none lg:rounded-l-[2rem] px-6 pt-8 pb-10 lg:px-10 lg:flex lg:flex-col lg:justify-center border-x-0 border-b-0 border-t border-white/5">
            {!showOTP ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Welcome Back</h2>
                <p className="text-sm text-white/40 mb-8">Sign in with your phone number</p>

                {/* Phone Input - Premium */}
                <div className="mb-5">
                  <label className="text-xs font-medium text-white/50 mb-2 block tracking-wide uppercase">Phone Number</label>
                  <div className="glass-light rounded-2xl px-4 h-14 flex items-center focus-within:ring-2 focus-within:ring-primary/30 transition-all duration-300">
                    <span className="text-white/60 font-semibold mr-3 text-sm border-r border-white/10 pr-3">+1</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(formatPhone(e.target.value)); setError(''); }}
                      placeholder="(416) 555-0100"
                      className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-white/20 font-medium"
                    />
                  </div>
                  {error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-2">{error}</motion.p>}
                </div>

                {/* Premium Send OTP Button */}
                <motion.button
                  onClick={handleSendOTP}
                  disabled={phone.replace(/\D/g, '').length !== 10}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-14 bg-gradient-primary text-white font-bold rounded-2xl shadow-button active:shadow-none transition-shadow disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-2 text-sm tracking-wide"
                >
                  Send OTP <ArrowRight size={18} />
                </motion.button>

                {/* Demo Credentials - Premium Cards */}
                <div className="mt-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-semibold">Pilot Demo — Click to Login</p>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>

                  <div className="space-y-3">
                    {/* Supervisor Card */}
                    <motion.button
                      onClick={() => handleQuickLogin('+1-416-555-0201')}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-4 glass-card rounded-2xl hover:border-primary/30 transition-all duration-300 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
                          <img src="/avatars/avatar-leader-1.jpg" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Supervisor Portal</p>
                          <p className="text-xs text-white/40">Robert Hayes — Team Leader</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                          <span className="text-[10px] text-white/30 font-mono">Online</span>
                        </div>
                      </div>
                    </motion.button>

                    {/* Employee Card */}
                    <motion.button
                      onClick={() => handleQuickLogin('+1-416-555-0101')}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-4 glass-card rounded-2xl hover:border-primary/30 transition-all duration-300 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/5 group-hover:ring-primary/30 transition-all">
                          <img src="/avatars/avatar-employee-1.jpg" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Employee Portal</p>
                          <p className="text-xs text-white/40">Raj Patel — Morning Shift</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                          <span className="text-[10px] text-white/30 font-mono">Online</span>
                        </div>
                      </div>
                    </motion.button>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-5 glass-light rounded-xl p-4 text-center"
                  >
                    <p className="text-[10px] text-white/30 leading-relaxed">
                      Additional employees: +1-416-555-0102 through 0108<br/>
                      Additional supervisors: +1-416-555-0202, 0203
                    </p>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div>
                <button onClick={() => { setShowOTP(false); setOtp(['', '', '', '', '', '']); }} className="text-sm text-primary font-medium mb-4 hover:text-primary/80">Back</button>
                <h2 className="text-2xl font-bold text-white mb-1">Enter OTP</h2>
                <p className="text-sm text-white/40 mb-8">Code sent to +1 {phone}</p>
                <div className="flex gap-3 mb-6 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-14 h-16 glass-light rounded-2xl text-center text-2xl font-bold text-white focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
