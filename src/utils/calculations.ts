import { Transaction, MonthlyComparison, MacroPillarId, SubCategory } from '../types/finance';

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/**
 * Agrupa transações por mês (YYYY-MM) calculando receitas, despesas e poupança de cada período.
 */
export function calculateMonthlyHistory(transactions: Transaction[]): MonthlyComparison[] {
  const monthMap: Record<string, { income: number; expense: number; savings: number }> = {};

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
    const name = MONTH_NAMES[mIdx] || key;
    return {
      month: name,
      monthKey: key,
      income: monthMap[key].income,
      expense: monthMap[key].expense,
      savings: monthMap[key].savings,
    };
  });
}

/**
 * Calcula os totais financeiros (receitas, despesas pagas/pendentes, poupança, saldo livre real e % do teto).
 */
export function calculateFinanceTotals(transactions: Transaction[], monthlyBudgetCeiling = 0) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPaidExpenses = transactions
    .filter(t => t.type === 'expense' && t.paid)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPendingExpenses = transactions
    .filter(t => t.type === 'expense' && !t.paid)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSaved = transactions
    .filter(t => t.type === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);

  const realFreeSavings = totalIncome - totalPaidExpenses - totalPendingExpenses - totalSaved;

  const committed = totalPaidExpenses + totalPendingExpenses + totalSaved;
  const budgetUsedPercentage = monthlyBudgetCeiling <= 0
    ? 0
    : Math.min(Math.round((committed / monthlyBudgetCeiling) * 100), 100);

  return {
    totalIncome,
    totalPaidExpenses,
    totalPendingExpenses,
    totalSaved,
    realFreeSavings,
    budgetUsedPercentage,
  };
}

/**
 * Calcula a distribuição de gastos por macropilar.
 */
export function calculatePillarExpenses(transactions: Transaction[]): Record<MacroPillarId, number> {
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
}

/**
 * Calcula a soma dos orçamentos mensais alocados por macropilar.
 */
export function calculatePillarBudgets(subcategories: SubCategory[]): Record<MacroPillarId, number> {
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
}
