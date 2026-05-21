import { LOGO } from '@/lib/images';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  setTimeout(onComplete, 1800);

  return (
    <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center z-[100]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
          <img src={LOGO} alt="SaniXperts" className="w-20 h-20 object-contain" />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-white text-3xl font-bold tracking-tight"
        >
          SaniXperts
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-white/70 text-sm mt-2 text-center px-6"
        >
          Task Management System<br/>Give and Go IM2 — Facility
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-12"
      >
        <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      </motion.div>
    </div>
  );
}
