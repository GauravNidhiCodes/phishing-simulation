import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { logId } = body;

    if (!logId || logId === 'test') {
      return NextResponse.json({ success: true, message: 'Simulated click tracked' });
    }

    const log = await prisma.campaignLog.findUnique({
      where: { id: logId },
      include: { user: true }
    });

    if (!log) {
      return NextResponse.json({ error: 'Simulation log reference not found' }, { status: 404 });
    }

    
    if (!log.clickedAt) {
      await prisma.campaignLog.update({
        where: { id: logId },
        data: { clickedAt: new Date() }
      });

      
      const newScore = Math.max(0, log.user.awarenessScore - 15);
      let newRisk = 'HIGH';
      if (newScore >= 80) newRisk = 'LOW';
      else if (newScore >= 60) newRisk = 'MEDIUM';

      await prisma.user.update({
        where: { id: log.userId },
        data: {
          awarenessScore: newScore,
          riskCategory: newRisk
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
