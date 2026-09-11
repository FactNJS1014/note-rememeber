import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().default(''),
  excerpt: z.string().optional(),
  color: z.string().default('default'),
  type: z.string().default('text'),
  categoryId: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  isPinned: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  remindAt: z.string().nullable().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  color: z.string().default('#6366f1'),
  icon: z.string().default('Folder'),
});

export const tagSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
});

export const reminderSchema = z.object({
  title: z.string().min(1, 'Reminder title is required'),
  remindAt: z.string().min(1, 'Reminder date/time is required'),
  noteId: z.string().nullable().optional(),
});
