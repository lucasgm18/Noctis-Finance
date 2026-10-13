import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, ShieldCheck, ArrowRight, Laptop } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { NoctisLogo } from './NoctisLogo';

export const SecurityFingerprint: React.FC = () => {
  const { authenticateBiometrics, unlockApp } = useFinance();
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Toque no sensor biométrico ou clique abaixo');

  const handleScan = async () => {
    setIsScanning(true);
    setStatusMessage('Autenticando biometria...');
    
    // Simula verificação e chama API real se disponível
    setTimeout(async () => {
      await authenticateBiometrics();
      setIsScanning(false);
    }, 900);
  };

  const handleBypass = () => {
    unlockApp();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#6E44FF] dark:bg-[#0F0B1A] text-[#F7F2E7] p-6 selection:bg-[#E5DEFF] selection:text-[#6E44FF] transition-colors duration-300">
      {/* Top Header */}
      <div className="w-full max-w-md pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <NoctisLogo className="w-10 h-10 shadow-lg rounded-2xl" />
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">Noctis</h1>
            <p className="text-xs text-[#E5DEFF] dark:text-[#A69BB8] font-bold">Guardião Financeiro</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-xs text-[#E5DEFF] dark:text-[#A69BB8]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1F9D73]" />
          <span>Protegido</span>
        </div>
      </div>

      {/* Center Biometrics Card */}
      <div className="w-full max-w-sm flex flex-col items-center text-center my-auto">
        <div className="relative flex items-center justify-center w-52 h-52 mb-8">
          {/* Animated Pulsing Rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#E5DEFF]/20 dark:border-[#7C5CFF]/20"
            animate={isScanning ? { scale: [1, 1.35, 1], opacity: [0.3, 0.8, 0.3] } : { scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border border-[#835FFF]/40 dark:border-[#7C5CFF]/40"
            animate={isScanning ? { scale: [1, 1.25, 1], opacity: [0.4, 0.9, 0.4] } : { scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />

          {/* Central Button */}
          <motion.button
            onClick={handleScan}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl ${
              isScanning
                ? 'bg-[#1F9D73] shadow-[#1F9D73]/50 scale-105'
                : 'bg-gradient-to-br from-[#835FFF] to-[#5A32E6] dark:from-[#7C5CFF] dark:to-[#4C28D4] hover:from-[#9270FF] hover:to-[#6E44FF] shadow-purple-950/40 border border-white/20'
            }`}
          >
            <Fingerprint className={`w-16 h-16 transition-colors duration-300 ${isScanning ? 'text-white animate-pulse' : 'text-[#E5DEFF]'}`} />
          </motion.button>
        </div>

        <h2 className="text-2xl font-black text-white mb-2">Desbloqueio Biométrico</h2>
        <p className="text-sm font-semibold text-[#E5DEFF] dark:text-[#A69BB8] max-w-xs leading-relaxed mb-8">
          {statusMessage}
        </p>

        {/* Primary Action Button */}
        <motion.button
          onClick={handleScan}
          disabled={isScanning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 px-6 rounded-2xl bg-[#FCF9F2] text-[#231942] dark:bg-[#7C5CFF] dark:text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 hover:bg-[#EDE5D5] dark:hover:bg-[#6E44FF] transition-all"
        >
          <Fingerprint className="w-5 h-5 text-[#6E44FF] dark:text-white" />
          <span>{isScanning ? 'Lendo Digital...' : 'Desbloquear com Digital'}</span>
        </motion.button>

        {/* Desktop / Quick Fallback Button */}
        <button
          onClick={handleBypass}
          className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#E5DEFF] dark:text-[#A69BB8] hover:text-white transition-colors py-2 px-4 rounded-xl hover:bg-white/10"
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Acesso direto (Entrar no PC)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Footer info */}
      <div className="w-full max-w-md pb-4 text-center">
        <p className="text-xs font-semibold text-[#E5DEFF]/70 dark:text-[#A69BB8]/70">
          Noctis Safe Vault • Criptografia & Armazenamento Seguro
        </p>
      </div>
    </div>
  );
};

export default SecurityFingerprint;
