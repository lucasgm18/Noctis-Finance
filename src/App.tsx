import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { SecurityFingerprint } from './components/SecurityFingerprint';
import { AddTransactionModal } from './components/AddTransactionModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { DashboardView } from './views/DashboardView';
import { AnalysisView } from './views/AnalysisView';
import { CategoriesView } from './views/CategoriesView';
import { TransactionsView } from './views/TransactionsView';
import { SettingsView } from './views/SettingsView';
import { Monitor, Smartphone, Plus, Sun, Moon } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    isLocked, 
    activeTab, 
    deviceViewMode, 
    setDeviceViewMode, 
    setIsAddModalOpen,
    setActiveTab,
    unreadNotificationsCount,
    setIsNotificationOpen,
    theme,
    toggleTheme,
  } = useFinance();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardView />;
      case 'analysis':
        return <AnalysisView />;
      case 'categories':
        return <CategoriesView />;
      case 'transactions':
        return <TransactionsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  if (isLocked) {
    return <SecurityFingerprint />;
  }

  // Se o usuário selecionou o simulador Mobile Mockup no Desktop:
  if (deviceViewMode === 'mobile-mockup') {
    return (
      <div className="min-h-screen bg-[#231942] dark:bg-[#07040D] flex flex-col items-center justify-center p-4 selection:bg-[#E5DEFF] selection:text-[#6E44FF] transition-colors duration-300">
        {/* Floating Top Control */}
        <div className="mb-4 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs">
          <span className="font-medium">Simulador Mobile Noctis</span>
          <button
            onClick={() => setDeviceViewMode('responsive')}
            className="px-3 py-1 bg-white text-[#231942] rounded-full font-bold hover:bg-[#EDE5D5] active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop Amplo</span>
          </button>
        </div>

        {/* Smartphone Shell - Background matches base page to eliminate stray bottom stripes */}
        <div className="w-[390px] h-[844px] bg-[#F7F2E7] dark:bg-[#0F0B1A] rounded-[52px] shadow-[0_25px_70px_rgba(0,0,0,0.6)] border-[10px] border-[#2D2054] dark:border-[#1E1736] relative overflow-hidden flex flex-col transition-colors duration-300">
          {/* iOS Dynamic Island / Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#231942] dark:bg-[#07040D] rounded-full z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-black/60 mr-2" />
            <div className="w-2 h-2 rounded-full bg-[#6E44FF]/40" />
          </div>

          {/* Scrollable Container with ample bottom padding for BottomNav */}
          <div className="flex-1 overflow-y-auto relative no-scrollbar pb-32 bg-[#F7F2E7] dark:bg-[#0F0B1A]">
            <Header />
            {/* FinWise Rounded Sheet */}
            <main className="bg-[#F7F2E7] dark:bg-[#0F0B1A] -mt-5 rounded-t-[36px] pt-6 px-4 min-h-[500px] border-t border-[#DFD5C3]/60 dark:border-[#322653] pb-16 transition-colors duration-300">
              {renderActiveView()}
            </main>
          </div>

          {/* Floating Mobile Bottom Navigation */}
          <BottomNav isInsideMockup={true} />
        </div>

        {/* Global Modals */}
        <AddTransactionModal />
        <NotificationDrawer />
      </div>
    );
  }

  // Layout Responsivo Natural (Desktop Sidebar + Mobile Bottom Sheet)
  return (
    <div className="min-h-screen bg-[#F7F2E7] dark:bg-[#0F0B1A] flex flex-col lg:flex-row text-[#231942] dark:text-[#F7F2E7] selection:bg-[#E5DEFF] selection:text-[#6E44FF] transition-colors duration-300">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header (hidden on lg desktop) */}
        <div className="block lg:hidden">
          <Header />
        </div>

        {/* Desktop Top Bar (only on lg desktop) */}
        <div className="hidden lg:flex items-center justify-between px-8 py-5 bg-[#FCF9F2] dark:bg-[#150F28] border-b border-[#DFD5C3] dark:border-[#322653] transition-colors duration-300">
          <div>
            <h2 className="text-xl font-black text-[#231942] dark:text-[#F7F2E7] tracking-tight">
              {activeTab === 'home' && 'Início'}
              {activeTab === 'analysis' && 'Análise'}
              {activeTab === 'categories' && 'Categorias'}
              {activeTab === 'transactions' && 'Extrato'}
              {activeTab === 'settings' && 'Configurações'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro (Noctis)'}
              className="py-2.5 px-4 rounded-2xl bg-[#EDE5D5]/80 dark:bg-[#241C3D] hover:bg-[#DFD5C3] dark:hover:bg-[#322653] text-[#231942] dark:text-[#F7F2E7] border border-[#DFD5C3] dark:border-[#3B2D63] text-xs font-bold shadow-sm flex items-center gap-2 active:scale-95 transition-all"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-[#FEF3C7]" />
                  <span>Tema Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#6E44FF]" />
                  <span>Tema Escuro</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Body */}
        <main className={`flex-1 px-4 sm:px-8 py-6 pb-36 lg:pb-12 ${
          // No mobile, cria o efeito de topo arredondado rounded-t-[36px] sobreposto ao cabeçalho roxo!
          'block lg:block -mt-5 lg:mt-0 rounded-t-[36px] lg:rounded-t-none bg-[#F7F2E7] dark:bg-[#0F0B1A] pt-6 lg:pt-6 border-t lg:border-t-0 border-[#DFD5C3]/60 dark:border-[#322653] transition-colors duration-300'
        }`}>
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Floating Bottom Navigation (only on mobile) */}
      <div className="block lg:hidden">
        <BottomNav />
      </div>

      {/* Global Modals */}
      <AddTransactionModal />
      <NotificationDrawer />
    </div>
  );
};

export function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
