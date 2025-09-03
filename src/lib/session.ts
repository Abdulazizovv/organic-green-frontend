/**
 * Session management utilities for cart and order operations
 */

const CART_SESSION_KEY = 'cart_session_key';

/**
 * Safely get cart session key from localStorage (SSR-safe)
 * CRITICAL: This must return the EXACT stored session key
 */
export function getCartSessionKey(): string | null {
  if (typeof window === 'undefined') return null;
  
  const sessionKey = localStorage.getItem(CART_SESSION_KEY);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[SESSION] Session key retrieval operation:', {
      operation: 'GET',
      hasKey: !!sessionKey,
      keyLength: sessionKey?.length || 0,
      keyType: typeof sessionKey,
      preview: sessionKey ? `${sessionKey.substring(0, 12)}...${sessionKey.substring(-4)}` : 'null',
      rawValue: sessionKey
    });
    
    // Additional validation
    if (sessionKey && sessionKey.length < 10) {
      console.warn('[SESSION] WARNING: Session key seems too short!', {
        length: sessionKey.length,
        value: sessionKey
      });
    }
  }
  
  return sessionKey;
}

/**
 * Safely set cart session key to localStorage (SSR-safe)
 * CRITICAL: This must store the EXACT session key without any modification
 */
export function setCartSessionKey(sessionKey: string): void {
  if (typeof window === 'undefined') return;
  
  // Validate session key before storing
  if (!sessionKey || typeof sessionKey !== 'string') {
    console.error('[SESSION] Invalid session key type:', typeof sessionKey, sessionKey);
    return;
  }
  
  const trimmedKey = sessionKey.trim();
  if (trimmedKey === '') {
    console.warn('[SESSION] Attempted to store empty session key');
    return;
  }
  
  // Store the EXACT key without any modification
  localStorage.setItem(CART_SESSION_KEY, trimmedKey);
  
  // Immediate verification that the key was stored correctly
  const storedKey = localStorage.getItem(CART_SESSION_KEY);
  const isCorrectlyStored = storedKey === trimmedKey;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[SESSION] Session key storage operation:', {
      operation: 'SET',
      originalKey: sessionKey,
      trimmedKey: trimmedKey,
      keyLength: trimmedKey.length,
      storedKey: storedKey,
      storedLength: storedKey?.length || 0,
      isCorrectlyStored,
      preview: `${trimmedKey.substring(0, 12)}...${trimmedKey.substring(-4)}`
    });
  }
  
  if (!isCorrectlyStored) {
    console.error('[SESSION] CRITICAL: Session key was not stored correctly!', {
      original: trimmedKey,
      stored: storedKey,
      lengthMismatch: trimmedKey.length !== (storedKey?.length || 0)
    });
  }
}

/**
 * Remove cart session key from localStorage
 */
export function clearCartSessionKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_SESSION_KEY);
  
  if (process.env.NODE_ENV === 'development') {
    console.debug('[SESSION] Cleared cart session key');
  }
}

/**
 * Check if user is authenticated by checking for access token
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('accessToken');
  return !!token;
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}
