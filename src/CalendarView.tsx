
import React, { useState } from 'react';
import { useAppStore } from './store';
import { ICONS } from './constants';
import { BudgetStatus } from './types';

interface CalendarViewProps {
  store: ReturnType<typeof useAppStore>;
}

const CalendarView: React.FC<CalendarViewProps> = ({ store }) => {
  const { budgets, clients } = store;
  const [currentDate] = useState(new Date());

  // Simplify for MVP: Just a list of upcoming events/pickups/returns
  const upcomingEvents = budgets
    .filter(b => b.status === BudgetStatus.APPROVED || b.status === BudgetStatus.SENT)
    .flatMap(b => {
      const client = clients.find(c => c.id === b.clientId);
      return [
        { id: `${b.id}-p`, type: 'Retirada', date: b.pickupDate, client: client?.name, status: b.status },
        { id: `${b.id}-e`, type: 'Evento', date: b.eventDate, client: client?.name, status: b.status },
        { id: `${b.id}-r`, type: 'DevoluÃ§Ã£o', date: b.returnDate, client: client?.name, status: b.status },
      ];
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Agenda de LocaÃ§Ã£o</h2>
        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((ev, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold
                ${ev.type === 'Retirada' ? 'bg-emerald-50 text-emerald-600' : 
                  ev.type === 'Evento' ? 'bg-blue-50 text-blue-600' : 
                  'bg-orange-50 text-orange-600'}
              `}>
                <span className="text-xs uppercase leading-none mb-1">{ev.type.slice(0, 3)}</span>
                <span className="text-lg">{new Date(ev.date).getDate() + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">{ev.type}</div>
                <div className="text-sm font-medium text-slate-600 truncate">{ev.client}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{new Date(ev.date).toLocaleDateString()}</div>
              </div>
              <div className={`w-2 h-2 rounded-full ${ev.status === BudgetStatus.APPROVED ? 'bg-emerald-500' : 'bg-blue-400'}`}></div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
            <p className="text-slate-400 italic">Nenhum evento agendado para o perÃ­odo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
