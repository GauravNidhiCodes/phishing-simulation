import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'src/app/api/admin/reports/reports_data.json');

// Helper to read data from JSON file
function readDataFile() {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading reports JSON file:', err);
  }
  return { schedules: [], history: [] };
}

// Helper to write data to JSON file
function writeDataFile(data: any) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing reports JSON file:', err);
    return false;
  }
}

export async function GET(request: Request) {
  try {
    // 1. Parse filter params
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branch') || 'All';
    const deptFilter = searchParams.get('department') || 'All';
    const campaignFilter = searchParams.get('campaign') || 'All';
    const employeeFilter = searchParams.get('employee') || 'All';
    const riskFilter = searchParams.get('riskLevel') || 'All';
    
    // 2. Fetch primary DB elements
    const org = await prisma.organization.findFirst();
    const orgName = org ? org.name : 'Pinkman Protects Enterprise';

    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      include: {
        quizProgress: true,
        campaignLogs: true
      }
    });

    const campaigns = await prisma.campaign.findMany({
      include: {
        logs: true
      }
    });

    const totalModules = await prisma.trainingModule.count() || 13;

    // 3. Apply Filters to Employee records
    let filteredEmployees = [...employees];
    if (branchFilter !== 'All') {
      filteredEmployees = filteredEmployees.filter(e => e.branch === branchFilter);
    }
    if (deptFilter !== 'All') {
      filteredEmployees = filteredEmployees.filter(e => e.department === deptFilter);
    }
    if (employeeFilter !== 'All') {
      filteredEmployees = filteredEmployees.filter(e => e.id === employeeFilter);
    }
    if (riskFilter !== 'All') {
      filteredEmployees = filteredEmployees.filter(e => e.riskCategory === riskFilter);
    }

    // 4. Apply Filters to Campaigns and logs
    let filteredCampaigns = [...campaigns];
    if (campaignFilter !== 'All') {
      filteredCampaigns = filteredCampaigns.filter(c => c.id === campaignFilter);
    }

    // Accumulate filtered logs
    const filteredCampaignIds = new Set(filteredCampaigns.map(c => c.id));
    const filteredEmployeeIds = new Set(filteredEmployees.map(e => e.id));

    const allLogs = await prisma.campaignLog.findMany({
      include: {
        user: true,
        campaign: true
      }
    });

    const filteredLogs = allLogs.filter(l => 
      filteredCampaignIds.has(l.campaignId) && 
      filteredEmployeeIds.has(l.userId)
    );

    // 5. Aggregate KPI Summary Metrics
    const totalEmployeesCount = filteredEmployees.length;
    
    const avgAwarenessScore = totalEmployeesCount > 0
      ? Math.round(filteredEmployees.reduce((sum, e) => sum + e.awarenessScore, 0) / totalEmployeesCount)
      : 100;

    const activeCampaignsCount = filteredCampaigns.filter(c => c.status === 'ACTIVE').length;
    const completedCampaignsCount = filteredCampaigns.filter(c => c.status === 'COMPLETED').length;
    const highRiskEmployeesCount = filteredEmployees.filter(e => e.riskCategory === 'HIGH').length;

    // Calculate training completion rate: completed progresses / (total modules * total employees)
    let totalCompletedQuizzes = 0;
    filteredEmployees.forEach(e => {
      totalCompletedQuizzes += e.quizProgress.filter(qp => qp.completed).length;
    });
    
    const totalAssignedQuizzesCount = totalModules * totalEmployeesCount || 1;
    const trainingCompletionRate = Math.min(100, Math.round((totalCompletedQuizzes / totalAssignedQuizzesCount) * 100));

    // Phishing campaign logs
    const totalDelivered = filteredLogs.filter(l => l.deliveredAt).length;
    const totalOpened = filteredLogs.filter(l => l.openedAt).length;
    const totalClicked = filteredLogs.filter(l => l.clickedAt).length;
    const totalSubmitted = filteredLogs.filter(l => l.submittedAt).length;

    const openRate = totalDelivered > 0 ? Math.round((totalOpened / totalDelivered) * 100) : 0;
    const clickRate = totalDelivered > 0 ? Math.round((totalClicked / totalDelivered) * 100) : 0;
    const submitRate = totalDelivered > 0 ? Math.round((totalSubmitted / totalDelivered) * 100) : 0;

    // 6. Branch-wise Performance (for 7 Indian cities)
    const branches = ['Pune', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata'];
    const branchStats = branches.map(brName => {
      const brEmps = employees.filter(e => e.branch === brName);
      const brEmpIds = new Set(brEmps.map(e => e.id));
      const brLogs = allLogs.filter(l => brEmpIds.has(l.userId));

      const brDelivered = brLogs.filter(l => l.deliveredAt).length;
      const brClicks = brLogs.filter(l => l.clickedAt).length;

      const brCompletedQuizzes = brEmps.reduce((sum, e) => sum + e.quizProgress.filter(qp => qp.completed).length, 0);
      const brTotalAssigned = totalModules * brEmps.length || 1;

      return {
        name: brName,
        employeesCount: brEmps.length,
        averageScore: brEmps.length > 0 ? Math.round(brEmps.reduce((sum, e) => sum + e.awarenessScore, 0) / brEmps.length) : 100,
        clickRate: brDelivered > 0 ? Math.round((brClicks / brDelivered) * 100) : 0,
        trainingCompletionRate: Math.min(100, Math.round((brCompletedQuizzes / brTotalAssigned) * 100))
      };
    });

    // 7. Department-wise Performance (for 7 departments)
    const depts = ['Engineering', 'HR', 'Finance', 'Sales', 'Marketing', 'IT Support', 'Operations'];
    const departmentStats = depts.map(dName => {
      const dEmps = employees.filter(e => e.department === dName);
      const dEmpIds = new Set(dEmps.map(e => e.id));
      const dLogs = allLogs.filter(l => dEmpIds.has(l.userId));

      const dDelivered = dLogs.filter(l => l.deliveredAt).length;
      const dClicks = dLogs.filter(l => l.clickedAt).length;

      const dCompletedQuizzes = dEmps.reduce((sum, e) => sum + e.quizProgress.filter(qp => qp.completed).length, 0);
      const dTotalAssigned = totalModules * dEmps.length || 1;

      return {
        name: dName,
        employeesCount: dEmps.length,
        averageScore: dEmps.length > 0 ? Math.round(dEmps.reduce((sum, e) => sum + e.awarenessScore, 0) / dEmps.length) : 100,
        clickRate: dDelivered > 0 ? Math.round((dClicks / dDelivered) * 100) : 0,
        trainingCompletionRate: Math.min(100, Math.round((dCompletedQuizzes / dTotalAssigned) * 100))
      };
    });

    // 8. Employees Pending Training & High-Risk Lists
    const pendingEmployees = employees.filter(e => {
      const completedCount = e.quizProgress.filter(qp => qp.completed).length;
      return completedCount < totalModules;
    }).map(e => {
      const completedCount = e.quizProgress.filter(qp => qp.completed).length;
      return {
        id: e.id,
        name: e.name || 'Anonymous',
        email: e.email,
        department: e.department || 'Operations',
        branch: e.branch || 'Pune',
        score: e.awarenessScore,
        completedCount,
        pendingCount: totalModules - completedCount
      };
    }).sort((a, b) => a.score - b.score).slice(0, 10);

    const highRiskEmployeesList = employees.filter(e => e.riskCategory === 'HIGH')
      .map(e => ({
        id: e.id,
        name: e.name || 'Anonymous',
        email: e.email,
        department: e.department || 'Operations',
        branch: e.branch || 'Pune',
        score: e.awarenessScore
      })).sort((a, b) => a.score - b.score);

    // 9. AI Insights engine
    // Highest Risk Branch = lowest average score or highest click rate
    const sortedBranchesByScore = [...branchStats].filter(b => b.employeesCount > 0).sort((a, b) => a.averageScore - b.averageScore);
    const highestRiskBranch = sortedBranchesByScore.length > 0 ? sortedBranchesByScore[0].name : 'Mumbai';

    // Most Improved Department = department with highest completion rate
    const sortedDeptsByCompletion = [...departmentStats].filter(d => d.employeesCount > 0).sort((a, b) => b.trainingCompletionRate - a.trainingCompletionRate);
    const mostImprovedDept = sortedDeptsByCompletion.length > 0 ? sortedDeptsByCompletion[0].name : 'Engineering';

    const requiresImmediateTraining = filteredEmployees
      .filter(e => e.riskCategory === 'HIGH' && e.quizProgress.filter(qp => qp.completed).length < totalModules)
      .map(e => ({ name: e.name || 'Anonymous', email: e.email, score: e.awarenessScore }))
      .slice(0, 3);

    const aiInsights = {
      highestRiskBranch,
      mostImprovedDept,
      requiresImmediateTraining,
      campaignEffectivenessSummary: `Across ${campaigns.length} campaigns, the average link click-through rate is ${clickRate}%, while credential/form submissions sit at ${submitRate}%. Phishing domains mimicking corporate IT services (VPN access, MS365 login) represent the highest risk factors for clicks.`,
      monthlyRecommendations: [
        `Mandatory MFA verification and password hygiene modules should be prioritised for ${highestRiskBranch} immediately.`,
        `Direct IT Support to deploy targeted internal notifications to the ${mostImprovedDept} department to maintain their leading compliance score.`,
        `Schedule a low-alert mock HR Leave Policy simulation next week to baseline newly onboarded staff.`
      ]
    };

    // 10. Load schedule and history lists
    const fileData = readDataFile();

    return NextResponse.json({
      orgName,
      stats: {
        avgAwarenessScore,
        totalEmployees: totalEmployeesCount,
        activeCampaigns: activeCampaignsCount,
        completedCampaigns: completedCampaignsCount,
        highRiskEmployees: highRiskEmployeesCount,
        trainingCompletionRate,
        phishingRates: {
          delivered: totalDelivered,
          opened: totalOpened,
          clicked: totalClicked,
          submitted: totalSubmitted,
          openRate,
          clickRate,
          submitRate
        }
      },
      branchStats,
      departmentStats,
      pendingEmployees,
      highRiskEmployees: highRiskEmployeesList,
      aiInsights,
      schedules: fileData.schedules,
      history: fileData.history,
      allEmployeesSummary: employees.map(e => ({ id: e.id, name: e.name || e.email })),
      allCampaignsSummary: campaigns.map(c => ({ id: c.id, name: c.name }))
    });

  } catch (error: any) {
    console.error('Error generating reports data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { actionType, title, category, frequency, targetEmails, format, creator } = body;

    const fileData = readDataFile();

    if (actionType === 'schedule') {
      const newSchedule = {
        id: `SCH-${Math.floor(Math.random() * 900) + 100}`,
        title: title || 'Scheduled Compliance Audit',
        category: category || 'Compliance Status',
        frequency: frequency || 'Monthly',
        targetEmails: targetEmails || 'admin@company.in',
        active: true,
        createdAt: new Date().toISOString()
      };
      
      fileData.schedules.unshift(newSchedule);
      writeDataFile(fileData);
      
      return NextResponse.json({ success: true, schedule: newSchedule });
    }

    if (actionType === 'history') {
      const newRun = {
        id: `REP-${Math.floor(Math.random() * 90000) + 10000}`,
        title: title || 'Manual Security Report',
        category: category || 'Executive Summary',
        format: format || 'PDF',
        creator: creator || 'Amit Sharma (SecOps)',
        timestamp: new Date().toISOString(),
        status: 'COMPLETED'
      };

      fileData.history.unshift(newRun);
      writeDataFile(fileData);

      return NextResponse.json({ success: true, run: newRun });
    }

    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
