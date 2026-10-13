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
  Trash2,
  AlertOctagon,
  RotateCcw,
  PiggyBank
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
    resetAllData
  } = useFinance();

  const [userName, setUserName] = useState(settings.userName || '');
  const [userEmail, setUserEmail] = useState(settings.userEmail || '');
  const [budgetCeiling, setBudgetCeiling] = useState(settings.monthlyBudgetCeiling ? settings.monthlyBudgetCeiling.toString() : '');
  const [emergencyGoal, setEmergencyGoal] = useState(settings.emergencyGoal ? settings.emergencyGoal.toString() : '');
  const [isTestingPush, setIsTestingPush] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState(false);

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

  const handleConfirmReset = async () => {
    await resetAllData();
    setUserName('');
    setUserEmail('');
    setBudgetCeiling('');
    setEmergencyGoal('');
    setShowResetConfirm(false);
    setResetSuccessMessage(true);
    setTimeout(() => setResetSuccessMessage(false), 3500);
  };

  const activeReminders = upcomingBills.filter(b => b.notifyEnabled);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft">
        <h2 className="text-xl font-extrabold text-[#231942]">Configurações & Central de Alertas</h2>
        <p className="text-xs text-[#655A7C]">Personalize notificações push, e-mail, metas e regras de segurança</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Perfil e Parâmetros Orçamentários */}
        <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#DFD5C3]">
            <div className="w-9 h-9 rounded-xl bg-[#E5DEFF] text-[#6E44FF] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#231942]">Perfil & Metas Financeiras</h3>
              <p className="text-xs text-[#655A7C]">Dados para personalização do app</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#655A7C] mb-1">Seu Nome / Apelido</label>
              <input
                type="text"
                placeholder="Ex: Lucas"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-sm font-semibold text-[#231942] placeholder:text-[#655A7C]/50 focus:outline-none focus:ring-2 focus:ring-[#6E44FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#655A7C] mb-1">E-mail para Avisos de Cobrança</label>
              <input
                type="email"
                placeholder="Seu e-mail para receber alertas de vencimento"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-sm font-semibold text-[#231942] placeholder:text-[#655A7C]/50 focus:outline-none focus:ring-2 focus:ring-[#6E44FF]"
              />
              <span className="text-[11px] text-[#655A7C] mt-1 block">
                Deixe em branco se preferir usar apenas notificações no app/celular
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#655A7C] mb-1">Teto Mensal Geral do Orçamento (R$)</label>
              <input
                type="number"
                placeholder="Ex: 5000"
                value={budgetCeiling}
                onChange={e => setBudgetCeiling(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-sm font-bold text-[#6E44FF] placeholder:text-[#655A7C]/50 focus:outline-none focus:ring-2 focus:ring-[#6E44FF]"
              />
              <span className="text-[11px] text-[#655A7C] mt-1 block">
                Usado na barra de progresso FinWise no cabeçalho
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#655A7C] mb-1">Meta da Reserva de Emergência (R$)</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Ex: 15000"
                  value={emergencyGoal}
                  onChange={e => setEmergencyGoal(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DFD5C3] text-sm font-bold text-[#1F9D73] placeholder:text-[#655A7C]/50 focus:outline-none focus:ring-2 focus:ring-[#6E44FF]"
                />
                <PiggyBank className="w-4 h-4 text-[#1F9D73] absolute left-3.5 top-3" />
              </div>
              <span className="text-[11px] text-[#655A7C] mt-1 block">
                Alvo de economia exibido no card de Reserva do Dashboard
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#6E44FF] hover:bg-[#5A32E6] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-2"
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
              Proteja o aplicativo contra olhares curiosos com o sensor digital ou biometria facial do seu aparelho.
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
            {activeReminders.length} lembrete{activeReminders.length !== 1 ? 's' : ''}
          </span>
        </div>

        {activeReminders.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white/70 border border-dashed border-[#DFD5C3] text-center space-y-2">
            <Bell className="w-7 h-7 text-[#655A7C]/40 mx-auto" />
            <p className="text-xs font-bold text-[#231942]">Nenhum lembrete ou conta pendente agendada no momento</p>
            <p className="text-[11px] text-[#655A7C] max-w-md mx-auto">
              Ao adicionar novos lançamentos de saída ou dívidas com a opção &quot;Alertas de Vencimento&quot; ativada, eles ficarão listados aqui até serem quitados.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeReminders.map(bill => (
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
        )}
      </div>

      {/* Item 5: Zona de Perigo & Reset de Dados */}
      <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#E0533C]/30 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#DFD5C3]">
          <div className="w-9 h-9 rounded-xl bg-[#FDE8E5] text-[#E0533C] flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#E0533C]">Zona de Perigo — Gerenciamento de Armazenamento</h3>
            <p className="text-xs text-[#655A7C]">Limpeza do banco local do aplicativo neste dispositivo</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DFD5C3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-[#231942]">Resetar todos os dados do App</h4>
            <p className="text-xs text-[#655A7C] max-w-xl">
              Apaga permanentemente todas as movimentações, categorias criadas, metas orçamentárias e e-mail salvos no armazenamento local (<code className="text-[#6E44FF]">localStorage</code>), retornando o Noctis ao estado inicial 100% limpo.
            </p>
          </div>

          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="py-2.5 px-4 rounded-xl bg-[#FDE8E5] hover:bg-[#E0533C] text-[#E0533C] hover:text-white border border-[#E0533C]/40 text-xs font-bold flex items-center gap-2 transition-all shrink-0 active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>Resetar Dados</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleConfirmReset}
                className="py-2.5 px-4 rounded-xl bg-[#E0533C] hover:bg-[#c23d28] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmar e Zerar Tudo</span>
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 px-3 rounded-xl bg-[#EDE5D5] hover:bg-[#DFD5C3] text-[#231942] text-xs font-semibold transition-all"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {resetSuccessMessage && (
          <div className="p-3 rounded-xl bg-[#E1F7EF] border border-[#1F9D73] text-[#1F9D73] text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Todos os dados foram resetados com sucesso! O Noctis está 100% zerado e pronto para uso real.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;
