'use client';
import React from 'react';
import { cn } from '@/utils/cn';

interface BaseProps {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  className?: string;
}

interface InputProps extends BaseProps, React.InputHTMLAttributes<HTMLInputElement> {}
interface TextareaProps extends BaseProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const FormInput: React.FC<InputProps> = ({ label, error, description, required, className, ...rest }) => {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <input
        {...rest}
        className={cn(
          'w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      />
      {description && !error && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export const FormTextarea: React.FC<TextareaProps> = ({ label, error, description, required, className, ...rest }) => {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <textarea
        {...rest}
        className={cn(
          'w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[110px]',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      />
      {description && !error && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends BaseProps, React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export const FormSelect: React.FC<SelectProps> = ({ label, error, description, required, className, options, ...rest }) => {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <select
        {...rest}
        className={cn(
          'w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {description && !error && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};
