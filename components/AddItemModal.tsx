import React, { useState, useEffect } from 'react';
import { Package, Hash, Layers, X, Plus, Pencil } from 'lucide-react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { cod: string; desc: string; qtd: string }) => void;
  initialData?: { cod: string; desc: string; qtd: string } | null;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onConfirm, initialData }) => {
  const [cod, setCod] = useState('');
  const [desc, setDesc] = useState('');
  const [qtd, setQtd] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCod(initialData.cod);
        setDesc(initialData.desc);
        setQtd(initialData.qtd);
      } else {
        setCod('');
        setDesc('');
        setQtd('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cod && desc && qtd) {
      onConfirm({ cod, desc, qtd });
      // Fields are cleared by useEffect when reopening, or manually here if staying open (not the case)
    }
  };

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl transform transition-all scale-100">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            {isEditing ? <Pencil className="text-blue-500" /> : <Plus className="text-gold-500" />}
            {isEditing ? 'Editar Item' : 'Adicionar Item Manual'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Código</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Hash size={18} />
              </div>
              <input
                type="text"
                value={cod}
                onChange={(e) => setCod(e.target.value)}
                placeholder="Ex: 102030"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Descrição</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Package size={18} />
              </div>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Ex: Parafuso Sextavado 10mm"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Quantidade</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Layers size={18} />
              </div>
              <input
                type="text"
                value={qtd}
                onChange={(e) => setQtd(e.target.value)}
                placeholder="Ex: 5,00"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                required
              />
            </div>
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
              className={`flex-1 px-4 py-3 rounded-lg font-bold hover:scale-[1.02] transition-all
                ${isEditing 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-gold-500 hover:bg-gold-400 text-black shadow-lg shadow-gold-500/20'}
              `}
            >
              {isEditing ? 'Salvar Alterações' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};