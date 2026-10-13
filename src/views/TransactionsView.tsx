import React, { useState } from 'react';
import { Search, Filter, Plus, Trash2, Check, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDateBR, getDueStatus } from '../utils/formatters';
import { DynamicIcon } from '../components/DynamicIcon';

export const TransactionsView: React.FC = () => {
  const { 
    transactions, 
    subcategories, 
    pillars, 
    togglePaid, 
    deleteTransaction, 
    setIsAddModalOpen 
  } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'savings' | 'pending'>('all');
  const [filterPillar, setFilterPillar] = useState<string>('all');

  const getSubCategory = (id: string) => subcategories.find(s => s.id === id);
  const getPillar = (id?: string) => pillars.find(p => p.id === id);

  const filteredTransactions = transactions.filter(t => {
    // Search filter
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // Type filter
    if (filterType === 'income' && t.type !== 'income') return false;
    if (filterType === 'expense' && t.type !== 'expense') return false;
    if (filterType === 'savings' && t.type !== 'savings') return false;
    if (filterType === 'pending' && (t.paid || t.type === 'income')) return false;

    // Pillar filter
    if (filterPillar !== 'all' && t.pillarId !== filterPillar) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#231942]">Extrato Completo</h2>
            <p className="text-xs text-[#655A7C]">Todos os lançamentos, cobranças agendadas e reservas</p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2.5 px-4 rounded-2xl bg-[#6E44FF] hover:bg-[#5A32E6] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo Lançamento</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#655A7C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por descrição ou anotação..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-xs font-semibold text-[#231942] focus:outline-none focus:ring-2 focus:ring-[#6E44FF]"
            />
          </div>

          {/* Pillar Selector */}
          <select
            value={filterPillar}
            onChange={e => setFilterPillar(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-xs font-bold text-[#231942] focus:outline-none focus:ring-2 focus:ring-[#6E44FF]"
          >
            <option value="all">Todos os Pilares</option>
            {pillars.map(p => (
              <option key={p.id} value={p.id}>{p.shortName}</option>
            ))}
          </select>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pending', label: 'A Vencer (Pendentes)' },
            { id: 'expense', label: 'Saídas' },
            { id: 'income', label: 'Entradas' },
            { id: 'savings', label: 'Reserva & Guardar' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilterType(btn.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === btn.id
                  ? 'bg-[#231942] text-white shadow-sm'
                  : 'bg-[#EDE5D5] text-[#655A7C] hover:text-[#231942]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-[#655A7C]">
            Exibindo {filteredTransactions.length} lançamentos
          </span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-[#655A7C] bg-[#EDE5D5]/40 rounded-2xl border border-dashed border-[#DFD5C3]">
            Nenhuma transação encontrada com os filtros selecionados.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map(tx => {
              const sub = getSubCategory(tx.subCategoryId);
              const pillar = getPillar(tx.pillarId);
              const isIncome = tx.type === 'income';
              const isSavings = tx.type === 'savings';
              const due = getDueStatus(tx.dueDate, tx.paid);

              return (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#EDE5D5]/40 border border-[#DFD5C3] gap-3 transition-all"
                >
                  {/* Left: Icon & Title */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{
                        backgroundColor: isIncome ? '#E1F7EF' : isSavings ? '#ECE7FF' : pillar?.softBg || '#E5DEFF',
                        color: isIncome ? '#1F9D73' : isSavings ? '#835FFF' : pillar?.color || '#6E44FF',
                      }}
                    >
                      <DynamicIcon name={sub?.iconName || pillar?.iconName || (isIncome ? 'Briefcase' : 'Tag')} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-[#231942] text-sm truncate">{tx.title}</h4>
                        {tx.recurrence === 'installment' && tx.currentInstallment && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5DEFF] text-[#6E44FF]">
                            {tx.currentInstallment}/{tx.totalInstallments}
                          </span>
                        )}
                        {tx.recurrence === 'fixed_monthly' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE5D5] text-[#655A7C]">
                            Fixo Mensal
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#655A7C] mt-0.5 flex-wrap">
                        <span>{sub?.name || (isIncome ? 'Entrada' : pillar?.shortName)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateBR(tx.dueDate)}
                        </span>
                        {tx.notes && (
                          <>
                            <span>•</span>
                            <span className="italic truncate max-w-[150px]">{tx.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Due status, Amount and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DFD5C3]">
                    {!isIncome && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${due.bg} ${due.color}`}>
                        {due.text}
                      </span>
                    )}

                    <div className="text-right">
                      <div className={`font-extrabold text-sm sm:text-base ${
                        isIncome ? 'text-[#1F9D73]' : isSavings ? 'text-[#835FFF]' : 'text-[#E0533C]'
                      }`}>
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isIncome && (
                        <button
                          onClick={() => togglePaid(tx.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                            tx.paid
                              ? 'bg-[#E1F7EF] text-[#1F9D73]'
                              : 'bg-[#1F9D73] text-white hover:bg-[#18805D] shadow-sm'
                          }`}
                          title={tx.paid ? 'Marcar como não pago' : 'Dar baixa / Pago'}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>{tx.paid ? 'Pago' : 'Pagar'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Remover lançamento "${tx.title}"?`)) {
                            deleteTransaction(tx.id);
                          }
                        }}
                        className="p-1.5 rounded-xl text-[#655A7C] hover:text-[#E0533C] hover:bg-[#FDE8E5] transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsView;
