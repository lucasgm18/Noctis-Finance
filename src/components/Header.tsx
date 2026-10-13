import React from 'react';
import { Bell, ArrowUpRight, ArrowDownRight, Lock, CheckCircle2, Settings as SettingsIcon, Sun, Moon } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { NoctisLogo } from './NoctisLogo';
import { SyncBadge } from './SyncBadge';

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
    theme,
    toggleTheme,
  } = useFinance();

  // Saídas totais comprometidas no mês
  const totalCommittedExpenses = totalPaidExpenses + totalPendingExpenses;

  return (
    <header className="bg-[#6E44FF] dark:bg-[#150F28] text-white pt-12 sm:pt-6 pb-9 px-4 sm:px-8 transition-colors duration-300 relative overflow-hidden border-b border-transparent dark:border-[#322653]">
      {/* Subtle light glow behind header */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-[#7C5CFF]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: User Greeting + Actions */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <NoctisLogo className="w-11 h-11 rounded-2xl shadow-md border border-white/20 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-[11px] uppercase tracking-wider text-[#E5DEFF] dark:text-[#A69BB8] font-bold">Noctis</span>
              <SyncBadge variant="header" />
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white truncate">
              {settings.userName ? `Olá, ${settings.userName} 👋` : 'Bem-vindo 👋'}
            </h1>
          </div>
        </div>

        {/* Action Buttons: Lock, Theme, Settings Gear, Bell */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Lock Button */}
          <button
            onClick={lockApp}
            title="Bloquear aplicativo"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md flex items-center justify-center transition-all border border-white/20 shadow-sm"
          >
            <Lock className="w-4 h-4 text-[#E5DEFF]" />
          </button>

          {/* Theme Toggle Button (Sol/Lua) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Tema Claro' : 'Tema Escuro (Noctis)'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md flex items-center justify-center transition-all border border-white/20 shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FEF3C7]" />
            ) : (
              <Moon className="w-4 h-4 text-[#E5DEFF]" />
            )}
          </button>

          {/* Settings Shortcut Gear Icon */}
          <button
            onClick={() => setActiveTab('settings')}
            title="Configurações"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md flex items-center justify-center transition-all border border-white/20 shadow-sm"
          >
            <SettingsIcon className="w-4 h-4 text-[#E5DEFF]" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            title="Alertas & Notificações"
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white active:scale-90 backdrop-blur-md text-[#231942] flex items-center justify-center transition-all shadow-md hover:shadow-lg"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#231942]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#E0533C] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#6E44FF]">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* FinWise Balance & Expense Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2 pb-5 border-b border-white/15 relative z-10">
        <div className="min-w-0">
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#E5DEFF] mb-1">
            <span className="p-0.5 rounded-full bg-white/10 text-white shrink-0">
              <ArrowUpRight className="w-3 h-3 text-[#1F9D73]" />
            </span>
            <span className="truncate">Total Entradas</span>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white whitespace-nowrap">
            {formatCurrency(totalIncome)}
          </div>
        </div>

        <div className="border-l border-white/15 pl-3 min-w-0">
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#E5DEFF] mb-1">
            <span className="p-0.5 rounded-full bg-white/10 text-white shrink-0">
              <ArrowDownRight className="w-3 h-3 text-[#E0533C]" />
            </span>
            <span className="truncate">Saídas & Dívidas</span>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#E5DEFF] whitespace-nowrap">
            - {formatCurrency(totalCommittedExpenses)}
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
            {budgetLimit > 0 ? `Teto ${formatCurrency(budgetLimit)}` : 'Sem teto definido'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#E5DEFF] pl-1 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#1F9D73]" />
          <span>
            {budgetLimit <= 0
              ? 'Defina seu teto mensal em Ajustes para acompanhar o consumo.'
              : budgetUsedPercentage <= 70 
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
