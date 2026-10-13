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

  // Filtra de acordo com o período selecionado
  const filtered = transactions.slice(0, 7);

  return (
    <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft">
      {/* Top Header & FinWise Filter Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#231942]">Últimas Movimentações</h2>
          <p className="text-xs text-[#655A7C]">Transações e registros recentes</p>
        </div>

        {/* FinWise Pill Group */}
        <div className="flex bg-[#EDE5D5] p-1 rounded-full border border-[#DFD5C3] self-stretch sm:self-auto justify-between sm:justify-start">
          <button
            onClick={() => setFilterPeriod('daily')}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
              filterPeriod === 'daily'
                ? 'bg-[#6E44FF] text-white shadow-sm'
                : 'text-[#655A7C] hover:text-[#231942]'
            }`}
          >
            Diário
          </button>
          <button
            onClick={() => setFilterPeriod('weekly')}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
              filterPeriod === 'weekly'
                ? 'bg-[#6E44FF] text-white shadow-sm'
                : 'text-[#655A7C] hover:text-[#231942]'
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => setFilterPeriod('monthly')}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
              filterPeriod === 'monthly'
                ? 'bg-[#6E44FF] text-white shadow-sm'
                : 'text-[#655A7C] hover:text-[#231942]'
            }`}
          >
            Mensal
          </button>
        </div>
      </div>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <div className="py-10 text-center text-[#655A7C] bg-[#EDE5D5]/30 rounded-2xl border border-dashed border-[#DFD5C3]">
          <p className="font-bold text-[#231942] text-sm">Nenhum lançamento registrado</p>
          <p className="text-xs text-[#655A7C] mt-1">Adicione sua primeira despesa ou receita no botão "+" para começar.</p>
        </div>
      ) : (
        <div className="space-y-3">
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
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-[#EDE5D5]/40 transition-all border border-[#DFD5C3]/80 group"
            >
              {/* Left */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105"
                  style={{ backgroundColor: iconBg, color: iconColor }}
                >
                  <DynamicIcon name={sub?.iconName || pillar?.iconName || (isIncome ? 'Briefcase' : 'Tag')} className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <h4 className="font-bold text-[#231942] text-sm truncate">{tx.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-[#655A7C] mt-0.5">
                    <span>{formatDateBR(tx.dueDate)}</span>
                    <span>•</span>
                    <span className="truncate max-w-[120px]">{sub?.name || (isIncome ? 'Entrada' : 'Geral')}</span>
                  </div>
                </div>
              </div>

              {/* Right: Amount & Paid status indicator */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`font-extrabold text-sm sm:text-base ${
                    isIncome ? 'text-[#1F9D73]' : isSavings ? 'text-[#835FFF]' : 'text-[#E0533C]'
                  }`}>
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>
                  <div className="text-[10px] font-semibold">
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
      <div className="mt-4 pt-3 border-t border-[#DFD5C3] text-center">
        <button
          onClick={() => setActiveTab('transactions')}
          className="text-xs font-bold text-[#6E44FF] hover:text-[#5A32E6] inline-flex items-center gap-1 py-1 px-3 rounded-full hover:bg-[#E5DEFF]/50 transition-colors"
        >
          <span>Ver extrato completo com filtros</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default RecentTransactions;
