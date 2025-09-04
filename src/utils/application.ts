// Utility functions for handling application form data

// Generate idempotency key for preventing duplicate submissions
export function generateIdempotencyKey(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Format phone number to E.164 format
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If starts with country code, add +
  if (cleaned.length >= 10) {
    // If doesn't start with country code, assume Uzbekistan (+998)
    if (!cleaned.startsWith('998') && !cleaned.startsWith('7') && !cleaned.startsWith('1')) {
      return `+998${cleaned}`;
    }
    return `+${cleaned}`;
  }
  
  return phone; // Return as-is if invalid
}

// Validate E.164 phone format
export function isValidE164Phone(phone: string): boolean {
  return /^\+[1-9]\d{10,14}$/.test(phone);
}

// Store form data in localStorage for prefilling
export function saveFormData(key: string, data: unknown): void {
  try {
    localStorage.setItem(`organic_green_${key}`, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save form data to localStorage:', error);
  }
}

// Retrieve form data from localStorage
export function getFormData(key: string): unknown {
  try {
    const data = localStorage.getItem(`organic_green_${key}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn('Failed to retrieve form data from localStorage:', error);
    return null;
  }
}

// Clear form data from localStorage
export function clearFormData(key: string): void {
  try {
    localStorage.removeItem(`organic_green_${key}`);
  } catch (error) {
    console.warn('Failed to clear form data from localStorage:', error);
  }
}

// Debounce function for API calls
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
