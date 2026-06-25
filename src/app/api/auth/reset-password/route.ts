import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PASSWORDS_FILE = path.join(process.cwd(), 'src/app/api/auth/passwords.json');
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
    const { email, token, newPassword } = body;

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: 'Email, Reset Token, and New Password are required' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    // Verify token structure
    if (!token.startsWith('RST-')) {
      return NextResponse.json({ error: 'Invalid or expired password reset token' }, { status: 400 });
    }

    const passwordsData = readJson(PASSWORDS_FILE, {});

    // Save new password
    passwordsData[emailLower] = {
      password: newPassword,
      failedAttempts: 0,
      lockedUntil: 0
    };
    writeJson(PASSWORDS_FILE, passwordsData);

    // Log reset event
    const auditData = readJson(AUDIT_FILE, []);
    auditData.unshift({
      id: `AUDIT-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toISOString(),
      eventType: 'PASSWORD_RESET_SUCCESS',
      email: emailLower,
      ipAddress: '192.168.1.1',
      details: 'Password was successfully reset using token verification.'
    });
    writeJson(AUDIT_FILE, auditData);

    return NextResponse.json({ success: true, message: 'Password has been updated. You may now login.' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
