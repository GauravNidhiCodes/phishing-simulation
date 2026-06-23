import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const logs = await prisma.campaignLog.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            department: true,
            awarenessScore: true,
            riskCategory: true
          }
        },
        campaign: {
          select: {
            name: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
