import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const AUDIT_FILE = path.join(process.cwd(), 'src/app/api/auth/audit_logs.json');

function readJson(filePath: string, defaultVal: any) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {}
  return defaultVal;
}

function writeJson(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {}
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if user exists in SQLite DB
    const user = await prisma.user.findUnique({
      where: { email: emailLower }
    });

    if (!user && !['superadmin@company.in', 'admin@company.in', 'hr@company.in', 'manager@company.in'].includes(emailLower)) {
      return NextResponse.json({ error: 'No user registered with this email address' }, { status: 404 });
    }

    const mockToken = `RST-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Write audit event
    const auditData = readJson(AUDIT_FILE, []);
    auditData.unshift({
      id: `AUDIT-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toISOString(),
      eventType: 'PASSWORD_RESET_REQUEST',
      email: emailLower,
      ipAddress: '192.168.1.1',
      details: `Generated password reset token: ${mockToken}`
    });
    writeJson(AUDIT_FILE, auditData);

    return NextResponse.json({ 
      success: true, 
      resetToken: mockToken,
      message: `A password reset link has been dispatched to your email address (Mock details: Use token '${mockToken}' at reset page)`
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
