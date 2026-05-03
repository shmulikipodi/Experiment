import { SessionOptions } from 'iron-session';

export interface SessionData {
  isAdmin?: boolean;
}

export const sessionOptions: SessionOptions = {
  // Falls back to a dummy value so the server starts even if the var is missing;
  // sessions simply won't decrypt correctly until the real secret is set.
  password: process.env.SESSION_SECRET || 'fallback-secret-please-set-SESSION_SECRET-in-railway',
  cookieName: 'experiment_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
  },
};
