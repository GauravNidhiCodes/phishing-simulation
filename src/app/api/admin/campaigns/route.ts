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
    const { 
      name, 
      description,
      category,
      riskLevel,
      organizationName,
      templateId, 
      scheduledStart, 
      targetDepartments, // array of strings
      targetBranches,    // array of strings
      targetUserIds      // array of strings
    } = body;

    // Required fields validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Campaign Name is required' }, { status: 400 });
    }
    if (!description || !description.trim()) {
      return NextResponse.json({ error: 'Campaign Description is required' }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: 'Campaign Category is required' }, { status: 400 });
    }
    if (!riskLevel) {
      return NextResponse.json({ error: 'Risk Level is required' }, { status: 400 });
    }
    if (!organizationName || !organizationName.trim()) {
      return NextResponse.json({ error: 'Organization Name is required' }, { status: 400 });
    }
    if (!templateId) {
      return NextResponse.json({ error: 'Email Template is required' }, { status: 400 });
    }

    const org = await prisma.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'No organization tenant initialized' }, { status: 500 });
    }

    // Duplicate campaign name check
    const duplicate = await prisma.campaign.findFirst({
      where: {
        name: name.trim(),
        organizationId: org.id
      }
    });
    if (duplicate) {
      return NextResponse.json({ error: 'A campaign with this name already exists in your organization' }, { status: 400 });
    }

    // Date/time validation
    let scheduledDate: Date | null = null;
    if (scheduledStart) {
      scheduledDate = new Date(scheduledStart);
      if (isNaN(scheduledDate.getTime())) {
        return NextResponse.json({ error: 'Invalid scheduled date/time format' }, { status: 400 });
      }
      
      const now = new Date();
      if (scheduledDate <= now) {
        return NextResponse.json({ error: 'Scheduled start date/time must be in the future' }, { status: 400 });
      }
    }

    // Resolve targeted employees
    // If targetUserIds is specified explicitly, use it.
    // Otherwise, filter dynamically by selected targetDepartments and/or targetBranches
    const targetEmployees = await prisma.user.findMany({
      where: {
        role: 'EMPLOYEE',
        organizationId: org.id,
        ...(targetUserIds && targetUserIds.length > 0
          ? { id: { in: targetUserIds } }
          : {
              ...(targetDepartments && targetDepartments.length > 0 && !targetDepartments.includes('ALL')
                ? { department: { in: targetDepartments } }
                : {}),
              ...(targetBranches && targetBranches.length > 0 && !targetBranches.includes('ALL')
                ? { branch: { in: targetBranches } }
                : {})
            }
        )
      }
    });

    // Employee selection validation
    if (targetEmployees.length === 0) {
      return NextResponse.json({ error: 'Employee selection validation failed: No matching active employees found for the selected targets' }, { status: 400 });
    }

    // Create the campaign in DRAFT or SCHEDULED
    const initialStatus = scheduledDate ? 'SCHEDULED' : 'DRAFT';

    const campaign = await prisma.campaign.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        category,
        riskLevel,
        organizationName: organizationName.trim(),
        templateId,
        scheduledStart: scheduledDate,
        status: initialStatus,
        organizationId: org.id,
        branches: JSON.stringify(targetBranches || []),
        departments: JSON.stringify(targetDepartments || [])
      },
      include: {
        template: true
      }
    });

    // Initialize logs for targeted users
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
