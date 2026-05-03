import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/client';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const code: unknown = body?.code;
  const result: unknown = body?.result;

  if (
    typeof code !== 'string' ||
    !code.trim() ||
    typeof result !== 'string' ||
    !result.trim() ||
    result.length > 10000
  ) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  const updated = getDb()
    .prepare(
      `UPDATE participants
       SET result = ?, assigned_at = datetime('now')
       WHERE code = ?`
    )
    .run(result.trim(), code.trim());

  if (updated.changes === 0) {
    return NextResponse.json({ error: 'code_not_found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
