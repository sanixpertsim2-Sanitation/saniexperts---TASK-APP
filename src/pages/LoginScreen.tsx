import { LOGO } from '@/lib/images';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2 } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface LoginScreenProps {
  onLogin: (user: { id: string; name: string; phone: string; role: 'employee' | 'leadership' }) => void;
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
    <div className="min-h-screen bg-primary flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-8 lg:py-0">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
          <div className="w-20 h-20 lg:w-28 lg:h-28 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
            <img src={LOGO} alt="SaniXperts" className="w-16 h-16 lg:w-24 lg:h-24 object-contain" />
          </div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white text-2xl lg:text-4xl font-bold">
            SaniXperts
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.2 }} className="text-white/70 text-sm lg:text-base mt-2 text-center">
            Task Management System
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.3 }} className="flex items-center gap-2 mt-4 text-white/60 text-xs lg:text-sm">
            <Building2 size={14} />
            <span>Give and Go IM2 — Facility</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Panel - Login Form */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-t-3xl lg:rounded-none lg:rounded-l-3xl px-6 pt-8 pb-10 lg:w-[480px] lg:flex lg:flex-col lg:justify-center lg:px-10"
      >
        {!showOTP ? (
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-1">Welcome Back</h2>
            <p className="text-sm text-slate-500 mb-6">Sign in with your phone number</p>

            <div className="mb-4">
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Phone Number</label>
              <div className="flex items-center h-12 border border-slate-200 rounded-xl px-3 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="text-slate-700 font-medium mr-2 text-sm">+1</span>
                <input type="tel" value={phone} onChange={(e) => { setPhone(formatPhone(e.target.value)); setError(''); }}
                  placeholder="(416) 555-0100" className="flex-1 text-sm outline-none text-slate-800 placeholder:text-slate-400" />
              </div>
              {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
            </div>

            <button onClick={handleSendOTP} disabled={phone.replace(/\D/g, '').length !== 10}
              className="w-full h-12 bg-primary text-white font-semibold rounded-xl shadow-button active:scale-[0.97] transition-transform disabled:opacity-50 flex items-center justify-center gap-2">
              Send OTP <ArrowRight size={18} />
            </button>

            {/* Demo Credentials - Prominent Section */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-[11px] text-slate-400 text-center mb-4 uppercase tracking-wider font-semibold">Pilot Demo — Click to Login</p>

              <div className="space-y-3">
                <button onClick={() => handleQuickLogin('+1-416-555-0201')}
                  className="w-full p-4 border-2 border-primary/30 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <img src="/avatars/avatar-leader-1.jpg" alt="" className="w-8 h-8 rounded-lg object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">Supervisor Portal</p>
                      <p className="text-xs text-slate-500">Robert Hayes — Team Leader</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">+1-416-555-0201</p>
                    </div>
                  </div>
                </button>

                <button onClick={() => handleQuickLogin('+1-416-555-0101')}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <img src="/avatars/avatar-employee-1.jpg" alt="" className="w-8 h-8 rounded-lg object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">Employee Portal</p>
                      <p className="text-xs text-slate-500">Raj Patel — Morning Shift</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">+1-416-555-0101</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-4 bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 text-center">
                  Additional employees: +1-416-555-0102 through 0108<br/>
                  Additional supervisors: +1-416-555-0202, 0203
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => { setShowOTP(false); setOtp(['', '', '', '', '', '']); }} className="text-sm text-primary font-medium mb-4">Back</button>
            <h2 className="text-xl font-semibold text-slate-800 mb-1">Enter OTP</h2>
            <p className="text-sm text-slate-500 mb-6">Code sent to +1 {phone}</p>
            <div className="flex gap-2 mb-6 justify-center">
              {otp.map((digit, i) => (
                <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-12 h-14 border border-slate-200 rounded-xl text-center text-xl font-semibold text-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
