import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDateBR } from '../utils/formatters';
import { DynamicIcon } from './DynamicIcon';
import { Check, ArrowRight } from 'lucide-react';

export const RecentTransactions: React.FC = () => {
  const { transactions, subcategories, pillars, setActiveTab, togglePaid } = useFinance();
  const [filterPeriod, setFilterPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const getSubCategory = (id: string) => subcategories.find(s => s.id === id);
  const getPillar = (id?: string) => pillars.find(p => p.id === id);

  const filtered = transactions.slice(0, 7);

  return (
    <div className="bg-[#FCF9F2]/75 dark:bg-[#1A142D]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-white/70 dark:border-[#322653] shadow-[0_8px_30px_rgb(35,25,66,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-[#6E44FF]/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none">
      {/* Top Header & FinWise Filter Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 relative z-10">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#231942] dark:text-[#F7F2E7]">Movimentações</h2>
        </div>

        {/* FinWise Pill Group - 100% width 3 columns on mobile */}
        <div className="grid grid-cols-3 sm:flex w-full sm:w-auto bg-[#EDE5D5]/80 dark:bg-[#241C3D] backdrop-blur-sm p-1 rounded-full border border-[#DFD5C3] dark:border-[#3B2D63]">
          <button
            onClick={() => setFilterPeriod('daily')}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all text-center active:scale-95 ${
              filterPeriod === 'daily'
                ? 'bg-[#6E44FF] dark:bg-[#7C5CFF] text-white shadow-sm'
                : 'text-[#655A7C] dark:text-[#A69BB8] hover:text-[#231942] dark:hover:text-white'
            }`}
          >
            Diário
          </button>
          <button
            onClick={() => setFilterPeriod('weekly')}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all text-center active:scale-95 ${
              filterPeriod === 'weekly'
                ? 'bg-[#6E44FF] dark:bg-[#7C5CFF] text-white shadow-sm'
                : 'text-[#655A7C] dark:text-[#A69BB8] hover:text-[#231942] dark:hover:text-white'
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => setFilterPeriod('monthly')}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all text-center active:scale-95 ${
              filterPeriod === 'monthly'
                ? 'bg-[#6E44FF] dark:bg-[#7C5CFF] text-white shadow-sm'
                : 'text-[#655A7C] dark:text-[#A69BB8] hover:text-[#231942] dark:hover:text-white'
            }`}
          >
            Mensal
          </button>
        </div>
      </div>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <div className="py-10 text-center text-[#655A7C] dark:text-[#A69BB8] bg-white/50 dark:bg-[#241C3D]/60 rounded-2xl border border-dashed border-[#DFD5C3] dark:border-[#3B2D63] relative z-10">
          <p className="font-extrabold text-[#231942] dark:text-[#F7F2E7] text-sm">Nenhum lançamento registrado</p>
          <p className="text-xs text-[#655A7C] dark:text-[#A69BB8] mt-1 font-medium">Adicione sua primeira movimentação no botão "+" para começar.</p>
        </div>
      ) : (
        <div className="space-y-2.5 relative z-10">
          {filtered.map(tx => {
            const sub = getSubCategory(tx.subCategoryId);
            const pillar = getPillar(tx.pillarId);

            const isIncome = tx.type === 'income';
            const isSavings = tx.type === 'savings';

            const iconBg = isIncome ? '#E1F7EF' : isSavings ? '#ECE7FF' : pillar?.softBg || '#E5DEFF';
            const iconColor = isIncome ? '#1F9D73' : isSavings ? '#835FFF' : pillar?.color || '#6E44FF';

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/90 dark:bg-[#241C3D] backdrop-blur-sm hover:bg-white dark:hover:bg-[#2A2046] hover:border-[#6E44FF]/40 dark:hover:border-[#7C5CFF]/60 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 border border-[#DFD5C3]/80 dark:border-[#3B2D63] group active:scale-[0.99]"
              >
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105"
                    style={{ backgroundColor: iconBg, color: iconColor }}
                  >
                    <DynamicIcon name={sub?.iconName || pillar?.iconName || (isIncome ? 'Briefcase' : 'Tag')} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-extrabold text-[#231942] dark:text-[#F7F2E7] text-sm truncate tracking-tight">{tx.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-[#655A7C] dark:text-[#A69BB8] mt-0.5 font-medium">
                      <span>{formatDateBR(tx.dueDate)}</span>
                      <span>•</span>
                      <span className="truncate max-w-[120px]">{sub?.name || (isIncome ? 'Entrada' : 'Geral')}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Paid status indicator */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className={`font-extrabold text-sm sm:text-base whitespace-nowrap tracking-tight ${
                      isIncome ? 'text-[#1F9D73]' : isSavings ? 'text-[#835FFF] dark:text-[#9A7DFF]' : 'text-[#E0533C]'
                    }`}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                    <div className="text-[10px] font-bold">
                      {tx.paid ? (
                        <span className="text-[#1F9D73] flex items-center justify-end gap-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" /> Pago
                        </span>
                      ) : (
                        <span className="text-[#D97706] hover:underline cursor-pointer" onClick={() => togglePaid(tx.id)}>
                          Pendente
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View All Button */}
      <div className="mt-4 pt-3 border-t border-[#DFD5C3]/60 dark:border-[#322653] text-center relative z-10">
        <button
          onClick={() => setActiveTab('transactions')}
          className="text-xs font-bold text-[#6E44FF] dark:text-[#7C5CFF] hover:text-[#5A32E6] inline-flex items-center gap-1 py-1.5 px-3.5 rounded-full hover:bg-[#E5DEFF]/60 dark:hover:bg-[#2D2054] active:scale-95 transition-all shadow-sm"
        >
          <span>Ver extrato</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default RecentTransactions;
