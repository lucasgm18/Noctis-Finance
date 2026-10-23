import { DBSubcategory, DBTransaction } from '../lib/supabase';
import { 
  SubCategory, 
  Transaction, 
  MacroPillarId, 
  TransactionType, 
  RecurrenceType 
} from '../types/finance';

/**
 * Mapeia registro de subcategoria vindo do banco Supabase para o modelo interno da aplicação.
 */
export function mapDBSubcategory(row: DBSubcategory): SubCategory {
  return {
    id: row.id,
    name: row.name,
    pillarId: (row.macro_pillar as MacroPillarId) || 'fixed',
    iconName: row.icon || 'Tag',
    monthlyBudget: Number(row.monthly_limit || 0),
  };
}

/**
 * Mapeia registro de transação vindo do banco Supabase para o modelo interno da aplicação.
 */
export function mapDBTransaction(row: DBTransaction): Transaction {
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
