import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Check, Calendar, ArrowUpRight, ArrowDownRight, Wallet, Layers } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDateBR, getDueStatus } from '../utils/formatters';
import { DynamicIcon } from '../components/DynamicIcon';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

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
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>('all'); // 'all' ou 'YYYY-MM'

  const getSubCategory = (id: string) => subcategories.find(s => s.id === id);
  const getPillar = (id?: string) => pillars.find(p => p.id === id);

  // Extrai lista ordenada de todos os meses com transações (e inclui o mês atual se vazio)
  const availableMonths = useMemo(() => {
    const keys = new Set<string>();
    
    // Mês atual como fallback garantido
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    keys.add(currentKey);

    transactions.forEach(t => {
      const date = t.dueDate || t.createdAt;
      if (date) {
        const [y, m] = date.split('-');
        if (y && m) keys.add(`${y}-${m}`);
      }
    });

    return Array.from(keys).sort().reverse().map(key => {
      const [yStr, mStr] = key.split('-');
      const mIdx = parseInt(mStr, 10) - 1;
      return {
        key,
        label: `${MONTH_NAMES[mIdx]} ${yStr}`,
        year: parseInt(yStr, 10),
        month: mIdx,
      };
    });
  }, [transactions]);

  // Transações filtradas
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Filtro de Busca
      const matchesSearch = 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Filtro de Mês
      if (selectedMonthKey !== 'all') {
        const date = t.dueDate || t.createdAt;
        if (!date || !date.startsWith(selectedMonthKey)) return false;
      }

      // Filtro de Tipo
      if (filterType === 'income' && t.type !== 'income') return false;
      if (filterType === 'expense' && t.type !== 'expense') return false;
      if (filterType === 'savings' && t.type !== 'savings') return false;
      if (filterType === 'pending' && (t.paid || t.type === 'income')) return false;

      // Filtro de Pilar
      if (filterPillar !== 'all' && t.pillarId !== filterPillar) return false;

      return true;
    });
  }, [transactions, searchTerm, selectedMonthKey, filterType, filterPillar]);

  // Agrupamento de lançamentos por mês
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, typeof transactions> = {};

    filteredTransactions.forEach(t => {
      const date = t.dueDate || t.createdAt || 'Outros';
      const [y, m] = date.split('-');
      const key = (y && m) ? `${y}-${m}` : 'Outros';
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });

    // Ordena chaves de mês mais recente para mais antigo
    const sortedKeys = Object.keys(groups).sort().reverse();
    return sortedKeys.map(key => {
      const items = groups[key];
      let label = key;
      if (key !== 'Outros') {
        const [yStr, mStr] = key.split('-');
        const mIdx = parseInt(mStr, 10) - 1;
        label = `${MONTH_NAMES[mIdx]} de ${yStr}`;
      }

      const monthIncome = items
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthExpense = items
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthSavings = items
        .filter(t => t.type === 'savings')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthBalance = monthIncome - monthExpense - monthSavings;

      return {
        key,
        label,
        items,
        monthIncome,
        monthExpense,
        monthSavings,
        monthBalance,
      };
    });
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#231942]">Extrato Completo</h2>
            <p className="text-xs text-[#655A7C]">Navegue e filtre lançamentos organizados por mês</p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2.5 px-4 rounded-2xl bg-[#6E44FF] hover:bg-[#5A32E6] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo Lançamento</span>
          </button>
        </div>

        {/* Barra Seletora de Mês/Ano (Item 4) */}
        <div className="pt-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedMonthKey('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedMonthKey === 'all'
                  ? 'bg-[#6E44FF] text-white shadow-md'
                  : 'bg-[#EDE5D5] text-[#655A7C] hover:text-[#231942] hover:bg-[#DFD5C3]'
              }`}
            >
              Todos os Meses
            </button>
            {availableMonths.map(m => (
              <button
                key={m.key}
                onClick={() => setSelectedMonthKey(m.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  selectedMonthKey === m.key
                    ? 'bg-[#6E44FF] text-white shadow-md'
                    : 'bg-[#EDE5D5] text-[#655A7C] hover:text-[#231942] hover:bg-[#DFD5C3]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Pillar Selector */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
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

      {/* Lista Agrupada por Mês com Cabeçalhos Mensais (Item 4) */}
      {groupedByMonth.length === 0 ? (
        <div className="bg-[#FCF9F2] p-12 rounded-[28px] border border-[#DFD5C3] text-center shadow-soft">
          <div className="w-14 h-14 rounded-full bg-[#E5DEFF] text-[#6E44FF] flex items-center justify-center mx-auto mb-3">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#231942]">Nenhum lançamento registrado</h3>
          <p className="text-xs text-[#655A7C] max-w-sm mx-auto mt-1 mb-5">
            Seu extrato está limpo. Comece adicionando suas receitas ou contas para organizar sua carteira.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2.5 px-5 rounded-2xl bg-[#6E44FF] hover:bg-[#5A32E6] text-white text-xs font-bold shadow-md inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Adicionar Primeiro Lançamento</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByMonth.map(group => (
            <div
              key={group.key}
              className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft space-y-4"
            >
              {/* Cabeçalho Mensal com Resumo Financeiro do Mês */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#DFD5C3]">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#231942] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#6E44FF]" />
                    <span>{group.label}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EDE5D5] text-[#655A7C]">
                      {group.items.length} itens
                    </span>
                  </h3>
                </div>

                {/* Resumo do Mês: Entradas, Saídas e Saldo */}
                <div className="flex items-center gap-3 text-xs font-bold flex-wrap">
                  <div className="flex items-center gap-1 text-[#1F9D73] bg-[#E1F7EF] px-2.5 py-1 rounded-xl">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+{formatCurrency(group.monthIncome)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#E0533C] bg-[#FDE8E5] px-2.5 py-1 rounded-xl">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>-{formatCurrency(group.monthExpense)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#6E44FF] bg-[#E5DEFF] px-2.5 py-1 rounded-xl">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Saldo: {formatCurrency(group.monthBalance)}</span>
                  </div>
                </div>
              </div>

              {/* Lançamentos do Mês */}
              <div className="space-y-2.5">
                {group.items.map(tx => {
                  const sub = getSubCategory(tx.subCategoryId);
                  const pillar = getPillar(tx.pillarId);
                  const isIncome = tx.type === 'income';
                  const isSavings = tx.type === 'savings';
                  const due = getDueStatus(tx.dueDate, tx.paid);

                  return (
                    <div
                      key={tx.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-[#EDE5D5]/40 border border-[#DFD5C3] gap-3 transition-all"
                    >
                      {/* Left: Icon & Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
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
                                Fixo
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
                                <span className="italic truncate max-w-[140px]">{tx.notes}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Amounts & Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DFD5C3]">
                        {!isIncome && (
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${due.bg} ${due.color}`}>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsView;
