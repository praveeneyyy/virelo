import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'info' | 'success' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container floating at bottom right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium border shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 duration-200 ${
              t.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-800/60 text-emerald-200 dark:bg-emerald-950/90 dark:border-emerald-800/80'
                : t.type === 'error'
                ? 'bg-rose-950/90 border-rose-800/60 text-rose-200 dark:bg-rose-950/90 dark:border-rose-800/80'
                : 'bg-[var(--surface-primary)] border-[var(--border-color)] text-[var(--text-primary)]'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />}
            {t.type === 'error' && <AlertCircle size={14} className="text-rose-400 shrink-0" />}
            {t.type === 'info' && <Info size={14} className="text-[var(--accent)] shrink-0" />}
            <span>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-2 text-current opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
