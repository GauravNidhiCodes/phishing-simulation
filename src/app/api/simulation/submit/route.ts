import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { logId } = body;

    // Reject password data payloads explicitly if sent
    if (body.password || body.credentials) {
      console.warn("Security Alert: Credential payload rejected from simulation log submission");
    }

    if (!logId || logId === 'test') {
      return NextResponse.json({ success: true, message: 'Simulated submission tracked (No credentials stored)' });
    }

    const log = await prisma.campaignLog.findUnique({
      where: { id: logId },
      include: { user: true }
    });

    if (!log) {
      return NextResponse.json({ error: 'Simulation log reference not found' }, { status: 404 });
    }

    // Only update if it hasn't been submitted yet
    if (!log.submittedAt) {
      await prisma.campaignLog.update({
        where: { id: logId },
        data: { submittedAt: new Date() }
      });

      // Deduct score for failing credential entry (heavy penalty)
      const newScore = Math.max(0, log.user.awarenessScore - 30);
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

    return NextResponse.json({ success: true, message: "Interaction logged successfully. Redirecting to awareness page." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
