import confetti from 'canvas-confetti';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
}

export function getDueStatus(dueDateStr: string, isPaid: boolean) {
  if (isPaid) return { text: 'Pago', color: 'text-[#1F9D73]', bg: 'bg-[#E1F7EF]', isUrgent: false };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [y, m, d] = dueDateStr.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `Venceu há ${Math.abs(diffDays)}d`, color: 'text-[#E0533C]', bg: 'bg-[#FDE8E5]', isUrgent: true };
  } else if (diffDays === 0) {
    return { text: 'Vence Hoje!', color: 'text-[#E0533C]', bg: 'bg-[#FDE8E5]', isUrgent: true };
  } else if (diffDays === 1) {
    return { text: 'Vence Amanhã', color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]', isUrgent: true };
  } else if (diffDays <= 3) {
    return { text: `Em ${diffDays} dias`, color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]', isUrgent: true };
  } else {
    return { text: `${d}/${m}`, color: 'text-[#655A7C]', bg: 'bg-[#EDE5D5]', isUrgent: false };
  }
}

export function triggerPaymentConfetti() {
  confetti({
    particleCount: 60,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#6E44FF', '#1F9D73', '#E5DEFF', '#835FFF', '#F7F2E7']
  });
}
