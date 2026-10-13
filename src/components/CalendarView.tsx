import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDateBR } from '../utils/formatters';
import { DynamicIcon } from './DynamicIcon';

export const CalendarView: React.FC = () => {
  const { transactions, togglePaid, subcategories, pillars } = useFinance();

  // Mês e ano de exibição (Outubro 2026 como base mockada atual)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = Outubro
  const [selectedDay, setSelectedDay] = useState<number>(14); // Seleciona dia 14 (vencimento Nubank)

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getSubCategory = (id: string) => subcategories.find(s => s.id === id);
  const getPillar = (id?: string) => pillars.find(p => p.id === id);

  // Calcula dias do mês
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Domingo
  // Ajusta para semana começando na Segunda (0 = Seg, 6 = Dom)
  const startOffset = (firstDayOfWeek + 6) % 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Mapeia transações por dia deste mês
  const billsByDay: Record<number, typeof transactions> = {};
  transactions.forEach(t => {
    if (!t.dueDate) return;
    const [y, m, d] = t.dueDate.split('-').map(Number);
    if (y === currentYear && m === currentMonth + 1) {
      if (!billsByDay[d]) billsByDay[d] = [];
      billsByDay[d].push(t);
    }
  });

  const selectedDayBills = billsByDay[selectedDay] || [];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  return (
    <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft space-y-6">
      {/* Month Navigator */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-[#231942] flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#6E44FF]" />
            <span>{monthNames[currentMonth]} {currentYear}</span>
          </h3>
          <p className="text-xs text-[#655A7C]">Calendário de vencimentos e compromissos</p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#EDE5D5] p-1 rounded-2xl border border-[#DFD5C3]">
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-xl bg-white hover:bg-[#F7F2E7] text-[#231942] flex items-center justify-center transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-xl bg-white hover:bg-[#F7F2E7] text-[#231942] flex items-center justify-center transition-colors shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
          <div key={day} className="text-[11px] font-bold text-[#655A7C] py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Offset days from previous month */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`offset-${i}`} className="h-11 sm:h-12 rounded-2xl opacity-20 pointer-events-none" />
        ))}

        {/* Current Month Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayBills = billsByDay[day] || [];
          const hasBills = dayBills.length > 0;
          const hasPending = dayBills.some(b => !b.paid && b.type !== 'income');
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`h-11 sm:h-12 rounded-2xl flex flex-col items-center justify-center relative transition-all ${
                isSelected
                  ? 'bg-[#6E44FF] text-white font-extrabold shadow-md scale-105 z-10'
                  : hasBills
                  ? 'bg-[#EDE5D5] text-[#231942] hover:bg-[#DFD5C3] font-bold'
                  : 'text-[#655A7C] hover:bg-black/5 font-medium'
              }`}
            >
              <span className="text-xs sm:text-sm">{day}</span>
              
              {/* Event Dots */}
              {hasBills && (
                <div className="flex gap-0.5 mt-0.5">
                  {hasPending ? (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#FEF3C7]' : 'bg-[#E0533C]'}`} />
                  ) : (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#1F9D73]'}`} />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Bills List */}
      <div className="pt-4 border-t border-[#DFD5C3]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-[#231942] flex items-center gap-1.5">
            <span>Contas do Dia {selectedDay} de {monthNames[currentMonth]}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#E5DEFF] text-[#6E44FF] font-bold">
              {selectedDayBills.length} lançamentos
            </span>
          </h4>
        </div>

        {selectedDayBills.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#655A7C] bg-[#EDE5D5]/40 rounded-2xl border border-dashed border-[#DFD5C3]">
            Nenhum compromisso ou vencimento registrado para este dia.
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedDayBills.map(bill => {
              const sub = getSubCategory(bill.subCategoryId);
              const pillar = getPillar(bill.pillarId);
              const isIncome = bill.type === 'income';

              return (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#DFD5C3] gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{
                        backgroundColor: isIncome ? '#E1F7EF' : pillar?.softBg || '#E5DEFF',
                        color: isIncome ? '#1F9D73' : pillar?.color || '#6E44FF',
                      }}
                    >
                      <DynamicIcon name={sub?.iconName || pillar?.iconName || 'Tag'} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <h5 className="font-bold text-[#231942] text-xs sm:text-sm truncate">{bill.title}</h5>
                      <span className="text-[11px] text-[#655A7C] truncate block">
                        {sub?.name || pillar?.shortName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`font-extrabold text-xs sm:text-sm ${isIncome ? 'text-[#1F9D73]' : 'text-[#231942]'}`}>
                        {formatCurrency(bill.amount)}
                      </div>
                      <span className="text-[10px] font-semibold text-[#655A7C]">
                        {bill.paid ? 'Quitado' : 'Pendente'}
                      </span>
                    </div>

                    {!isIncome && (
                      <button
                        onClick={() => togglePaid(bill.id)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all ${
                          bill.paid
                            ? 'bg-[#E1F7EF] text-[#1F9D73]'
                            : 'bg-[#1F9D73] text-white hover:bg-[#18805D] shadow-sm'
                        }`}
                        title={bill.paid ? 'Marcar como não pago' : 'Dar baixa / Pago'}
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    )}
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

export default CalendarView;
