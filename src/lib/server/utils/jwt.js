import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

const ACCESS_SECRET = env.JWT_SECRET || 'dev-secret-key-2024';
const REFRESH_SECRET = env.JWT_REFRESH_SECRET || 'dev-refresh-key-2024';

export function generateAccessToken(userId, role) {
  return jwt.sign({ userId, role }, ACCESS_SECRET, { expiresIn: '1h' });
}

export function generateRefreshToken(userId) {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}
