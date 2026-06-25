import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/db';

const SETTINGS_FILE = path.join(process.cwd(), 'src/app/api/admin/settings/settings_data.json');
const AUDIT_FILE = path.join(process.cwd(), 'src/app/api/auth/audit_logs.json');

function readJson(filePath: string, defaultVal: any) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultVal;
}

function writeJson(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Helper to decode user session from cookie
function getSessionUser(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionCookie = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('pinkman_session='))
      ?.split('=')[1];

    if (!sessionCookie) return null;
    const decodedString = Buffer.from(sessionCookie, 'base64').toString('utf-8');
    return JSON.parse(decodedString);
  } catch (e) {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const settings = readJson(SETTINGS_FILE, {});
    
    // Sync organization name from DB if available
    const dbOrg = await prisma.organization.findFirst();
    if (dbOrg && settings.profile) {
      settings.profile.name = dbOrg.name;
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userSession = getSessionUser(request);
    const body = await request.json();
    
    // Write new settings to JSON
    writeJson(SETTINGS_FILE, body);

    // Sync organization name to database
    if (body.profile && body.profile.name) {
      const dbOrg = await prisma.organization.findFirst();
      if (dbOrg) {
        await prisma.organization.update({
          where: { id: dbOrg.id },
          data: { name: body.profile.name }
        });
      } else {
        await prisma.organization.create({
          data: { name: body.profile.name }
        });
      }
    }

    // Add Audit Log entry
    const userEmail = userSession?.email || 'superadmin@company.in';
    const userBranch = userSession?.branch || 'Pune';
    const auditData = readJson(AUDIT_FILE, []);
    
    const detailsMsg = `Organization settings changed by ${userEmail}. Updated profile and configuration variables.`;
    
    auditData.unshift({
      id: `AUDIT-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toISOString(),
      eventType: 'SETTINGS_CHANGE',
      email: userEmail,
      ipAddress: request.headers.get('x-forwarded-for') || '192.168.1.45',
      details: detailsMsg,
      browser: request.headers.get('user-agent') || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      branch: userBranch,
      role: userSession?.role || 'SUPERADMIN'
    });
    
    writeJson(AUDIT_FILE, auditData);

    return NextResponse.json({ success: true, settings: body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
