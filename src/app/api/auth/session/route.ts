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

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionCookie = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('pinkman_session='))
      ?.split('=')[1];

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decodedString = Buffer.from(sessionCookie, 'base64').toString('utf-8');
    const userSession = JSON.parse(decodedString);

    return NextResponse.json({ authenticated: true, user: userSession });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionCookie = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('pinkman_session='))
      ?.split('=')[1];

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
    }

    const decodedString = Buffer.from(sessionCookie, 'base64').toString('utf-8');
    const userSession = JSON.parse(decodedString);

    const body = await request.json();
    const { actionType } = body;

    
    if (actionType === 'switchOrg') {
      const { targetOrgName } = body;
      if (!targetOrgName) {
        return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
      }

      
      userSession.orgName = targetOrgName;
      const sessionString = Buffer.from(JSON.stringify(userSession)).toString('base64');

      
      const auditData = readJson(AUDIT_FILE, []);
      auditData.unshift({
        id: `AUDIT-${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: new Date().toISOString(),
        eventType: 'ORG_SWITCH',
        email: userSession.email,
        ipAddress: '192.168.1.1',
        details: `Switched organization context to: ${targetOrgName}`
      });
      writeJson(AUDIT_FILE, auditData);

      const response = NextResponse.json({ success: true, user: userSession });
      response.headers.set(
        'Set-Cookie',
        `pinkman_session=${sessionString}; Path=/; HttpOnly; SameSite=Lax`
      );

      return response;
    }

    
    if (actionType === 'changePassword') {
      const { currentPassword, newPassword } = body;
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: 'Current and New passwords are required' }, { status: 400 });
      }

      const emailLower = userSession.email.toLowerCase();
      const passwordsData = readJson(PASSWORDS_FILE, {});

      const expectedPassword = passwordsData[emailLower] ? passwordsData[emailLower].password : 'password123';
      if (currentPassword !== expectedPassword) {
        return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
      }

      
      passwordsData[emailLower] = {
        password: newPassword,
        failedAttempts: 0,
        lockedUntil: 0
      };
      writeJson(PASSWORDS_FILE, passwordsData);

      
      const auditData = readJson(AUDIT_FILE, []);
      auditData.unshift({
        id: `AUDIT-${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: new Date().toISOString(),
        eventType: 'PASSWORD_CHANGE',
        email: userSession.email,
        ipAddress: '192.168.1.1',
        details: 'User changed their password successfully.'
      });
      writeJson(AUDIT_FILE, auditData);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
