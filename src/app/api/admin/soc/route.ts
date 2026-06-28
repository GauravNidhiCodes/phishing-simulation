import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // 1. Session authentication check
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionCookie = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('pinkman_session='))
      ?.split('=')[1];

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
    }

    const decodedString = Buffer.from(sessionCookie, 'base64').toString('utf-8');
    const userSession = JSON.parse(decodedString);

    if (userSession.role === 'EMPLOYEE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Fetch base data
    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' }
    });

    const campaigns = await prisma.campaign.findMany({
      include: {
        template: true,
        logs: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const logs = await prisma.campaignLog.findMany({
      include: {
        user: true,
        campaign: {
          include: {
            template: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const quizProgress = await prisma.quizProgress.findMany({
      include: {
        user: true
      }
    });

    const totalEmployees = employees.length;
    const activeCampaignsCount = campaigns.filter(c => c.status === 'ACTIVE').length;

    // Calculate Health Score (average employee score)
    const avgScore = totalEmployees > 0 
      ? Math.round(employees.reduce((acc, curr) => acc + curr.awarenessScore, 0) / totalEmployees) 
      : 100;

    const highRiskCount = employees.filter(e => e.riskCategory === 'HIGH').length;

    // Calculate Training Completion rate
    const totalQuizzes = quizProgress.length;
    const completedQuizzes = quizProgress.filter(qp => qp.completed).length;
    const trainingCompletionRate = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

    // Posture and Index
    const maturityLevel = avgScore >= 80 ? "Level 4 - Managed" : avgScore >= 70 ? "Level 3 - Defined" : avgScore >= 60 ? "Level 2 - Repeatable" : "Level 1 - Initial";
    const riskIndex = avgScore >= 75 ? "LOW RISK" : avgScore >= 60 ? "MEDIUM RISK" : "HIGH RISK";

    // 3. Indian Branches Aggregation
    const indianBranches = ['Pune', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata'];
    const branchStats = indianBranches.map(branchName => {
      const branchEmps = employees.filter(e => e.branch === branchName);
      const branchEmpIds = branchEmps.map(e => e.id);
      
      const empCount = branchEmps.length;
      const avgBranchScore = empCount > 0 
        ? Math.round(branchEmps.reduce((acc, curr) => acc + curr.awarenessScore, 0) / empCount) 
        : 80; // default baseline

      const branchRiskCount = branchEmps.filter(e => e.riskCategory === 'HIGH').length;
      const branchRiskScore = empCount > 0 ? Math.round((branchRiskCount / empCount) * 100) : 0;

      // Quiz progress inside branch
      const branchQuizzes = quizProgress.filter(qp => branchEmpIds.includes(qp.userId));
      const branchCompleted = branchQuizzes.filter(qp => qp.completed).length;
      const branchTrainingRate = branchQuizzes.length > 0 ? Math.round((branchCompleted / branchQuizzes.length) * 100) : 0;

      // Check if branch targeted in active campaigns
      const isTargeted = campaigns.some(c => c.status === 'ACTIVE' && c.branches?.includes(branchName));

      return {
        name: branchName,
        employees: empCount,
        awarenessScore: avgBranchScore,
        riskScore: branchRiskScore,
        trainingPercent: branchTrainingRate || 0,
        campaignStatus: isTargeted ? "ACTIVE" : "INACTIVE"
      };
    });

    // 4. Threat Intelligence Calculations
    // Most Clicked Simulation
    const templateClicks: Record<string, { count: number; name: string }> = {};
    logs.forEach(log => {
      if (log.clickedAt) {
        const tName = log.campaign?.template?.name || log.campaign?.name || 'Standard Alert';
        if (!templateClicks[tName]) {
          templateClicks[tName] = { count: 0, name: tName };
        }
        templateClicks[tName].count += 1;
      }
    });

    const sortedClicks = Object.values(templateClicks).sort((a, b) => b.count - a.count);
    const mostClickedSimulation = sortedClicks.length > 0 ? sortedClicks[0].name : "EPFO Aadhaar Linking Alert";

    // Most Vulnerable Department
    const depts = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));
    const deptStats = depts.map(dName => {
      const dEmps = employees.filter(e => e.department === dName);
      const avgDScore = dEmps.reduce((acc, curr) => acc + curr.awarenessScore, 0) / dEmps.length;
      return { name: dName!, avgScore: Math.round(avgDScore) };
    }).sort((a, b) => a.avgScore - b.avgScore);

    const mostVulnerableDept = deptStats.length > 0 ? deptStats[0].name : "Finance";

    // Fastest Improving Branch (highest average branch score)
    const sortedBranches = [...branchStats].sort((a, b) => b.awarenessScore - a.awarenessScore);
    const fastestImprovingBranch = sortedBranches.length > 0 ? sortedBranches[0].name : "Bengaluru";

    // Top AI Recommendation
    const topAIRecommendation = avgScore < 75 
      ? `Configure MFA enforcement drills for ${mostVulnerableDept} department employees immediately.` 
      : "Maintain current simulation frequency; launch festival bonus templates to test payroll teams.";

    // 5. Timeline Generation (Chronological event log)
    const timelineEvents = logs.slice(0, 15).map((log, index) => {
      let eventType = 'DELIVERED';
      let title = 'Email Delivered';
      let desc = `Phishing email delivered to ${log.user?.name || 'employee'}.`;
      let time = log.deliveredAt || log.createdAt;

      if (log.submittedAt) {
        eventType = 'SUBMITTED';
        title = 'Credentials Intercepted';
        desc = `${log.user?.name} submitted credentials on fake landing page for campaign: "${log.campaign?.name}".`;
        time = log.submittedAt;
      } else if (log.clickedAt) {
        eventType = 'CLICKED';
        title = 'Link Clicked';
        desc = `${log.user?.name} clicked simulation link inside spoofed email.`;
        time = log.clickedAt;
      } else if (log.openedAt) {
        eventType = 'OPENED';
        title = 'Email Opened';
        desc = `Simulation email opened by ${log.user?.name || 'employee'}.`;
        time = log.openedAt;
      }

      return {
        id: `EV-${log.id}-${index}`,
        eventType,
        title,
        description: desc,
        timestamp: time
      };
    });

    // 6. Mock Live Ticker feeds
    const mockLiveFeeds = [
      { type: 'CAMPAIGN_LAUNCHED', title: 'Campaign Started', message: 'Phishing exercise "Income Tax Refund Notice" launched corporate-wide.' },
      { type: 'CAMPAIGN_COMPLETED', title: 'Campaign Completed', message: 'Simulation "Vendor Invoice Renewal" successfully finalized.' },
      { type: 'OPENED', title: 'Employee Opened Email', message: 'Security alert opened by user Rohan Deshmukh (Pune Branch).' },
      { type: 'CLICKED', title: 'Employee Clicked Link', message: 'Risk Alert: User click registered in HR leave policy simulation.' },
      { type: 'TRAINING_COMPLETED', title: 'Training Completed', message: 'User Priya Patel finished course: "Anti-Phishing Essentials".' },
      { type: 'REPORTED', title: 'Employee Reported suspicious email', message: 'System alert: Suspicious email flagged using Phish-Report extension.' },
      { type: 'RISK_UPDATED', title: 'Risk Score Updated', message: 'Awareness metrics recalculated for Sales department.' },
      { type: 'AI_GENERATED', title: 'AI Recommendation Generated', message: 'AI Engine advises targeting Finance with credential harvesting templates.' },
      { type: 'ALERT', title: 'New Security Alert', message: 'Department awareness score dropped below corporate safety boundary.' }
    ];

    return NextResponse.json({
      posture: {
        healthScore: avgScore,
        activeCampaigns: activeCampaignsCount,
        activeEmployees: totalEmployees,
        highRiskEmployees: highRiskCount,
        trainingCompletion: trainingCompletionRate,
        maturityLevel,
        riskIndex
      },
      branchStats,
      threatIntel: {
        mostClickedSimulation,
        mostVulnerableDept,
        fastestImprovingBranch,
        topAIRecommendation,
        mostEffectiveEmailTemplate: 'Salary Bonus Notification'
      },
      timelineEvents,
      mockLiveFeeds
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
