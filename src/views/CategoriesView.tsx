import React, { useState } from 'react';
import { Plus, Trash2, Filter, Layers, DollarSign } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { MacroPillarId } from '../types/finance';
import { formatCurrency, formatDateBR } from '../utils/formatters';
import { DynamicIcon } from '../components/DynamicIcon';

export const CategoriesView: React.FC = () => {
  const { 
    pillars, 
    subcategories, 
    transactions, 
    pillarExpenses, 
    pillarBudgets,
    addSubCategory,
    deleteSubCategory,
    togglePaid,
    setIsAddModalOpen,
    deviceViewMode
  } = useFinance();

  const isMobile = deviceViewMode === 'mobile-mockup';

  const [selectedPillarId, setSelectedPillarId] = useState<MacroPillarId>('fixed');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);

  // Modal de Nova Subcategoria
  const [isNewSubModalOpen, setIsNewSubModalOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubBudget, setNewSubBudget] = useState('500');
  const [newSubIcon, setNewSubIcon] = useState('Tag');
  const [targetPillarForNew, setTargetPillarForNew] = useState<MacroPillarId>('fixed');

  const selectedPillar = pillars.find(p => p.id === selectedPillarId) || pillars[0];
  const currentSubcategories = subcategories.filter(s => s.pillarId === selectedPillarId);

  // Gastos por subcategoria no pilar selecionado
  const subCategorySpentMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.subCategoryId && t.pillarId === selectedPillarId) {
        map[t.subCategoryId] = (map[t.subCategoryId] || 0) + t.amount;
      }
    });
    return map;
  }, [transactions, selectedPillarId]);

  // Lançamentos filtrados pelo pilar e subcategoria
  const filteredTransactions = transactions.filter(t => {
    if (selectedSubCategoryId) {
      return t.subCategoryId === selectedSubCategoryId;
    }
    return t.pillarId === selectedPillarId;
  });

  const handleCreateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    await addSubCategory({
      name: newSubName.trim(),
      pillarId: targetPillarForNew,
      iconName: newSubIcon,
      monthlyBudget: parseFloat(newSubBudget) || 500,
    });

    setIsNewSubModalOpen(false);
    setNewSubName('');
    setNewSubBudget('500');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FCF9F2]/75 dark:bg-[#1A142D]/80 backdrop-blur-xl p-5 rounded-[28px] border border-white/70 dark:border-[#322653] shadow-[0_8px_30px_rgb(35,25,66,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300">
        <div>
          <h2 className="text-xl font-black tracking-tight text-[#231942] dark:text-[#F7F2E7]">Categorias</h2>
        </div>

        <button
          onClick={() => {
            setTargetPillarForNew(selectedPillarId);
            setIsNewSubModalOpen(true);
          }}
          className={`py-2.5 px-4 rounded-2xl bg-[#6E44FF] hover:bg-[#5A32E6] dark:bg-[#7C5CFF] dark:hover:bg-[#6E44FF] text-white text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
            isMobile ? 'w-full' : ''
          }`}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Nova Subcategoria</span>
        </button>
      </div>

      {/* Grid / Carrossel dos 5 Pilares Macro (Item 1.3) */}
      <div className={
        isMobile
          ? "flex overflow-x-auto snap-x snap-mandatory gap-3 py-2 px-1 no-scrollbar scrollbar-none"
          : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      }>
        {pillars.map(pillar => {
          const spent = pillarExpenses[pillar.id] || 0;
          const budget = pillarBudgets[pillar.id] || 0;
          const hasBudget = budget > 0;
          const pct = hasBudget ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
          const isSelected = selectedPillarId === pillar.id;

          return (
            <button
              key={pillar.id}
              onClick={() => {
                setSelectedPillarId(pillar.id);
                setSelectedSubCategoryId(null);
              }}
              className={`p-4 rounded-[24px] text-left transition-all duration-300 relative overflow-hidden border flex flex-col justify-between active:scale-[0.98] ${
                isMobile ? 'min-w-[175px] shrink-0 snap-start' : ''
              } ${
                isSelected
                  ? 'bg-white dark:bg-[#241C3D] border-[#6E44FF] dark:border-[#7C5CFF] shadow-lg scale-[1.02] ring-2 ring-[#6E44FF]/25 dark:ring-[#7C5CFF]/40'
                  : 'bg-[#FCF9F2]/75 dark:bg-[#1A142D]/80 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-[#211A38] hover:border-[#6E44FF]/45 dark:hover:border-[#7C5CFF]/60 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(110,68,255,0.14)] border-white/70 dark:border-[#322653]'
              } before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-[#6E44FF]/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none`}
            >
              <div className="relative z-10 w-full">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 shadow-sm transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: pillar.softBg, color: pillar.color }}
                >
                  <DynamicIcon name={pillar.iconName} className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-black text-[#231942] dark:text-[#F7F2E7] leading-tight">
                  {pillar.shortName}
                </h4>
              </div>

              {/* Teto do Pilar */}
              <div className="mt-4 pt-2 border-t border-[#DFD5C3]/60 dark:border-[#322653] relative z-10 w-full">
                <div className="text-xs font-black text-[#231942] dark:text-[#F7F2E7]">
                  {formatCurrency(spent)}
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#655A7C] dark:text-[#A69BB8] mt-1 font-semibold">
                  <span className="truncate max-w-[115px]">
                    {hasBudget ? `Teto ${formatCurrency(budget)}` : 'Sem teto'}
                  </span>
                  <span className={pct > 90 ? 'text-[#E0533C]' : 'text-[#1F9D73]'}>
                    {hasBudget ? `${pct}%` : '-'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#EDE5D5]/80 dark:bg-[#241C3D] rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pct > 90 ? '#E0533C' : pillar.color,
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Subcategorias do Pilar Selecionado */}
      <div className="bg-[#FCF9F2]/75 dark:bg-[#1A142D]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-white/70 dark:border-[#322653] shadow-[0_8px_30px_rgb(35,25,66,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-4 transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#DFD5C3]/70 dark:border-[#322653]">
          <div>
            <h3 className="text-lg font-black text-[#231942] dark:text-[#F7F2E7] flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: selectedPillar.color }} />
              <span>Subcategorias de {selectedPillar.name}</span>
            </h3>
          </div>

          {selectedSubCategoryId && (
            <button
              onClick={() => setSelectedSubCategoryId(null)}
              className="text-xs font-bold text-[#6E44FF] dark:text-[#7C5CFF] hover:underline flex items-center gap-1 active:scale-95 transition-all"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Remover filtro</span>
            </button>
          )}
        </div>

        {/* Subcategories Horizontal / Grid pills */}
        {currentSubcategories.length === 0 ? (
          <div className="py-8 text-center text-[#655A7C] dark:text-[#A69BB8] bg-white/50 dark:bg-[#241C3D]/40 rounded-2xl border border-dashed border-[#DFD5C3] dark:border-[#322653]">
            <p className="font-bold text-[#231942] dark:text-[#F7F2E7] text-sm">Nenhuma subcategoria cadastrada</p>
            <p className="text-xs text-[#655A7C] dark:text-[#A69BB8] mt-1 mb-4">
              Crie subcategorias para organizar seus custos em {selectedPillar.shortName}.
            </p>
            <button
              onClick={() => {
                setTargetPillarForNew(selectedPillarId);
                setIsNewSubModalOpen(true);
              }}
              className="py-2.5 px-4 rounded-xl bg-[#6E44FF] hover:bg-[#5A32E6] dark:bg-[#7C5CFF] dark:hover:bg-[#6E44FF] text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Criar Subcategoria</span>
            </button>
          </div>
        ) : (
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-3`}>
            {currentSubcategories.map(sub => {
              const spent = subCategorySpentMap[sub.id] || 0;
              const hasSubBudget = sub.monthlyBudget > 0;
              const pct = hasSubBudget ? Math.min(Math.round((spent / sub.monthlyBudget) * 100), 100) : 0;
              const isSelected = selectedSubCategoryId === sub.id;

              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubCategoryId(isSelected ? null : sub.id)}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[#E5DEFF]/80 dark:bg-[#6E44FF]/25 border-[#6E44FF] dark:border-[#7C5CFF] shadow-md ring-2 ring-[#6E44FF]/20 dark:ring-[#7C5CFF]/40'
                      : 'bg-white/90 dark:bg-[#241C3D]/80 backdrop-blur-sm hover:bg-white dark:hover:bg-[#2b2248] hover:border-[#6E44FF]/40 dark:hover:border-[#7C5CFF]/60 hover:-translate-y-0.5 hover:shadow-md border-[#DFD5C3] dark:border-[#322653]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{ backgroundColor: selectedPillar.softBg, color: selectedPillar.color }}
                      >
                        <DynamicIcon name={sub.iconName} className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black text-[#231942] dark:text-[#F7F2E7] truncate">{sub.name}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Excluir a subcategoria "${sub.name}"?`)) {
                          deleteSubCategory(sub.id);
                        }
                      }}
                      className="text-[#655A7C] dark:text-[#A69BB8] hover:text-[#E0533C] p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all active:scale-90"
                      title="Excluir subcategoria"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#DFD5C3]/40 dark:border-[#322653] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-black text-[#231942] dark:text-[#F7F2E7]">{formatCurrency(spent)}</span>
                      <span className="text-[10px] text-[#655A7C] dark:text-[#A69BB8] ml-1 font-semibold">
                        {hasSubBudget ? `/ ${formatCurrency(sub.monthlyBudget)}` : ''}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold ${pct > 90 ? 'text-[#E0533C]' : 'text-[#655A7C] dark:text-[#A69BB8]'}`}>
                      {hasSubBudget ? `${pct}%` : '-'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lista de Lançamentos da Categoria / Subcategoria Filtrada */}
      <div className="bg-[#FCF9F2]/75 dark:bg-[#1A142D]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-white/70 dark:border-[#322653] shadow-[0_8px_30px_rgb(35,25,66,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-black text-[#231942] dark:text-[#F7F2E7]">
              Lançamentos: {selectedSubCategoryId ? currentSubcategories.find(s => s.id === selectedSubCategoryId)?.name : selectedPillar.name}
            </h4>
            <p className="text-xs font-semibold text-[#655A7C] dark:text-[#A69BB8]">{filteredTransactions.length} registros</p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-1.5 px-3 rounded-xl bg-[#EDE5D5] hover:bg-[#DFD5C3] dark:bg-[#241C3D] dark:hover:bg-[#322653] text-xs font-bold text-[#231942] dark:text-[#F7F2E7] flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="py-8 text-center text-xs font-semibold text-[#655A7C] dark:text-[#A69BB8] bg-white/50 dark:bg-[#241C3D]/40 rounded-2xl border border-dashed border-[#DFD5C3] dark:border-[#322653]">
            Nenhum lançamento registrado nesta categoria.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTransactions.map(tx => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/90 dark:bg-[#241C3D]/80 backdrop-blur-sm border border-[#DFD5C3] dark:border-[#322653] hover:border-[#6E44FF]/40 dark:hover:border-[#7C5CFF]/60 hover:-translate-y-0.5 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-[#231942] dark:text-[#F7F2E7]">{tx.title}</h5>
                  <span className="text-[11px] font-semibold text-[#655A7C] dark:text-[#A69BB8]">
                    Vencimento: {formatDateBR(tx.dueDate)} {tx.notes ? `• ${tx.notes}` : ''}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-xs sm:text-sm text-[#231942] dark:text-[#F7F2E7] whitespace-nowrap">
                    {formatCurrency(tx.amount)}
                  </span>
                  <button
                    onClick={() => togglePaid(tx.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm ${
                      tx.paid
                        ? 'bg-[#E1F7EF] text-[#1F9D73] dark:bg-[#1F9D73]/20 dark:text-[#34D399] hover:bg-[#d0f2e5]'
                        : 'bg-[#EDE5D5] text-[#D97706] dark:bg-[#322653] dark:text-[#F59E0B] hover:bg-[#FEF3C7]'
                    }`}
                  >
                    {tx.paid ? 'Pago' : 'Pendente'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Criar Nova Subcategoria */}
      {isNewSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0B1A]/70 backdrop-blur-md">
          <div className="bg-[#FCF9F2]/95 dark:bg-[#1A142D]/95 backdrop-blur-2xl rounded-[32px] border border-white/80 dark:border-[#322653] p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-[#231942] dark:text-[#F7F2E7]">Criar Nova Subcategoria</h3>

            <form onSubmit={handleCreateSubcategory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#655A7C] dark:text-[#A69BB8] mb-1">Pilar de Destino</label>
                <select
                  value={targetPillarForNew}
                  onChange={e => setTargetPillarForNew(e.target.value as MacroPillarId)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#241C3D] border border-[#DFD5C3] dark:border-[#322653] text-xs font-bold text-[#231942] dark:text-[#F7F2E7] focus:outline-none focus:ring-2 focus:ring-[#6E44FF] dark:focus:ring-[#7C5CFF]"
                >
                  {pillars.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#655A7C] dark:text-[#A69BB8] mb-1">Nome da Subcategoria</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ração e Areia de Gato"
                  value={newSubName}
                  onChange={e => setNewSubName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#241C3D] border border-[#DFD5C3] dark:border-[#322653] text-sm font-semibold text-[#231942] dark:text-[#F7F2E7] placeholder:text-[#655A7C]/60 dark:placeholder:text-[#A69BB8]/40 focus:outline-none focus:ring-2 focus:ring-[#6E44FF] dark:focus:ring-[#7C5CFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#655A7C] dark:text-[#A69BB8] mb-1">Teto Mensal Estimado (R$)</label>
                <input
                  type="number"
                  placeholder="Ex: 500"
                  value={newSubBudget}
                  onChange={e => setNewSubBudget(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#241C3D] border border-[#DFD5C3] dark:border-[#322653] text-sm font-black text-[#6E44FF] dark:text-[#7C5CFF] focus:outline-none focus:ring-2 focus:ring-[#6E44FF] dark:focus:ring-[#7C5CFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#655A7C] dark:text-[#A69BB8] mb-1">Ícone</label>
                <select
                  value={newSubIcon}
                  onChange={e => setNewSubIcon(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#241C3D] border border-[#DFD5C3] dark:border-[#322653] text-xs font-bold text-[#231942] dark:text-[#F7F2E7] focus:outline-none focus:ring-2 focus:ring-[#6E44FF] dark:focus:ring-[#7C5CFF]"
                >
                  <option value="Tag">Etiqueta Geral (Tag)</option>
                  <option value="Home">Casa / Moradia</option>
                  <option value="Zap">Energia / Luz</option>
                  <option value="Droplet">Água</option>
                  <option value="Wifi">Internet / Telefone</option>
                  <option value="ShoppingBag">Supermercado</option>
                  <option value="Car">Transporte / Mobilidade</option>
                  <option value="PawPrint">Pets (Cão e Gato)</option>
                  <option value="HeartPulse">Saúde / Farmácia</option>
                  <option value="Tv">Streaming / Assinaturas</option>
                  <option value="Coffee">Lazer / Restaurantes</option>
                  <option value="PiggyBank">Reserva / Investimento</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-[#6E44FF] hover:bg-[#5A32E6] dark:bg-[#7C5CFF] dark:hover:bg-[#6E44FF] text-white text-xs font-bold shadow-md active:scale-95 transition-all"
                >
                  Salvar Subcategoria
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewSubModalOpen(false)}
                  className="py-3 px-4 rounded-2xl bg-[#EDE5D5] hover:bg-[#DFD5C3] dark:bg-[#241C3D] dark:hover:bg-[#322653] text-[#231942] dark:text-[#F7F2E7] text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesView;
