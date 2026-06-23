import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(templates);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, subject, bodyHtml, indicators } = body;

    if (!name || !subject || !bodyHtml) {
      return NextResponse.json({ error: 'Name, Subject and Body HTML are required' }, { status: 400 });
    }

    const org = await prisma.organization.findFirst();
    
    const template = await prisma.emailTemplate.create({
      data: {
        name,
        subject,
        bodyHtml,
        indicators: indicators ? JSON.stringify(indicators) : JSON.stringify([]),
        organizationId: org?.id || null
      }
    });

    return NextResponse.json(template);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
