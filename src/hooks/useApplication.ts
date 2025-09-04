import { useState, useCallback } from 'react';
import { applicationSchema, type ApplicationFormValues } from '@/utils/validation';
import apiClient from '@/api/client';
import { generateIdempotencyKey, saveFormData, clearFormData } from '@/utils/application';
import type { ApplicationResponse, ApplicationError, APIErrorShape } from '@/types/application';

interface UseApplicationReturn {
  isSubmitting: boolean;
  submitApplication: (data: ApplicationFormValues) => Promise<{
    success: boolean;
    data?: ApplicationResponse;
    error?: ApplicationError;
  }>;
}

export function useApplication(): UseApplicationReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitApplication = useCallback(async (data: ApplicationFormValues) => {
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = applicationSchema.parse(data);
      
      // Save form data for prefilling future forms
      saveFormData('application_prefill', {
        full_name: validatedData.full_name,
        phone: validatedData.phone,
        email: validatedData.email,
        city: validatedData.city,
        referral_source: validatedData.referral_source,
      });

      // Submit application
      const response = await apiClient.post<ApplicationResponse>('/applications/', validatedData, {
        headers: {
          'X-Idempotency-Key': generateIdempotencyKey(),
        },
      });

      // Clear form data on successful submission
      clearFormData('application_draft');

      return {
        success: true,
        data: response.data,
      };

    } catch (error: unknown) {
      console.error('Application submission error:', error);

      // Handle validation errors
      if (error && typeof error === 'object' && 'issues' in error) {
        const fieldErrors: { [key: string]: string } = {};
        // @ts-expect-error - Zod error structure
        error.issues.forEach((issue) => {
          const field = issue.path[0];
          if (field && typeof field === 'string') {
            fieldErrors[field] = issue.message;
          }
        });

        return {
          success: false,
          error: {
            type: 'validation' as const,
            fields: fieldErrors,
            message: 'Please check the form for errors',
          },
        };
      }

      // Handle API errors
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response: { status: number; data: APIErrorShape } }).response;
        
        if (response.status === 429) {
          return {
            success: false,
            error: {
              type: 'throttle' as const,
              message: 'Too many requests. Please try again later.',
              throttle: true,
            },
          };
        }

        if (response.status === 400 && response.data) {
          const fieldErrors: { [key: string]: string } = {};
          
          Object.entries(response.data).forEach(([field, messages]) => {
            if (field !== 'detail' && Array.isArray(messages) && messages.length > 0) {
              fieldErrors[field] = messages[0];
            } else if (field !== 'detail' && typeof messages === 'string') {
              fieldErrors[field] = messages;
            }
          });

          return {
            success: false,
            error: {
              type: 'validation' as const,
              fields: fieldErrors,
              message: response.data.detail || 'Validation errors occurred',
            },
          };
        }

        return {
          success: false,
          error: {
            type: 'network' as const,
            message: 'Network error. Please check your connection and try again.',
          },
        };
      }

      // Handle unknown errors
      return {
        success: false,
        error: {
          type: 'unknown' as const,
          message: 'An unexpected error occurred. Please try again.',
        },
      };

    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    submitApplication,
  };
}
