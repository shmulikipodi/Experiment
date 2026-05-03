import { SessionOptions } from 'iron-session';
import { getEnv } from '@/lib/env';

export interface SessionData {
  isAdmin?: boolean;
}

export const sessionOptions: SessionOptions = {
  password: getEnv('SESSION_SECRET') || 'fallback-secret-please-set-SESSION_SECRET-in-railway',
  cookieName: 'experiment_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
  },
};
