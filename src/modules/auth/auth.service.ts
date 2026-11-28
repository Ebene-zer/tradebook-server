import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/errors.js';
import { signToken } from '../../lib/jwt.js';
import type { LoginInput, RegisterInput } from './auth.schemas.js';

const publicUser = {
  id: true,
  name: true,
  email: true,
  phone: true,
  businessName: true,
  currency: true,
  createdAt: true,
} as const;

export async function register(input: RegisterInput) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw AppError.conflict('Email already registered');

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      businessName: input.businessName,
      passwordHash: await bcrypt.hash(input.password, 10),
    },
    select: publicUser,
  });
  return { user, token: signToken({ sub: user.id }) };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw AppError.unauthorized('Invalid email or password');
  }
  return { token: signToken({ sub: user.id }) };
}

export async function me(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUser });
  if (!user) throw AppError.notFound('User not found');
  return user;
}
