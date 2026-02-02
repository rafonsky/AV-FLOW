
import React, { useState } from 'react';
import { useAppStore } from './store';
import { ICONS } from './constants';
import { BudgetStatus, Budget } from './types';
import BudgetPDF from './BudgetPDF';

interface BudgetListProps {
  store: ReturnType<typeof useAppStore>;
  onEdit: (b: Budget) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({ store, onEdit }) => {
  const { budgets, clients, updateBudgetStatus } = store;
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  if (selectedBudget) {
    const client = clients.find(c => c.id === selectedBudget.clientId);
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedBudget(null)}
          className="flex items-center gap-2 text-slate-600 font-bold mb-4"
        >
          {ICONS.Next} Voltar para a lista
        </button>
        <BudgetPDF budget={selectedBudget} client={client!} equipments={store.equipments} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-900">Gerenciar OrÃ§amentos</h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Cliente</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Datas</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">AÃ§Ãµes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {budgets.map(budget => {
              const client = clients.find(c => c.id === budget.clientId);
              return (
                <tr key={budget.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{client?.name}</div>
                    <div className="text-xs text-slate-500">{client?.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">
                      {new Date(budget.eventDate).toLocaleDateString()}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-tight">
                      {new Date(budget.pickupDate).toLocaleDateString()} â†’ {new Date(budget.returnDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    R$ {budget.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider
                      ${budget.status === BudgetStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' : 
                        budget.status === BudgetStatus.SENT ? 'bg-blue-100 text-blue-700' : 
                        budget.status === BudgetStatus.CANCELLED ? 'bg-red-100 text-red-700' : 
                        'bg-slate-100 text-slate-700'}
                    `}>
                      {budget.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedBudget(budget)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver PDF"
                      >
                        {ICONS.Budgets}
                      </button>
                      {budget.status !== BudgetStatus.APPROVED && (
                        <button 
                          onClick={() => updateBudgetStatus(budget.id, BudgetStatus.APPROVED)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Aprovar"
                        >
                          {ICONS.Check}
                        </button>
                      )}
                      {budget.status !== BudgetStatus.CANCELLED && (
                        <button 
                          onClick={() => updateBudgetStatus(budget.id, BudgetStatus.CANCELLED)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancelar"
                        >
                          {ICONS.Cancel}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {budgets.length === 0 && (
          <div className="text-center py-20 bg-slate-50/50">
            <div className="text-slate-400 mb-2">{ICONS.Budgets}</div>
            <p className="text-slate-500 font-medium">Nenhum orÃ§amento encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetList;
