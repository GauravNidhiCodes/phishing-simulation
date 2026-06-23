import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        template: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    const templates = await prisma.emailTemplate.findMany({
      orderBy: { name: 'asc' }
    });

    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' }
    });

    return NextResponse.json({ campaigns, templates, employees });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, templateId, scheduledStart, targetDepartment } = body;

    if (!name || !templateId) {
      return NextResponse.json({ error: 'Name and Template are required' }, { status: 400 });
    }

    const org = await prisma.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization tenant initialized' }, { status: 500 });
    }

    // Create the campaign in DRAFT or SCHEDULED
    const scheduledDate = scheduledStart ? new Date(scheduledStart) : null;
    const initialStatus = scheduledDate ? 'SCHEDULED' : 'DRAFT';

    const campaign = await prisma.campaign.create({
      data: {
        name,
        templateId,
        scheduledStart: scheduledDate,
        status: initialStatus,
        organizationId: org.id,
      },
      include: {
        template: true
      }
    });

    // If campaign is active or scheduled, let's create mock logs for employees
    // Filtering by department if specified
    const targetEmployees = await prisma.user.findMany({
      where: {
        role: 'EMPLOYEE',
        organizationId: org.id,
        ...(targetDepartment && targetDepartment !== 'ALL' ? { department: targetDepartment } : {})
      }
    });

    // Initialize blank log slots for these users in this campaign
    for (const emp of targetEmployees) {
      await prisma.campaignLog.create({
        data: {
          campaignId: campaign.id,
          userId: emp.id,
        }
      });
    }

    return NextResponse.json(campaign);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Support updating campaign status (e.g. starting a draft, completing it)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Campaign ID and Status are required' }, { status: 400 });
    }

    const updateData: any = { status };
    if (status === 'ACTIVE') {
      updateData.startedAt = new Date();
    } else if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: updateData,
      include: {
        template: true,
        logs: true
      }
    });

    // If starting a campaign, let's populate deliveredAt stamps for the initialized logs
    if (status === 'ACTIVE') {
      await prisma.campaignLog.updateMany({
        where: { campaignId: id },
        data: {
          deliveredAt: new Date()
        }
      });
    }

    return NextResponse.json(campaign);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
