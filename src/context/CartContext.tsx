'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useState, ReactNode } from 'react';
import cartService from '@/lib/cart';
import type {
  Cart,
  CartSummary,
  AddItemRequest,
  UpdateItemRequest,
  OptimisticUpdate
} from '@/types/cart';

interface CartState {
  cart: Cart | null;
  summary: CartSummary | null;
  loading: boolean;
  error: string | null;
  optimisticUpdate: OptimisticUpdate | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_SUMMARY'; payload: CartSummary }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'OPTIMISTIC_UPDATE'; payload: OptimisticUpdate }
  | { type: 'ROLLBACK_OPTIMISTIC' }
  | { type: 'COMMIT_OPTIMISTIC' };

const initialState: CartState = {
  cart: null,
  summary: null,
  loading: false,
  error: null,
  optimisticUpdate: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_CART':
      return { 
        ...state, 
        cart: action.payload, 
        loading: false, 
        error: null,
        optimisticUpdate: null
      };
    
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'OPTIMISTIC_UPDATE':
      return { ...state, optimisticUpdate: action.payload };
    
    case 'ROLLBACK_OPTIMISTIC':
      if (state.optimisticUpdate) {
        state.optimisticUpdate.rollback();
      }
      return { ...state, optimisticUpdate: null };
    
    case 'COMMIT_OPTIMISTIC':
      return { ...state, optimisticUpdate: null };
    
    default:
      return state;
  }
}

interface CartContextType {
  // State
  cart: Cart | null;
  summary: CartSummary | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  addItem: (request: AddItemRequest, optimistic?: boolean) => Promise<void>;
  updateItem: (request: UpdateItemRequest, optimistic?: boolean) => Promise<void>;
  removeItem: (itemId: string, optimistic?: boolean) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
  
