import React from 'react';
import { BudgetHeaderData, SeparationItem } from '../types';
import { CheckCircle2, AlertCircle, Printer, ArrowLeft } from 'lucide-react';
import { DataTable } from './DataTable';

interface DeliveryReceiptProps {
  header: BudgetHeaderData;
  items: SeparationItem[];
  receiverName: string;
  employeeName: string;
  timestamp: string;
  onReset: () => void;
}

export const DeliveryReceipt: React.FC<DeliveryReceiptProps> = ({ 
  header, items, receiverName, employeeName, timestamp, onReset 
}) => {
  const delivered = items.filter(i => i.checked);
  const pending = items.filter(i => !i.checked);

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-500 space-y-8 pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden print:border-black print:bg-white">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none print:hidden">
          <CheckCircle2 size={120} className="text-gold-500" />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white print:text-black mb-1">Recibo de Entrega</h2>
              <p className="text-slate-400 print:text-gray-600 text-sm">Orçamento #{header.orcamento}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 print:text-gray-500 uppercase">Data/Hora da Retirada</p>
              <p className="text-slate-200 print:text-black font-mono font-bold text-lg">{timestamp}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/50 print:bg-gray-100 p-6 rounded-lg border border-slate-800 print:border-gray-300">
            <div>
              <p className="text-xs text-slate-500 print:text-gray-600 uppercase tracking-wider mb-1">Cliente</p>
              <p className="text-lg font-semibold text-slate-200 print:text-black">{header.cliente}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 print:text-gray-600 uppercase tracking-wider mb-1">Entregue Por</p>
              <p className="text-lg font-semibold text-slate-200 print:text-black">{employeeName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 print:text-gray-600 uppercase tracking-wider mb-1">Retirado Por</p>
              <p className="text-lg font-bold text-gold-500 print:text-black">{receiverName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivered Items Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 print:text-black print:bg-transparent print:p-0">
            <CheckCircle2 size={20} />
          </div>
          <h3 className="text-lg font-bold text-emerald-400 print:text-black">Itens Entregues ({delivered.length})</h3>
        </div>
        <div className="border border-emerald-900/30 rounded-xl overflow-hidden print:border-gray-300">
          <DataTable items={delivered} readOnly />
        </div>
      </div>

      {/* Pending Items Section */}
      {pending.length > 0 && (
        <div className="opacity-90">
          <div className="flex items-center gap-3 mb-4 mt-8">
             <div className="p-2 bg-red-500/10 rounded-lg text-red-500 print:text-black print:bg-transparent print:p-0">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-lg font-bold text-red-400 print:text-black">Itens Pendentes / Não Entregues ({pending.length})</h3>
          </div>
           <div className="border border-red-900/30 rounded-xl overflow-hidden grayscale-[0.3] print:grayscale-0 print:border-gray-300">
            <DataTable items={pending} readOnly />
          </div>
        </div>
      )}

      {/* Signature Area for Print */}
      <div className="hidden print:flex justify-between mt-12 pt-12">
        <div className="w-5/12 border-t border-black text-center pt-2">
          <p className="font-bold text-black">{employeeName}</p>
          <p className="text-xs text-gray-500">Assinatura do Entregador</p>
        </div>
        <div className="w-5/12 border-t border-black text-center pt-2">
          <p className="font-bold text-black">{receiverName}</p>
          <p className="text-xs text-gray-500">Assinatura do Recebedor</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-8 border-t border-slate-800 no-print">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Voltar ao Início</span>
        </button>
        
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-gold-500 font-bold rounded-lg transition-all shadow-lg"
        >
          <Printer size={18} />
          <span>Imprimir Recibo</span>
        </button>
      </div>

      <style>{`
        @media print {
          body { background: white; color: black; }
          .no-print { display: none; }
          .bg-slate-900, .bg-slate-950, .bg-slate-800 { background: white !important; border-color: #ddd !important; box-shadow: none !important; }
          .text-slate-200, .text-slate-300, .text-slate-400 { color: #000 !important; }
          .text-gold-500, .text-emerald-400, .text-emerald-500, .text-red-400, .text-red-500 { color: #000 !important; font-weight: bold; }
          
          /* Table Styles for Print */
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th { background-color: #f0f0f0 !important; color: #000 !important; border: 1px solid #ccc; }
          td { border: 1px solid #ccc; padding: 4px; color: #000 !important; }
          
          .backdrop-blur { backdrop-filter: none; }
        }
      `}</style>
    </div>
  );
};