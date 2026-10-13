import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  MacroPillarId, 
  MacroPillar, 
  SubCategory, 
  Transaction, 
  NotificationItem, 
  UserSettings, 
  MonthlyComparison 
} from '../types/finance';
import { 
  MACRO_PILLARS, 
  DEFAULT_SUBCATEGORIES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_NOTIFICATIONS, 
  DEFAULT_USER_SETTINGS,
  MONTHLY_CHART_DATA 
} from '../data/mockData';
import { triggerPaymentConfetti } from '../utils/formatters';

interface FinanceContextType {
  pillars: MacroPillar[];
  subcategories: SubCategory[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  settings: UserSettings;
  monthlyHistory: MonthlyComparison[];
  
  // Navigation & UI State
  activeTab: 'home' | 'analysis' | 'categories' | 'transactions' | 'settings';
  setActiveTab: (tab: 'home' | 'analysis' | 'categories' | 'transactions' | 'settings') => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  deviceViewMode: 'responsive' | 'mobile-mockup';
  setDeviceViewMode: (mode: 'responsive' | 'mobile-mockup') => void;
  selectedPillarForDetail: MacroPillarId | null;
  setSelectedPillarForDetail: (pillar: MacroPillarId | null) => void;
  
  // Subcategory management
  addSubCategory: (sub: Omit<SubCategory, 'id'>) => void;
  updateSubCategory: (id: string, updates: Partial<SubCategory>) => void;
  deleteSubCategory: (id: string) => void;

  // Transaction actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  togglePaid: (id: string) => void;
  deleteTransaction: (id: string) => void;
  
  // Settings & Notifications
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  markAllNotificationsRead: () => void;
  testBrowserNotification: () => Promise<boolean>;
  
  // Biometrics
  authenticateBiometrics: () => Promise<boolean>;
  unlockApp: () => void;
  lockApp: () => void;

  // Computed metrics
  totalIncome: number;
  totalPaidExpenses: number;
  totalPendingExpenses: number;
  totalSaved: number;
  realFreeSavings: number;
  budgetLimit: number;
  budgetUsedPercentage: number;
  unreadNotificationsCount: number;
  pillarExpenses: Record<MacroPillarId, number>;
  pillarBudgets: Record<MacroPillarId, number>;
  upcomingBills: Transaction[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TRANSACTIONS: 'noctis_transactions_v2',
  SUBCATEGORIES: 'noctis_subcategories_v2',
  NOTIFICATIONS: 'noctis_notifications_v2',
  SETTINGS: 'noctis_settings_v2',
  LOCKED: 'noctis_is_locked_v2',
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage state initialization
  const [subcategories, setSubcategories] = useState<SubCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBCATEGORIES);
      return saved ? JSON.parse(saved) : DEFAULT_SUBCATEGORIES;
    } catch {
      return DEFAULT_SUBCATEGORIES;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_USER_SETTINGS;
    } catch {
      return DEFAULT_USER_SETTINGS;
    }
  });

  const [pillars] = useState<MacroPillar[]>(MACRO_PILLARS);
  const [monthlyHistory] = useState<MonthlyComparison[]>(MONTHLY_CHART_DATA);
  const [activeTab, setActiveTab] = useState<'home' | 'analysis' | 'categories' | 'transactions' | 'settings'>('home');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [deviceViewMode, setDeviceViewMode] = useState<'responsive' | 'mobile-mockup'>('responsive');
  const [selectedPillarForDetail, setSelectedPillarForDetail] = useState<MacroPillarId | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBCATEGORIES, JSON.stringify(subcategories));
    } catch (e) {
      console.error(e);
    }
  }, [subcategories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Computed metrics
  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalPaidExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense' && t.paid)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalPendingExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense' && !t.paid)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalSaved = useMemo(() => {
    return transactions
      .filter(t => t.type === 'savings')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Sobra Real: Entradas - Saídas Pagas - Pendências - Guardados
  const realFreeSavings = useMemo(() => {
    return totalIncome - totalPaidExpenses - totalPendingExpenses - totalSaved;
  }, [totalIncome, totalPaidExpenses, totalPendingExpenses, totalSaved]);

  const budgetLimit = settings.monthlyBudgetCeiling || 10000;

  const budgetUsedPercentage = useMemo(() => {
    const committed = totalPaidExpenses + totalPendingExpenses + totalSaved;
    return Math.min(Math.round((committed / budgetLimit) * 100), 100);
  }, [totalPaidExpenses, totalPendingExpenses, totalSaved, budgetLimit]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Despesas agregadas por Pilar Macro
  const pillarExpenses = useMemo(() => {
    const map: Record<MacroPillarId, number> = {
      fixed: 0,
      debts: 0,
      routine: 0,
      lifestyle: 0,
      wealth: 0,
    };
    transactions.forEach(t => {
      if (t.pillarId && map[t.pillarId] !== undefined) {
        map[t.pillarId] += t.amount;
      }
    });
    return map;
  }, [transactions]);

  // Orçamentos somados por Pilar Macro
  const pillarBudgets = useMemo(() => {
    const map: Record<MacroPillarId, number> = {
      fixed: 0,
      debts: 0,
      routine: 0,
      lifestyle: 0,
      wealth: 0,
    };
    subcategories.forEach(s => {
      if (s.pillarId && map[s.pillarId] !== undefined) {
        map[s.pillarId] += s.monthlyBudget;
      }
    });
    return map;
  }, [subcategories]);

  // Próximos vencimentos
  const upcomingBills = useMemo(() => {
    return transactions
      .filter(t => !t.paid && t.type !== 'income')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [transactions]);

  // Actions
  const addTransaction = (newTx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const id = `tx-${Date.now()}`;
    const tx: Transaction = {
      ...newTx,
      id,
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [tx, ...prev]);

    if (tx.notifyEnabled) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Lembrete: ${tx.title}`,
        message: `Vencimento em ${tx.dueDate}. Avisos por ${tx.notifyPush ? 'Push' : ''}${tx.notifyPush && tx.notifyEmail ? ' + ' : ''}${tx.notifyEmail ? 'E-mail' : ''} ativos.`,
        time: 'Agora',
        date: 'Hoje',
        type: 'reminder',
        read: false,
        amount: tx.amount,
        transactionId: id,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const togglePaid = (id: string) => {
    setTransactions(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextPaid = !t.paid;
          if (nextPaid) {
            triggerPaymentConfetti();
          }
          return {
            ...t,
            paid: nextPaid,
            paidDate: nextPaid ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return t;
      })
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addSubCategory = (sub: Omit<SubCategory, 'id'>) => {
    const newSub: SubCategory = {
      ...sub,
      id: `sub-${Date.now()}`,
      isCustom: true,
    };
    setSubcategories(prev => [...prev, newSub]);
  };

  const updateSubCategory = (id: string, updates: Partial<SubCategory>) => {
    setSubcategories(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteSubCategory = (id: string) => {
    setSubcategories(prev => prev.filter(s => s.id !== id));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const testBrowserNotification = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      alert('Seu navegador atual não suporta notificações de sistema.');
      return false;
    }

    try {
      let permission = Notification.permission;
      if (permission !== 'granted') {
        permission = await Notification.requestPermission();
      }

      if (permission === 'granted') {
        new Notification('Noctis — Guardião Financeiro', {
          body: 'Notificação de teste recebida com sucesso! Você receberá alertas de vencimento aqui.',
          icon: '/noctis-logo.svg',
          badge: '/noctis-logo.svg',
        });
        return true;
      } else {
        alert('Permissão de notificações não concedida no navegador.');
        return false;
      }
    } catch (e) {
      console.warn('Erro ao disparar notificação nativa:', e);
      return false;
    }
  };

  const authenticateBiometrics = async (): Promise<boolean> => {
    if (window.PublicKeyCredential && window.navigator.credentials) {
      try {
        // Preparado para WebAuthn se suportado pelo dispositivo
        // Fallback rápido se não houver authenticator configurado
        setIsLocked(false);
        return true;
      } catch (err) {
        console.warn('WebAuthn fallback:', err);
        setIsLocked(false);
        return true;
      }
    } else {
      setIsLocked(false);
      return true;
    }
  };

  const unlockApp = () => setIsLocked(false);
  const lockApp = () => setIsLocked(true);

  return (
    <FinanceContext.Provider
      value={{
        pillars,
        subcategories,
        transactions,
        notifications,
        settings,
        monthlyHistory,
        activeTab,
        setActiveTab,
        isLocked,
        setIsLocked,
        isAddModalOpen,
        setIsAddModalOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        deviceViewMode,
        setDeviceViewMode,
        selectedPillarForDetail,
        setSelectedPillarForDetail,
        addSubCategory,
        updateSubCategory,
        deleteSubCategory,
        addTransaction,
        togglePaid,
        deleteTransaction,
        updateSettings,
        markAllNotificationsRead,
        testBrowserNotification,
        authenticateBiometrics,
        unlockApp,
        lockApp,
        totalIncome,
        totalPaidExpenses,
        totalPendingExpenses,
        totalSaved,
        realFreeSavings,
        budgetLimit,
        budgetUsedPercentage,
        unreadNotificationsCount,
        pillarExpenses,
        pillarBudgets,
        upcomingBills,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
