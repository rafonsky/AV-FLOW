import React, { useState } from 'react';
import { useAppStore } from './store';
import { ICONS } from './constants';
import Dashboard from './Dashboard';
import EquipmentManager from './EquipmentManager';
import ClientManager from './ClientManager';
import BudgetBuilder from './BudgetBuilder';
import BudgetList from './BudgetList';
import CalendarView from './CalendarView';

type Screen = 'dashboard' | 'equipment' | 'clients' | 'budgets' | 'calendar' | 'newBudget';

function App() {
  const store = useAppStore();
  const [screen, setScreen] = useState<Screen>('dashboard');

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':
        return <Dashboard store={store} onNewBudget={() => setScreen('newBudget')} />;
      case 'equipment':
        return <EquipmentManager store={store} />;
      case 'clients':
        return <ClientManager store={store} />;
      case 'budgets':
        return <BudgetList store={store} onEdit={() => {}} />;
      case 'calendar':
        return <CalendarView store={store} />;
      case 'newBudget':
        return <BudgetBuilder store={store} onFinish={() => setScreen('budgets')} />;
      default:
        return <Dashboard store={store} onNewBudget={() => setScreen('newBudget')} />;
    }
  };

  const navItems = [
    { id: 'dashboard' as Screen, label: 'Início', icon: ICONS.Dashboard },
    { id: 'equipment' as Screen, label: 'Estoque', icon: ICONS.Equipment },
    { id: 'clients' as Screen, label: 'Clientes', icon: ICONS.Clients },
    { id: 'budgets' as Screen, label: 'Orçamentos', icon: ICONS.Budgets },
    { id: 'calendar' as Screen, label: 'Agenda', icon: ICONS.Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-blue-600">AV-Flow</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gestão Audiovisual</p>
          </div>
          {screen !== 'dashboard' && screen !== 'newBudget' && (
            <button 
              onClick={() => setScreen('newBudget')}
              className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg active-scale"
            >
              {ICONS.Plus}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 safe-area-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-md mx-auto px-2 py-2 flex items-center justify-around">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all active-scale
                ${screen === item.id 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-slate-400 hover:text-slate-600'
                }
              `}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;
