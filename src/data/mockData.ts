import { MacroPillar, SubCategory, Transaction, NotificationItem, MonthlyComparison, UserSettings } from '../types/finance';

export const MACRO_PILLARS: MacroPillar[] = [
  {
    id: 'fixed',
    name: 'Custos Fixos & Essenciais',
    shortName: 'Fixos & Essenciais',
    description: 'Moradia, energia, água, internet, telefone, assinaturas e saúde.',
    color: '#6E44FF',
    softBg: '#E5DEFF',
    borderColor: '#DFD5C3',
    iconName: 'Home',
  },
  {
    id: 'debts',
    name: 'Dívidas & Compromissos',
    shortName: 'Dívidas & Parcelas',
    description: 'Faturas de cartão, empréstimos, parcelamentos, boletos agendados e acordos.',
    color: '#E0533C',
    softBg: '#FDE8E5',
    borderColor: '#DFD5C3',
    iconName: 'CreditCard',
  },
  {
    id: 'routine',
    name: 'Rotina, Casa & Dependentes',
    shortName: 'Rotina & Casa',
    description: 'Supermercado, mobilidade, cuidados e insumos pets e manutenção.',
    color: '#1F9D73',
    softBg: '#E1F7EF',
    borderColor: '#DFD5C3',
    iconName: 'ShoppingBag',
  },
  {
    id: 'lifestyle',
    name: 'Estilo de Vida & Variáveis',
    shortName: 'Estilo de Vida',
    description: 'Lazer, bares, restaurantes, compras por impulso, jogos e hobbies.',
    color: '#D97706',
    softBg: '#FEF3C7',
    borderColor: '#DFD5C3',
    iconName: 'Sparkles',
  },
  {
    id: 'wealth',
    name: 'Patrimônio & Reserva',
    shortName: 'Reserva & Investir',
    description: 'Dinheiro para guardar, reserva de emergência, metas e investimentos.',
    color: '#835FFF',
    softBg: '#ECE7FF',
    borderColor: '#DFD5C3',
    iconName: 'PiggyBank',
  },
];

// Estado 100% Limpo para Produção Real
export const DEFAULT_SUBCATEGORIES: SubCategory[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const MONTHLY_CHART_DATA: MonthlyComparison[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const DEFAULT_USER_SETTINGS: UserSettings = {
  userName: '',
  userEmail: '',
  pushEnabled: false,
  emailEnabled: false,
  monthlyBudgetCeiling: 0,
  emergencyGoal: 0,
  biometricsEnabled: true,
};
