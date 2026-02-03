import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  title: string;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 min-w-[320px] max-w-sm bg-slate-900/95 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl shadow-black/50 animate-in slide-in-from-right-full duration-300"
        >
          <div className={`mt-0.5 ${toast.type === 'success' ? 'text-gold-500' : 'text-red-500'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          </div>
          <div className="flex-1">
            <h4 className={`text-sm font-bold ${toast.type === 'success' ? 'text-slate-100' : 'text-red-400'}`}>
              {toast.title}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-slate-600 hover:text-slate-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    
    // Auto remove
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
};