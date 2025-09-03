'use client';

import { useState, useEffect } from 'react';
import { getCartSessionKey, setCartSessionKey, clearCartSessionKey } from '@/lib/session';
import cartService from '@/lib/cart';

export default function DebugSessionPage() {
  const [sessionKey, setSessionKeyState] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLog(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    const currentKey = getCartSessionKey();
    setSessionKeyState(currentKey);
    addLog(`Initial session key: ${currentKey ? `${currentKey.substring(0, 8)}...` : 'null'}`);
  }, []);

  const handleGetSessionKey = () => {
    const key = getCartSessionKey();
    setSessionKeyState(key);
    addLog(`Retrieved session key: ${key ? `${key.substring(0, 8)}... (length: ${key.length})` : 'null'}`);
    
    if (key) {
      addLog(`Full session key: ${key}`);
    }
  };

  const handleSetSessionKey = () => {
    const testKey = 'test-session-key-' + Date.now();
    setCartSessionKey(testKey);
    addLog(`Set test session key: ${testKey}`);
    
    // Verify it was stored
    const retrieved = getCartSessionKey();
    addLog(`Verification - retrieved: ${retrieved ? `${retrieved.substring(0, 8)}...` : 'null'}`);
    setSessionKeyState(retrieved);
  };

  const handleClearSessionKey = () => {
    clearCartSessionKey();
    addLog('Cleared session key');
    setSessionKeyState(null);
  };

  const handleInitializeCart = async () => {
    addLog('Initializing cart to get session key...');
    try {
      const cart = await cartService.getCurrentCart();
      addLog(`Cart initialized. Session key: ${cart.owner?.session_key ? `${cart.owner.session_key.substring(0, 8)}...` : 'none'}`);
      
      const storedKey = getCartSessionKey();
      setSessionKeyState(storedKey);
      addLog(`Stored session key: ${storedKey ? `${storedKey.substring(0, 8)}... (length: ${storedKey.length})` : 'null'}`);
      
      if (cart.owner?.session_key && storedKey) {
        const matches = cart.owner.session_key === storedKey;
        addLog(`Session keys match: ${matches}`);
        if (!matches) {
          addLog(`MISMATCH - Cart: ${cart.owner.session_key}, Stored: ${storedKey}`);
        }
      }
    } catch (error) {
      addLog(`Error initializing cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleResetCartSession = () => {
    addLog('Resetting cart session...');
    // Access the resetSession method if it exists
    if ('resetSession' in cartService && typeof cartService.resetSession === 'function') {
      cartService.resetSession();
    }
    setSessionKeyState(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Session Key Debug Page</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Current Session Key</h2>
        <p className="font-mono text-sm bg-gray-100 p-2 rounded">
          {sessionKey ? `${sessionKey.substring(0, 20)}... (length: ${sessionKey.length})` : 'No session key'}
        </p>
        {sessionKey && (
          <details className="mt-2">
            <summary className="cursor-pointer text-blue-600">Show full key</summary>
            <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
              {sessionKey}
            </p>
          </details>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={handleGetSessionKey}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Get Session Key
        </button>
        
        <button
          onClick={handleSetSessionKey}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Set Test Key
        </button>
        
        <button
          onClick={handleClearSessionKey}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Session
        </button>
        
        <button
          onClick={handleInitializeCart}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Initialize Cart
        </button>
        
        <button
          onClick={handleResetCartSession}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Reset Cart Session
        </button>
      </div>

      <div className="p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Debug Log</h2>
        <div className="bg-black text-green-400 font-mono text-xs p-4 rounded h-64 overflow-y-auto">
          {debugLog.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
        <button
          onClick={() => setDebugLog([])}
          className="mt-2 px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
        >
          Clear Log
        </button>
      </div>

      <div className="mt-6 p-4 border rounded bg-yellow-50">
        <h3 className="font-semibold text-yellow-800">localStorage Contents</h3>
        <pre className="text-xs mt-2 bg-white p-2 rounded border">
          {typeof window !== 'undefined' ? 
            JSON.stringify(
              Object.fromEntries(
                Object.entries(localStorage).filter(([key]) => 
                  key.includes('cart') || key.includes('session') || key.includes('token')
                )
              ), 
              null, 
              2
            ) : 
            'SSR - localStorage not available'
          }
        </pre>
      </div>
    </div>
  );
}
