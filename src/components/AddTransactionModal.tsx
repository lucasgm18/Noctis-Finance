import React, { useState } from 'react';
import { X, Calendar, DollarSign, Bell, Mail, Smartphone, Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { MacroPillarId, TransactionType, RecurrenceType } from '../types/finance';
import { DynamicIcon } from './DynamicIcon';

export const AddTransactionModal: React.FC = () => {
  const { 
    isAddModalOpen, 
    setIsAddModalOpen, 
    pillars, 
    subcategories, 
    addTransaction,
    addSubCategory,
    settings 
  } = useFinance();

  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [pillarId, setPillarId] = useState<MacroPillarId>('fixed');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [inlineSubName, setInlineSubName] = useState('');
  const [isCreatingInlineSub, setIsCreatingInlineSub] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceType>('single');
  const [currentInstallment, setCurrentInstallment] = useState('1');
  const [totalInstallments, setTotalInstallments] = useState('10');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paid, setPaid] = useState(false);
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notes, setNotes] = useState('');

  if (!isAddModalOpen) return null;

  // Filtra as subcategorias de acordo com o pilar selecionado
  const currentSubcategories = subcategories.filter(s => s.pillarId === pillarId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseFloat(amountStr.replace(',', '.'));
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      alert('Por favor, informe um valor numérico válido.');
      return;
    }

    if (!title.trim()) {
      alert('Informe o título do lançamento.');
      return;
    }

    let effectiveSubCategory = subCategoryId;
    if (type !== 'income') {
      if (inlineSubName.trim() || currentSubcategories.length === 0) {
        const subName = inlineSubName.trim() || title.trim();
        const generatedId = `sub-${Date.now()}`;
        addSubCategory({
          name: subName,
          pillarId,
          iconName: 'Tag',
          monthlyBudget: 0,
        });
        effectiveSubCategory = generatedId;
      } else if (!effectiveSubCategory && currentSubcategories.length > 0) {
        effectiveSubCategory = currentSubcategories[0].id;
      }
    } else {
      effectiveSubCategory = 'income-default';
    }

    addTransaction({
      title: title.trim(),
      amount: cleanAmount,
      type,
      pillarId: type === 'income' ? undefined : pillarId,
      subCategoryId: effectiveSubCategory,
      recurrence,
      currentInstallment: recurrence === 'installment' ? parseInt(currentInstallment) || 1 : undefined,
      totalInstallments: recurrence === 'installment' ? parseInt(totalInstallments) || 1 : undefined,
      dueDate,
      paid,
      paidDate: paid ? new Date().toISOString().split('T')[0] : undefined,
      notifyEnabled,
      notifyPush: notifyEnabled && notifyPush,
      notifyEmail: notifyEnabled && notifyEmail && !!settings.userEmail,
      notes: notes.trim() || undefined,
    });

    setIsAddModalOpen(false);
    // Reset form
    setTitle('');
    setAmountStr('');
    setInlineSubName('');
    setIsCreatingInlineSub(false);
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231942]/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FCF9F2] w-full max-w-lg rounded-[32px] border border-[#DFD5C3] shadow-2xl p-6 sm:p-7 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DFD5C3]">
          <div>
            <h3 className="text-xl font-extrabold text-[#231942]">Novo Lançamento</h3>
            <p className="text-xs text-[#655A7C]">Registre despesas, contas agendadas ou reservas</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="w-9 h-9 rounded-full bg-[#EDE5D5] text-[#231942] hover:bg-[#DFD5C3] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Tipo de Transação: Entrada, Saída, Guardar/Reserva */}
          <div>
            <label className="block text-xs font-bold text-[#655A7C] uppercase tracking-wider mb-2">
              Tipo de Movimentação
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border ${
                  type === 'expense'
                    ? 'bg-[#E0533C] text-white border-[#E0533C] shadow-md'
                    : 'bg-[#EDE5D5] text-[#231942] border-[#DFD5C3] hover:bg-[#DFD5C3]'
                }`}
              >
                Saída / Despesa
              </button>
              <button
                type="button"
                onClick={() => { setType('income'); }}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border ${
                  type === 'income'
                    ? 'bg-[#1F9D73] text-white border-[#1F9D73] shadow-md'
                    : 'bg-[#EDE5D5] text-[#231942] border-[#DFD5C3] hover:bg-[#DFD5C3]'
                }`}
              >
                Entrada / Receita
              </button>
              <button
                type="button"
                onClick={() => { setType('savings'); setPillarId('wealth'); }}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border ${
                  type === 'savings'
                    ? 'bg-[#6E44FF] text-white border-[#6E44FF] shadow-md'
                    : 'bg-[#EDE5D5] text-[#231942] border-[#DFD5C3] hover:bg-[#DFD5C3]'
                }`}
              >
                Guardar / Reserva
              </button>
            </div>
          </div>

          {/* Título & Valor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#655A7C] mb-1">
                Título do Lançamento *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Conta de Luz, Ração Gatos"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#DFD5C3] text-[#231942] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#6E44FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#655A7C] mb-1">
                Valor (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#655A7C]">R$</span>
                <input
                  type="text"
                  required
                  placeholder="0,00"
                  value={amountStr}
                  onChange={e => setAmountStr(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#DFD5C3] text-[#231942] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6E44FF]"
                />
              </div>
            </div>
          </div>

          {/* Seleção do Pilar Macro e Subcategoria (quando não for receita pura) */}
          {type !== 'income' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#655A7C] mb-1">
                  Pilar Macro Financeiro
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {pillars.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPillarId(p.id);
                        const firstSub = subcategories.find(s => s.pillarId === p.id);
                        if (firstSub) setSubCategoryId(firstSub.id);
                      }}
                      className={`p-2 rounded-xl text-left text-xs font-bold transition-all border flex items-center gap-2 ${
                        pillarId === p.id
                          ? 'bg-[#6E44FF] text-white border-[#6E44FF] shadow-sm'
                          : 'bg-[#EDE5D5]/60 text-[#231942] border-[#DFD5C3] hover:bg-[#EDE5D5]'
                      }`}
                    >
                      <DynamicIcon name={p.iconName} className="w-4 h-4 shrink-0" />
                      <span className="truncate">{p.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#655A7C]">
                    Subcategoria
                  </label>
                  {currentSubcategories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsCreatingInlineSub(!isCreatingInlineSub)}
                      className="text-xs font-bold text-[#6E44FF] hover:underline flex items-center gap-1"
                    >
                      {isCreatingInlineSub ? 'Selecionar existente' : '+ Nova subcategoria'}
                    </button>
                  )}
                </div>

                {isCreatingInlineSub || currentSubcategories.length === 0 ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="Nome da subcategoria (ex: Aluguel, Mercado, Ração)"
                      value={inlineSubName}
                      onChange={e => setInlineSubName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#6E44FF] text-[#231942] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6E44FF] placeholder:text-[#655A7C]/50"
                    />
                    {currentSubcategories.length === 0 && (
                      <p className="text-[11px] text-[#655A7C]">
                        Nenhuma subcategoria neste pilar. Digite o nome para criá-la automaticamente.
                      </p>
                    )}
                  </div>
                ) : (
                  <select
                    value={subCategoryId}
                    onChange={e => setSubCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-[#231942] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6E44FF]"
                  >
                    <option value="">Selecione uma subcategoria</option>
                    {currentSubcategories.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} {sub.monthlyBudget > 0 ? `(Teto: R$ ${sub.monthlyBudget})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )}

          {/* Recorrência & Parcelas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#655A7C] mb-1">
                Recorrência
              </label>
              <select
                value={recurrence}
                onChange={e => setRecurrence(e.target.value as RecurrenceType)}
                className="w-full px-3 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-[#231942] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6E44FF]"
              >
                <option value="single">Lançamento Único</option>
                <option value="fixed_monthly">Fixo Todo Mês</option>
                <option value="installment">Compra Parcelada (1/N)</option>
              </select>
            </div>

            {recurrence === 'installment' ? (
              <div>
                <label className="block text-xs font-bold text-[#655A7C] mb-1">
                  Parcela Atual / Total
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={currentInstallment}
                    onChange={e => setCurrentInstallment(e.target.value)}
                    className="w-1/2 px-3 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-sm font-bold text-center"
                    placeholder="Atual"
                  />
                  <span className="text-[#655A7C] font-bold">/</span>
                  <input
                    type="number"
                    min="2"
                    value={totalInstallments}
                    onChange={e => setTotalInstallments(e.target.value)}
                    className="w-1/2 px-3 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-sm font-bold text-center"
                    placeholder="Total"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-[#655A7C] mb-1">
                  Data de Vencimento
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-[#231942] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6E44FF]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Switch de Pago Imediatamente */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EDE5D5]/50 border border-[#DFD5C3]">
            <div>
              <span className="text-xs font-bold text-[#231942] block">Lançamento já quitado?</span>
              <span className="text-[11px] text-[#655A7C]">Marque para dar baixa imediata</span>
            </div>
            <button
              type="button"
              onClick={() => setPaid(!paid)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                paid ? 'bg-[#1F9D73]' : 'bg-[#DFD5C3]'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform absolute top-0.5 ${
                paid ? 'right-0.5' : 'left-0.5'
              }`} />
            </button>
          </div>

          {/* Switch de Notificações / Alertas */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#DFD5C3] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#6E44FF]" />
                <div>
                  <span className="text-xs font-bold text-[#231942] block">Alertas de Vencimento</span>
                  <span className="text-[11px] text-[#655A7C]">Notificar no dia e véspera</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotifyEnabled(!notifyEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  notifyEnabled ? 'bg-[#6E44FF]' : 'bg-[#DFD5C3]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform absolute top-0.5 ${
                  notifyEnabled ? 'right-0.5' : 'left-0.5'
                }`} />
              </button>
            </div>

            {notifyEnabled && (
              <div className="pt-2 border-t border-[#DFD5C3]/60 flex items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#231942] font-semibold">
                  <input
                    type="checkbox"
                    checked={notifyPush}
                    onChange={e => setNotifyPush(e.target.checked)}
                    className="rounded text-[#6E44FF] focus:ring-[#6E44FF]"
                  />
                  <Smartphone className="w-3.5 h-3.5 text-[#6E44FF]" />
                  <span>Notificação Push</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[#231942] font-semibold">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={e => setNotifyEmail(e.target.checked)}
                    className="rounded text-[#6E44FF] focus:ring-[#6E44FF]"
                  />
                  <Mail className="w-3.5 h-3.5 text-[#1F9D73]" />
                  <span>
                    {settings.userEmail ? `E-mail (${settings.userEmail})` : 'E-mail (Definir em Ajustes)'}
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Observações */}
          <div>
            <textarea
              placeholder="Anotações adicionais (opcional)"
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-xs font-medium text-[#231942] focus:outline-none focus:ring-2 focus:ring-[#6E44FF]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#6E44FF] hover:bg-[#5A32E6] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Salvar Lançamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
