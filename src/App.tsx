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
import { Monitor, Smartphone, Plus } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    isLocked, 
    activeTab, 
    deviceViewMode, 
    setDeviceViewMode, 
    setIsAddModalOpen,
    setActiveTab,
    unreadNotificationsCount,
    setIsNotificationOpen
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
      <div className="min-h-screen bg-[#231942] flex flex-col items-center justify-center p-4 selection:bg-[#E5DEFF] selection:text-[#6E44FF]">
        {/* Floating Top Control */}
        <div className="mb-4 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs">
          <span>Simulador de Celular (FinWise PWA Mobile)</span>
          <button
            onClick={() => setDeviceViewMode('responsive')}
            className="px-3 py-1 bg-white text-[#231942] rounded-full font-bold hover:bg-[#EDE5D5] transition-colors flex items-center gap-1.5"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Voltar ao Desktop Amplo</span>
          </button>
        </div>

        {/* Smartphone Shell */}
        <div className="w-[390px] h-[844px] bg-[#6E44FF] rounded-[52px] shadow-[0_25px_70px_rgba(0,0,0,0.6)] border-[10px] border-[#2D2054] relative overflow-hidden flex flex-col">
          {/* iOS Dynamic Island / Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#231942] rounded-full z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-black/60 mr-2" />
            <div className="w-2 h-2 rounded-full bg-[#6E44FF]/40" />
          </div>

          {/* Scrollable Container with ample bottom padding for BottomNav */}
          <div className="flex-1 overflow-y-auto relative no-scrollbar pb-32">
            <Header />
            {/* FinWise Rounded Sheet */}
            <main className="bg-[#F7F2E7] -mt-5 rounded-t-[36px] pt-6 px-4 min-h-[500px] border-t border-[#DFD5C3]/60 pb-16">
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
    <div className="min-h-screen bg-[#F7F2E7] flex flex-col lg:flex-row text-[#231942] selection:bg-[#E5DEFF] selection:text-[#6E44FF]">
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
        <div className="hidden lg:flex items-center justify-between px-8 py-5 bg-[#FCF9F2] border-b border-[#DFD5C3]">
          <div>
            <h2 className="text-xl font-black text-[#231942]">
              {activeTab === 'home' && 'Visão Geral & Dashboard'}
              {activeTab === 'analysis' && 'Análise Gráfica & Vencimentos'}
              {activeTab === 'categories' && 'Estrutura dos 5 Pilares & Subcategorias'}
              {activeTab === 'transactions' && 'Extrato Financeiro Completo'}
              {activeTab === 'settings' && 'Configurações de Alertas & Segurança'}
            </h2>
            <p className="text-xs text-[#655A7C]">Noctis • Guardião Financeiro & Carteira Pessoal</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="py-2.5 px-5 rounded-2xl bg-[#6E44FF] hover:bg-[#5A32E6] text-white text-xs font-bold shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Novo Lançamento</span>
            </button>
          </div>
        </div>

        {/* Main Content Body */}
        <main className={`flex-1 px-4 sm:px-8 py-6 pb-36 lg:pb-12 ${
          // No mobile, cria o efeito de topo arredondado rounded-t-[36px] sobreposto ao cabeçalho roxo!
          'block lg:block -mt-5 lg:mt-0 rounded-t-[36px] lg:rounded-t-none bg-[#F7F2E7] pt-6 lg:pt-6 border-t lg:border-t-0 border-[#DFD5C3]/60'
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
