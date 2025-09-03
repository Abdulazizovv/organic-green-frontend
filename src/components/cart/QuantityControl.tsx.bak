'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantityControlProps {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  loading?: boolean;
  onChange: (quantity: number) => void;
  size?: 'sm' | 'md' | 'lg';
  'aria-label'?: string;
}

export function QuantityControl({
  value,
  min = 1,
  max,
  disabled = false,
  loading = false,
  onChange,
  size = 'md',
  'aria-label': ariaLabel = 'Quantity control'
}: QuantityControlProps) {

  const handleDecrement = () => {
    const newValue = Math.max(min, value - 1);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = max !== undefined ? Math.min(max, value + 1) : value + 1;
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    const clampedValue = max !== undefined 
      ? Math.max(min, Math.min(max, newValue))
      : Math.max(min, newValue);
    onChange(clampedValue);
  };

  const sizeClasses = {
    sm: { button: 'h-6 w-6 p-0', input: 'h-6 w-12 text-xs', icon: 'w-3 h-3' },
    md: { button: 'h-8 w-8 p-0', input: 'h-8 w-16 text-sm', icon: 'w-4 h-4' },
    lg: { button: 'h-10 w-10 p-0', input: 'h-10 w-20 text-base', icon: 'w-5 h-5' }
  };

  const classes = sizeClasses[size];

  return (
    <div 
      className="flex items-center gap-1 border rounded-md bg-white"
      role="group"
      aria-label={ariaLabel}
    >
      <Button
        variant="ghost"
        size="sm"
        className={classes.button}
        onClick={handleDecrement}
        disabled={disabled || loading || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className={classes.icon} />
      </Button>
      
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled || loading}
        className={`${classes.input} text-center border-0 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded`}
        aria-label="Quantity"
      />
      
      <Button
        variant="ghost"
        size="sm"
        className={classes.button}
        onClick={handleIncrement}
        disabled={disabled || loading || (max !== undefined && value >= max)}
        aria-label="Increase quantity"
      >
        <Plus className={classes.icon} />
      </Button>
    </div>
  );
}
