import React, { useState } from 'react';
import { UserCheck, X, User, CopyPlus } from 'lucide-react';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (receiverName: string, employeeName: string, createBackorder: boolean) => void;
  totalItems: number;
  checkedItems: number;
}

export const DeliveryModal: React.FC<DeliveryModalProps> = ({ 
  isOpen, onClose, onConfirm, totalItems, checkedItems 
}) => {
  const [receiverName, setReceiverName] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [createBackorder, setCreateBackorder] = useState(true);

  if (!isOpen) return null;

  const pendingItemsCount = totalItems - checkedItems;
  const hasPendingItems = pendingItemsCount > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (receiverName.trim() && employeeName.trim()) {
      onConfirm(receiverName, employeeName, hasPendingItems && createBackorder);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-gold-500/30 w-full max-w-md rounded-2xl shadow-2xl shadow-black/50 transform transition-all scale-100">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="text-gold-500" />
            Dados da Entrega
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Itens Separados</span>
              <span className="text-gold-500 font-bold">{checkedItems} de {totalItems}</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gold-500 h-full transition-all duration-500" 
                style={{ width: `${(checkedItems / totalItems) * 100}%` }}
              ></div>
            </div>
            {hasPendingItems && (
              <p className="text-xs text-orange-400 mt-2">
                * {pendingItemsCount} itens não foram selecionados.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Funcionário responsável (Entrega)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Quem está retirando?
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <UserCheck size={18} />
                </div>
                <input
                  type="text"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  placeholder="Nome do Cliente / Motorista"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                  required
                />
              </div>
            </div>

            {hasPendingItems && (
              <div className="pt-2 border-t border-slate-800">
                 <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={createBackorder}
                        onChange={(e) => setCreateBackorder(e.target.checked)}
                      />
                      <div className="w-5 h-5 border-2 border-slate-600 rounded bg-slate-900 peer-checked:bg-gold-500 peer-checked:border-gold-500 transition-colors"></div>
                      <svg className="absolute w-3 h-3 text-black pointer-events-none opacity-0 peer-checked:opacity-100 left-1 top-1 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-200 group-hover:text-gold-400 transition-colors flex items-center gap-2">
                        <CopyPlus size={16} />
                        Gerar nova ordem com itens pendentes
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Cria uma cópia do pedido contendo apenas os itens não entregues para finalizar depois.
                      </p>
                    </div>
                 </label>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!receiverName.trim() || !employeeName.trim()}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold hover:shadow-lg hover:shadow-gold-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Concluir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};