import React from 'react';
import { Home, PieChart, Plus, Layers, Receipt } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface BottomNavProps {
  isInsideMockup?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ isInsideMockup = false }) => {
  const { activeTab, setActiveTab, setIsAddModalOpen } = useFinance();

  return (
    <div className={`${isInsideMockup ? 'absolute' : 'fixed'} bottom-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none`}>
      <nav className="pointer-events-auto bg-[#EDE5D5]/90 backdrop-blur-xl border border-[#DFD5C3] rounded-full px-4 py-2.5 shadow-2xl flex items-center justify-between gap-1 sm:gap-4 max-w-md w-full">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
            activeTab === 'home'
              ? 'bg-[#6E44FF] text-white shadow-md scale-105'
              : 'text-[#655A7C] hover:text-[#231942] hover:bg-black/5'
          }`}
          title="Início"
        >
          <Home className="w-5 h-5" />
        </button>

        {/* Analysis */}
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
            activeTab === 'analysis'
              ? 'bg-[#6E44FF] text-white shadow-md scale-105'
              : 'text-[#655A7C] hover:text-[#231942] hover:bg-black/5'
          }`}
          title="Análise & Gráficos"
        >
          <PieChart className="w-5 h-5" />
        </button>

        {/* Center Floating Action Button (+) */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="relative -top-4 w-14 h-14 rounded-full bg-[#6E44FF] hover:bg-[#5A32E6] text-white flex items-center justify-center shadow-lg hover:shadow-[#6E44FF]/40 border-4 border-[#F7F2E7] active:scale-95 transition-all"
          title="Adicionar Lançamento"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Categories (5 Pilares) */}
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
            activeTab === 'categories'
              ? 'bg-[#6E44FF] text-white shadow-md scale-105'
              : 'text-[#655A7C] hover:text-[#231942] hover:bg-black/5'
          }`}
          title="5 Pilares Macro"
        >
          <Layers className="w-5 h-5" />
        </button>

        {/* Transactions / Extrato */}
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
            activeTab === 'transactions'
              ? 'bg-[#6E44FF] text-white shadow-md scale-105'
              : 'text-[#655A7C] hover:text-[#231942] hover:bg-black/5'
          }`}
          title="Extrato Completo"
        >
          <Receipt className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
};

export default BottomNav;
