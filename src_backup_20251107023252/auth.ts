import * as admin from 'firebase-admin';
import { Request } from 'express';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();

export const getUserFromRequest = async (req: Request) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  if (!token) {
    throw new Error('Missing Authorization token');
  }

  const decoded = await admin.auth().verifyIdToken(token);
  return decoded;
};
