import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, PiggyBank, Sparkles } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

export const SummaryCards: React.FC = () => {
  const { 
    totalIncome, 
    totalPaidExpenses, 
    totalPendingExpenses, 
    totalSaved,
    realFreeSavings,
    deviceViewMode,
    settings,
  } = useFinance();

  const isMockup = deviceViewMode === 'mobile-mockup';

  const emergencyGoal = settings.emergencyGoal || 0;
  const currentEmergencySaved = totalSaved;
  const emergencyPercentage = emergencyGoal > 0 ? Math.min(Math.round((currentEmergencySaved / emergencyGoal) * 100), 100) : 0;

  return (
    <div className="space-y-5">
      {/* 4 Cards Principais de Resumo */}
      <div className={`grid ${isMockup ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'} gap-3 sm:gap-4`}>
        {/* 1. Entradas do Mês */}
        <div className="bg-[#FCF9F2]/75 backdrop-blur-xl p-4 sm:p-5 rounded-[24px] border border-white/70 shadow-[0_8px_30px_rgb(35,25,66,0.05)] hover:border-[#6E44FF]/45 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(110,68,255,0.15)] active:scale-[0.98] transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-[#6E44FF]/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none">
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-xs font-bold text-[#655A7C] uppercase tracking-wider">Entradas</span>
            <span className="w-8 h-8 rounded-full bg-[#E1F7EF] text-[#1F9D73] flex items-center justify-center shadow-sm">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-[#231942] relative z-10 whitespace-nowrap">
            {formatCurrency(totalIncome)}
          </div>
          <div className="text-[11px] font-semibold text-[#1F9D73] mt-1 flex items-center gap-1 relative z-10">
            <span>{totalIncome > 0 ? '● Recebido no mês' : 'Nenhuma entrada'}</span>
          </div>
        </div>

        {/* 2. Saídas Pagas */}
        <div className="bg-[#FCF9F2]/75 backdrop-blur-xl p-4 sm:p-5 rounded-[24px] border border-white/70 shadow-[0_8px_30px_rgb(35,25,66,0.05)] hover:border-[#6E44FF]/45 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(110,68,255,0.15)] active:scale-[0.98] transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-[#6E44FF]/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none">
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-xs font-bold text-[#655A7C] uppercase tracking-wider">Saídas Pagas</span>
            <span className="w-8 h-8 rounded-full bg-[#FDE8E5] text-[#E0533C] flex items-center justify-center shadow-sm">
              <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-[#231942] relative z-10 whitespace-nowrap">
            {formatCurrency(totalPaidExpenses)}
          </div>
          <div className="text-[11px] font-semibold text-[#655A7C] mt-1 relative z-10">
            Boletos & Pix quitados
          </div>
        </div>

        {/* 3. Dívidas / Contas Pendentes */}
        <div className="bg-[#FCF9F2]/75 backdrop-blur-xl p-4 sm:p-5 rounded-[24px] border border-white/70 shadow-[0_8px_30px_rgb(35,25,66,0.05)] hover:border-[#6E44FF]/45 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(110,68,255,0.15)] active:scale-[0.98] transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-[#6E44FF]/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none">
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-xs font-bold text-[#655A7C] uppercase tracking-wider">Pendentes</span>
            <span className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shadow-sm">
              <Clock className="w-4 h-4 stroke-[2.5]" />
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-[#D97706] relative z-10 whitespace-nowrap">
            {formatCurrency(totalPendingExpenses)}
          </div>
          <div className="text-[11px] font-semibold text-[#D97706] mt-1 relative z-10">
            A vencer este mês
          </div>
        </div>

        {/* 4. Livre para Guardar (Sobra Real) */}
        <div className="bg-gradient-to-br from-[#EDE5D5]/80 to-[#FCF9F2]/90 backdrop-blur-xl p-4 sm:p-5 rounded-[24px] border-2 border-[#6E44FF]/40 shadow-soft hover:border-[#6E44FF]/60 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(110,68,255,0.2)] active:scale-[0.98] transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/50 before:via-transparent before:to-[#6E44FF]/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none">
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-xs font-bold text-[#6E44FF] uppercase tracking-wider">Sobra Real</span>
            <span className="w-8 h-8 rounded-full bg-[#E5DEFF] text-[#6E44FF] flex items-center justify-center shadow-sm">
              <PiggyBank className="w-4 h-4 stroke-[2.5]" />
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#6E44FF] relative z-10 whitespace-nowrap">
            {formatCurrency(realFreeSavings)}
          </div>
          <div className="text-[11px] font-semibold text-[#655A7C] mt-1 relative z-10">
            Livre após todas as contas
          </div>
        </div>
      </div>

      {/* Card Destaque Inspirado no FinWise "Savings On Goals" */}
      <div className="bg-[#6E44FF] text-white p-5 sm:p-6 rounded-[28px] shadow-float hover:shadow-2xl hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#835FFF]/40 rounded-full blur-2xl pointer-events-none" />
        
        <div className={`relative z-10 flex flex-col ${isMockup ? 'flex-col' : 'sm:flex-row'} items-center justify-between gap-5`}>
          {/* Circular Progress Gauge */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#1F9D73] transition-all duration-1000 ease-out"
                  strokeDasharray={`${emergencyPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <ShieldCheck className="w-6 h-6 text-[#E5DEFF]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E5DEFF]">
                <Sparkles className="w-3.5 h-3.5 text-[#FEF3C7]" />
                <span>Patrimônio & Reserva</span>
              </div>
              <h3 className="text-lg font-bold text-white">Reserva de Emergência</h3>
              <p className="text-xs text-[#E5DEFF]/90">
                {emergencyGoal > 0 
                  ? `${emergencyPercentage}% concluído • Meta ${formatCurrency(emergencyGoal)}`
                  : 'Meta não definida • Configure em Alertas & Ajustes'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/20 pt-3 sm:pt-0">
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-[#E5DEFF] block">Aportado este mês</span>
              <span className="text-sm sm:text-base font-extrabold text-white">
                {formatCurrency(totalSaved)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#E5DEFF] block">Total Acumulado</span>
              <span className="text-sm sm:text-base font-extrabold text-[#FEF3C7]">
                {formatCurrency(currentEmergencySaved)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
