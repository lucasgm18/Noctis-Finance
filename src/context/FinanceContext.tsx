import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  MacroPillarId, 
  MacroPillar, 
  SubCategory, 
  Transaction, 
  NotificationItem, 
  UserSettings, 
  MonthlyComparison,
  SyncStatus,
  TransactionType,
  RecurrenceType
} from '../types/finance';
import { 
  MACRO_PILLARS, 
  DEFAULT_SUBCATEGORIES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_NOTIFICATIONS, 
  DEFAULT_USER_SETTINGS,
} from '../data/mockData';
import { triggerPaymentConfetti } from '../utils/formatters';
import { supabase, DBSubcategory, DBTransaction, DBUserSettings } from '../lib/supabase';

interface FinanceContextType {
  pillars: MacroPillar[];
  subcategories: SubCategory[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  settings: UserSettings;
  monthlyHistory: MonthlyComparison[];
  
  // Realtime & Sync
  syncStatus: SyncStatus;
  refreshFromSupabase: () => Promise<void>;

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
  addSubCategory: (sub: Omit<SubCategory, 'id'>) => Promise<SubCategory | null>;
  updateSubCategory: (id: string, updates: Partial<SubCategory>) => Promise<void>;
  deleteSubCategory: (id: string) => Promise<void>;

  // Transaction actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Promise<Transaction | null>;
  togglePaid: (id: string) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Settings & Notifications
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  markAllNotificationsRead: () => void;
  testBrowserNotification: () => Promise<boolean>;
  resetAllData: () => Promise<void>;
  
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

// Storage keys de cache local seguro
const STORAGE_KEYS = {
  TRANSACTIONS: 'noctis_prod_v1_transactions',
  SUBCATEGORIES: 'noctis_prod_v1_subcategories',
  NOTIFICATIONS: 'noctis_prod_v1_notifications',
  SETTINGS: 'noctis_prod_v1_settings',
  LOCKED: 'noctis_prod_v1_is_locked',
};

const LEGACY_STORAGE_KEYS = [
  'noctis_transactions_v2',
  'noctis_subcategories_v2',
  'noctis_notifications_v2',
  'noctis_settings_v2',
  'noctis_is_locked_v2',
];

// Funções de mapeamento DB <-> App
function mapDBSubcategory(row: DBSubcategory): SubCategory {
  return {
    id: row.id,
    name: row.name,
    pillarId: (row.macro_pillar as MacroPillarId) || 'fixed',
    iconName: row.icon || 'Tag',
    monthlyBudget: Number(row.monthly_limit || 0),
  };
}

function mapDBTransaction(row: DBTransaction): Transaction {
  return {
    id: row.id,
    title: row.title,
    notes: row.notes || undefined,
    amount: Number(row.amount || 0),
    type: (row.type as TransactionType) || 'expense',
    pillarId: (row.macro_pillar && row.macro_pillar !== 'income') ? (row.macro_pillar as MacroPillarId) : undefined,
    subCategoryId: row.subcategory_id || '',
    recurrence: (row.recurrence as RecurrenceType) || 'single',
    currentInstallment: row.installment_current ?? undefined,
    totalInstallments: row.installment_total ?? undefined,
    dueDate: row.due_date || (row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
    paid: Boolean(row.is_paid),
    paidDate: row.paid_at || undefined,
    notifyEnabled: Boolean(row.notify_push || row.notify_email),
    notifyPush: Boolean(row.notify_push),
    notifyEmail: Boolean(row.notify_email),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Limpeza de chaves legadas de rascunhos antigos
  useEffect(() => {
    LEGACY_STORAGE_KEYS.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Erro ao purgar chave legada:', e);
      }
    });
  }, []);

  // State com fallback em cache local para carregamento instantâneo
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

  const [syncStatus, setSyncStatus] = useState<SyncStatus>('syncing');
  const [pillars] = useState<MacroPillar[]>(MACRO_PILLARS);
  const [activeTab, setActiveTab] = useState<'home' | 'analysis' | 'categories' | 'transactions' | 'settings'>('home');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [deviceViewMode, setDeviceViewMode] = useState<'responsive' | 'mobile-mockup'>('responsive');
  const [selectedPillarForDetail, setSelectedPillarForDetail] = useState<MacroPillarId | null>(null);

  // Espelhamento no LocalStorage para resiliência offline (PWA)
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
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Fetch individual de subcategorias do Supabase
  const fetchSubcategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) {
        setSubcategories(data.map(mapDBSubcategory));
      }
    } catch (err) {
      console.warn('Erro ao carregar subcategorias do Supabase:', err);
    }
  }, []);

  // Fetch individual de transações do Supabase
  const fetchTransactions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setTransactions(data.map(mapDBTransaction));
      }
    } catch (err) {
      console.warn('Erro ao carregar transações do Supabase:', err);
    }
  }, []);

  // Fetch individual de configurações do Supabase
  const fetchUserSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSettings(prev => ({
          ...prev,
          userEmail: data.alert_email || '',
          monthlyBudgetCeiling: Number(data.monthly_budget_limit || 0),
          emergencyGoal: Number(data.emergency_reserve_goal || 0),
        }));
      }
    } catch (err) {
      console.warn('Erro ao carregar configurações do Supabase:', err);
    }
  }, []);

  // Sincronização geral completa (Refresh)
  const refreshFromSupabase = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      await Promise.all([
        fetchSubcategories(),
        fetchTransactions(),
        fetchUserSettings()
      ]);
      setSyncStatus('synced');
    } catch (err) {
      console.error('Falha geral na sincronização com Supabase:', err);
      setSyncStatus('error');
    }
  }, [fetchSubcategories, fetchTransactions, fetchUserSettings]);

  // Sincronização em Tempo Real (Realtime WebSockets)
  useEffect(() => {
    refreshFromSupabase();

    const channel = supabase
      .channel('noctis-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subcategories' },
        () => {
          fetchSubcategories();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => {
          fetchTransactions();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_settings' },
        () => {
          fetchUserSettings();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setSyncStatus('synced');
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setSyncStatus('error');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshFromSupabase, fetchSubcategories, fetchTransactions, fetchUserSettings]);

  // Histórico Mensal Calculado Dinamicamente
  const monthlyHistory: MonthlyComparison[] = useMemo(() => {
    if (transactions.length === 0) {
      return [];
    }
    
    const monthMap: Record<string, { income: number; expense: number; savings: number }> = {};
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    transactions.forEach(t => {
      const date = t.dueDate || t.createdAt;
      if (!date) return;
      const [y, m] = date.split('-');
      if (!y || !m) return;
      const key = `${y}-${m}`;
      if (!monthMap[key]) {
        monthMap[key] = { income: 0, expense: 0, savings: 0 };
      }
      if (t.type === 'income') {
        monthMap[key].income += t.amount;
      } else if (t.type === 'savings') {
        monthMap[key].savings += t.amount;
      } else {
        monthMap[key].expense += t.amount;
      }
    });

    const sortedKeys = Object.keys(monthMap).sort();
    return sortedKeys.map(key => {
      const [, mStr] = key.split('-');
      const mIdx = parseInt(mStr, 10) - 1;
      const name = monthNames[mIdx] || key;
      return {
        month: name,
        monthKey: key,
        income: monthMap[key].income,
        expense: monthMap[key].expense,
        savings: monthMap[key].savings,
      };
    });
  }, [transactions]);

  // Métricas calculadas
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

  const realFreeSavings = useMemo(() => {
    return totalIncome - totalPaidExpenses - totalPendingExpenses - totalSaved;
  }, [totalIncome, totalPaidExpenses, totalPendingExpenses, totalSaved]);

  const budgetLimit = settings.monthlyBudgetCeiling || 0;

  const budgetUsedPercentage = useMemo(() => {
    if (budgetLimit <= 0) return 0;
    const committed = totalPaidExpenses + totalPendingExpenses + totalSaved;
    return Math.min(Math.round((committed / budgetLimit) * 100), 100);
  }, [totalPaidExpenses, totalPendingExpenses, totalSaved, budgetLimit]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const pillarExpenses = useMemo(() => {
    const expenses: Record<MacroPillarId, number> = {
      fixed: 0,
      debts: 0,
      routine: 0,
      lifestyle: 0,
      wealth: 0,
    };
    transactions.forEach(t => {
      if (t.pillarId && expenses[t.pillarId] !== undefined) {
        expenses[t.pillarId] += t.amount;
      }
    });
    return expenses;
  }, [transactions]);

  const pillarBudgets = useMemo(() => {
    const budgets: Record<MacroPillarId, number> = {
      fixed: 0,
      debts: 0,
      routine: 0,
      lifestyle: 0,
      wealth: 0,
    };
    subcategories.forEach(s => {
      if (budgets[s.pillarId] !== undefined) {
        budgets[s.pillarId] += s.monthlyBudget;
      }
    });
    return budgets;
  }, [subcategories]);

  const upcomingBills = useMemo(() => {
    return transactions
      .filter(t => !t.paid && t.dueDate)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [transactions]);

  // Ações de Subcategorias
  const addSubCategory = async (sub: Omit<SubCategory, 'id'>): Promise<SubCategory | null> => {
    setSyncStatus('syncing');
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .insert({
          name: sub.name,
          macro_pillar: sub.pillarId,
          icon: sub.iconName || 'Tag',
          monthly_limit: sub.monthlyBudget || 0,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const created = mapDBSubcategory(data);
        setSubcategories(prev => [...prev.filter(s => s.id !== created.id), created]);
        setSyncStatus('synced');
        return created;
      }
    } catch (err) {
      console.error('Erro ao adicionar subcategoria:', err);
      setSyncStatus('error');
    }
    return null;
  };

  const updateSubCategory = async (id: string, updates: Partial<SubCategory>) => {
    setSyncStatus('syncing');
    setSubcategories(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    try {
      const payload: Partial<DBSubcategory> = {};
      if (updates.name) payload.name = updates.name;
      if (updates.pillarId) payload.macro_pillar = updates.pillarId;
      if (updates.iconName) payload.icon = updates.iconName;
      if (updates.monthlyBudget !== undefined) payload.monthly_limit = updates.monthlyBudget;

      const { error } = await supabase
        .from('subcategories')
        .update(payload)
        .eq('id', id);

      if (error) throw error;
      setSyncStatus('synced');
    } catch (err) {
      console.error('Erro ao atualizar subcategoria no Supabase:', err);
      setSyncStatus('error');
    }
  };

  const deleteSubCategory = async (id: string) => {
    setSyncStatus('syncing');
    setSubcategories(prev => prev.filter(s => s.id !== id));
    try {
      await supabase.from('transactions').delete().eq('subcategory_id', id);
      const { error } = await supabase.from('subcategories').delete().eq('id', id);
      if (error) throw error;
      setSyncStatus('synced');
    } catch (err) {
      console.error('Erro ao deletar subcategoria no Supabase:', err);
      setSyncStatus('error');
    }
  };

  // Ações de Transações
  const addTransaction = async (tx: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction | null> => {
    setSyncStatus('syncing');
    try {
      const sub = subcategories.find(s => s.id === tx.subCategoryId);
      const isTemporaryId = tx.subCategoryId?.startsWith('sub-') || tx.subCategoryId === 'income-default';
      const effectiveSubId = isTemporaryId ? null : (tx.subCategoryId || null);
      const effectiveSubName = sub?.name || (tx.type === 'income' ? 'Entrada' : '');

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          title: tx.title,
          notes: tx.notes || null,
          amount: tx.amount,
          type: tx.type,
          macro_pillar: tx.pillarId || (tx.type === 'income' ? 'income' : 'fixed'),
          subcategory_id: effectiveSubId,
          subcategory_name: effectiveSubName,
          recurrence: tx.recurrence || 'single',
          installment_current: tx.currentInstallment || 1,
          installment_total: tx.totalInstallments || 1,
          due_date: tx.dueDate,
          is_paid: Boolean(tx.paid),
          paid_at: tx.paid ? (tx.paidDate || new Date().toISOString()) : null,
          notify_push: Boolean(tx.notifyPush),
          notify_email: Boolean(tx.notifyEmail),
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const created = mapDBTransaction(data);
        setTransactions(prev => [created, ...prev.filter(t => t.id !== created.id)]);
        setSyncStatus('synced');
        return created;
      }
    } catch (err) {
      console.error('Erro ao salvar transação no Supabase:', err);
      setSyncStatus('error');
    }
    return null;
  };

  const togglePaid = async (id: string) => {
    const current = transactions.find(t => t.id === id);
    if (!current) return;
    const newPaid = !current.paid;
    const paidDate = newPaid ? new Date().toISOString().split('T')[0] : undefined;

    // Atualização otimista imediata
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, paid: newPaid, paidDate } : t))
    );

    if (newPaid) {
      triggerPaymentConfetti();
    }

    setSyncStatus('syncing');
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          is_paid: newPaid,
          paid_at: newPaid ? new Date().toISOString() : null,
        })
        .eq('id', id);

      if (error) throw error;
      setSyncStatus('synced');
    } catch (err) {
      console.error('Erro ao alternar status pago no Supabase:', err);
      setSyncStatus('error');
    }
  };

  const deleteTransaction = async (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setSyncStatus('syncing');
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      setSyncStatus('synced');
    } catch (err) {
      console.error('Erro ao excluir transação no Supabase:', err);
      setSyncStatus('error');
    }
  };

  // Atualizar Ajustes do Usuário
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    setSyncStatus('syncing');
    try {
      const payload: Partial<DBUserSettings> = {
        updated_at: new Date().toISOString(),
      };
      if (newSettings.userEmail !== undefined) {
        payload.alert_email = newSettings.userEmail;
      }
      if (newSettings.monthlyBudgetCeiling !== undefined) {
        payload.monthly_budget_limit = newSettings.monthlyBudgetCeiling;
      }
      if (newSettings.emergencyGoal !== undefined) {
        payload.emergency_reserve_goal = newSettings.emergencyGoal;
      }

      const { error } = await supabase
        .from('user_settings')
        .update(payload)
        .eq('id', 1);

      if (error) throw error;
      setSyncStatus('synced');
    } catch (err) {
      console.error('Erro ao atualizar configurações no Supabase:', err);
      setSyncStatus('error');
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Resetar todos os dados do App (Local + Supabase PostgreSQL)
  const resetAllData = async () => {
    setSyncStatus('syncing');
    try {
      // 1. Limpar tabelas no Supabase
      await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('subcategories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('user_settings').update({
        alert_email: '',
        monthly_budget_limit: 0,
        emergency_reserve_goal: 0,
        emergency_reserve_current: 0,
        updated_at: new Date().toISOString(),
      }).eq('id', 1);
    } catch (err) {
      console.error('Erro ao zerar dados no Supabase:', err);
    }

    // 2. Limpar estado e cache local
    setTransactions([]);
    setSubcategories([]);
    setNotifications([]);
    setSettings(DEFAULT_USER_SETTINGS);

    Object.values(STORAGE_KEYS).forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch (e) {
        console.error(e);
      }
    });

    setSyncStatus('synced');
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
        syncStatus,
        refreshFromSupabase,
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
        resetAllData,
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
