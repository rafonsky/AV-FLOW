
import React from 'react';
import { Budget, Client, Equipment } from './types';
import { ICONS } from './constants';

interface BudgetPDFProps {
  budget: Budget;
  client: Client;
  equipments: Equipment[];
}

const BudgetPDF: React.FC<BudgetPDFProps> = ({ budget, client, equipments }) => {
  
  const handleShare = async () => {
    const shareText = `OrÃ§amento AV-Flow #${budget.id.toUpperCase()}\nCliente: ${client.name}\nTotal: R$ ${budget.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\nConfira os detalhes no link ou PDF anexo.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'OrÃ§amento Audiovisual',
          text: shareText,
          url: window.location.href, // Em um app real, aqui seria o link do PDF pÃºblico
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      // Fallback para WhatsApp Link
      const waUrl = `https://wa.me/${client.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    }
  };

  return (
    <div className="max-w-full space-y-4">
      <div className="flex gap-2 no-print">
        <button 
          onClick={() => window.print()}
          className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 active-scale"
        >
          {ICONS.Download} PDF
        </button>
        <button 
          onClick={handleShare}
          className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 active-scale"
        >
          {ICONS.Share} Compartilhar
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-[10px]">
        {/* SimplificaÃ§Ã£o visual para preview mobile */}
        <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between">
          <div>
            <h1 className="text-lg font-black text-blue-600">AV-Flow</h1>
            <p className="text-slate-400">#ORD-{budget.id.slice(0,4)}</p>
          </div>
          <div className="text-right">
            <p className="font-bold">{new Date(budget.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-slate-400 uppercase font-bold text-[8px] tracking-widest mb-1">Cliente</p>
          <p className="font-bold text-sm">{client.name}</p>
          <p className="text-slate-500">{client.company}</p>
        </div>

        <div className="space-y-2 mb-6">
          <p className="text-slate-400 uppercase font-bold text-[8px] tracking-widest border-b border-slate-50 pb-1">Equipamentos</p>
          {budget.items.map((item, idx) => {
            const eq = equipments.find(e => e.id === item.equipmentId);
            return (
              <div key={idx} className="flex justify-between">
                <span>{item.quantity}x {eq?.name}</span>
                <span className="font-bold">R$ {(item.quantity * item.pricePerDay).toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center">
          <span className="font-bold uppercase text-[8px] tracking-widest">Total</span>
          <span className="text-lg font-black text-blue-400">R$ {budget.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetPDF;
