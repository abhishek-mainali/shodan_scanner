import React, { useState, useEffect, createContext, useContext } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }].slice(-3));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const Toast = ({ toast, onClose }) => {
  const styles = {
    success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    info: { icon: Info, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
  };

  const { icon: Icon, color, bg, border } = styles[toast.type] || styles.info;

  return (
    <div className={`${bg} ${border} border backdrop-blur-md px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 min-w-[300px] animate-in slide-in-from-right duration-300`}>
      <Icon className={`w-5 h-5 ${color}`} />
      <span className="text-sm font-bold tracking-tight flex-1 uppercase">{toast.message}</span>
      <button onClick={onClose} className="text-secondary hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
