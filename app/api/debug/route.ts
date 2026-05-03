import { NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';

export async function GET() {
  const adminCode = getEnv('ADMIN_CODE');
  return NextResponse.json({
    adminCodeSet: adminCode.length > 0,
    adminCodeLength: adminCode.length,
    adminCodeFirstChar: adminCode.length > 0 ? adminCode[0] : null,
    adminCodeLastChar: adminCode.length > 0 ? adminCode[adminCode.length - 1] : null,
    nodeEnv: process.env.NODE_ENV,
  });
}
