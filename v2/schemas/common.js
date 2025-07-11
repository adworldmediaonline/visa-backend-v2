import { z } from 'zod';

// MongoDB ObjectId validation
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

// Common status enum
export const statusSchema = z.enum(['active', 'inactive']);

// Country and currency codes
export const countryCodeSchema = z
  .string()
  .length(2, 'Country code must be 2 characters');
export const currencyCodeSchema = z
  .string()
  .length(3, 'Currency code must be 3 characters');

// Contact information
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');
export const emailSchema = z.string().email('Invalid email format');

// URL validation
export const urlSchema = z.string().url('Invalid URL format');

// Date validation
export const dateSchema = z.coerce.date();

// Pricing validation
export const priceSchema = z.number().min(0, 'Price must be non-negative');
export const percentageSchema = z
  .number()
  .min(0)
  .max(100, 'Percentage must be between 0 and 100');

// Response schemas
export const successResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
});

export const errorResponseSchema = z.object({
  success: z.boolean().default(false),
  message: z.string(),
  errors: z.array(z.string()).optional(),
});
