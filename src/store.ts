import { useState, useEffect } from 'react';
import { Equipment, Client, Budget, BudgetStatus } from './types';

// Initial Mock Data
const INITIAL_EQUIPMENTS: Equipment[] = [
  { id: '1', name: 'Notebook Dell G15', category: 'Informática', totalQuantity: 10, dailyRate: 150 },
  { id: '2', name: 'Painel LED P3 Indoor (m²)', category: 'Vídeo/LED', totalQuantity: 50, dailyRate: 350 },
  { id: '3', name: 'Mesa de Som Behringer X32', category: 'Som', totalQuantity: 3, dailyRate: 450 },
  { id: '4', name: 'Par LED 18x12w RGBW', category: 'Iluminação', totalQuantity: 24, dailyRate: 45 },
  { id: '5', name: 'Microfone Shure SM58', category: 'Som', totalQuantity: 12, dailyRate: 60 },
];

const INITIAL_CLIENTS: Client[] = [
  { id: '1', name: 'João Silva', company: 'Tech Events', whatsapp: '11999999999', email: 'joao@tech.com' },
  { id: '2', name: 'Maria Souza', company: 'Agência Criativa', whatsapp: '11888888888', email: 'maria@criativa.com' },
];

export const useAppStore = () => {
  const [equipments, setEquipments] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('avflow_equipments');
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENTS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('avflow_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('avflow_budgets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('avflow_equipments', JSON.stringify(equipments));
  }, [equipments]);

  useEffect(() => {
    localStorage.setItem('avflow_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('avflow_budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addEquipment = (eq: Equipment) => setEquipments(prev => [...prev, eq]);
  const removeEquipment = (id: string) => setEquipments(prev => prev.filter(e => e.id !== id));
  
  const addClient = (cl: Client) => setClients(prev => [...prev, cl]);
  const removeClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id));

  const addBudget = (bu: Budget) => setBudgets(prev => [...prev, bu]);
  const updateBudgetStatus = (id: string, status: BudgetStatus) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const getAvailableStock = (equipmentId: string, startDate: string, endDate: string) => {
    const eq = equipments.find(e => e.id === equipmentId);
    if (!eq) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Filter approved budgets that overlap with these dates
    const overlappingBudgets = budgets.filter(b => {
      if (b.status !== BudgetStatus.APPROVED) return false;
      
      const bStart = new Date(b.pickupDate);
      const bEnd = new Date(b.returnDate);
      
      return (start <= bEnd && end >= bStart);
    });

    const reservedQty = overlappingBudgets.reduce((sum, b) => {
      const item = b.items.find(i => i.equipmentId === equipmentId);
      return sum + (item ? item.quantity : 0);
    }, 0);

    return Math.max(0, eq.totalQuantity - reservedQty);
  };

  return {
    equipments,
    clients,
    budgets,
    addEquipment,
    removeEquipment,
    addClient,
    removeClient,
    addBudget,
    updateBudgetStatus,
    getAvailableStock
  };
};
