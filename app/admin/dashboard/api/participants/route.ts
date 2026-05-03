import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/client';

type ParticipantRow = {
  id: number;
  code: string;
  result: string | null;
  feedback: number | null;
  created_at: string;
  assigned_at: string | null;
  feedback_at: string | null;
};

export async function GET() {
  const rows = db
    .prepare(
      `SELECT id, code,
              CASE WHEN result IS NOT NULL THEN substr(result, 1, 80) ELSE NULL END AS result,
              feedback, created_at, assigned_at, feedback_at
       FROM participants ORDER BY created_at DESC`
    )
    .all() as ParticipantRow[];

  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const code: unknown = body?.code;

  if (typeof code !== 'string' || !code.trim()) {
    return NextResponse.json({ error: 'invalid_code' }, { status: 400 });
  }

  const trimmed = code.trim();
  if (!/^[a-zA-Z0-9\-_]+$/.test(trimmed) || trimmed.length > 64) {
    return NextResponse.json({ error: 'invalid_code_format' }, { status: 400 });
  }

  try {
    const row = db
      .prepare(`INSERT INTO participants (code) VALUES (?) RETURNING id, code, created_at`)
      .get(trimmed) as { id: number; code: string; created_at: string };
    return NextResponse.json(row, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'duplicate_code' }, { status: 409 });
  }
}
