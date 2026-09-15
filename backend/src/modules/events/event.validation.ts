import { z } from 'zod';
import { EventMode, EventCategory } from '../../types/enums';

export const rawEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.nativeEnum(EventCategory, { errorMap: () => ({ message: 'Invalid category' }) }),
  image: z
    .string()
    .refine(
      (v) => !v || /^https?:\/\//i.test(v) || v.startsWith('/'),
      'Image must be a valid URL or image path'
    )
    .optional()
    .or(z.literal('')),
  venue: z.string().max(255).optional().or(z.literal('')),
  location: z.string().min(2, 'Location is required'),
  mode: z.nativeEnum(EventMode, { errorMap: () => ({ message: 'Invalid mode' }) }),
  startDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid start date'),
  endDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid end date'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time must be HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'End time must be HH:MM'),
  registrationDeadline: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid registration deadline'),
  capacity: z.number().int().positive('Capacity must be greater than 0'),
  eligibility: z.string().optional().or(z.literal('')),
  registrationLink: z.string().url('Registration link must be a valid URL').optional().or(z.literal('')),
});

export const createEventSchema = rawEventSchema
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date must not be before start date',
    path: ['endDate'],
  })
  .refine((data) => new Date(data.registrationDeadline) <= new Date(data.startDate), {
    message: 'Registration deadline must be before or on the event start date',
    path: ['registrationDeadline'],
  });

export const updateEventSchema = rawEventSchema.partial();

export const registerSchema = z.object({});

export const rejectEventSchema = z.object({
  reason: z.string().min(5, 'Rejection reason is required').optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
