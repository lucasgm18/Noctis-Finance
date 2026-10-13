import React from 'react';
import { Check, Bell, Mail, Calendar, AlertCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDateBR, getDueStatus } from '../utils/formatters';
import { DynamicIcon } from './DynamicIcon';

export const UpcomingBills: React.FC = () => {
  const { upcomingBills, togglePaid, subcategories, pillars } = useFinance();

  const getSubCategory = (id: string) => {
    return subcategories.find(s => s.id === id);
  };

  const getPillar = (id?: string) => {
    return pillars.find(p => p.id === id);
  };

  return (
    <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-[#231942] flex items-center gap-2">
            <span>Próximos Vencimentos</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] font-bold">
              {upcomingBills.length} pendentes
            </span>
          </h2>
          <p className="text-xs text-[#655A7C]">Contas a pagar e cobranças agendadas</p>
        </div>
      </div>

      {upcomingBills.length === 0 ? (
        <div className="py-8 text-center text-[#655A7C] bg-[#EDE5D5]/40 rounded-2xl border border-dashed border-[#DFD5C3]">
          <div className="w-12 h-12 rounded-full bg-[#E1F7EF] text-[#1F9D73] flex items-center justify-center mx-auto mb-2">
            <Check className="w-6 h-6 stroke-[2.5]" />
          </div>
          <p className="font-bold text-[#231942]">Tudo em dia!</p>
          <p className="text-xs">Nenhuma conta pendente para os próximos dias.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingBills.map(bill => {
            const sub = getSubCategory(bill.subCategoryId);
            const pillar = getPillar(bill.pillarId);
            const dueStatus = getDueStatus(bill.dueDate, bill.paid);

            return (
              <div
                key={bill.id}
                className="p-4 rounded-2xl bg-[#EDE5D5]/60 hover:bg-[#EDE5D5] transition-all border border-[#DFD5C3] space-y-3"
              >
                {/* Top Row: Icon + Title & Category */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: pillar?.softBg || '#E5DEFF', color: pillar?.color || '#6E44FF' }}
                    >
                      <DynamicIcon name={sub?.iconName || pillar?.iconName || 'Tag'} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-[#231942] text-sm">{bill.title}</h4>
                        {bill.recurrence === 'installment' && bill.currentInstallment && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5DEFF] text-[#6E44FF]">
                            {bill.currentInstallment}/{bill.totalInstallments}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-[#655A7C] mt-0.5">
                        <span className="font-medium truncate">{sub?.name || pillar?.shortName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#6E44FF]" />
                          {formatDateBR(bill.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Value */}
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-[#231942] text-base">
                      {formatCurrency(bill.amount)}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Badges & 1-click Pay Button */}
                <div className="flex items-center justify-between pt-2 border-t border-[#DFD5C3]/80">
                  <div className="flex items-center gap-2">
                    {/* Due badge */}
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${dueStatus.bg} ${dueStatus.color} flex items-center gap-1`}>
                      {dueStatus.isUrgent && <AlertCircle className="w-3 h-3" />}
                      {dueStatus.text}
                    </span>

                    {/* Notification chips */}
                    {bill.notifyEnabled && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/80 border border-[#DFD5C3] text-[10px] text-[#655A7C] font-semibold" title="Alertas ativados">
                        {bill.notifyPush && <Bell className="w-3 h-3 text-[#6E44FF]" />}
                        {bill.notifyEmail && <Mail className="w-3 h-3 text-[#1F9D73]" />}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => togglePaid(bill.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1F9D73] hover:bg-[#18805D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    title="Dar baixa e marcar como pago"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Dar Baixa / Pago</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingBills;
