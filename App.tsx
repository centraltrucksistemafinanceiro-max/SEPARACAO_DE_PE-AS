import React, { useState, useEffect } from 'react';
import { UploadZone } from './components/UploadZone';
import { SummaryCard } from './components/SummaryCard';
import { DataTable } from './components/DataTable';
import { DeliveryModal } from './components/DeliveryModal';
import { DeliveryReceipt } from './components/DeliveryReceipt';
import { OrderDashboard } from './components/OrderDashboard';
import { AddItemModal } from './components/AddItemModal';
import { ToastContainer, useToast } from './components/Toast';
import { parseBudgetHtml } from './utils/parser';
import { ParsedBudget, Order, SeparationItem } from './types';
import { LayoutDashboard, Sparkles, ClipboardList, Send, ArrowLeft, Plus, Truck } from 'lucide-react';

const App: React.FC = () => {
  // Global State with Initial Load from LocalStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('luxbudget_orders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  
  // UI State
  const [isUploadMode, setIsUploadMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modals & Forms
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SeparationItem | null>(null);

  // Hooks
  const { toasts, addToast, removeToast } = useToast();

  // Derived State
  const activeOrder = orders.find(o => o.id === activeOrderId);
  const showDashboard = !isUploadMode && !activeOrderId;

  // Effects
  useEffect(() => {
    // Determine initial view based on data presence
    if (orders.length === 0 && !activeOrderId) {
      setIsUploadMode(true);
    }
  }, []); // Run once on mount

  useEffect(() => {
    // Persistence
    localStorage.setItem('luxbudget_orders', JSON.stringify(orders));
  }, [orders]);

  const handleFileProcess = (file: File) => {
    setLoading(true);
    setError(null);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (!content) throw new Error("Arquivo vazio");
        
        setTimeout(() => {
          try {
            const parsed = parseBudgetHtml(content);
            const newOrder: Order = {
              id: crypto.randomUUID(),
              header: parsed.header,
              items: parsed.items.map(i => ({ ...i, checked: false })),
              status: 'pending',
              createdAt: Date.now()
            };

            setOrders(prev => [newOrder, ...prev]);
            setLoading(false);
            setIsUploadMode(false);
            setActiveOrderId(null); // Return to dashboard to see the new item in list
            addToast('success', 'Importação Concluída', `Orçamento #${parsed.header.orcamento} importado.`);
          } catch (err) {
             setError("Erro ao interpretar o HTML. Verifique o arquivo.");
             addToast('error', 'Erro na Importação', 'O formato do arquivo não é compatível.');
             setLoading(false);
          }
        }, 600);
      } catch (err) {
        setError("Erro ao ler o arquivo.");
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError("Falha na leitura do arquivo.");
      setLoading(false);
    };

    reader.readAsText(file, 'ISO-8859-1');
  };

  const handleToggleItem = (itemId: string) => {
    if (!activeOrderId) return;
    
    setOrders(prev => prev.map(order => {
      if (order.id !== activeOrderId) return order;
      
      const newItems = order.items.map(item => 
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );

      const anyChecked = newItems.some(i => i.checked);
      const newStatus = order.status === 'delivered' ? 'delivered' : (anyChecked ? 'in_progress' : 'pending');

      return { ...order, items: newItems, status: newStatus };
    }));
  };

  const handleDeleteItem = (itemId: string) => {
    if (!activeOrderId) return;

    setOrders(prev => prev.map(order => {
      if (order.id !== activeOrderId) return order;
      return {
        ...order,
        items: order.items.filter(i => i.id !== itemId)
      };
    }));
    addToast('success', 'Item Removido', 'O item foi excluído da lista.');
  };

  const handleOpenAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: SeparationItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (data: { cod: string; desc: string; qtd: string }) => {
    if (!activeOrderId) return;

    setOrders(prev => prev.map(order => {
      if (order.id !== activeOrderId) return order;

      let newItems = [...order.items];

      if (editingItem) {
        // Update existing item
        newItems = newItems.map(item => 
          item.id === editingItem.id 
            ? { ...item, cod: data.cod, desc: data.desc, qtd: data.qtd }
            : item
        );
      } else {
        // Add new item
        const newItem: SeparationItem = {
          id: `manual-${Date.now()}`,
          item: 'M',
          cod: data.cod,
          desc: data.desc,
          qtd: data.qtd,
          topPosition: 99999,
          checked: false
        };
        newItems.push(newItem);
      }

      return { ...order, items: newItems };
    }));

    setIsItemModalOpen(false);
    setEditingItem(null);
    addToast('success', editingItem ? 'Item Atualizado' : 'Item Adicionado', 'As alterações foram salvas.');
  };

  const handleConfirmDelivery = (receiver: string, employee: string, createBackorder: boolean) => {
    if (!activeOrderId) return;

    const timestamp = new Date().toLocaleString('pt-BR');

    // 1. Update current order status
    setOrders(prev => {
      const currentOrder = prev.find(o => o.id === activeOrderId);
      if (!currentOrder) return prev;

      const updatedOrders = prev.map(order => {
        if (order.id !== activeOrderId) return order;
        return {
          ...order,
          status: 'delivered' as const, // Fix type inference
          deliveryDetails: {
            receiverName: receiver,
            employeeName: employee,
            timestamp
          }
        };
      });

      // 2. Create Backorder if requested
      if (createBackorder) {
        const pendingItems = currentOrder.items.filter(i => !i.checked);
        
        if (pendingItems.length > 0) {
          // Reset check status for the new order
          const backorderItems = pendingItems.map(i => ({ ...i, checked: false }));
          
          const backorder: Order = {
            id: crypto.randomUUID(),
            header: {
              ...currentOrder.header,
              orcamento: `${currentOrder.header.orcamento} (PENDENTE)`
            },
            items: backorderItems,
            status: 'pending',
            createdAt: Date.now() + 1 // Ensure it appears after
          };
          
          addToast('success', 'Entrega Registrada', `Recibo gerado e nova ordem pendente criada.`);
          return [backorder, ...updatedOrders];
        }
      }

      addToast('success', 'Entrega Concluída', 'Recibo de entrega gerado com sucesso.');
      return updatedOrders;
    });
    
    setIsDeliveryModalOpen(false);
  };

  const handleDeleteOrder = (id: string) => {
    if (window.confirm("Tem certeza que deseja remover esta ordem? Esta ação não pode ser desfeita.")) {
      setOrders(prev => prev.filter(o => o.id !== id));
      if (activeOrderId === id) setActiveOrderId(null);
      addToast('success', 'Ordem Excluída', 'O pedido foi removido do histórico.');
    }
  };

  // --- Render Helpers ---

  // 1. Upload Screen
  if (isUploadMode && orders.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-obsidian-950 to-obsidian-950 p-6 flex flex-col items-center justify-center">
          <div className="max-w-xl w-full">
            <div className="text-center mb-10">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 shadow-xl shadow-gold-500/20 mb-6">
                  <LayoutDashboard size={40} className="text-black" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 uppercase tracking-wide">
                  SEPARAÇÃO DE PEÇAS
                </h1>
                <p className="text-gold-500 font-bold tracking-widest text-sm md:text-base">
                  CENTRAL TRUCK
                </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="w-12 h-12 border-4 border-slate-800 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400 animate-pulse">Processando arquivo...</p>
              </div>
            ) : (
              <UploadZone onFileSelect={handleFileProcess} />
            )}
          </div>
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  // Common Header for App
  const AppHeader = () => (
    <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 no-print">
      <div 
        className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => { setActiveOrderId(null); setIsUploadMode(false); }}
      >
        <div className="p-2.5 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg shadow-lg shadow-gold-500/10 text-black">
          <Truck size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-100 uppercase tracking-tight">
            SEPARAÇÃO DE PEÇAS
          </h1>
          <div className="flex items-center gap-2 text-gold-500/90 text-xs font-bold tracking-widest">
            <Sparkles size={12} />
            <span>CENTRAL TRUCK</span>
          </div>
        </div>
      </div>

      {activeOrder && (
        <button 
          onClick={() => setActiveOrderId(null)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm border border-transparent hover:border-slate-700"
        >
          <ArrowLeft size={16} />
          <span>Voltar ao Dashboard</span>
        </button>
      )}
    </header>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-obsidian-950 to-obsidian-950 p-6 md:p-8 text-slate-200">
      <div className="max-w-7xl mx-auto">
        <AppHeader />

        <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {isUploadMode && orders.length > 0 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
               <div className="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-700 p-8 relative">
                 <button 
                   onClick={() => setIsUploadMode(false)}
                   className="absolute top-4 right-4 text-slate-500 hover:text-white"
                 >
                   <ArrowLeft size={24} />
                 </button>
                 <h2 className="text-2xl font-bold mb-6 text-white text-center">Nova Ordem de Entrega</h2>
                 {loading ? (
                    <div className="text-center py-10">
                      <div className="w-10 h-10 border-4 border-slate-700 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <p>Importando dados...</p>
                    </div>
                 ) : (
                   <UploadZone onFileSelect={handleFileProcess} />
                 )}
               </div>
            </div>
          )}

          {showDashboard && (
            <OrderDashboard 
              orders={orders}
              onSelectOrder={setActiveOrderId}
              onDeleteOrder={handleDeleteOrder}
              onNewOrder={() => setIsUploadMode(true)}
            />
          )}

          {activeOrder && (
            <>
              {activeOrder.status === 'delivered' && activeOrder.deliveryDetails ? (
                <DeliveryReceipt 
                  header={activeOrder.header}
                  items={activeOrder.items}
                  receiverName={activeOrder.deliveryDetails.receiverName}
                  employeeName={activeOrder.deliveryDetails.employeeName}
                  timestamp={activeOrder.deliveryDetails.timestamp}
                  onReset={() => setActiveOrderId(null)}
                />
              ) : (
                <div className="space-y-6">
                  <SummaryCard header={activeOrder.header} />
                  
                  <div className="sticky top-4 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                       <div className="bg-slate-800 p-2 rounded-lg text-gold-500">
                         <ClipboardList size={24} />
                       </div>
                       <div className="flex-1">
                          <p className="text-xs text-slate-400 uppercase font-bold">Progresso da Separação</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-white">
                              {activeOrder.items.filter(i => i.checked).length}
                            </span>
                            <span className="text-sm text-slate-500">de {activeOrder.items.length} itens</span>
                          </div>
                       </div>
                    </div>

                    <div className="w-full md:w-1/3 mx-4 hidden md:block">
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-300"
                          style={{ width: `${(activeOrder.items.filter(i => i.checked).length / activeOrder.items.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        onClick={handleOpenAddItem}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 transition-all"
                      >
                         <Plus size={18} />
                         <span className="hidden sm:inline">Add Item</span>
                      </button>

                      <button 
                        onClick={() => setIsDeliveryModalOpen(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-black font-bold rounded-lg shadow-lg shadow-gold-500/20 transition-all transform hover:scale-105"
                      >
                        <Send size={18} />
                        <span>Concluir</span>
                      </button>
                    </div>
                  </div>

                  <div className="pb-20">
                    <DataTable 
                      items={activeOrder.items} 
                      onToggleItem={handleToggleItem} 
                      onDeleteItem={handleDeleteItem}
                      onEditItem={handleOpenEditItem}
                    />
                  </div>

                  <DeliveryModal 
                    isOpen={isDeliveryModalOpen}
                    onClose={() => setIsDeliveryModalOpen(false)}
                    onConfirm={handleConfirmDelivery}
                    totalItems={activeOrder.items.length}
                    checkedItems={activeOrder.items.filter(i => i.checked).length}
                  />

                  <AddItemModal 
                    isOpen={isItemModalOpen}
                    onClose={() => setIsItemModalOpen(false)}
                    onConfirm={handleSaveItem}
                    initialData={editingItem}
                  />
                </div>
              )}
            </>
          )}

        </main>
      </div>
      
      {/* Notifications Layer */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default App;