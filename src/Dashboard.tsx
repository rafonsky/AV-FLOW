
import React from 'react';
import { useAppStore } from './store';
import { ICONS } from './constants';
import { BudgetStatus } from './types';

interface DashboardProps {
  store: ReturnType<typeof useAppStore>;
  onNewBudget: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ store, onNewBudget }) => {
  const { budgets, equipments, clients } = store;

  const stats = [
    { label: 'Pedidos', value: budgets.length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Itens', value: equipments.length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Clientes', value: clients.length, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Aprovados', value: budgets.filter(b => b.status === BudgetStatus.APPROVED).length, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-xl font-extrabold text-slate-900">OlÃ¡, Admin</h2>
        <p className="text-xs text-slate-500 font-medium">Resumo do dia em tempo real.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <span className="text-2xl font-black text-slate-900 leading-none mb-1">{stat.value}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.color}`}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">OrÃ§amentos Recentes</h3>
        <div className="space-y-3">
          {budgets.slice(-3).reverse().map((b) => {
            const client = clients.find(c => c.id === b.clientId);
            return (
              <div key={b.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm">
                  {ICONS.Budgets}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black text-slate-900 truncate">{client?.name || 'Cliente'}</div>
                  <div className="text-[10px] text-slate-500 font-bold">R$ {b.total.toLocaleString('pt-BR')}</div>
                </div>
                <div className={`px-2 py-1 rounded text-[8px] font-black uppercase
                  ${b.status === BudgetStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}
                `}>
                  {b.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
