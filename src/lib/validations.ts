import { z } from 'zod';

export const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  phone: z
    .string()
    .min(10, 'Enter a valid 10-digit phone number')
    .max(10, 'Enter a valid 10-digit phone number')
    .regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
  city: z.string().min(1, 'City is required'),
  consent: z.literal(true, {
    message: 'You must agree to continue',
  }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const emailSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export type EmailFormData = z.infer<typeof emailSchema>;
