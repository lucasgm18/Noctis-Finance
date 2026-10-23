import { describe, it, expect } from 'vitest';
import {
  calculateMonthlyHistory,
  calculateFinanceTotals,
  calculatePillarExpenses,
  calculatePillarBudgets,
} from './calculations';
import { Transaction, SubCategory } from '../types/finance';

describe('calculations', () => {
  const sampleTransactions: Transaction[] = [
    {
      id: 'tx-1',
      title: 'Salário Mensal',
      amount: 10000,
      type: 'income',
      subCategoryId: 'sub-salary',
      recurrence: 'single',
      dueDate: '2026-10-05',
      paid: true,
      notifyEnabled: false,
      notifyPush: false,
      notifyEmail: false,
      createdAt: '2026-10-05T10:00:00Z',
    },
    {
      id: 'tx-2',
      title: 'Aluguel Pago',
      amount: 2500,
      type: 'expense',
      pillarId: 'fixed',
      subCategoryId: 'sub-rent',
      recurrence: 'fixed_monthly',
      dueDate: '2026-10-10',
      paid: true,
      paidDate: '2026-10-09',
      notifyEnabled: false,
      notifyPush: false,
      notifyEmail: false,
      createdAt: '2026-10-01T10:00:00Z',
    },
    {
      id: 'tx-3',
      title: 'Fatura do Cartão Pendente',
      amount: 1500,
      type: 'expense',
      pillarId: 'lifestyle',
      subCategoryId: 'sub-cc',
      recurrence: 'single',
      dueDate: '2026-10-25',
      paid: false,
      notifyEnabled: true,
      notifyPush: true,
      notifyEmail: false,
      createdAt: '2026-10-02T10:00:00Z',
    },
    {
      id: 'tx-4',
      title: 'Aporte Tesouro Direto',
      amount: 2000,
      type: 'savings',
      pillarId: 'wealth',
      subCategoryId: 'sub-invest',
      recurrence: 'single',
      dueDate: '2026-10-15',
      paid: true,
      notifyEnabled: false,
      notifyPush: false,
      notifyEmail: false,
      createdAt: '2026-10-15T10:00:00Z',
    },
    {
      id: 'tx-5',
      title: 'Freelance Mês Anterior',
      amount: 3000,
      type: 'income',
      subCategoryId: 'sub-freelance',
      recurrence: 'single',
      dueDate: '2026-09-20',
      paid: true,
      notifyEnabled: false,
      notifyPush: false,
      notifyEmail: false,
      createdAt: '2026-09-20T10:00:00Z',
    },
  ];

  describe('calculateFinanceTotals', () => {
    it('calcula receitas, despesas pagas, despesas pendentes, poupança e saldo livre real', () => {
      const totals = calculateFinanceTotals(sampleTransactions, 8000);

      // totalIncome: 10000 + 3000 = 13000
      expect(totals.totalIncome).toBe(13000);

      // totalPaidExpenses: 2500
      expect(totals.totalPaidExpenses).toBe(2500);

      // totalPendingExpenses: 1500
      expect(totals.totalPendingExpenses).toBe(1500);

      // totalSaved: 2000
      expect(totals.totalSaved).toBe(2000);

      // realFreeSavings: 13000 - 2500 - 1500 - 2000 = 7000
      expect(totals.realFreeSavings).toBe(7000);

      // committed: 2500 + 1500 + 2000 = 6000. 6000 / 8000 = 75%
      expect(totals.budgetUsedPercentage).toBe(75);
    });

    it('retorna 0 para budgetUsedPercentage se teto for 0', () => {
      const totals = calculateFinanceTotals(sampleTransactions, 0);
      expect(totals.budgetUsedPercentage).toBe(0);
    });

    it('limita budgetUsedPercentage ao máximo de 100%', () => {
      const totals = calculateFinanceTotals(sampleTransactions, 2000);
      expect(totals.budgetUsedPercentage).toBe(100);
    });
  });

  describe('calculateMonthlyHistory', () => {
    it('agrupa receitas, despesas e investimentos por mês cronológico', () => {
      const history = calculateMonthlyHistory(sampleTransactions);

      expect(history).toHaveLength(2);

      // Setembro 2026
      const sep = history.find(h => h.monthKey === '2026-09');
      expect(sep).toBeDefined();
      expect(sep?.income).toBe(3000);
      expect(sep?.expense).toBe(0);
      expect(sep?.savings).toBe(0);
      expect(sep?.month).toBe('Set');

      // Outubro 2026
      const oct = history.find(h => h.monthKey === '2026-10');
      expect(oct).toBeDefined();
      expect(oct?.income).toBe(10000);
      expect(oct?.expense).toBe(4000); // 2500 + 1500
      expect(oct?.savings).toBe(2000);
      expect(oct?.month).toBe('Out');
    });

    it('retorna array vazio quando não há transações', () => {
      expect(calculateMonthlyHistory([])).toEqual([]);
    });
  });

  describe('calculatePillarExpenses', () => {
    it('soma os valores por macropilar corretamente', () => {
      const pillarExpenses = calculatePillarExpenses(sampleTransactions);

      expect(pillarExpenses.fixed).toBe(2500);
      expect(pillarExpenses.lifestyle).toBe(1500);
      expect(pillarExpenses.wealth).toBe(2000);
      expect(pillarExpenses.debts).toBe(0);
      expect(pillarExpenses.routine).toBe(0);
    });
  });

  describe('calculatePillarBudgets', () => {
    it('calcula o somatório de orçamentos por pilar a partir das subcategorias', () => {
      const subcategories: SubCategory[] = [
        { id: '1', name: 'Aluguel', pillarId: 'fixed', iconName: 'Home', monthlyBudget: 2500 },
        { id: '2', name: 'Condomínio', pillarId: 'fixed', iconName: 'Building', monthlyBudget: 500 },
        { id: '3', name: 'Restaurantes', pillarId: 'lifestyle', iconName: 'Utensils', monthlyBudget: 800 },
        { id: '4', name: 'Reserva', pillarId: 'wealth', iconName: 'PiggyBank', monthlyBudget: 1500 },
      ];

      const budgets = calculatePillarBudgets(subcategories);

      expect(budgets.fixed).toBe(3000);
      expect(budgets.lifestyle).toBe(800);
      expect(budgets.wealth).toBe(1500);
      expect(budgets.debts).toBe(0);
      expect(budgets.routine).toBe(0);
    });
  });
});
