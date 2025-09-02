import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export function getToken() {
  const cookieStore = cookies();
  return cookieStore.get('auth-token')?.value;
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  return verifyToken(token);
}
