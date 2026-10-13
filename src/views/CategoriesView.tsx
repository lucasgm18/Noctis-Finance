import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, X, Sparkles, Filter } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { MacroPillarId, SubCategory } from '../types/finance';
import { formatCurrency, formatDateBR } from '../utils/formatters';
import { DynamicIcon, AVAILABLE_ICON_NAMES } from '../components/DynamicIcon';

export const CategoriesView: React.FC = () => {
  const { 
    pillars, 
    subcategories, 
    transactions, 
    pillarExpenses, 
    pillarBudgets,
    addSubCategory,
    deleteSubCategory,
    setIsAddModalOpen,
    togglePaid
  } = useFinance();

  const [selectedPillarId, setSelectedPillarId] = useState<MacroPillarId>('fixed');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
  
  // Modal de Criação de Nova Subcategoria
  const [isNewSubModalOpen, setIsNewSubModalOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubBudget, setNewSubBudget] = useState('500');
  const [newSubIcon, setNewSubIcon] = useState('Tag');
  const [targetPillarForNew, setTargetPillarForNew] = useState<MacroPillarId>('fixed');

  const selectedPillar = pillars.find(p => p.id === selectedPillarId) || pillars[0];

  // Subcategorias do pilar ativo
  const currentSubcategories = subcategories.filter(s => s.pillarId === selectedPillarId);

  // Gastos por subcategoria
  const subCategorySpentMap: Record<string, number> = {};
  transactions.forEach(t => {
    if (t.subCategoryId) {
      subCategorySpentMap[t.subCategoryId] = (subCategorySpentMap[t.subCategoryId] || 0) + t.amount;
    }
  });

  // Transações filtradas
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FCF9F2] p-5 rounded-[28px] border border-[#DFD5C3]">
        <div>
          <h2 className="text-xl font-extrabold text-[#231942]">5 Pilares & Subcategorias</h2>
          <p className="text-xs text-[#655A7C]">Estrutura orçamentária com tetos personalizados</p>
        </div>

        <button
          onClick={() => {
            setTargetPillarForNew(selectedPillarId);
            setIsNewSubModalOpen(true);
          }}
          className="py-2.5 px-4 rounded-2xl bg-[#6E44FF] hover:bg-[#5A32E6] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Criar Nova Subcategoria</span>
        </button>
      </div>

      {/* Grid com os 5 Pilares Macro */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {pillars.map(pillar => {
          const spent = pillarExpenses[pillar.id] || 0;
          const budget = pillarBudgets[pillar.id] || 1;
          const pct = Math.min(Math.round((spent / budget) * 100), 100);
          const isSelected = selectedPillarId === pillar.id;

          return (
            <button
              key={pillar.id}
              onClick={() => {
                setSelectedPillarId(pillar.id);
                setSelectedSubCategoryId(null);
              }}
              className={`p-4 rounded-[24px] text-left transition-all relative border flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#6E44FF] shadow-lg scale-[1.02] ring-2 ring-[#6E44FF]/20'
                  : 'bg-[#FCF9F2] hover:bg-[#EDE5D5]/50 border-[#DFD5C3]'
              }`}
            >
              <div>
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 shadow-sm"
                  style={{ backgroundColor: pillar.softBg, color: pillar.color }}
                >
                  <DynamicIcon name={pillar.iconName} className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-[#231942] leading-tight line-clamp-2">
                  {pillar.shortName}
                </h4>
              </div>

              <div className="mt-4 pt-2 border-t border-[#DFD5C3]/60">
                <div className="text-xs font-extrabold text-[#231942]">
                  {formatCurrency(spent)}
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#655A7C] mt-1 font-semibold">
                  <span>Teto {formatCurrency(budget)}</span>
                  <span className={pct > 90 ? 'text-[#E0533C]' : 'text-[#1F9D73]'}>{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#EDE5D5] rounded-full mt-1.5 overflow-hidden">
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
      <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#DFD5C3]">
          <div>
            <h3 className="text-lg font-bold text-[#231942] flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedPillar.color }} />
              <span>Subcategorias de {selectedPillar.name}</span>
            </h3>
            <p className="text-xs text-[#655A7C]">{selectedPillar.description}</p>
          </div>

          {selectedSubCategoryId && (
            <button
              onClick={() => setSelectedSubCategoryId(null)}
              className="text-xs font-bold text-[#6E44FF] hover:underline flex items-center gap-1"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Remover filtro de subcategoria</span>
            </button>
          )}
        </div>

        {/* Subcategories Horizontal / Grid pills */}
        {currentSubcategories.length === 0 ? (
          <div className="py-10 text-center text-[#655A7C] bg-[#EDE5D5]/30 rounded-2xl border border-dashed border-[#DFD5C3]">
            <p className="font-bold text-[#231942] text-sm">Nenhuma subcategoria cadastrada ainda</p>
            <p className="text-xs text-[#655A7C] mt-1 mb-4">
              Crie subcategorias para organizar seus custos dentro de {selectedPillar.shortName}.
            </p>
            <button
              onClick={() => {
                setTargetPillarForNew(selectedPillarId);
                setIsNewSubModalOpen(true);
              }}
              className="py-2.5 px-4 rounded-xl bg-[#6E44FF] hover:bg-[#5A32E6] text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Criar Primeira Subcategoria</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentSubcategories.map(sub => {
              const spent = subCategorySpentMap[sub.id] || 0;
              const pct = sub.monthlyBudget > 0 ? Math.min(Math.round((spent / sub.monthlyBudget) * 100), 100) : 0;
              const isSelected = selectedSubCategoryId === sub.id;

              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubCategoryId(isSelected ? null : sub.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#E5DEFF]/70 border-[#6E44FF] shadow-sm'
                      : 'bg-white hover:bg-[#EDE5D5]/50 border-[#DFD5C3]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: selectedPillar.softBg, color: selectedPillar.color }}
                      >
                        <DynamicIcon name={sub.iconName} className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#231942] truncate">{sub.name}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Excluir a subcategoria "${sub.name}"?`)) {
                          deleteSubCategory(sub.id);
                        }
                      }}
                      className="text-[#655A7C] hover:text-[#E0533C] p-1 transition-colors"
                      title="Excluir subcategoria"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#DFD5C3]/40 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-[#231942]">{formatCurrency(spent)}</span>
                      <span className="text-[10px] text-[#655A7C] ml-1">/ teto {formatCurrency(sub.monthlyBudget)}</span>
                    </div>
                    <span className={`text-[11px] font-bold ${pct > 90 ? 'text-[#E0533C]' : 'text-[#655A7C]'}`}>
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lista de Lançamentos da Categoria / Subcategoria Filtrada */}
      <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-[#231942]">
              Lançamentos: {selectedSubCategoryId ? currentSubcategories.find(s => s.id === selectedSubCategoryId)?.name : selectedPillar.name}
            </h4>
            <p className="text-xs text-[#655A7C]">{filteredTransactions.length} registros encontrados</p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-1.5 px-3 rounded-xl bg-[#EDE5D5] hover:bg-[#DFD5C3] text-xs font-bold text-[#231942] flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Neste Pilar</span>
          </button>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#655A7C] bg-[#EDE5D5]/40 rounded-2xl border border-dashed border-[#DFD5C3]">
            Nenhum lançamento registrado nesta categoria para este período.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTransactions.map(tx => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#DFD5C3]"
              >
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-[#231942]">{tx.title}</h5>
                  <span className="text-[11px] text-[#655A7C]">
                    Vencimento: {formatDateBR(tx.dueDate)} {tx.notes ? `• ${tx.notes}` : ''}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-xs sm:text-sm text-[#231942]">
                    {formatCurrency(tx.amount)}
                  </span>
                  <button
                    onClick={() => togglePaid(tx.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                      tx.paid
                        ? 'bg-[#E1F7EF] text-[#1F9D73]'
                        : 'bg-[#EDE5D5] text-[#D97706] hover:bg-[#FEF3C7]'
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

      {/* Modal Nova Subcategoria Dinâmica */}
      {isNewSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231942]/60 backdrop-blur-sm">
          <div className="bg-[#FCF9F2] w-full max-w-md rounded-[32px] border border-[#DFD5C3] shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFD5C3]">
              <h3 className="text-lg font-bold text-[#231942]">Nova Subcategoria</h3>
              <button
                onClick={() => setIsNewSubModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#EDE5D5] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubcategory} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#655A7C] mb-1">Pilar Financeiro</label>
                <select
                  value={targetPillarForNew}
                  onChange={e => setTargetPillarForNew(e.target.value as MacroPillarId)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DFD5C3] text-xs font-bold"
                >
                  {pillars.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#655A7C] mb-1">Nome da Subcategoria *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ração e Cuidados Especiais, Cursos"
                  value={newSubName}
                  onChange={e => setNewSubName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DFD5C3] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#655A7C] mb-1">Teto Mensal Estimado (R$)</label>
                <input
                  type="number"
                  required
                  value={newSubBudget}
                  onChange={e => setNewSubBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DFD5C3] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#655A7C] mb-1">Escolha um Ícone Lucide</label>
                <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2 bg-white rounded-xl border border-[#DFD5C3]">
                  {AVAILABLE_ICON_NAMES.map(iconName => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setNewSubIcon(iconName)}
                      className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                        newSubIcon === iconName
                          ? 'bg-[#6E44FF] text-white shadow-sm scale-110'
                          : 'hover:bg-[#EDE5D5] text-[#231942]'
                      }`}
                      title={iconName}
                    >
                      <DynamicIcon name={iconName} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#6E44FF] text-white font-bold text-xs shadow-md hover:bg-[#5A32E6] transition-colors"
                >
                  Salvar Subcategoria
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
