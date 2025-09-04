import { z } from 'zod';

// Phone validation - E.164 format
export const phoneSchema = z.string()
  .min(1, 'Phone number is required')
  .regex(
    /^\+[1-9]\d{10,14}$/,
    'Phone must be in international format (+1234567890)'
  );

// Email validation - optional but when present must be valid
export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .optional()
  .or(z.literal(''));

// Application form validation schema
export const applicationSchema = z.object({
  course: z.string().min(1, 'Course selection is required'),
  full_name: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  phone: phoneSchema,
  email: emailSchema,
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters'),
  investment_amount: z.number()
    .min(0, 'Investment amount must be positive')
    .optional(),
  referral_source: z.enum(['website', 'instagram', 'telegram', 'friend', 'other'])
    .optional(),
  message: z.string()
    .max(500, 'Message must be less than 500 characters')
    .optional()
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
