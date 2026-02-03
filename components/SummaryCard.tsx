import React from 'react';
import { Calendar, User, FileText } from 'lucide-react';
import { BudgetHeaderData } from '../types';

interface SummaryCardProps {
  header: BudgetHeaderData;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ header }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Orcamento Card */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-5 rounded-xl flex items-center gap-4 shadow-lg shadow-black/20">
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
          <FileText size={24} />
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Orçamento Nº</p>
          <p className="text-xl font-bold text-slate-100">{header.orcamento || "--"}</p>
        </div>
      </div>

      {/* Cliente Card - Takes more attention */}
      <div className="bg-slate-900/80 backdrop-blur border border-gold-500/20 p-5 rounded-xl flex items-center gap-4 shadow-lg shadow-black/20 md:border-l-4 md:border-l-gold-500 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div className="p-3 bg-gold-500/10 text-gold-500 rounded-lg relative z-10">
          <User size={24} />
        </div>
        <div className="relative z-10">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Cliente</p>
          <p className="text-lg font-bold text-slate-100 truncate max-w-[200px] lg:max-w-xs" title={header.cliente}>
            {header.cliente || "Cliente não identificado"}
          </p>
        </div>
      </div>

      {/* Data Card */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-5 rounded-xl flex items-center gap-4 shadow-lg shadow-black/20">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
          <Calendar size={24} />
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Data de Emissão</p>
          <p className="text-xl font-bold text-slate-100">{header.data || "--/--/----"}</p>
        </div>
      </div>
    </div>
  );
};