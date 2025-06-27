import jwt from 'jsonwebtoken';

export const generateToken = (userId: number): string => {
  const payload = { userId };
  const secret = process.env.JWT_SECRET!;
  
  // Use the simple approach without explicit typing for options
  return jwt.sign(payload, secret, { 
    expiresIn: '7d'
  });
};

export const verifyToken = (token: string): { userId: number } => {
  const secret = process.env.JWT_SECRET!;
  return jwt.verify(token, secret) as { userId: number };
};
