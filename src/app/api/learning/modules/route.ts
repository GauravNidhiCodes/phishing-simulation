import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Default logged-in user to Alex Rivera for simulation convenience
    const user = await prisma.user.findFirst({
      where: { email: 'alex.r@acme.com' }
    });

    if (!user) {
      return NextResponse.json({ error: 'Default employee user not found. Run seed script.' }, { status: 404 });
    }

    const modules = await prisma.trainingModule.findMany({
      include: {
        quizzes: true,
        progress: {
          where: { userId: user.id }
        }
      }
    });

    // Parse options field from JSON string for each question
    const parsedModules = modules.map(m => ({
      ...m,
      quizzes: m.quizzes.map(q => ({
        ...q,
        options: JSON.parse(q.options)
      }))
    }));

    return NextResponse.json({ user, modules: parsedModules });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { moduleId, userId, score, completed } = body;

    if (!moduleId || !userId) {
      return NextResponse.json({ error: 'Module ID and User ID are required' }, { status: 400 });
    }

    // 1. Create or Update QuizProgress record
    const existingProgress = await prisma.quizProgress.findFirst({
      where: { moduleId, userId }
    });

    let progress;
    if (existingProgress) {
      progress = await prisma.quizProgress.update({
        where: { id: existingProgress.id },
        data: {
          score,
          completed: completed || false
        }
      });
    } else {
      progress = await prisma.quizProgress.create({
        data: {
          userId,
          moduleId,
          score,
          completed: completed || false
        }
      });
    }

    // 2. Adjust User's general awareness score based on their training results
    // Let's load all progress for this user
    const allProgress = await prisma.quizProgress.findMany({
      where: { userId }
    });

    const totalModules = await prisma.trainingModule.count();
    const completedCount = allProgress.filter(p => p.completed).length;
    const avgQuizScore = allProgress.length > 0
      ? allProgress.reduce((sum, curr) => sum + curr.score, 0) / allProgress.length
      : 0;

    // Calculate a new awareness score out of 100
    // Starting with 70 base, training completion adds up to 30 points
    const trainingFactor = totalModules > 0 ? (completedCount / totalModules) * 30 : 0;
    const quizFactor = (avgQuizScore / 100) * 70;
    const newAwarenessScore = Math.min(100, Math.round(trainingFactor + quizFactor));

    // Determine new risk category
    let riskCategory = 'HIGH';
    if (newAwarenessScore >= 80) riskCategory = 'LOW';
    else if (newAwarenessScore >= 60) riskCategory = 'MEDIUM';

    await prisma.user.update({
      where: { id: userId },
      data: {
        awarenessScore: newAwarenessScore,
        riskCategory
      }
    });

    return NextResponse.json({ progress, newScore: newAwarenessScore, riskCategory });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
