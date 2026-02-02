
import React, { useState } from 'react';
import { useAppStore } from './store';
import { ICONS, CATEGORIES } from './constants';
import { Equipment } from './types';

interface EquipmentManagerProps { store: ReturnType<typeof useAppStore>; }

const EquipmentManager: React.FC<EquipmentManagerProps> = ({ store }) => {
  const { equipments, addEquipment, removeEquipment } = store;
  const [showForm, setShowForm] = useState(false);
  const [newEq, setNewEq] = useState<Partial<Equipment>>({ category: CATEGORIES[0], totalQuantity: 1, dailyRate: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEq.name) {
      addEquipment({ ...newEq as Equipment, id: Math.random().toString(36).substr(2, 9) });
      setShowForm(false);
      setNewEq({ category: CATEGORIES[0], totalQuantity: 1, dailyRate: 0 });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-extrabold text-slate-900">InventÃ¡rio</h2>
        <button onClick={() => setShowForm(!showForm)} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md active-scale">
          {showForm ? ICONS.Cancel : ICONS.Plus}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4 animate-in slide-in-from-top-4 duration-300">
          <input required type="text" placeholder="Nome do item" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none font-medium" value={newEq.name || ''} onChange={e => setNewEq({ ...newEq, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <select className="px-4 py-3 rounded-xl bg-slate-50 border-none outline-none font-medium text-xs" value={newEq.category} onChange={e => setNewEq({ ...newEq, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input required type="number" placeholder="Qtd" className="px-4 py-3 rounded-xl bg-slate-50 border-none outline-none font-medium" value={newEq.totalQuantity} onChange={e => setNewEq({ ...newEq, totalQuantity: parseInt(e.target.value) || 0 })} />
          </div>
          <input required type="number" step="0.01" placeholder="Valor DiÃ¡ria R$" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none font-medium" value={newEq.dailyRate} onChange={e => setNewEq({ ...newEq, dailyRate: parseFloat(e.target.value) || 0 })} />
          <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl active-scale uppercase tracking-widest text-xs">Adicionar ao Estoque</button>
        </form>
      )}

      <div className="space-y-3">
        {equipments.map(eq => (
          <div key={eq.id} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 active-scale">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600">
              {ICONS.Equipment}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 text-sm truncate">{eq.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">{eq.category}</span>
                <span className="text-[10px] text-slate-400 font-bold">Estoque: {eq.totalQuantity}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-slate-900">R$ {eq.dailyRate}</div>
              <button onClick={() => removeEquipment(eq.id)} className="text-red-400 p-2 mt-1">{ICONS.Trash}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentManager;
