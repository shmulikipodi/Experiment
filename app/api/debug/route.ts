import { NextResponse } from 'next/server';

export async function GET() {
  const adminCode = process.env.ADMIN_CODE ?? '';
  return NextResponse.json({
    adminCodeSet: adminCode.length > 0,
    adminCodeLength: adminCode.length,
    adminCodeFirstChar: adminCode.length > 0 ? adminCode[0] : null,
    adminCodeLastChar: adminCode.length > 0 ? adminCode[adminCode.length - 1] : null,
    nodeEnv: process.env.NODE_ENV,
  });
}
