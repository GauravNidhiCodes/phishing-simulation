import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.emailTemplate.findUnique({
      where: { id }
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, subject, bodyHtml, indicators } = body;

    if (!name || !subject || !bodyHtml) {
      return NextResponse.json({ error: 'Name, Subject and Body HTML are required' }, { status: 400 });
    }

    const updated = await prisma.emailTemplate.update({
      where: { id },
      data: {
        name,
        subject,
        bodyHtml,
        indicators: typeof indicators === 'string' ? indicators : JSON.stringify(indicators || [])
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    
    const campaignCount = await prisma.campaign.count({
      where: { templateId: id }
    });

    if (campaignCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete template. It is currently associated with active or historical simulation campaigns.' 
      }, { status: 400 });
    }

    await prisma.emailTemplate.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
