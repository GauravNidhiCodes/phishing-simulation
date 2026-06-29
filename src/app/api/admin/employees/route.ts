import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const org = await prisma.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'Tenant not initialized' }, { status: 500 });
    }

    if (id) {
      // Single employee details
      const employee = await prisma.user.findUnique({
        where: { id, role: 'EMPLOYEE', organizationId: org.id }
      });

      if (!employee) {
        return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
      }

      // Simulation history logs
      const campaignLogs = await prisma.campaignLog.findMany({
        where: { userId: id },
        include: {
          campaign: {
            include: {
              template: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Training progress logs
      const quizProgress = await prisma.quizProgress.findMany({
        where: { userId: id },
        include: {
          module: true
        },
        orderBy: { updatedAt: 'desc' }
      });

      // All available modules (to build recommendation rules)
      const allModules = await prisma.trainingModule.findMany();

      return NextResponse.json({
        employee,
        campaignLogs,
        quizProgress,
        allModules
      });
    }

    // Default: list all employees and authorized domains
    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE', organizationId: org.id },
      orderBy: { name: 'asc' }
    });

    const domains = await prisma.verifiedDomain.findMany({
      where: { organizationId: org.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ employees, domains });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, name, email, department, branch, managerName, domain } = body;

    const org = await prisma.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'Tenant not initialized' }, { status: 500 });
    }

    if (action === 'ADD_EMPLOYEE') {
      if (!email || !name) {
        return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
      }

      // Check if domain of email is verified
      const emailDomain = email.split('@')[1];
      const verifiedDomain = await prisma.verifiedDomain.findFirst({
        where: { domain: emailDomain, isVerified: true, organizationId: org.id }
      });

      if (!verifiedDomain) {
        return NextResponse.json({ 
          error: `Domain '${emailDomain}' is not verified. You must add and verify this domain under 'Authorized Domains' before adding users.` 
        }, { status: 400 });
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          department: department || 'General',
          branch: branch || 'Pune',
          managerName: managerName || 'Rahul Sharma',
          joiningDate: new Date(),
          organizationId: org.id,
          role: 'EMPLOYEE',
          awarenessScore: 100,
          riskCategory: 'LOW'
        }
      });
      return NextResponse.json(user);
    } 
    
    if (action === 'ADD_DOMAIN') {
      if (!domain) {
        return NextResponse.json({ error: 'Domain name is required' }, { status: 400 });
      }

      const txtKey = `pinkman-verification-${Math.random().toString(36).substring(2, 15)}`;
      const newDomain = await prisma.verifiedDomain.create({
        data: {
          domain,
          txtRecordKey: txtKey,
          isVerified: false,
          organizationId: org.id
        }
      });
      return NextResponse.json(newDomain);
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Verification process
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { domainId } = body;

    if (!domainId) {
      return NextResponse.json({ error: 'Domain ID is required' }, { status: 400 });
    }

    const domainObj = await prisma.verifiedDomain.findUnique({
      where: { id: domainId }
    });

    if (!domainObj) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    const updated = await prisma.verifiedDomain.update({
      where: { id: domainId },
      data: { isVerified: true }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
