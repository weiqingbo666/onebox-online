import jwt from 'jsonwebtoken';
import type { User } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string){
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}
