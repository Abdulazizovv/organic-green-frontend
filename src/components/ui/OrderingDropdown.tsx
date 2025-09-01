'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  SortAsc, 
  SortDesc, 
  Calendar, 
  Package, 
  TrendingUp,
  Type,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language';

export type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'stock_high' | 'stock_low' | 'popularity';

interface SortOptionConfig {
  value: SortOption;
  label: string;
  labelKey: string;
  icon: React.ReactNode;
  apiParam: string;
  description?: string;
  descriptionKey?: string;
}

const SORT_OPTIONS: SortOptionConfig[] = [
  {
    value: 'name_asc',
    label: 'Name A-Z',
    labelKey: 'products.sort.name_asc',
    icon: <Type className="w-4 h-4" />,
    apiParam: 'name_uz',
    description: 'Alphabetical order',
    descriptionKey: 'products.sort.name_asc_desc'
  },
  {
    value: 'name_desc',
    label: 'Name Z-A',
    labelKey: 'products.sort.name_desc',
    icon: <Type className="w-4 h-4" />,
    apiParam: '-name_uz',
    description: 'Reverse alphabetical order',
    descriptionKey: 'products.sort.name_desc_desc'
  },
  {
    value: 'price_asc',
    label: 'Price: Low to High',
    labelKey: 'products.sort.price_asc',
    icon: <SortAsc className="w-4 h-4" />,
    apiParam: 'price',
    description: 'Cheapest first',
    descriptionKey: 'products.sort.price_asc_desc'
  },
  {
    value: 'price_desc',
    label: 'Price: High to Low',
    labelKey: 'products.sort.price_desc',
    icon: <SortDesc className="w-4 h-4" />,
    apiParam: '-price',
    description: 'Most expensive first',
    descriptionKey: 'products.sort.price_desc_desc'
  },
  {
    value: 'newest',
    label: 'Newest First',
    labelKey: 'products.sort.newest',
    icon: <Calendar className="w-4 h-4" />,
    apiParam: '-created_at',
    description: 'Recently added products',
    descriptionKey: 'products.sort.newest_desc'
  },
  {
    value: 'oldest',
    label: 'Oldest First',
    labelKey: 'products.sort.oldest',
    icon: <Calendar className="w-4 h-4" />,
    apiParam: 'created_at',
    description: 'Earlier added products',
    descriptionKey: 'products.sort.oldest_desc'
  },
  {
    value: 'stock_high',
    label: 'Stock: High to Low',
    labelKey: 'products.sort.stock_high',
    icon: <Package className="w-4 h-4" />,
    apiParam: '-stock',
    description: 'Most available first',
    descriptionKey: 'products.sort.stock_high_desc'
  },
  {
    value: 'stock_low',
    label: 'Stock: Low to High',
    labelKey: 'products.sort.stock_low',
    icon: <Package className="w-4 h-4" />,
    apiParam: 'stock',
    description: 'Limited stock first',
    descriptionKey: 'products.sort.stock_low_desc'
  },
  {
    value: 'popularity',
    label: 'Most Popular',
    labelKey: 'products.sort.popularity',
    icon: <TrendingUp className="w-4 h-4" />,
    apiParam: '-popularity',
    description: 'Customer favorites',
    descriptionKey: 'products.sort.popularity_desc'
  }
];

interface OrderingDropdownProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption, apiParam: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

function OrderingDropdown({
  selectedSort,
  onSortChange,
  className = '',
  size = 'md',
  variant = 'outline'
}: OrderingDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { t } = useLanguage();

  // Get current option config
  const currentOption = SORT_OPTIONS.find(opt => opt.value === selectedSort) || SORT_OPTIONS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => 
            prev < SORT_OPTIONS.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : SORT_OPTIONS.length - 1
          );
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (focusedIndex >= 0) {
            const option = SORT_OPTIONS[focusedIndex];
            handleOptionSelect(option);
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, focusedIndex]);

  // Handle option selection
  const handleOptionSelect = (option: SortOptionConfig) => {
    console.log('🔀 OrderingDropdown: Sort option selected:', option.value, 'API param:', option.apiParam);
    onSortChange(option.value, option.apiParam);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setFocusedIndex(-1);
  };

  // Get button size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3 text-sm';
      case 'lg':
        return 'h-12 px-6 text-base';
      default:
        return 'h-10 px-4 text-sm';
    }
  };

  // Get localized text
  const getLocalizedText = (key: string, fallback: string) => {
    return t(key) || fallback;
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95, 
      y: -10,
      transition: { duration: 0.1 }
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  const iconRotateVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <Button
        ref={buttonRef}
        variant={variant}
        onClick={toggleDropdown}
        className={`
          ${getSizeClasses()}
          justify-between gap-2 min-w-0 max-w-full
          ${variant === 'outline' 
            ? 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300' 
            : ''
          }
          ${isOpen ? 'ring-2 ring-green-500 ring-opacity-20 border-green-300' : ''}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={getLocalizedText('products.sort_by', 'Sort by')}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {currentOption.icon}
          <span className="truncate">
            {getLocalizedText(currentOption.labelKey, currentOption.label)}
          </span>
        </div>
        
        <motion.div
          variants={iconRotateVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-full mt-1 w-full min-w-[280px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div className="py-1 max-h-[400px] overflow-y-auto">
              {SORT_OPTIONS.map((option, index) => {
                const isSelected = option.value === selectedSort;
                const isFocused = index === focusedIndex;
                
                return (
                  <motion.button
                    key={option.value}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.02 }}
                    onClick={() => handleOptionSelect(option)}
                    className={`
                      w-full px-4 py-3 text-left flex items-center gap-3 transition-colors duration-150
                      ${isSelected 
                        ? 'bg-green-50 text-green-700 border-l-2 border-green-500' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                      ${isFocused ? 'bg-gray-100' : ''}
                    `}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setFocusedIndex(index)}
                    onMouseLeave={() => setFocusedIndex(-1)}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 ${isSelected ? 'text-green-600' : 'text-gray-400'}`}>
                      {option.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">
                          {getLocalizedText(option.labelKey, option.label)}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-green-600 ml-2 flex-shrink-0" />
                        )}
                      </div>
                      
                      {option.description && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {getLocalizedText(option.descriptionKey || '', option.description)}
                        </p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Dropdown Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                {getLocalizedText('products.sort.total_options', `${SORT_OPTIONS.length} sorting options available`)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { OrderingDropdown, SORT_OPTIONS };
export type { SortOptionConfig };
