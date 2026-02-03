import React, { useState } from 'react';
import { Order } from '../types';
import { Package, Clock, CheckCircle2, ChevronRight, Trash2, User, Search, BarChart3, History, Layers } from 'lucide-react';

interface OrderDashboardProps {
  orders: Order[];
  onSelectOrder: (id: string) => void;
  onDeleteOrder: (id: string) => void;
  onNewOrder: () => void;
}

export const OrderDashboard: React.FC<OrderDashboardProps> = ({ 
  orders, onSelectOrder, onDeleteOrder, onNewOrder 
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [searchTerm, setSearchTerm] = useState('');

  // Stats Calculation
  const totalActive = orders.filter(o => o.status !== 'delivered').length;
  const totalDelivered = orders.filter(o => o.status === 'delivered').length;
  const totalItemsProcessed = orders.reduce((acc, curr) => acc + curr.items.filter(i => i.checked).length, 0);

  // Filtering Logic
  const filteredOrders = orders
    .filter(order => {
      const matchesTab = activeTab === 'active' 
        ? order.status !== 'delivered' 
        : order.status === 'delivered';
      
      const matchesSearch = 
        order.header.orcamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.header.cliente.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Welcome / Action Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl p-6 shadow-lg shadow-gold-500/10 flex flex-col justify-between text-black">
          <div>
            <h2 className="text-2xl font-bold mb-1 uppercase text-slate-900">SEPARAÇÃO DE PEÇAS</h2>
            <p className="text-black/70 text-sm font-bold tracking-widest">CENTRAL TRUCK</p>
          </div>
          <button 
            onClick={onNewOrder}
            className="mt-6 w-full py-3 bg-black/90 hover:bg-black text-gold-500 font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Package size={20} />
            <span>Nova Importação</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Em Aberto</p>
              <p className="text-2xl font-bold text-slate-100">{totalActive}</p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Entregues</p>
              <p className="text-2xl font-bold text-slate-100">{totalDelivered}</p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Itens Processados</p>
              <p className="text-2xl font-bold text-slate-100">{totalItemsProcessed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm min-h-[500px]">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/60">
          
          {/* Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'active' 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Clock size={16} />
              Em Andamento
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'history' 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <History size={16} />
              Histórico
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Buscar cliente ou orçamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-4 rounded-full bg-slate-800/50 mb-4 text-slate-600">
                <Search size={32} />
              </div>
              <p className="text-slate-400 font-medium">Nenhum pedido encontrado.</p>
              <p className="text-slate-600 text-sm mt-1">
                {searchTerm ? 'Tente buscar por outro termo.' : 'Importe um orçamento para começar.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onSelect={onSelectOrder}
                  onDelete={onDeleteOrder}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component tailored for this dashboard
const OrderCard: React.FC<{ order: Order; onSelect: (id: string) => void; onDelete: (id: string) => void }> = ({ order, onSelect, onDelete }) => {
  const totalItems = order.items.length;
  const checkedItems = order.items.filter(i => i.checked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;
  
  return (
    <div 
      onClick={() => onSelect(order.id)}
      className="group relative bg-slate-900 border border-slate-800 hover:border-gold-500/50 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/10 hover:-translate-y-1 overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950 px-2 py-0.5 rounded">Orçamento</span>
          <h3 className="text-lg font-bold text-slate-100 font-mono mt-1">#{order.header.orcamento}</h3>
        </div>
        {order.status === 'delivered' ? (
          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-1 rounded-full font-bold border border-emerald-500/20">
            ENTREGUE
          </span>
        ) : (
            <span className={`text-[10px] px-2 py-1 rounded-full font-bold border ${progress > 0 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
            {progress > 0 ? 'EM ANDAMENTO' : 'PENDENTE'}
          </span>
        )}
      </div>

      <div className="mb-5 h-12">
        <div className="flex items-start gap-2 text-slate-300">
          <User size={14} className="text-gold-500 mt-1 shrink-0" />
          <p className="text-sm font-semibold line-clamp-2 leading-tight" title={order.header.cliente}>
            {order.header.cliente}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 pt-4 border-t border-slate-800/50">
        <div className="flex justify-between text-xs font-medium text-slate-500">
          <span>Separação</span>
          <span className={progress === 100 ? 'text-emerald-500' : 'text-slate-300'}>{checkedItems}/{totalItems}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${order.status === 'delivered' ? 'bg-emerald-500' : 'bg-gold-500'}`} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      {/* Hover Action */}
      <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
        <div className="bg-gold-500 p-2 rounded-full text-black shadow-lg">
          <ChevronRight size={16} />
        </div>
      </div>

      {/* Delete Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(order.id); }}
        className="absolute top-4 right-4 text-slate-600 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        title="Remover"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};