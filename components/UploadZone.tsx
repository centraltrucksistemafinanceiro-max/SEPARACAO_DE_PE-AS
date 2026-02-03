import React, { useRef, useState } from 'react';
import { UploadCloud, FileType } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer 
        border-2 border-dashed rounded-xl p-12 
        flex flex-col items-center justify-center 
        transition-all duration-300 ease-in-out
        ${isDragging 
          ? 'border-gold-500 bg-gold-500/10 scale-[1.02]' 
          : 'border-slate-700 bg-slate-900/50 hover:border-gold-500/50 hover:bg-slate-800/80'}
      `}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept=".html"
        className="hidden"
      />
      
      <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-gold-500 text-black' : 'bg-slate-800 text-gold-500 group-hover:scale-110 duration-300'}`}>
        <UploadCloud size={32} />
      </div>

      <h3 className="text-xl font-semibold text-slate-200 mb-2">
        Carregar Orçamento
      </h3>
      <p className="text-slate-400 text-center max-w-sm">
        Arraste seu arquivo <span className="text-gold-500 font-mono">.html</span> aqui ou clique para buscar no computador.
      </p>
      
      {/* Decorative glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold-500/0 via-gold-500/5 to-gold-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};