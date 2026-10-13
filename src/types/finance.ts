export type MacroPillarId = 
  | 'fixed'      // Custos Fixos & Essenciais
  | 'debts'      // Dívidas & Compromissos
  | 'routine'    // Rotina, Casa & Dependentes
  | 'lifestyle'  // Estilo de Vida & Variáveis
  | 'wealth';    // Patrimônio & Reserva

export type TransactionType = 'income' | 'expense' | 'savings';

export type RecurrenceType = 'single' | 'fixed_monthly' | 'installment';

export interface SubCategory {
  id: string;
  name: string;
  pillarId: MacroPillarId;
  iconName: string;
  monthlyBudget: number; // Teto mensal em R$
  color?: string;
  isCustom?: boolean;
}

export interface MacroPillar {
  id: MacroPillarId;
  name: string;
  shortName: string;
  description: string;
  color: string;
  softBg: string;
  borderColor: string;
  iconName: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  pillarId?: MacroPillarId; // Opcional se for 'income'
  subCategoryId: string;
  recurrence: RecurrenceType;
  currentInstallment?: number;
  totalInstallments?: number;
  dueDate: string; // YYYY-MM-DD
  paid: boolean;
  paidDate?: string;
  notifyEnabled: boolean;
  notifyPush: boolean;
  notifyEmail: boolean;
  notes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  date: string;
  type: 'reminder' | 'warning' | 'update' | 'transaction';
  read: boolean;
  amount?: number;
  transactionId?: string;
}

export interface UserSettings {
  userName: string;
  userEmail: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  monthlyBudgetCeiling: number;
  biometricsEnabled: boolean;
}

export interface MonthlyComparison {
  month: string;
  income: number;
  expense: number;
  savings: number;
}
