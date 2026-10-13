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
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0F0B1A]/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FCF9F2]/95 dark:bg-[#1A142D]/95 backdrop-blur-2xl h-full shadow-[0_0_50px_rgba(0,0,0,0.4)] flex flex-col justify-between border-l border-white/80 dark:border-[#322653] p-6 overflow-y-auto">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#DFD5C3] dark:border-[#322653]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#E5DEFF] dark:bg-[#6E44FF]/25 text-[#6E44FF] dark:text-[#A78BFA] flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#231942] dark:text-[#F7F2E7]">Notificações</h3>
              </div>
            </div>

            <button
              onClick={() => setIsNotificationOpen(false)}
              className="w-9 h-9 rounded-full bg-[#EDE5D5] dark:bg-[#241C3D] text-[#231942] dark:text-[#F7F2E7] hover:bg-[#DFD5C3] dark:hover:bg-[#322653] flex items-center justify-center transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action: Mark all read */}
          <div className="flex items-center justify-between py-3">
            <span className="text-xs font-bold text-[#655A7C] dark:text-[#A69BB8]">Fila de Notificações</span>
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-bold text-[#6E44FF] dark:text-[#7C5CFF] hover:underline flex items-center gap-1 active:scale-95"
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
                      ? 'bg-white/70 dark:bg-[#241C3D]/60 border-[#DFD5C3] dark:border-[#322653]'
                      : 'bg-[#EDE5D5]/70 dark:bg-[#2e244d] border-[#6E44FF]/40 dark:border-[#7C5CFF]/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm ${
                        isWarning
                          ? 'bg-[#FEF3C7] dark:bg-[#D97706]/20 text-[#D97706]'
                          : isReminder
                          ? 'bg-[#E5DEFF] dark:bg-[#6E44FF]/25 text-[#6E44FF] dark:text-[#A78BFA]'
                          : 'bg-[#E1F7EF] dark:bg-[#1F9D73]/20 text-[#1F9D73] dark:text-[#34D399]'
                      }`}
                    >
                      {isWarning ? <AlertTriangle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-black text-[#231942] dark:text-[#F7F2E7] truncate">{item.title}</h4>
                        <span className="text-[10px] text-[#655A7C] dark:text-[#A69BB8] font-semibold">{item.time}</span>
                      </div>
                      <p className="text-xs font-medium text-[#655A7C] dark:text-[#A69BB8] mt-0.5 leading-relaxed">{item.message}</p>
                      {item.amount && (
                        <div className="text-xs font-black text-[#231942] dark:text-[#F7F2E7] mt-1">
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
        <div className="pt-6 mt-6 border-t border-[#DFD5C3] dark:border-[#322653] space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6E44FF] dark:text-[#7C5CFF]" />
            <h4 className="text-xs font-bold text-[#231942] dark:text-[#F7F2E7] uppercase tracking-wider">
              Canais de Disparo
            </h4>
          </div>

          {/* Native Browser Push Test */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#241C3D]/80 border border-[#DFD5C3] dark:border-[#322653] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#6E44FF] dark:text-[#7C5CFF]" />
                <span className="text-xs font-bold text-[#231942] dark:text-[#F7F2E7]">Notificação Push</span>
              </div>
              <button
                type="button"
                onClick={() => updateSettings({ pushEnabled: !settings.pushEnabled })}
                className={`w-10 h-5 rounded-full transition-colors relative active:scale-95 ${
                  settings.pushEnabled ? 'bg-[#6E44FF] dark:bg-[#7C5CFF]' : 'bg-[#DFD5C3] dark:bg-[#322653]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 shadow-sm ${
                  settings.pushEnabled ? 'right-0.5' : 'left-0.5'
                }`} />
              </button>
            </div>

            <button
              onClick={handleTestPush}
              disabled={isTestingPush}
              className="w-full py-2 px-3 rounded-xl bg-[#EDE5D5] hover:bg-[#DFD5C3] dark:bg-[#322653] dark:hover:bg-[#3e3066] text-[#231942] dark:text-[#F7F2E7] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            >
              <Send className="w-3 h-3 text-[#6E44FF] dark:text-[#7C5CFF]" />
              <span>{isTestingPush ? 'Enviando...' : 'Testar Notificação Push'}</span>
            </button>
          </div>

          {/* Email Settings */}
          <form onSubmit={handleSaveEmail} className="p-3.5 rounded-2xl bg-white dark:bg-[#241C3D]/80 border border-[#DFD5C3] dark:border-[#322653] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1F9D73] dark:text-[#34D399]" />
                <span className="text-xs font-bold text-[#231942] dark:text-[#F7F2E7]">Alerta por E-mail</span>
              </div>
              <button
                type="button"
                onClick={() => updateSettings({ emailEnabled: !settings.emailEnabled })}
                className={`w-10 h-5 rounded-full transition-colors relative active:scale-95 ${
                  settings.emailEnabled ? 'bg-[#1F9D73] dark:bg-[#1F9D73]' : 'bg-[#DFD5C3] dark:bg-[#322653]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 shadow-sm ${
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
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#EDE5D5]/50 dark:bg-[#1A142D] border border-[#DFD5C3] dark:border-[#322653] text-xs font-semibold text-[#231942] dark:text-[#F7F2E7] placeholder:text-[#655A7C]/50 dark:placeholder:text-[#A69BB8]/40 focus:outline-none focus:ring-1 focus:ring-[#6E44FF] dark:focus:ring-[#7C5CFF]"
              />
              <button
                type="submit"
                className="py-1.5 px-3 rounded-xl bg-[#231942] dark:bg-[#6E44FF] text-white text-xs font-bold hover:bg-[#6E44FF] dark:hover:bg-[#5A32E6] transition-colors active:scale-95"
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
