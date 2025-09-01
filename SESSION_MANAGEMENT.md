# Cart Session Management with Django Backend

This document explains how the cart service now properly handles Django sessions for both anonymous and authenticated users.

## Changes Made

### 1. Removed Random Session Key Generation
- **Before**: Generated random `anon_xxx` keys that created multiple carts
- **After**: Uses backend-provided session keys from Django

### 2. Added Cookie Support
- Configured Axios with `withCredentials: true` to support Django's `sessionid` cookies
- Backend can now use either cookies or `X-Session-Key` header

### 3. Session Key Storage and Retrieval
- **Storage**: `storeSessionKey()` saves backend-provided session keys to localStorage
- **Retrieval**: `getStoredSessionKey()` gets stored session keys
- **Reset**: `resetSession()` clears session state for debugging

### 4. Automatic Session Initialization
- **Method**: `ensureSession()` automatically initializes sessions when needed
- **Process**: Fetches `/cart/current/` once to get a valid Django session
- **Caching**: Reuses existing session keys to prevent unnecessary requests

### 5. Improved Error Handling
- Better network error messages
- CORS error detection
- Graceful fallback to empty cart on connection issues
- Prevents infinite retry loops

## How It Works

### Session Flow
1. **First Request**: If no session key exists, fetch `/cart/current/` to initialize
2. **Backend Response**: Extract `session_key` from `response.data.owner.session_key`
3. **Storage**: Save session key to localStorage as `cart_session_key`
4. **Subsequent Requests**: Add stored session key to `X-Session-Key` header
5. **Cookie Support**: Django can also use `sessionid` cookie if preferred

### Request Headers
```javascript
{
  'Content-Type': 'application/json',
  'X-Session-Key': 'django_session_key_from_backend',
  'Authorization': 'Bearer jwt_token' // if authenticated
}
```

### Response Handling
```javascript
// Extract session key from any cart API response
if (response.data?.owner?.session_key) {
  this.storeSessionKey(response.data.owner.session_key);
}
```

## Benefits

1. **Single Cart Per User**: No more multiple carts from random keys
2. **Django Compatibility**: Proper integration with Django session framework
3. **Cookie Support**: Works with both header and cookie-based sessions
4. **Automatic Management**: Sessions initialize and persist automatically
5. **Error Resilience**: Graceful handling of network/CORS issues

## Usage

The cart service now works seamlessly with Django sessions:

```javascript
import cartService from '@/lib/cart';

// All methods now use proper Django sessions
const cart = await cartService.getCurrentCart();
await cartService.addItem({ product_id: 'uuid', quantity: 1 });

// Manual session reset (for debugging)
cartService.resetSession();
```

## Backend Requirements

Your Django backend should:
1. Return `session_key` in cart responses under `owner.session_key`
2. Accept either `sessionid` cookie or `X-Session-Key` header
3. Support CORS with credentials for cross-origin requests
