import React from 'react';
import { SummaryCards } from '../components/SummaryCards';
import { UpcomingBills } from '../components/UpcomingBills';
import { RecentTransactions } from '../components/RecentTransactions';
import { useFinance } from '../context/FinanceContext';

export const DashboardView: React.FC = () => {
  const { deviceViewMode } = useFinance();
  const isMockup = deviceViewMode === 'mobile-mockup';

  return (
    <div className="space-y-6">
      {/* Top 4 Summary Cards & FinWise Goal Highlight */}
      <SummaryCards />

      {/* Bento Grid: Próximos Vencimentos + Transações Recentes */}
      <div className={`grid grid-cols-1 ${isMockup ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-6`}>
        <UpcomingBills />
        <RecentTransactions />
      </div>
    </div>
  );
};

export default DashboardView;
