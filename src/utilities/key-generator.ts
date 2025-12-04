// utils/keyGenerator.js
import crypto from 'node:crypto';

export function generateKey(length = 32) {
  return crypto.randomBytes(length).toString('base64url').slice(0, Math.max(0, length));
}
