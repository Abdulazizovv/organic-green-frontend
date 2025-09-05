'use client';
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
  preventClose?: boolean; // if true, clicking overlay won't close
}

const sizeMap: Record<NonNullable<AdminModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
};

export function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  preventClose = false,
}: AdminModalProps) {
  if (!isOpen) return null;

  const handleOverlay = () => {
    if (!preventClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={handleOverlay}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full mt-20 rounded-lg bg-white shadow-xl border border-gray-200 flex flex-col',
          sizeMap[size]
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded hover:bg-gray-100 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[70vh]">{children}</div>
        {footer && <div className="px-5 py-4 border-t bg-gray-50 rounded-b-lg">{footer}</div>}
      </div>
    </div>
  );
}

export default AdminModal;
