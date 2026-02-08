import {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext
} from
  'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
export type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
export function ToastProvider({ children }: { children: React.ReactNode; }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type
      }]
    );
    // Auto dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  return (
    <ToastContext.Provider
      value={{
        showToast
      }}>

      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) =>
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 min-w-[300px] max-w-md p-4 rounded-xl shadow-lg border animate-in slide-in-from-top-5 fade-in duration-300
              ${toast.type === 'success' ? 'bg-white border-green-100 text-green-800' : ''}
              ${toast.type === 'error' ? 'bg-white border-red-100 text-red-800' : ''}
              ${toast.type === 'info' ? 'bg-white border-blue-100 text-blue-800' : ''}
              ${toast.type === 'warning' ? 'bg-white border-amber-100 text-amber-800' : ''}
            `}>

            {toast.type === 'success' &&
              <CheckCircle size={20} className="text-green-500 shrink-0" />
            }
            {toast.type === 'error' &&
              <AlertCircle size={20} className="text-red-500 shrink-0" />
            }
            {toast.type === 'info' &&
              <Info size={20} className="text-blue-500 shrink-0" />
            }
            {toast.type === 'warning' &&
              <AlertTriangle size={20} className="text-amber-500 shrink-0" />
            }

            <p className="text-sm font-medium flex-1">{toast.message}</p>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors">

              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>);

}