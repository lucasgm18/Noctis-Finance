import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Lock, 
  Sliders, 
  ShieldCheck, 
  Send, 
  User, 
  DollarSign,
  CheckCircle2,
  AlertTriangle
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
    togglePaid
  } = useFinance();

  const [userName, setUserName] = useState(settings.userName);
  const [userEmail, setUserEmail] = useState(settings.userEmail);
  const [budgetCeiling, setBudgetCeiling] = useState(settings.monthlyBudgetCeiling.toString());
  const [isTestingPush, setIsTestingPush] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      monthlyBudgetCeiling: parseFloat(budgetCeiling) || 10000,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const handleTestPush = async () => {
    setIsTestingPush(true);
    await testBrowserNotification();
    setIsTestingPush(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft">
        <h2 className="text-xl font-extrabold text-[#231942]">Configurações & Central de Alertas</h2>
        <p className="text-xs text-[#655A7C]">Personalize notificações push, e-mail e regras de segurança</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Perfil e Parâmetros Orçamentários */}
        <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#DFD5C3]">
            <div className="w-9 h-9 rounded-xl bg-[#E5DEFF] text-[#6E44FF] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#231942]">Perfil & Orçamento Mensal</h3>
              <p className="text-xs text-[#655A7C]">Dados para personalização do app</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#655A7C] mb-1">Seu Nome / Apelido</label>
              <input
                type="text"
                required
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-sm font-semibold text-[#231942]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#655A7C] mb-1">E-mail para Avisos de Cobrança</label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-sm font-semibold text-[#231942]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#655A7C] mb-1">Teto Mensal Geral do Orçamento (R$)</label>
              <input
                type="number"
                required
                value={budgetCeiling}
                onChange={e => setBudgetCeiling(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-sm font-bold text-[#6E44FF]"
              />
              <span className="text-[11px] text-[#655A7C] mt-1 block">
                Usado na barra de progresso FinWise no cabeçalho
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#6E44FF] hover:bg-[#5A32E6] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
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

        {/* Card 2: Disparo de Alertas & Biometria */}
        <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#DFD5C3]">
            <div className="w-9 h-9 rounded-xl bg-[#E1F7EF] text-[#1F9D73] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#231942]">Disparo de Alertas & Segurança</h3>
              <p className="text-xs text-[#655A7C]">Web Push nativo e bloqueio biométrico</p>
            </div>
          </div>

          {/* Teste Push Nativo */}
          <div className="p-4 rounded-2xl bg-white border border-[#DFD5C3] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#6E44FF]" />
                <span className="text-xs font-bold text-[#231942]">Notificações Push no Celular/PC</span>
              </div>
              <button
                type="button"
                onClick={() => updateSettings({ pushEnabled: !settings.pushEnabled })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  settings.pushEnabled ? 'bg-[#6E44FF]' : 'bg-[#DFD5C3]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  settings.pushEnabled ? 'right-0.5' : 'left-0.5'
                }`} />
              </button>
            </div>

            <p className="text-xs text-[#655A7C]">
              Receba avisos instantâneos de vencimentos mesmo com o aplicativo fechado.
            </p>

            <button
              onClick={handleTestPush}
              disabled={isTestingPush}
              className="w-full py-2.5 px-4 rounded-xl bg-[#EDE5D5] hover:bg-[#DFD5C3] text-[#231942] text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-[#6E44FF]" />
              <span>{isTestingPush ? 'Enviando...' : 'Testar Notificação Push Nativa'}</span>
            </button>
          </div>

          {/* Bloqueio Biométrico */}
          <div className="p-4 rounded-2xl bg-white border border-[#DFD5C3] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#6E44FF]" />
                <span className="text-xs font-bold text-[#231942]">Desbloqueio Biométrico (TouchID / WebAuthn)</span>
              </div>
            </div>

            <p className="text-xs text-[#655A7C]">
              Proteja o aplicativo contra olhares curiosos com o sensor digital ou Face ID do seu aparelho.
            </p>

            <button
              onClick={lockApp}
              className="w-full py-2.5 px-4 rounded-xl bg-[#231942] hover:bg-[#2D2054] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Bloquear Aplicativo Agora (Testar Tela de Bloqueio)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fila de Lembretes Ativos */}
      <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#231942] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#D97706]" />
              <span>Fila de Lembretes Ativos Programados</span>
            </h3>
            <p className="text-xs text-[#655A7C]">Lançamentos que acionam avisos push e e-mail no vencimento</p>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] font-bold">
            {upcomingBills.filter(b => b.notifyEnabled).length} lembretes
          </span>
        </div>

        <div className="space-y-2.5">
          {upcomingBills.filter(b => b.notifyEnabled).map(bill => (
            <div
              key={bill.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#DFD5C3]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#231942]">{bill.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#655A7C]">
                    <span>Vence em {formatDateBR(bill.dueDate)}</span>
                    <span>•</span>
                    <span className="text-[#6E44FF] font-semibold">
                      {bill.notifyPush ? 'Push ' : ''}{bill.notifyEmail ? '+ E-mail' : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-extrabold text-[#231942]">
                  {formatCurrency(bill.amount)}
                </span>
                <button
                  onClick={() => togglePaid(bill.id)}
                  className="px-2.5 py-1 rounded-xl bg-[#1F9D73] text-white text-xs font-bold hover:bg-[#18805D]"
                >
                  Dar Baixa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
