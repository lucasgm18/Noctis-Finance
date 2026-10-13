import { 
  Home, 
  PieChart, 
  Layers, 
  Receipt, 
  Sliders, 
  Plus, 
  Lock, 
  Smartphone, 
  Monitor,
  Bell,
  Wallet,
  Sun,
  Moon
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { NoctisLogo } from './NoctisLogo';
import { SyncBadge } from './SyncBadge';
import { formatCurrency } from '../utils/formatters';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsAddModalOpen, 
    lockApp, 
    realFreeSavings, 
    deviceViewMode, 
    setDeviceViewMode,
    unreadNotificationsCount,
    setIsNotificationOpen,
    theme,
    toggleTheme,
    settings,
  } = useFinance();

  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'analysis', label: 'Análise', icon: PieChart },
    { id: 'categories', label: 'Categorias', icon: Layers },
    { id: 'transactions', label: 'Extrato', icon: Receipt },
    { id: 'settings', label: 'Configurações', icon: Sliders },
  ] as const;

  return (
    <aside className="w-72 bg-[#6E44FF] dark:bg-[#120D22] text-white flex flex-col justify-between p-6 shadow-2xl h-screen sticky top-0 shrink-0 z-30 select-none border-r border-transparent dark:border-[#322653] transition-colors duration-300">
      {/* Top Branding */}
      <div>
        <div className="flex items-center gap-3.5 mb-8 px-2">
          <NoctisLogo className="w-12 h-12 rounded-2xl shadow-lg border border-white/20" />
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              Noctis
            </h1>
            <p className="text-xs font-semibold text-[#E5DEFF] tracking-wide">
              Guardião Financeiro
            </p>
          </div>
        </div>

        {/* Realtime Supabase Sync Badge */}
        <div className="mb-6 px-1">
          <SyncBadge variant="sidebar" className="w-full justify-center" />
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full py-3.5 px-4 mb-7 rounded-2xl bg-[#FCF9F2] text-[#231942] dark:bg-[#7C5CFF] dark:text-white font-bold text-sm shadow-[0_8px_20px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-[#6E44FF] hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 group"
        >
          <div className="w-6 h-6 rounded-full bg-[#6E44FF] dark:bg-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span>Novo Lançamento</span>
        </button>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#FCF9F2] text-[#231942] dark:bg-[#241C3D] dark:text-[#F7F2E7] shadow-lg font-bold'
                    : 'text-[#E5DEFF] hover:bg-white/15 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#6E44FF] dark:text-[#7C5CFF]' : 'text-[#E5DEFF]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'settings' && unreadNotificationsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#E0533C] text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Information Card & Mode Switcher */}
      <div className="space-y-4 pt-4 border-t border-white/15">
        {/* Real Savings Badge */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E5DEFF] mb-1">
            <Wallet className="w-4 h-4 text-[#1F9D73]" />
            <span>Sobra Real Livre</span>
          </div>
          <div className="text-xl font-extrabold text-white tracking-tight">
            {formatCurrency(realFreeSavings)}
          </div>
          <p className="text-[11px] text-[#E5DEFF]/80 mt-1 leading-tight">
            Descontadas contas e aportes do mês
          </p>
        </div>

        {/* Quick Footer Controls */}
        <div className="flex items-center justify-between gap-1.5 px-1">
          {/* Notification Button */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="flex-1 py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all border border-white/10 hover:border-white/25"
            title="Central de Alertas"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alertas</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
            className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all border border-white/10 hover:border-white/25"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-[#FEF3C7]" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#E5DEFF]" />
            )}
            <span>{theme === 'dark' ? 'Claro' : 'Escuro'}</span>
          </button>

          {/* Biometrics Lock */}
          <button
            onClick={lockApp}
            title="Bloquear agora"
            className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all border border-white/10 hover:border-white/25"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Bloquear</span>
          </button>
        </div>

        {/* Simulator Device Switcher */}
        <div className="flex items-center justify-between bg-black/20 p-1.5 rounded-xl text-xs">
          <span className="text-[#E5DEFF] text-[11px] pl-2 font-medium">Visualização:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setDeviceViewMode('responsive')}
              className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                deviceViewMode === 'responsive' ? 'bg-[#FCF9F2] text-[#231942] font-bold' : 'text-[#E5DEFF] hover:text-white'
              }`}
              title="Layout Desktop Amplo"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[10px]">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceViewMode('mobile-mockup')}
              className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                deviceViewMode === 'mobile-mockup' ? 'bg-[#FCF9F2] text-[#231942] font-bold' : 'text-[#E5DEFF] hover:text-white'
              }`}
              title="Simulador Mobile Smartphone"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[10px]">Mobile</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
