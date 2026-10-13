import React from 'react';
import { Bell, ArrowUpRight, ArrowDownRight, Lock, CheckCircle2, Sliders } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { NoctisLogo } from './NoctisLogo';

export const Header: React.FC = () => {
  const { 
    totalIncome, 
    totalPaidExpenses, 
    totalPendingExpenses, 
    budgetLimit, 
    budgetUsedPercentage,
    unreadNotificationsCount,
    setIsNotificationOpen,
    lockApp,
    settings,
    setActiveTab,
  } = useFinance();

  // Saídas totais comprometidas no mês
  const totalCommittedExpenses = totalPaidExpenses + totalPendingExpenses;

  return (
    <header className="bg-[#6E44FF] text-white pt-6 pb-9 px-5 sm:px-8 transition-all">
      {/* Top Bar: User Greeting + Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <NoctisLogo className="w-11 h-11 rounded-2xl shadow-md border border-white/20" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase tracking-wider text-[#E5DEFF] font-semibold">Noctis Finanças</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Olá, {settings.userName || 'Lucas'} 👋
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Lock Button */}
          <button
            onClick={lockApp}
            title="Bloquear aplicativo (Biometria)"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/15"
          >
            <Lock className="w-4 h-4 text-[#E5DEFF]" />
          </button>

          {/* Settings Shortcut */}
          <button
            onClick={() => setActiveTab('settings')}
            title="Configurações & Notificações"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/15"
          >
            <Sliders className="w-4 h-4 text-[#E5DEFF]" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            title="Central de Notificações"
            className="relative w-10 h-10 rounded-full bg-white hover:bg-[#FCF9F2] text-[#231942] flex items-center justify-center transition-transform active:scale-95 shadow-md"
          >
            <Bell className="w-5 h-5 text-[#231942]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-[#E0533C] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-[#6E44FF]">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* FinWise Balance & Expense Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2 pb-5 border-b border-white/15">
        <div>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#E5DEFF] mb-1">
            <span className="p-0.5 rounded-full bg-white/10 text-white">
              <ArrowUpRight className="w-3 h-3 text-[#1F9D73]" />
            </span>
            <span>Total Entradas</span>
          </div>
          <div className="text-sm xs:text-base sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
            {formatCurrency(totalIncome)}
          </div>
        </div>

        <div className="border-l border-white/15 pl-3">
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#E5DEFF] mb-1">
            <span className="p-0.5 rounded-full bg-white/10 text-white">
              <ArrowDownRight className="w-3 h-3 text-[#E0533C]" />
            </span>
            <span className="truncate">Saídas & Dívidas</span>
          </div>
          <div className="text-sm xs:text-base sm:text-2xl lg:text-3xl font-black tracking-tight text-[#E5DEFF]">
            -{formatCurrency(totalCommittedExpenses)}
          </div>
        </div>
      </div>

      {/* FinWise Budget Progress Bar */}
      <div className="pt-4">
        <div className="flex items-center bg-[#231942]/60 backdrop-blur-md rounded-full p-1 border border-white/10 mb-2">
          <span className="bg-[#231942] text-[#E5DEFF] font-bold text-xs px-3 py-1 rounded-full shadow-inner">
            {budgetUsedPercentage}%
          </span>
          <div className="flex-1 mx-2 h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                budgetUsedPercentage > 90 ? 'bg-[#E0533C]' : budgetUsedPercentage > 75 ? 'bg-[#D97706]' : 'bg-[#1F9D73]'
              }`}
              style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
            />
          </div>
          <span className="text-xs font-medium text-white/90 pr-3">
            Teto {formatCurrency(budgetLimit)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#E5DEFF] pl-1 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#1F9D73]" />
          <span>
            {budgetUsedPercentage <= 70 
              ? `${budgetUsedPercentage}% das despesas sob controle. Excelente!`
              : budgetUsedPercentage <= 90
              ? `Atenção: ${budgetUsedPercentage}% do teto mensal consumido.`
              : `Alerta: Teto orçamentário próximo do limite (${budgetUsedPercentage}%).`}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
