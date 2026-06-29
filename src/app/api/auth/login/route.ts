import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const PASSWORDS_FILE = path.join(process.cwd(), 'src/app/api/auth/passwords.json');
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and Password are required' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    const passwordsData = readJson(PASSWORDS_FILE, {});
    const auditData = readJson(AUDIT_FILE, []);

    
    const record = passwordsData[emailLower];
    const now = Date.now();

    if (record && record.lockedUntil && record.lockedUntil > now) {
      const remainingSeconds = Math.round((record.lockedUntil - now) / 1000);
      return NextResponse.json({ 
        error: `Account is temporarily locked due to multiple failed login attempts. Try again in ${remainingSeconds} seconds.` 
      }, { status: 403 });
    }

    
    let user = await prisma.user.findUnique({
      where: { email: emailLower }
    });

    let targetOrg = await prisma.organization.findFirst();
    if (!targetOrg) {
      targetOrg = await prisma.organization.create({
        data: { name: 'Pinkman Technologies Pvt. Ltd.' }
      });
      await prisma.verifiedDomain.create({
        data: {
          domain: 'company.in',
          isVerified: true,
          organizationId: targetOrg.id,
          txtRecordKey: 'pinkman-root-key'
        }
      });
    }

    if (!user) {
      
      if (emailLower === 'superadmin@company.in') {
        user = await prisma.user.create({
          data: {
            email: emailLower,
            name: 'Arjun Mehta',
            role: 'SUPERADMIN',
            department: 'SecOps',
            branch: 'Pune',
            organizationId: targetOrg.id,
            managerName: 'Board of Directors'
          }
        });
      } else if (emailLower === 'admin@company.in') {
        user = await prisma.user.create({
          data: {
            email: emailLower,
            name: 'Rajesh Kumar',
            role: 'SECURITY_ADMIN',
            department: 'IT Security',
            branch: 'Bengaluru',
            organizationId: targetOrg.id,
            managerName: 'Arjun Mehta'
          }
        });
      } else if (emailLower === 'hr@company.in') {
        user = await prisma.user.create({
          data: {
            email: emailLower,
            name: 'Priya Sharma',
            role: 'HR_MANAGER',
            department: 'HR',
            branch: 'Delhi',
            organizationId: targetOrg.id,
            managerName: 'Arjun Mehta'
          }
        });
      } else if (emailLower === 'manager@company.in') {
        user = await prisma.user.create({
          data: {
            email: emailLower,
            name: 'Vikram Malhotra',
            role: 'DEPT_MANAGER',
            department: 'Finance',
            branch: 'Mumbai',
            organizationId: targetOrg.id,
            managerName: 'Arjun Mehta'
          }
        });
      } else {
        
        user = await prisma.user.create({
          data: {
            email: emailLower,
            name: 'Rahul Verma',
            role: 'EMPLOYEE',
            department: 'Operations',
            branch: 'Pune',
            organizationId: targetOrg.id,
            managerName: 'Vikram Malhotra'
          }
        });
      }
    }

    
    const expectedPassword = record ? record.password : 'password123';
    if (password !== expectedPassword) {
      
      const attempts = record ? (record.failedAttempts || 0) + 1 : 1;
      let lockTime = 0;
      if (attempts >= 5) {
        lockTime = now + 5 * 60 * 1000; 
      }

      passwordsData[emailLower] = {
        password: expectedPassword,
        failedAttempts: attempts,
        lockedUntil: lockTime
      };
      writeJson(PASSWORDS_FILE, passwordsData);

      
      auditData.unshift({
        id: `AUDIT-${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: new Date().toISOString(),
        eventType: 'LOGIN_FAILURE',
        email: emailLower,
        ipAddress: '192.168.1.1',
        details: `Failed login attempt ${attempts}/5. ${lockTime > 0 ? 'Account locked.' : ''}`
      });
      writeJson(AUDIT_FILE, auditData);

      return NextResponse.json({ 
        error: `Incorrect password. Attempts: ${attempts}/5 before account lock.` 
      }, { status: 401 });
    }

    
    passwordsData[emailLower] = {
      password: expectedPassword,
      failedAttempts: 0,
      lockedUntil: 0
    };
    writeJson(PASSWORDS_FILE, passwordsData);

    
    auditData.unshift({
      id: `AUDIT-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toISOString(),
      eventType: 'LOGIN_SUCCESS',
      email: emailLower,
      ipAddress: '192.168.1.1',
      details: `${user.role} logged in successfully.`
    });
    writeJson(AUDIT_FILE, auditData);

    
    const sessionObj = {
      userId: user.id,
      email: user.email,
      name: user.name || user.email,
      role: user.role,
      orgId: user.organizationId,
      orgName: targetOrg.name,
      branch: user.branch || 'Pune',
      department: user.department || 'Operations',
      managerName: user.managerName || 'Suresh Iyer',
      joiningDate: user.joiningDate || new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    const sessionString = Buffer.from(JSON.stringify(sessionObj)).toString('base64');
    
    
    const response = NextResponse.json({ success: true, user: sessionObj });
    
    const expiry = rememberMe 
      ? `Max-Age=${30 * 24 * 60 * 60};` 
      : '';

    response.headers.set(
      'Set-Cookie',
      `pinkman_session=${sessionString}; Path=/; HttpOnly; SameSite=Lax; ${expiry}`
    );

    return response;

  } catch (error: any) {
    console.error('Error logging in user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
