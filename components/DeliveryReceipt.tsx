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
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden print:border-none print:bg-white print:p-0 print:shadow-none">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none print:hidden">
          <CheckCircle2 size={120} className="text-gold-500" />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-6 print:border-black">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gold-500 rounded-xl overflow-hidden print:bg-transparent">
                <img src="/favicon.png" alt="CT Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white print:text-black mb-1">Recibo de Entrega</h2>
                <div className="flex items-center gap-2 text-gold-500 font-bold tracking-widest text-[10px] print:text-black">
                   <span>CENTRAL TRUCK</span>
                   <span className="text-slate-600 print:text-gray-400">|</span>
                   <span>Orçamento #{header.orcamento}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 print:text-gray-500 uppercase font-bold">Data/Hora da Retirada</p>
              <p className="text-slate-200 print:text-black font-mono font-bold text-lg">{timestamp}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/50 print:bg-gray-50 p-6 rounded-lg border border-slate-800 print:border-gray-300">
            <div>
              <p className="text-[10px] text-slate-500 print:text-gray-600 uppercase tracking-widest mb-1 font-bold">Cliente</p>
              <p className="text-base font-semibold text-slate-200 print:text-black leading-tight">{header.cliente}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 print:text-gray-600 uppercase tracking-widest mb-1 font-bold">Entregue Por</p>
              <p className="text-base font-semibold text-slate-200 print:text-black">{employeeName}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 print:text-gray-600 uppercase tracking-widest mb-1 font-bold">Retirado Por</p>
              <p className="text-base font-bold text-gold-500 print:text-black">{receiverName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivered Items Section */}
      <div className="print:mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 print:hidden">
            <CheckCircle2 size={20} />
          </div>
          <h3 className="text-lg font-bold text-emerald-400 print:text-black flex items-center gap-2">
            <CheckCircle2 size={18} className="hidden print:block" />
            Itens Entregues <span className="text-slate-500 font-medium ml-1">({delivered.length})</span>
          </h3>
        </div>
        <div className="border border-emerald-900/30 rounded-xl overflow-hidden print:border-gray-400">
          <DataTable items={delivered} readOnly />
        </div>
      </div>

      {/* Pending Items Section */}
      {pending.length > 0 && (
        <div className="opacity-90 print:mt-10 print:opacity-100">
          <div className="flex items-center gap-3 mb-4 mt-8">
             <div className="p-2 bg-red-500/10 rounded-lg text-red-500 print:hidden">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-lg font-bold text-red-400 print:text-black flex items-center gap-2">
              <AlertCircle size={18} className="hidden print:block" />
              Itens Pendentes <span className="text-slate-500 font-medium ml-1">({pending.length})</span>
            </h3>
          </div>
           <div className="border border-red-900/30 rounded-xl overflow-hidden grayscale-[0.3] print:grayscale-0 print:border-gray-400">
            <DataTable items={pending} readOnly />
          </div>
        </div>
      )}

      {/* Signature Area for Print */}
      <div className="hidden print:grid grid-cols-2 gap-12 mt-20 pt-10">
        <div className="text-center">
          <div className="border-t border-black pt-2">
            <p className="font-bold text-sm text-black">{employeeName}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Assinatura do Entregador (Central Truck)</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-black pt-2">
            <p className="font-bold text-sm text-black">{receiverName}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Assinatura do Recebedor (Cliente/Motorista)</p>
          </div>
        </div>
      </div>

      <div className="hidden print:block text-center mt-12 text-[8px] text-gray-400 border-t border-gray-100 pt-4">
        Recibo gerado eletronicamente via Sistema de Separação Central Truck em {timestamp}
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
          @page { size: auto; margin: 10mm; }
          
          /* Force white background and black text on EVERYTHING */
          html, body, #root, .min-h-screen { 
            background: white !important; 
            color: black !important; 
            margin: 0 !important;
            padding: 0 !important;
          }

          .no-print { display: none !important; }
          
          /* Remove all dark theme artifacts */
          .bg-slate-900, .bg-slate-950, .bg-slate-800, .bg-obsidian-950, .bg-slate-950\/50, .bg-slate-900\/80 { 
            background: white !important; 
            border-color: #000 !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
          }

          /* Reset all text colors to black */
          .text-white, .text-slate-200, .text-slate-300, .text-slate-400, .text-slate-500, .text-gold-500, .text-emerald-400, .text-red-400 {
            color: black !important;
          }

          /* Simplify borders and tables */
          .border, .border-slate-800, .border-emerald-900\/30, .border-red-900\/30 {
            border: 1px solid black !important;
          }
          
          table { 
            width: 100% !important; 
            border-collapse: collapse !important; 
            color: black !important;
            background: white !important;
          }
          
          th { 
            background: #eee !important; 
            border: 1px solid black !important;
            color: black !important;
            font-weight: bold !important;
          }
          
          td { 
            border: 1px solid black !important;
            color: black !important;
            background: white !important;
          }

          /* Hide UI-only elements */
          .animate-in, .shadow-2xl, .shadow-lg, .shadow-xl {
            animation: none !important;
            box-shadow: none !important;
          }

          /* Signature space */
          .mt-20 { margin-top: 50px !important; }
        }
      `}</style>
    </div>
  );
};