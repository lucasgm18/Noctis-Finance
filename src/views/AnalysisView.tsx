import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Calendar as CalendarIcon, BarChart3, ArrowUpRight, ArrowDownRight, Layers, Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { CalendarView } from '../components/CalendarView';

export const AnalysisView: React.FC = () => {
  const { 
    pillars, 
    pillarExpenses, 
    monthlyHistory, 
    totalIncome, 
    totalPaidExpenses,
    totalPendingExpenses,
    setIsAddModalOpen
  } = useFinance();

  const [activeSubTab, setActiveSubTab] = useState<'charts' | 'calendar'>('charts');
  const [hoveredPillar, setHoveredPillar] = useState<{ id: string; name: string; fullName: string; value: number; color: string } | null>(null);

  // Prepara dados para o gráfico de Donut
  const donutData = pillars.map(p => ({
    id: p.id,
    name: p.shortName,
    fullName: p.name,
    value: pillarExpenses[p.id] || 0,
    color: p.color,
  })).filter(d => d.value > 0);

  const totalCommitted = totalPaidExpenses + totalPendingExpenses;

  return (
    <div className="space-y-6">
      {/* Top Switcher: Gráficos vs Calendário de Vencimentos */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FCF9F2] p-4 rounded-[24px] border border-[#DFD5C3]">
        <div>
          <h2 className="text-xl font-extrabold text-[#231942]">Análise & Vencimentos</h2>
          <p className="text-xs text-[#655A7C]">Visão gráfica dos 5 Pilares e cronograma financeiro</p>
        </div>

        <div className="flex bg-[#EDE5D5] p-1 rounded-full border border-[#DFD5C3]">
          <button
            onClick={() => setActiveSubTab('charts')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition-all ${
              activeSubTab === 'charts'
                ? 'bg-[#6E44FF] text-white shadow-md'
                : 'text-[#655A7C] hover:text-[#231942]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Gráficos & Distribuição</span>
          </button>
          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition-all ${
              activeSubTab === 'calendar'
                ? 'bg-[#6E44FF] text-white shadow-md'
                : 'text-[#655A7C] hover:text-[#231942]'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Calendário de Vencimentos</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'calendar' ? (
        <CalendarView />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Gráfico de Rosca dos 5 Pilares */}
          <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft flex flex-col justify-between">
            <div className="mb-3">
              <h3 className="text-base font-bold text-[#231942] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#6E44FF]" />
                <span>Distribuição pelos 5 Pilares Macro</span>
              </h3>
              <p className="text-xs text-[#655A7C]">Passe o mouse ou toque nas fatias para detalhar</p>
            </div>

            {/* Donut Chart Container */}
            <div className="h-64 sm:h-72 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData.length > 0 ? donutData : [{ id: 'empty', name: 'Sem dados', fullName: 'Sem gastos', value: 1, color: '#DFD5C3' }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={106}
                    paddingAngle={donutData.length > 0 ? 4 : 0}
                    dataKey="value"
                    onMouseEnter={(_, index) => {
                      if (donutData[index]) {
                        setHoveredPillar(donutData[index]);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredPillar(null);
                    }}
                  >
                    {donutData.length > 0 ? (
                      donutData.map(entry => (
                        <Cell 
                          key={entry.id} 
                          fill={entry.color} 
                          stroke="#FCF9F2" 
                          strokeWidth={3}
                          className="cursor-pointer transition-transform hover:opacity-80"
                        />
                      ))
                    ) : (
                      <Cell fill="#DFD5C3" stroke="#FCF9F2" strokeWidth={3} />
                    )}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Centro do Donut Dinâmico (Sem sobreposição!) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all">
                {hoveredPillar ? (
                  <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-150 px-2">
                    <span className="text-[11px] font-bold text-[#655A7C] uppercase tracking-wider truncate max-w-[140px]">
                      {hoveredPillar.name}
                    </span>
                    <span className="text-base sm:text-xl font-black text-[#231942]">
                      {formatCurrency(hoveredPillar.value)}
                    </span>
                    <span 
                      className="text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-1 text-white shadow-sm"
                      style={{ backgroundColor: hoveredPillar.color }}
                    >
                      {totalCommitted > 0 ? Math.round((hoveredPillar.value / totalCommitted) * 100) : 0}% do total
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[11px] font-bold text-[#655A7C] uppercase tracking-wider">
                      {totalCommitted > 0 ? 'Total Comprometido' : 'Sem Despesas'}
                    </span>
                    <span className="text-base sm:text-xl font-black text-[#231942]">
                      {formatCurrency(totalCommitted)}
                    </span>
                    <span className="text-[10px] text-[#655A7C] font-semibold mt-0.5">
                      {totalCommitted > 0 ? 'Passe o mouse na fatia' : 'R$ 0,00 registrado'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Legend for 5 Pillars or Empty state */}
            {donutData.length === 0 ? (
              <div className="py-4 text-center border-t border-[#DFD5C3]">
                <p className="text-xs text-[#655A7C]">Nenhum gasto registrado para gerar a distribuição dos pilares.</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-2 text-xs font-bold text-[#6E44FF] hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar primeiro lançamento</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 mt-2 pt-3 border-t border-[#DFD5C3]">
                {donutData.map(item => {
                  const pct = totalCommitted > 0 ? Math.round((item.value / totalCommitted) * 100) : 0;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoveredPillar(item)}
                      onMouseLeave={() => setHoveredPillar(null)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#EDE5D5]/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-bold text-[#231942]">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#231942]">{formatCurrency(item.value)}</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EDE5D5] text-[#655A7C] min-w-[42px] text-center">
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card 2: Comparativo Mensal Entradas vs Saídas */}
          <div className="bg-[#FCF9F2] p-5 sm:p-6 rounded-[28px] border border-[#DFD5C3] shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-base font-bold text-[#231942]">Entradas vs Saídas por Mês</h3>
                  <p className="text-xs text-[#655A7C]">Histórico de fluxo de caixa</p>
                </div>
              </div>

              {/* Mini Summary badges */}
              <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
                <div className="p-3 rounded-2xl bg-[#E1F7EF] border border-[#1F9D73]/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F9D73]">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Entradas Totais</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#1F9D73]">{formatCurrency(totalIncome)}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FDE8E5] border border-[#E0533C]/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#E0533C]">
                    <ArrowDownRight className="w-4 h-4" />
                    <span>Saídas Totais</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#E0533C]">{formatCurrency(totalPaidExpenses)}</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Container / Empty State */}
            {monthlyHistory.length === 0 ? (
              <div className="h-64 sm:h-72 w-full flex flex-col items-center justify-center text-center p-6 bg-[#EDE5D5]/30 rounded-2xl border border-dashed border-[#DFD5C3]">
                <BarChart3 className="w-10 h-10 text-[#655A7C]/50 mb-2" />
                <p className="text-sm font-bold text-[#231942]">Nenhum histórico mensal registrado</p>
                <p className="text-xs text-[#655A7C] max-w-xs mt-1">
                  Conforme você cadastrar seus lançamentos e receitas, o comparativo mensal será traçado automaticamente aqui.
                </p>
              </div>
            ) : (
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DFD5C3" opacity={0.6} />
                    <XAxis dataKey="month" tick={{ fill: '#655A7C', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#655A7C', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip
                      formatter={(val: any) => [formatCurrency(Number(val) || 0)]}
                      contentStyle={{
                        backgroundColor: '#FCF9F2',
                        border: '1px solid #DFD5C3',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#231942',
                      }}
                    />
                    <Bar dataKey="income" name="Entradas" fill="#1F9D73" radius={[6, 6, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="expense" name="Saídas" fill="#6E44FF" radius={[6, 6, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Bar Chart Legend */}
            <div className="flex items-center justify-center gap-6 pt-3 border-t border-[#DFD5C3] text-xs font-bold text-[#655A7C]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#1F9D73]" />
                <span>Entradas (Receitas)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#6E44FF]" />
                <span>Saídas (Despesas)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
