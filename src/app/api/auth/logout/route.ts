import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const AUDIT_FILE = path.join(process.cwd(), 'src/app/api/auth/audit_logs.json');

// Helper to read/write JSON
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
    const sessionCookie = request.headers.get('Cookie')
      ?.split(';')
      .find(c => c.trim().startsWith('pinkman_session='))
      ?.split('=')[1];

    let email = 'unknown@company.in';
    if (sessionCookie) {
      try {
        const decoded = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf-8'));
        email = decoded.email || email;
      } catch (e) {}
    }

    // Write audit event
    const auditData = readJson(AUDIT_FILE, []);
    auditData.unshift({
      id: `AUDIT-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toISOString(),
      eventType: 'LOGOUT',
      email: email,
      ipAddress: '192.168.1.1',
      details: 'User logged out successfully.'
    });
    writeJson(AUDIT_FILE, auditData);

    const response = NextResponse.json({ success: true });
    
    // Clear cookie header
    response.headers.set(
      'Set-Cookie',
      'pinkman_session=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT;'
    );

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
