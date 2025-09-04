export interface ApplicationFormValues {
  course: string; // course slug
  full_name: string;
  phone: string; // E.164 format
  email?: string;
  city: string;
  investment_amount?: number;
  referral_source?: 'website' | 'instagram' | 'telegram' | 'friend' | 'other';
  message?: string;
}

export interface ApplicationResponse {
  id: string;
  course: string;
  full_name: string;
  phone: string;
  email?: string;
  city: string;
  investment_amount?: number;
  referral_source?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  message?: string;
}

// Generic API error shape
export interface APIErrorShape {
  [key: string]: string[] | string | undefined;
  detail?: string;
  non_field_errors?: string[];
}

// Typed error for application submissions
export interface ApplicationError {
  type: 'validation' | 'throttle' | 'network' | 'unknown';
  fields?: { [key: string]: string }; // First error for each field
  message?: string;
  throttle?: boolean;
}
