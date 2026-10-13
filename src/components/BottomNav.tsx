import React from 'react';
import { Home, PieChart, Plus, Layers, Receipt, Sliders } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface BottomNavProps {
  isInsideMockup?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ isInsideMockup = false }) => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsAddModalOpen,
    unreadNotificationsCount
  } = useFinance();

  return (
    <div className={`${isInsideMockup ? 'absolute' : 'fixed'} bottom-4 left-0 right-0 z-40 px-3 flex justify-center pointer-events-none`}>
      <nav className="pointer-events-auto bg-[#F7F2E7]/80 backdrop-blur-2xl border border-white/70 rounded-full px-3 py-2 shadow-[0_12px_40px_rgba(35,25,66,0.14)] flex items-center justify-between gap-1 max-w-sm w-full">
        {/* 1. Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 active:scale-90 ${
            activeTab === 'home'
              ? 'bg-[#6E44FF] text-white shadow-md scale-105'
              : 'text-[#655A7C] hover:text-[#231942] hover:bg-black/5'
          }`}
          title="Início & Resumo"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 2. Analysis */}
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 active:scale-90 ${
            activeTab === 'analysis'
              ? 'bg-[#6E44FF] text-white shadow-md scale-105'
              : 'text-[#655A7C] hover:text-[#231942] hover:bg-black/5'
          }`}
          title="Análise & Gráficos"
        >
          <PieChart className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 3. Center Floating Action Button (+) */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="relative -top-3 w-12 h-12 rounded-full bg-[#6E44FF] hover:bg-[#5A32E6] text-white flex items-center justify-center shadow-lg hover:shadow-[#6E44FF]/40 border-4 border-[#F7F2E7] active:scale-90 transition-all duration-200"
          title="Novo Lançamento"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* 4. Categories (5 Pilares) */}
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 active:scale-90 ${
            activeTab === 'categories'
              ? 'bg-[#6E44FF] text-white shadow-md scale-105'
              : 'text-[#655A7C] hover:text-[#231942] hover:bg-black/5'
          }`}
          title="5 Pilares Macro"
        >
          <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 5. Transactions / Extrato */}
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 active:scale-90 ${
            activeTab === 'transactions'
              ? 'bg-[#6E44FF] text-white shadow-md scale-105'
              : 'text-[#655A7C] hover:text-[#231942] hover:bg-black/5'
          }`}
          title="Extrato Completo"
        >
          <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 6. Settings / Ajustes (Item 2.3) */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 active:scale-90 relative ${
            activeTab === 'settings'
              ? 'bg-[#6E44FF] text-white shadow-md scale-105'
              : 'text-[#655A7C] hover:text-[#231942] hover:bg-black/5'
          }`}
          title="Alertas & Ajustes"
        >
          <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#E0533C] absolute top-1.5 right-1.5" />
          )}
        </button>
      </nav>
    </div>
  );
};

export default BottomNav;
