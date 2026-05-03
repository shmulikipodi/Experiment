import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { timingSafeEqual } from 'crypto';
import { getDb } from '@/db/client';
import { SessionData, sessionOptions } from '@/lib/session';
import { getEnv } from '@/lib/env';

type Participant = {
  code: string;
  result: string | null;
  feedback: number | null;
};

function safeEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const code: unknown = body?.code;

  if (typeof code !== 'string' || !code.trim()) {
    return NextResponse.json({ status: 'not_found' });
  }

  const trimmed = code.trim();
  const response = NextResponse.json({ status: 'ok' });

  // Check admin code first
  const adminCode = getEnv('ADMIN_CODE');
  if (adminCode && safeEqual(trimmed, adminCode)) {
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    session.isAdmin = true;
    await session.save();
    return NextResponse.json({ role: 'admin' }, { headers: response.headers });
  }

  // Look up participant
  const row = getDb()
    .prepare('SELECT code, result, feedback FROM participants WHERE code = ?')
    .get(trimmed) as Participant | undefined;

  if (!row) {
    return NextResponse.json({ status: 'not_found' });
  }

  if (row.result === null) {
    return NextResponse.json({ status: 'no_result' });
  }

  return NextResponse.json({
    status: 'ok',
    code: row.code,
    result: row.result,
    feedbackSubmitted: row.feedback !== null,
  });
}
