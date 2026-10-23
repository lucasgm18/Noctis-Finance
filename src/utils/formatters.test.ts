import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatCurrency, formatDateBR, getDueStatus } from './formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formata valor positivo em moeda brasileira (BRL)', () => {
      const formatted = formatCurrency(1500.5);
      // Remove espaços não separáveis para teste seguro
      const normalized = formatted.replace(/\u00a0/g, ' ');
      expect(normalized).toBe('R$ 1.500,50');
    });

    it('formata zero corretamente', () => {
      const formatted = formatCurrency(0);
      const normalized = formatted.replace(/\u00a0/g, ' ');
      expect(normalized).toBe('R$ 0,00');
    });

    it('formata valor negativo corretamente', () => {
      const formatted = formatCurrency(-250.75);
      const normalized = formatted.replace(/\u00a0/g, ' ');
      expect(normalized).toContain('250,75');
    });
  });

  describe('formatDateBR', () => {
    it('converte formato YYYY-MM-DD para DD/MM/YYYY', () => {
      expect(formatDateBR('2026-10-22')).toBe('22/10/2026');
      expect(formatDateBR('2025-01-05')).toBe('05/01/2025');
    });

    it('retorna string vazia se entrada for vazia', () => {
      expect(formatDateBR('')).toBe('');
    });

    it('retorna a própria string se formato for inválido', () => {
      expect(formatDateBR('data-invalida')).toBe('data-invalida');
    });
  });

  describe('getDueStatus', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      // Fixa a data atual de referência em 2026-10-15T00:00:00.000Z
      vi.setSystemTime(new Date(2026, 9, 15, 12, 0, 0));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('retorna status Pago quando isPaid é true', () => {
      const status = getDueStatus('2026-10-10', true);
      expect(status.text).toBe('Pago');
      expect(status.isUrgent).toBe(false);
      expect(status.color).toBe('text-[#1F9D73]');
    });

    it('retorna status Vencido quando a data é anterior ao dia de hoje', () => {
      const status = getDueStatus('2026-10-12', false);
      expect(status.text).toBe('Venceu há 3d');
      expect(status.isUrgent).toBe(true);
      expect(status.color).toBe('text-[#E0533C]');
    });

    it('retorna Vence Hoje! quando o vencimento é hoje', () => {
      const status = getDueStatus('2026-10-15', false);
      expect(status.text).toBe('Vence Hoje!');
      expect(status.isUrgent).toBe(true);
      expect(status.color).toBe('text-[#E0533C]');
    });

    it('retorna Vence Amanhã quando o vencimento é no dia seguinte', () => {
      const status = getDueStatus('2026-10-16', false);
      expect(status.text).toBe('Vence Amanhã');
      expect(status.isUrgent).toBe(true);
      expect(status.color).toBe('text-[#D97706]');
    });

    it('retorna Em X dias quando faltam até 3 dias', () => {
      const status = getDueStatus('2026-10-18', false);
      expect(status.text).toBe('Em 3 dias');
      expect(status.isUrgent).toBe(true);
      expect(status.color).toBe('text-[#D97706]');
    });

    it('retorna d/m quando o vencimento é distante (mais de 3 dias)', () => {
      const status = getDueStatus('2026-10-25', false);
      expect(status.text).toBe('25/10');
      expect(status.isUrgent).toBe(false);
      expect(status.color).toBe('text-[#655A7C]');
    });
  });
});
