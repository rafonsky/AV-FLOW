
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  Calendar as CalendarIcon, 
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Send,
  XCircle,
  ArrowRight,
  ChevronRight,
  Download,
  Share2
} from 'lucide-react';

export const COLORS = {
  primary: '#2563eb', // Blue-600
  secondary: '#64748b', // Slate-500
  success: '#10b981', // Emerald-500
  danger: '#ef4444', // Red-500
  warning: '#f59e0b', // Amber-500
};

export const CATEGORIES = [
  'Som',
  'IluminaÃ§Ã£o',
  'VÃ­deo/LED',
  'Estrutura',
  'InformÃ¡tica',
  'ServiÃ§os'
];

export const ICONS = {
  Dashboard: <LayoutDashboard size={20} />,
  Equipment: <Package size={20} />,
  Clients: <Users size={20} />,
  Budgets: <FileText size={20} />,
  Calendar: <CalendarIcon size={20} />,
  Settings: <Settings size={20} />,
  Plus: <Plus size={20} />,
  Trash: <Trash2 size={18} />,
  Check: <CheckCircle size={18} />,
  Clock: <Clock size={18} />,
  Send: <Send size={18} />,
  Cancel: <XCircle size={18} />,
  Next: <ArrowRight size={18} />,
  ChevronRight: <ChevronRight size={16} />,
  Download: <Download size={18} />,
  Share: <Share2 size={18} />
};
