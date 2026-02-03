import React from 'react';
import { SeparationItem } from '../types';
import { Package, Hash, Layers, CheckSquare, Square, Trash2, Pencil } from 'lucide-react';

interface DataTableProps {
  items: SeparationItem[];
  onToggleItem?: (id: string) => void;
  onDeleteItem?: (id: string) => void;
  onEditItem?: (item: SeparationItem) => void;
  readOnly?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({ items, onToggleItem, onDeleteItem, onEditItem, readOnly = false }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
        <p className="text-slate-500">Nenhum item encontrado.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 backdrop-blur shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
              {!readOnly && <th className="p-4 w-16 text-center">Status</th>}
              <th className="p-4 font-semibold w-20 text-center">Item</th>
              <th className="p-4 font-semibold w-32">
                <div className="flex items-center gap-2">
                   <Hash size={14} /> Código
                </div>
              </th>
              <th className="p-4 font-semibold">
                <div className="flex items-center gap-2">
                   <Package size={14} /> Descrição do Produto
                </div>
              </th>
              <th className="p-4 font-semibold w-24 text-right">
                <div className="flex items-center justify-end gap-2">
                   <Layers size={14} /> Qtd
                </div>
              </th>
              {!readOnly && (onDeleteItem || onEditItem) && <th className="p-4 w-24 text-center">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {items.map((row) => (
              <tr 
                key={row.id} 
                className={`
                  group transition-all duration-200 
                  ${!readOnly ? 'hover:bg-slate-800/40' : ''}
                  ${row.checked 
                    ? 'bg-slate-800/60 border-l-2 border-l-gold-500' 
                    : 'border-l-2 border-l-transparent'}
                `}
              >
                {!readOnly && (
                  <td 
                    className="p-4 text-center cursor-pointer"
                    onClick={() => onToggleItem && onToggleItem(row.id)}
                  >
                    <div className={`transition-colors duration-300 ${row.checked ? 'text-gold-500' : 'text-slate-600 group-hover:text-slate-400'}`}>
                      {row.checked ? <CheckSquare size={20} fill="#fbbf24" className="text-black" /> : <Square size={20} />}
                    </div>
                  </td>
                )}
                <td className={`p-4 text-center font-mono text-sm ${row.checked ? 'text-slate-300' : 'text-slate-600'}`}>
                  {row.item}
                </td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 border rounded font-mono text-xs font-bold shadow-sm transition-all
                    ${row.checked 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                      : 'bg-slate-800/50 text-slate-500 border-slate-700'}
                  `}>
                    {row.cod}
                  </span>
                </td>
                <td 
                  className={`p-4 font-medium text-sm leading-relaxed transition-colors cursor-pointer ${row.checked ? 'text-slate-200' : 'text-slate-500'}`}
                  onClick={() => !readOnly && onToggleItem && onToggleItem(row.id)}
                >
                  {row.desc}
                </td>
                <td className="p-4 text-right">
                  <span className={`text-base font-bold px-3 py-1 rounded-lg border transition-all
                     ${row.checked
                      ? 'bg-slate-800 text-gold-400 border-gold-500/30'
                      : 'text-slate-500 border-slate-800'}
                  `}>
                    {row.qtd}
                  </span>
                </td>
                {!readOnly && (
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onEditItem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditItem(row);
                          }}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Editar Item"
                        >
                          <Pencil size={18} />
                        </button>
                      )}
                      {onDeleteItem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Tem certeza que deseja excluir este item?')) {
                              onDeleteItem(row.id);
                            }
                          }}
                          className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Excluir Item"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};