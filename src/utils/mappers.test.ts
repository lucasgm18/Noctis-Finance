import { describe, it, expect } from 'vitest';
import { mapDBSubcategory, mapDBTransaction } from './mappers';
import { DBSubcategory, DBTransaction } from '../lib/supabase';

describe('mappers (DB <-> App)', () => {
  describe('mapDBSubcategory', () => {
    it('converte DBSubcategory para SubCategory do modelo da aplicação', () => {
      const row: DBSubcategory = {
        id: 'sub-1',
        name: 'Supermercado',
        macro_pillar: 'routine',
        icon: 'ShoppingCart',
        monthly_limit: 1200,
        created_at: '2026-10-01T00:00:00Z',
      };

      const result = mapDBSubcategory(row);

      expect(result).toEqual({
        id: 'sub-1',
        name: 'Supermercado',
        pillarId: 'routine',
        iconName: 'ShoppingCart',
        monthlyBudget: 1200,
      });
    });

    it('aplica valores padrão quando campos opcionais estão nulos ou ausentes', () => {
      const row: DBSubcategory = {
        id: 'sub-2',
        name: 'Outros',
        macro_pillar: null as any,
        icon: null as any,
        monthly_limit: null as any,
        created_at: '2026-10-01T00:00:00Z',
      };

      const result = mapDBSubcategory(row);

      expect(result.pillarId).toBe('fixed');
      expect(result.iconName).toBe('Tag');
      expect(result.monthlyBudget).toBe(0);
    });
  });

  describe('mapDBTransaction', () => {
    it('converte DBTransaction completa para o formato da aplicação', () => {
      const row: DBTransaction = {
        id: 'tx-100',
        title: 'Notebook parcelado',
        notes: 'Compra trabalho',
        amount: 500,
        type: 'expense',
        macro_pillar: 'routine',
        subcategory_id: 'sub-eletronicos',
        subcategory_name: 'Eletrônicos',
        recurrence: 'installment',
        installment_current: 2,
        installment_total: 10,
        due_date: '2026-11-15',
        is_paid: true,
        paid_at: '2026-11-14T10:00:00Z',
        notify_push: true,
        notify_email: false,
        created_at: '2026-10-15T12:00:00Z',
      };

      const result = mapDBTransaction(row);

      expect(result).toEqual({
        id: 'tx-100',
        title: 'Notebook parcelado',
        notes: 'Compra trabalho',
        amount: 500,
        type: 'expense',
        pillarId: 'routine',
        subCategoryId: 'sub-eletronicos',
        recurrence: 'installment',
        currentInstallment: 2,
        totalInstallments: 10,
        dueDate: '2026-11-15',
        paid: true,
        paidDate: '2026-11-14T10:00:00Z',
        notifyEnabled: true,
        notifyPush: true,
        notifyEmail: false,
        createdAt: '2026-10-15T12:00:00Z',
      });
    });

    it('lida com transações de receita (não atribuindo pillarId)', () => {
      const row: DBTransaction = {
        id: 'tx-200',
        title: 'Salário',
        notes: null,
        amount: 8000,
        type: 'income',
        macro_pillar: 'income',
        subcategory_id: null,
        subcategory_name: null,
        recurrence: 'single',
        installment_current: null,
        installment_total: null,
        due_date: '2026-10-01',
        is_paid: true,
        paid_at: null,
        notify_push: false,
        notify_email: false,
        created_at: '2026-10-01T08:00:00Z',
      };

      const result = mapDBTransaction(row);

      expect(result.type).toBe('income');
      expect(result.pillarId).toBeUndefined();
      expect(result.amount).toBe(8000);
      expect(result.dueDate).toBe('2026-10-01');
      expect(result.paid).toBe(true);
      expect(result.notifyEnabled).toBe(false);
    });
  });
});