  // Utilities
  getItemQuantity: (productId: string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  enableOptimistic?: boolean;
}

export function CartProvider({ children, enableOptimistic = false }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  const loadCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('🛒 CartContext: Loading cart...');
      
      // Ensure we have a session key before making requests
      const currentSessionKey = typeof window !== 'undefined' ? 
        localStorage.getItem('cart_session_key') : null;
      
      console.log('🔑 CartContext: Session status before cart load:', {
        hasSessionKey: !!currentSessionKey,
        sessionKeyLength: currentSessionKey?.length || 0,
        sessionPreview: currentSessionKey ? 
          `${currentSessionKey.substring(0, 12)}...${currentSessionKey.substring(-4)}` : 'none'
      });
      
      const [cart, summary] = await Promise.all([
        cartService.getCurrentCart(),
        cartService.getCartSummary(),
      ]);
      
      // Verify session key after cart load
      const sessionKeyAfterLoad = typeof window !== 'undefined' ? 
        localStorage.getItem('cart_session_key') : null;
      
      console.log('✅ CartContext: Cart loaded successfully', {
        itemsCount: cart.items?.length || 0,
        totalItems: cart.total_items,
        ownerType: cart.owner?.type,
        sessionKeyBeforeLoad: currentSessionKey?.length || 0,
        sessionKeyAfterLoad: sessionKeyAfterLoad?.length || 0,
        sessionKeyUpdated: currentSessionKey !== sessionKeyAfterLoad
      });
      
      dispatch({ type: 'SET_CART', payload: cart });
      dispatch({ type: 'SET_SUMMARY', payload: summary });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      if (!sessionInitialized) {
        setSessionInitialized(true);
        console.log('🎯 CartContext: Session marked as initialized');
      }
    } catch (error) {
      console.error('❌ CartContext: Failed to load cart', error);
      const message = error instanceof Error ? error.message : 'Failed to load cart';
      dispatch({ type: 'SET_ERROR', payload: message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [sessionInitialized]);

  // Load cart on mount and ensure session is initialized
  useEffect(() => {
    console.log('🚀 CartContext: Initializing cart context...');
    
    // Comprehensive session state logging for debugging
    if (typeof window !== 'undefined') {
      const currentSessionKey = localStorage.getItem('cart_session_key');
      const allCartKeys = Object.keys(localStorage).filter(key => 
        key.includes('cart') || key.includes('session')
      );
      
      console.log('🔑 CartContext: Initial session state:', {
        hasSessionKey: !!currentSessionKey,
        sessionKeyLength: currentSessionKey?.length || 0,
        sessionPreview: currentSessionKey ? 
          `${currentSessionKey.substring(0, 12)}...${currentSessionKey.substring(-4)}` : 'none',
        allCartRelatedKeys: allCartKeys,
        storageContents: Object.fromEntries(
          allCartKeys.map(key => [key, localStorage.getItem(key)])
        )
      });
      
      // Check for potential truncation issues
      if (currentSessionKey && currentSessionKey.includes('...')) {
        console.error('🚨 CartContext: Session key appears to be truncated!', {
          suspiciousKey: currentSessionKey
        });
      }
    }
    
    loadCart();
  }, [loadCart]);

  const addItem = async (request: AddItemRequest, optimistic = enableOptimistic) => {
    if (optimistic && state.cart) {
      // Optimistic update
      const rollback = () => {
        // Implementation would restore previous state
      };
      
      dispatch({
        type: 'OPTIMISTIC_UPDATE',
        payload: { action: 'add_item', payload: request, rollback }
      });
    }

    try {
      console.log('🛒 CartContext: Adding item:', request);
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await cartService.addItem(request);
      console.log('✅ CartContext: Add item response:', response);
      
      // Immediately sync with backend to ensure consistency
      await loadCart();
      
      if (optimistic) {
        dispatch({ type: 'COMMIT_OPTIMISTIC' });
      }
      
      dispatch({ type: 'SET_ERROR', payload: null });
      console.log('✅ CartContext: Item added and cart synced successfully');
    } catch (error) {
      console.error('❌ CartContext: Add item failed:', error);
      console.error('❌ CartContext: Add request was:', request);
      
      if (optimistic) {
        dispatch({ type: 'ROLLBACK_OPTIMISTIC' });
      }
      const message = error instanceof Error ? error.message : 'Failed to add item';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateItem = async (request: UpdateItemRequest) => {
    try {
      console.log('🔄 CartContext: Updating item:', request);
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await cartService.updateItem(request);
      console.log('✅ CartContext: Update item response:', response);
      
      // Immediately sync with backend to ensure consistency
      await loadCart();
      
      dispatch({ type: 'SET_ERROR', payload: null });
      console.log('✅ CartContext: Item updated and cart synced successfully');
    } catch (error) {
      console.error('❌ CartContext: Update item failed:', error);
      console.error('❌ CartContext: Update request was:', request);
      
      const message = error instanceof Error ? error.message : 'Failed to update item';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      console.log('🗑️ CartContext: Removing item:', { itemId });
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await cartService.removeItem(itemId);
      console.log('✅ CartContext: Remove item response:', response);
      
      // Immediately sync with backend to ensure consistency
      await loadCart();
      
      dispatch({ type: 'SET_ERROR', payload: null });
      console.log('✅ CartContext: Item removed and cart synced successfully');
    } catch (error) {
      console.error('❌ CartContext: Remove item failed:', error);
      console.error('❌ CartContext: Remove item ID was:', itemId);
      
      const message = error instanceof Error ? error.message : 'Failed to remove item';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = async () => {
    try {
      console.log('🗑️ CartContext: Clearing cart...');
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await cartService.clearCart();
      console.log('✅ CartContext: Cart cleared successfully');
      
      // Immediately sync with backend to ensure consistency
      await loadCart();
      
      dispatch({ type: 'SET_ERROR', payload: null });
      console.log('✅ CartContext: Cart cleared and synced successfully');
    } catch (error) {
      console.error('❌ CartContext: Clear cart failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to clear cart';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const refreshCart = useCallback(async () => {
    console.log('🔄 CartContext: Manually refreshing cart...');
    await loadCart();
  }, [loadCart]);

  // Force sync with backend - useful for guest users
  const syncWithBackend = useCallback(async () => {
    console.log('🔄 CartContext: Forcing sync with backend...');
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await loadCart();
      console.log('✅ CartContext: Backend sync completed successfully');
    } catch (error) {
      console.error('❌ CartContext: Backend sync failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to sync with backend';
      dispatch({ type: 'SET_ERROR', payload: message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loadCart]);

  const getItemQuantity = (productId: string): number => {
    if (!state.cart) return 0;
    const item = state.cart.items.find(item => item.product.id === productId);
    return item?.quantity || 0;
  };

  const getTotalItems = (): number => {
    return state.cart?.total_items || 0;
  };

  const getTotalPrice = (): number => {
    return state.cart?.total_price || 0;
  };

  const contextValue: CartContextType = {
    cart: state.cart,
    summary: state.summary,
    loading: state.loading,
    error: state.error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refreshCart,
    syncWithBackend,
    getItemQuantity,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
