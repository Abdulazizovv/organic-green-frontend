'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showThrottleWarning: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      placement: 'top-right',
      ...toast,
    };

    setToasts(prev => {
      const next = [...prev, newToast];
      return next.slice(-6); // limit last 6
    });

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [removeToast]);

  const showError = useCallback((message: string, title = 'Error') => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  const showSuccess = useCallback((message: string, title = 'Success') => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const showWarning = useCallback((message: string, title = 'Warning') => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  const showInfo = useCallback((message: string, title = 'Info') => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  const showThrottleWarning = useCallback(() => {
    showToast({
      type: 'warning',
      title: 'Too Many Requests',
      message: 'You are sending too many requests. Please wait a moment 🌱',
      duration: 7000,
    });
  }, [showToast]);

  const value: ToastContextType = {
    showToast,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    showThrottleWarning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const groups = toasts.reduce<Record<string, Toast[]>>((acc, t) => {
    const key = t.placement || 'top-right';
    acc[key] = acc[key] || [];
    acc[key].push(t);
    return acc;
  }, {});
  return (
    <>
      {Object.entries(groups).map(([place, list]) => {
        const positionClasses = {
          'top-right': 'top-4 right-4',
          'top-left': 'top-4 left-4',
          'bottom-right': 'bottom-4 right-4',
          'bottom-left': 'bottom-4 left-4',
        }[place];
        return (
          <div key={place} className={`fixed z-50 space-y-2 ${positionClasses}`}>
            <AnimatePresence>
              {list.map((toast) => (
                <ToastComponent key={toast.id} toast={toast} onRemove={onRemove} />
              ))}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
}

interface ToastComponentProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastComponent({ toast, onRemove }: ToastComponentProps) {
  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colorMap = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColorMap = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  const Icon = iconMap[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        max-w-sm w-full border rounded-lg shadow-lg p-4
        ${colorMap[toast.type]}
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColorMap[toast.type]}`} />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{toast.title}</p>
          {toast.message && (
            <p className="mt-1 text-sm opacity-90">{toast.message}</p>
          )}
          {toast.action && (
            <div className="mt-3">
              <button
                onClick={toast.action.onClick}
                className="text-sm font-medium underline hover:no-underline"
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => onRemove(toast.id)}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
