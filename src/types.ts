
export enum BudgetStatus {
  DRAFT = 'Rascunho',
  SENT = 'Enviado',
  APPROVED = 'Aprovado',
  CANCELLED = 'Cancelado'
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  dailyRate: number;
  description?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  whatsapp: string;
  email: string;
}

export interface BudgetItem {
  equipmentId: string;
  quantity: number;
  pricePerDay: number;
}

export interface Budget {
  id: string;
  clientId: string;
  status: BudgetStatus;
  pickupDate: string;
  eventDate: string;
  returnDate: string;
  items: BudgetItem[];
  discount: number;
  total: number;
  createdAt: string;
}

export interface EventTimeline {
  title: string;
  date: string;
  type: 'pickup' | 'event' | 'return';
}
