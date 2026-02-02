import React, { useState } from 'react';
import { useAppStore } from './store';
import { ICONS } from './constants';
import { BudgetItem, BudgetStatus } from './types';

interface BudgetBuilderProps {
  store: ReturnType<typeof useAppStore>;
  onFinish: () => void;
}

const BudgetBuilder: React.FC<BudgetBuilderProps> = ({ store, onFinish }) => {
  const { clients, equipments, addBudget, getAvailableStock } = store;
  
  const [clientId, setClientId] = useState('');
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [showEquipmentPicker, setShowEquipmentPicker] = useState(false);

  const calculateTotal = () => {
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity * item.pricePerDay * days);
    }, 0);
    return Math.max(0, subtotal - discount);
  };

  const addItem = (equipmentId: string) => {
    const eq = equipments.find(e => e.id === equipmentId);
    if (!eq) return;

    const available = getAvailableStock(equipmentId, pickupDate, returnDate);
    if (available <= 0) {
      alert('Este equipamento não está disponível nas datas selecionadas.');
      return;
    }

    const existing = items.find(i => i.equipmentId === equipmentId);
    if (existing) {
      alert('Este equipamento já foi adicionado.');
      return;
    }

    setItems([...items, {
      equipmentId,
      quantity: 1,
      pricePerDay: eq.dailyRate
    }]);
    setShowEquipmentPicker(false);
  };

  const updateItemQuantity = (equipmentId: string, quantity: number) => {
    const available = getAvailableStock(equipmentId, pickupDate, returnDate);
    if (quantity > available) {
      alert(`Apenas ${available} unidades disponíveis.`);
      return;
    }
    setItems(items.map(i => 
      i.equipmentId === equipmentId ? { ...i, quantity: Math.max(1, quantity) } : i
    ));
  };

  const handleSave = (status: BudgetStatus) => {
    if (!clientId) {
      alert('Por favor, selecione um cliente.');
      return;
    }
    if (items.length === 0) {
      alert('Adicione pelo menos um item ao orçamento.');
      return;
    }

    addBudget({
      id: Math.random().toString(36).substr(2, 9),
      clientId,
      status,
      pickupDate,
      eventDate,
      returnDate,
      items,
      discount,
      total: calculateTotal(),
      createdAt: new Date().toISOString()
    });
    onFinish();
  };

  return (
    <div className="flex flex-col gap-6 pb-32 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900">Novo Orçamento</h2>
      </div>

      <div className="space-y-6">
        {/* Cliente e Datas */}
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Cliente</label>
            <select 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none font-bold text-sm"
              value={clientId}
              onChange={e => setClientId(e.target.value)}
            >
              <option value="">Selecione um cliente...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Retirada</label>
              <input 
                type="date" 
                className="w-full p-3 bg-slate-50 rounded-xl border-none text-xs font-bold" 
                value={pickupDate} 
                onChange={e => setPickupDate(e.target.value)} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Evento</label>
              <input 
                type="date" 
                className="w-full p-3 bg-slate-50 rounded-xl border-none text-xs font-bold" 
                value={eventDate} 
                onChange={e => setEventDate(e.target.value)} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Devolução</label>
              <input 
                type="date" 
                className="w-full p-3 bg-slate-50 rounded-xl border-none text-xs font-bold" 
                value={returnDate} 
                onChange={e => setReturnDate(e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Lista de Itens */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Itens do Pedido</h3>
            <button 
              onClick={() => setShowEquipmentPicker(!showEquipmentPicker)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-full text-[10px] font-bold active-scale"
            >
              {ICONS.Plus} Adicionar
            </button>
          </div>

          {/* Equipment Picker */}
          {showEquipmentPicker && (
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2 animate-in fade-in slide-in-from-top-2">
              {equipments.map(eq => {
                const available = getAvailableStock(eq.id, pickupDate, returnDate);
                const alreadyAdded = items.some(i => i.equipmentId === eq.id);
                return (
                  <button
                    key={eq.id}
                    onClick={() => addItem(eq.id)}
                    disabled={available <= 0 || alreadyAdded}
                    className={`w-full p-3 rounded-xl text-left transition-colors ${
                      available <= 0 || alreadyAdded
                        ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-900'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-bold text-sm">{eq.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {available > 0 ? `${available} disponíveis` : 'Indisponível'} • R$ {eq.dailyRate}/dia
                        </p>
                      </div>
                      {alreadyAdded && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">
                          Adicionado
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          
          {items.map((item) => {
            const eq = equipments.find(e => e.id === item.equipmentId);
            const available = getAvailableStock(item.equipmentId, pickupDate, returnDate);
            return (
              <div key={item.equipmentId} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-left-2">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{eq?.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    R$ {item.pricePerDay.toLocaleString('pt-BR')} / dia • {available} disponíveis
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                    <button 
                      onClick={() => updateItemQuantity(item.equipmentId, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm font-black text-slate-900 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateItemQuantity(item.equipmentId, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => setItems(prev => prev.filter(i => i.equipmentId !== item.equipmentId))}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    {ICONS.Trash}
                  </button>
                </div>
              </div>
            );
          })}

          {items.length === 0 && !showEquipmentPicker && (
            <div className="py-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-xs font-medium">Nenhum item adicionado ainda.</p>
              <p className="text-[10px] text-slate-300 mt-1">Clique em "Adicionar" para começar</p>
            </div>
          )}
        </div>

        {/* Desconto */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Desconto (R$)</label>
          <input 
            type="number" 
            step="0.01"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none font-bold text-sm"
            value={discount}
            onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Footer Fixo com Resumo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg p-6 safe-area-bottom border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-end mb-4 px-2">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Total</p>
              <p className="text-2xl font-black text-blue-600">R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="text-right">
               <p className="text-[9px] text-slate-400 font-bold uppercase">Incluindo diárias e descontos</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleSave(BudgetStatus.DRAFT)} 
              className="py-4 bg-slate-100 text-slate-600 font-black rounded-2xl text-xs active-scale uppercase tracking-widest"
            >
              Salvar Rascunho
            </button>
            <button 
              onClick={() => handleSave(BudgetStatus.SENT)} 
              className="py-4 bg-blue-600 text-white font-black rounded-2xl text-xs active-scale flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-blue-100"
            >
              {ICONS.Send} Enviar Proposta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetBuilder;
