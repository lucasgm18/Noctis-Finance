import React from 'react';
import { Home, PieChart, Plus, Layers, Receipt } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface BottomNavProps {
  isInsideMockup?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ isInsideMockup = false }) => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsAddModalOpen,
  } = useFinance();

  return (
    <div className={`${isInsideMockup ? 'absolute' : 'fixed'} bottom-4 left-0 right-0 z-40 px-3 flex justify-center pointer-events-none`}>
      <nav className="pointer-events-auto bg-[#F7F2E7]/85 dark:bg-[#1A142D]/90 backdrop-blur-2xl border border-white/70 dark:border-[#322653] rounded-full px-2 py-1.5 shadow-[0_12px_40px_rgba(35,25,66,0.14)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.55)] grid grid-cols-5 items-center max-w-sm w-full transition-colors duration-300">
        {/* 1. Início */}
        <div className="flex justify-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-full transition-all duration-200 active:scale-90 ${
              activeTab === 'home'
                ? 'bg-[#6E44FF] dark:bg-[#7C5CFF] text-white shadow-md scale-105'
                : 'text-[#655A7C] dark:text-[#A69BB8] hover:text-[#231942] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="Início"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Análise */}
        <div className="flex justify-center">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-full transition-all duration-200 active:scale-90 ${
              activeTab === 'analysis'
                ? 'bg-[#6E44FF] dark:bg-[#7C5CFF] text-white shadow-md scale-105'
                : 'text-[#655A7C] dark:text-[#A69BB8] hover:text-[#231942] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="Análise"
          >
            <PieChart className="w-5 h-5" />
          </button>
        </div>

        {/* 3. Centro Exato: Botão (+) Novo Lançamento */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="relative -top-3 w-12 h-12 rounded-full bg-[#6E44FF] hover:bg-[#5A32E6] dark:bg-[#7C5CFF] dark:hover:bg-[#6E44FF] text-white flex items-center justify-center shadow-lg hover:shadow-[#6E44FF]/40 border-4 border-[#F7F2E7] dark:border-[#0F0B1A] active:scale-90 transition-all duration-200"
            title="Novo Lançamento"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. Categorias */}
        <div className="flex justify-center">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-full transition-all duration-200 active:scale-90 ${
              activeTab === 'categories'
                ? 'bg-[#6E44FF] dark:bg-[#7C5CFF] text-white shadow-md scale-105'
                : 'text-[#655A7C] dark:text-[#A69BB8] hover:text-[#231942] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="Categorias"
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>

        {/* 5. Extrato */}
        <div className="flex justify-center">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-full transition-all duration-200 active:scale-90 ${
              activeTab === 'transactions'
                ? 'bg-[#6E44FF] dark:bg-[#7C5CFF] text-white shadow-md scale-105'
                : 'text-[#655A7C] dark:text-[#A69BB8] hover:text-[#231942] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="Extrato"
          >
            <Receipt className="w-5 h-5" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;
