
import React, { useState } from 'react';
import { useAppStore } from './store';
import { ICONS } from './constants';
import { Client } from './types';

interface ClientManagerProps {
  store: ReturnType<typeof useAppStore>;
}

const ClientManager: React.FC<ClientManagerProps> = ({ store }) => {
  const { clients, addClient, removeClient } = store;
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.name && newClient.whatsapp) {
      addClient({
        ...newClient as Client,
        id: Math.random().toString(36).substr(2, 9),
      });
      setShowForm(false);
      setNewClient({});
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Meus Clientes</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          {showForm ? ICONS.Cancel : ICONS.Plus}
          {showForm ? 'Cancelar' : 'Novo Cliente'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Nome Completo</label>
              <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none" value={newClient.name || ''} onChange={e => setNewClient({ ...newClient, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Empresa</label>
              <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none" value={newClient.company || ''} onChange={e => setNewClient({ ...newClient, company: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">WhatsApp</label>
              <input required type="tel" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none" value={newClient.whatsapp || ''} onChange={e => setNewClient({ ...newClient, whatsapp: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">E-mail</label>
              <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none" value={newClient.email || ''} onChange={e => setNewClient({ ...newClient, email: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl">Salvar Cliente</button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div key={client.id} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group">
            <button 
              onClick={() => removeClient(client.id)}
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {ICONS.Trash}
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">
                {client.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{client.name}</h4>
                <p className="text-xs text-slate-500 uppercase tracking-tight">{client.company || 'Pessoa FÃ­sica'}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-xs">WA:</span> {client.whatsapp}
              </div>
              <div className="flex items-center gap-2 text-slate-600 truncate">
                <span className="text-xs">EM:</span> {client.email}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientManager;
