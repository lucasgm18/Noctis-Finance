import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Lock, 
  ShieldCheck, 
  Send, 
  User, 
  CheckCircle2,
  AlertTriangle,
  PiggyBank,
  Sun,
  Moon
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDateBR } from '../utils/formatters';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    testBrowserNotification, 
    lockApp,
    upcomingBills,
    togglePaid,
    deviceViewMode,
    theme,
    toggleTheme
  } = useFinance();

  const isMobile = deviceViewMode === 'mobile-mockup';

  const [userName, setUserName] = useState(settings.userName || '');
  const [userEmail, setUserEmail] = useState(settings.userEmail || '');
  const [budgetCeiling, setBudgetCeiling] = useState(settings.monthlyBudgetCeiling ? settings.monthlyBudgetCeiling.toString() : '');
  const [emergencyGoal, setEmergencyGoal] = useState(settings.emergencyGoal ? settings.emergencyGoal.toString() : '');
  const [isTestingPush, setIsTestingPush] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      monthlyBudgetCeiling: parseFloat(budgetCeiling) || 0,
      emergencyGoal: parseFloat(emergencyGoal) || 0,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const handleTestPush = async () => {
    setIsTestingPush(true);
    await testBrowserNotification();
    setIsTestingPush(false);
  };

  const activeReminders = upcomingBills.filter(b => b.notifyEnabled);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#FCF9F2]/75 dark:bg-[#1A142D]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-white/70 dark:border-[#322653] shadow-[0_8px_30px_rgb(35,25,66,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300">
        <h2 className="text-xl font-black tracking-tight text-[#231942] dark:text-[#F7F2E7]">Configurações</h2>
      </div>

      {/* Grid: 1 coluna no celular, 2 no desktop */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>
        {/* Card 1: Perfil e Parâmetros Orçamentários */}
        <div className="bg-[#FCF9F2]/75 dark:bg-[#1A142D]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-white/70 dark:border-[#322653] shadow-[0_8px_30px_rgb(35,25,66,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-4 w-full transition-all duration-300">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#DFD5C3]/70 dark:border-[#322653]">
            <div className="w-9 h-9 rounded-xl bg-[#E5DEFF] dark:bg-[#6E44FF]/25 text-[#6E44FF] dark:text-[#A78BFA] flex items-center justify-center shrink-0 shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#231942] dark:text-[#F7F2E7]">Perfil & Metas</h3>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div className="w-full">
              <label className="block text-xs font-bold text-[#655A7C] dark:text-[#A69BB8] mb-1">Seu Nome / Apelido</label>
              <input
                type="text"
                placeholder="Ex: Lucas"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#241C3D] border border-[#DFD5C3] dark:border-[#322653] text-sm font-semibold text-[#231942] dark:text-[#F7F2E7] placeholder:text-[#655A7C]/50 dark:placeholder:text-[#A69BB8]/40 focus:outline-none focus:ring-2 focus:ring-[#6E44FF] dark:focus:ring-[#7C5CFF] transition-all"
              />
            </div>

            <div className="w-full">
              <label className="block text-xs font-bold text-[#655A7C] dark:text-[#A69BB8] mb-1">E-mail para Avisos</label>
              <input
                type="email"
                placeholder="Seu e-mail para receber alertas de vencimento"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#241C3D] border border-[#DFD5C3] dark:border-[#322653] text-sm font-semibold text-[#231942] dark:text-[#F7F2E7] placeholder:text-[#655A7C]/50 dark:placeholder:text-[#A69BB8]/40 focus:outline-none focus:ring-2 focus:ring-[#6E44FF] dark:focus:ring-[#7C5CFF] transition-all"
              />
            </div>

            <div className="w-full">
              <label className="block text-xs font-bold text-[#655A7C] dark:text-[#A69BB8] mb-1">Teto Mensal do Orçamento (R$)</label>
              <input
                type="number"
                placeholder="Ex: 5000"
                value={budgetCeiling}
                onChange={e => setBudgetCeiling(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#241C3D] border border-[#DFD5C3] dark:border-[#322653] text-sm font-black text-[#6E44FF] dark:text-[#7C5CFF] placeholder:text-[#655A7C]/50 dark:placeholder:text-[#A69BB8]/40 focus:outline-none focus:ring-2 focus:ring-[#6E44FF] dark:focus:ring-[#7C5CFF] transition-all"
              />
            </div>

            <div className="w-full">
              <label className="block text-xs font-bold text-[#655A7C] dark:text-[#A69BB8] mb-1">Meta da Reserva de Emergência (R$)</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Ex: 15000"
                  value={emergencyGoal}
                  onChange={e => setEmergencyGoal(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#241C3D] border border-[#DFD5C3] dark:border-[#322653] text-sm font-black text-[#1F9D73] dark:text-[#34D399] placeholder:text-[#655A7C]/50 dark:placeholder:text-[#A69BB8]/40 focus:outline-none focus:ring-2 focus:ring-[#6E44FF] dark:focus:ring-[#7C5CFF] transition-all"
                />
                <PiggyBank className="w-4 h-4 text-[#1F9D73] dark:text-[#34D399] absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#6E44FF] hover:bg-[#5A32E6] dark:bg-[#7C5CFF] dark:hover:bg-[#6E44FF] active:scale-[0.98] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              {savedMessage ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#E1F7EF]" />
                  <span>Ajustes Salvos com Sucesso!</span>
                </>
              ) : (
                <span>Salvar Configurações</span>
              )}
            </button>
          </form>
        </div>

        {/* Card 2: Aparência, Alertas & Segurança */}
        <div className="space-y-6">
          {/* Aparência / Tema Dark Mode */}
          <div className="bg-[#FCF9F2]/75 dark:bg-[#1A142D]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-white/70 dark:border-[#322653] shadow-[0_8px_30px_rgb(35,25,66,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-4 w-full transition-all duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#DFD5C3]/70 dark:border-[#322653]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E5DEFF] dark:bg-[#6E44FF]/25 text-[#6E44FF] dark:text-[#A78BFA] flex items-center justify-center shrink-0 shadow-sm">
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#231942] dark:text-[#F7F2E7]">Aparência</h3>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-[#241C3D] border border-[#DFD5C3] dark:border-[#322653] text-xs font-bold text-[#231942] dark:text-[#F7F2E7] hover:border-[#6E44FF] transition-all shadow-sm active:scale-95"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Modo Claro</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-[#6E44FF]" />
                    <span>Modo Escuro</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-[#655A7C] dark:text-[#A69BB8]">
              <span>Tema atual</span>
              <span className="font-bold text-[#231942] dark:text-[#F7F2E7] capitalize">{theme === 'dark' ? 'Noctis Dark' : 'Bege & Roxinho'}</span>
            </div>
          </div>

          {/* Card Segurança & Notificações */}
          <div className="bg-[#FCF9F2]/75 dark:bg-[#1A142D]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-white/70 dark:border-[#322653] shadow-[0_8px_30px_rgb(35,25,66,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-4 w-full transition-all duration-300">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#DFD5C3]/70 dark:border-[#322653]">
              <div className="w-9 h-9 rounded-xl bg-[#E1F7EF] dark:bg-[#1F9D73]/20 text-[#1F9D73] dark:text-[#34D399] flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#231942] dark:text-[#F7F2E7]">Alertas & Segurança</h3>
              </div>
            </div>

            {/* Teste Push Nativo */}
            <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#241C3D]/80 backdrop-blur-md border border-[#DFD5C3]/80 dark:border-[#322653] space-y-2.5 transition-all shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#6E44FF] dark:text-[#7C5CFF]" />
                  <span className="text-xs font-bold text-[#231942] dark:text-[#F7F2E7]">Notificações Push</span>
                </div>
                <button
                  type="button"
                  onClick={() => updateSettings({ pushEnabled: !settings.pushEnabled })}
                  className={`w-11 h-6 rounded-full transition-colors relative active:scale-95 ${
                    settings.pushEnabled ? 'bg-[#6E44FF] dark:bg-[#7C5CFF]' : 'bg-[#DFD5C3] dark:bg-[#322653]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 shadow-sm ${
                    settings.pushEnabled ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              <button
                onClick={handleTestPush}
                disabled={isTestingPush}
                className="w-full py-2.5 px-4 rounded-xl bg-[#EDE5D5] hover:bg-[#DFD5C3] dark:bg-[#322653] dark:hover:bg-[#3e3066] text-[#231942] dark:text-[#F7F2E7] text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-[#6E44FF] dark:text-[#7C5CFF]" />
                <span>{isTestingPush ? 'Enviando...' : 'Testar Notificação Push'}</span>
              </button>
            </div>

            {/* Bloqueio Biométrico */}
            <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#241C3D]/80 backdrop-blur-md border border-[#DFD5C3]/80 dark:border-[#322653] space-y-2.5 transition-all shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#6E44FF] dark:text-[#7C5CFF]" />
                  <span className="text-xs font-bold text-[#231942] dark:text-[#F7F2E7]">Bloqueio Biométrico</span>
                </div>
              </div>

              <button
                onClick={lockApp}
                className="w-full py-2.5 px-4 rounded-xl bg-[#231942] hover:bg-[#2D2054] dark:bg-[#6E44FF] dark:hover:bg-[#5A32E6] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Bloquear Aplicativo Agora</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fila de Lembretes Ativos */}
      <div className="bg-[#FCF9F2]/75 dark:bg-[#1A142D]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-white/70 dark:border-[#322653] shadow-[0_8px_30px_rgb(35,25,66,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-[#231942] dark:text-[#F7F2E7] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#D97706]" />
              <span>Lembretes Ativos</span>
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FEF3C7] dark:bg-[#D97706]/20 text-[#D97706] font-bold">
            {activeReminders.length} lembrete{activeReminders.length !== 1 ? 's' : ''}
          </span>
        </div>

        {activeReminders.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#241C3D]/40 border border-dashed border-[#DFD5C3] dark:border-[#322653] text-center space-y-1">
            <Bell className="w-7 h-7 text-[#655A7C]/40 dark:text-[#A69BB8]/40 mx-auto mb-2" />
            <p className="text-xs font-bold text-[#231942] dark:text-[#F7F2E7]">Nenhum lembrete agendado</p>
            <p className="text-[11px] font-semibold text-[#655A7C] dark:text-[#A69BB8]">
              Lançamentos com alertas ativados serão listados aqui até serem quitados.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeReminders.map(bill => (
              <div
                key={bill.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/90 dark:bg-[#241C3D]/80 backdrop-blur-sm border border-[#DFD5C3] dark:border-[#322653] hover:border-[#6E44FF]/40 dark:hover:border-[#7C5CFF]/60 hover:-translate-y-0.5 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] dark:bg-[#D97706]/20 text-[#D97706] flex items-center justify-center shrink-0 shadow-sm">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[#231942] dark:text-[#F7F2E7] truncate">{bill.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-[#655A7C] dark:text-[#A69BB8]">
                      <span>Vence em {formatDateBR(bill.dueDate)}</span>
                      <span>•</span>
                      <span className="text-[#6E44FF] dark:text-[#7C5CFF] font-bold truncate">
                        {bill.notifyPush ? 'Push ' : ''}{bill.notifyEmail ? '+ E-mail' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs sm:text-sm font-black text-[#231942] dark:text-[#F7F2E7] whitespace-nowrap">
                    {formatCurrency(bill.amount)}
                  </span>
                  <button
                    onClick={() => togglePaid(bill.id)}
                    className="px-2.5 py-1 rounded-xl bg-[#1F9D73] hover:bg-[#18805D] text-white text-xs font-bold active:scale-95 transition-all shadow-sm"
                  >
                    Dar Baixa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;
