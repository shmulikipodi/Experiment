import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/client';

type Participant = { result: string | null; feedback: number | null };

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const code: unknown = body?.code;
  const score: unknown = body?.score;

  if (
    typeof code !== 'string' ||
    !code.trim() ||
    typeof score !== 'number' ||
    !Number.isInteger(score) ||
    score < 0 ||
    score > 100
  ) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  const result = getDb()
    .prepare(
      `UPDATE participants
       SET feedback = ?, feedback_at = datetime('now')
       WHERE code = ? AND result IS NOT NULL AND feedback IS NULL`
    )
    .run(score, code.trim());

  if (result.changes === 1) {
    return NextResponse.json({ success: true });
  }

  // Distinguish why the update matched 0 rows
  const row = getDb()
    .prepare('SELECT result, feedback FROM participants WHERE code = ?')
    .get(code.trim()) as Participant | undefined;

  if (!row) return NextResponse.json({ error: 'code_not_found' }, { status: 404 });
  if (row.feedback !== null) return NextResponse.json({ error: 'already_submitted' }, { status: 409 });
  return NextResponse.json({ error: 'no_result_assigned' }, { status: 400 });
}
