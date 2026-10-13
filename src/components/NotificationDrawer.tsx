import React, { useState } from 'react';
import { X, Bell, CheckCheck, Send, Mail, Smartphone, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

export const NotificationDrawer: React.FC = () => {
  const { 
    isNotificationOpen, 
    setIsNotificationOpen, 
    notifications, 
    markAllNotificationsRead,
    settings,
    updateSettings,
    testBrowserNotification
  } = useFinance();

  const [emailInput, setEmailInput] = useState(settings.userEmail);
  const [isTestingPush, setIsTestingPush] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  if (!isNotificationOpen) return null;

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ userEmail: emailInput.trim() });
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  const handleTestPush = async () => {
    setIsTestingPush(true);
    await testBrowserNotification();
    setIsTestingPush(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#231942]/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FCF9F2]/95 backdrop-blur-2xl h-full shadow-[0_0_50px_rgba(35,25,66,0.25)] flex flex-col justify-between border-l border-white/80 p-6 overflow-y-auto">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#DFD5C3]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#E5DEFF] text-[#6E44FF] flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#231942]">Central de Alertas</h3>
                <p className="text-xs text-[#655A7C]">Lembretes no App e no E-mail</p>
              </div>
            </div>

            <button
              onClick={() => setIsNotificationOpen(false)}
              className="w-9 h-9 rounded-full bg-[#EDE5D5] text-[#231942] hover:bg-[#DFD5C3] flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action: Mark all read */}
          <div className="flex items-center justify-between py-3">
            <span className="text-xs font-bold text-[#655A7C]">Fila de Notificações</span>
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-bold text-[#6E44FF] hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Marcar todas como lidas</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3 mt-1">
            {notifications.map(item => {
              const isWarning = item.type === 'warning';
              const isReminder = item.type === 'reminder';

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    item.read
                      ? 'bg-white/70 border-[#DFD5C3]'
                      : 'bg-[#EDE5D5]/70 border-[#6E44FF]/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm ${
                        isWarning
                          ? 'bg-[#FEF3C7] text-[#D97706]'
                          : isReminder
                          ? 'bg-[#E5DEFF] text-[#6E44FF]'
                          : 'bg-[#E1F7EF] text-[#1F9D73]'
                      }`}
                    >
                      {isWarning ? <AlertTriangle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#231942] truncate">{item.title}</h4>
                        <span className="text-[10px] text-[#655A7C] font-semibold">{item.time}</span>
                      </div>
                      <p className="text-xs text-[#655A7C] mt-0.5 leading-relaxed">{item.message}</p>
                      {item.amount && (
                        <div className="text-xs font-extrabold text-[#231942] mt-1">
                          {formatCurrency(item.amount)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Push & Email Configuration */}
        <div className="pt-6 mt-6 border-t border-[#DFD5C3] space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6E44FF]" />
            <h4 className="text-xs font-bold text-[#231942] uppercase tracking-wider">
              Canais de Disparo
            </h4>
          </div>

          {/* Native Browser Push Test */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#DFD5C3] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#6E44FF]" />
                <span className="text-xs font-bold text-[#231942]">Notificação Push Nativa</span>
              </div>
              <button
                type="button"
                onClick={() => updateSettings({ pushEnabled: !settings.pushEnabled })}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  settings.pushEnabled ? 'bg-[#6E44FF]' : 'bg-[#DFD5C3]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                  settings.pushEnabled ? 'right-0.5' : 'left-0.5'
                }`} />
              </button>
            </div>
            
            <p className="text-[11px] text-[#655A7C]">
              Dispara lembrete na tela do celular ou PC mesmo em background.
            </p>

            <button
              onClick={handleTestPush}
              disabled={isTestingPush}
              className="w-full py-2 px-3 rounded-xl bg-[#EDE5D5] hover:bg-[#DFD5C3] text-[#231942] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-3 h-3 text-[#6E44FF]" />
              <span>{isTestingPush ? 'Enviando...' : 'Testar Notificação Push no Navegador'}</span>
            </button>
          </div>

          {/* Email Settings */}
          <form onSubmit={handleSaveEmail} className="p-3.5 rounded-2xl bg-white border border-[#DFD5C3] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1F9D73]" />
                <span className="text-xs font-bold text-[#231942]">Alerta por E-mail</span>
              </div>
              <button
                type="button"
                onClick={() => updateSettings({ emailEnabled: !settings.emailEnabled })}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  settings.emailEnabled ? 'bg-[#1F9D73]' : 'bg-[#DFD5C3]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                  settings.emailEnabled ? 'right-0.5' : 'left-0.5'
                }`} />
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                required
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#EDE5D5]/50 border border-[#DFD5C3] text-xs font-medium text-[#231942] focus:outline-none focus:ring-1 focus:ring-[#6E44FF]"
              />
              <button
                type="submit"
                className="py-1.5 px-3 rounded-xl bg-[#231942] text-white text-xs font-bold hover:bg-[#6E44FF] transition-colors"
              >
                {saveFeedback ? 'Salvo!' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
