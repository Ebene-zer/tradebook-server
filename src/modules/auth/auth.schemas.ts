import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(6),
  phone: z.string().trim().min(7).max(20).optional(),
  businessName: z.string().trim().optional(),
});

export const LoginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
