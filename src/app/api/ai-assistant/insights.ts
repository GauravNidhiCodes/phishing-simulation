import { prisma } from '@/lib/db';

export interface DepartmentStat {
  name: string;
  employeesCount: number;
  averageScore: number;
  highRiskCount: number;
}

export interface BranchStat {
  name: string;
  employeesCount: number;
  averageScore: number;
}

export interface HighRiskEmployee {
  name: string;
  email: string;
  department: string;
  branch: string;
  awarenessScore: number;
  riskCategory: string;
}

export interface CampaignSummary {
  name: string;
  status: string;
  clicks: number;
  submits: number;
  delivered: number;
  clickRate: number;
  submitRate: number;
  templateName: string;
}

export async function getSecurityInsights() {
  
  const employees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    orderBy: { awarenessScore: 'asc' }
  });

  const totalEmployees = employees.length;

  
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
    }
  });

  
  const avgScore = totalEmployees > 0 
    ? Math.round(employees.reduce((acc, curr) => acc + curr.awarenessScore, 0) / totalEmployees) 
    : 100;

  
  const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));
  const departmentStats: DepartmentStat[] = departments.map(dept => {
    const deptEmps = employees.filter(e => e.department === dept);
    const avgDeptScore = deptEmps.reduce((acc, curr) => acc + curr.awarenessScore, 0) / deptEmps.length;
    const highRiskCount = deptEmps.filter(e => e.riskCategory === 'HIGH').length;

    return {
      name: dept || 'Unknown',
      employeesCount: deptEmps.length,
      averageScore: Math.round(avgDeptScore),
      highRiskCount
    };
  });

  const highestRiskDept = departmentStats.length > 0
    ? [...departmentStats].sort((a, b) => a.averageScore - b.averageScore || b.highRiskCount - a.highRiskCount)[0]
    : { name: 'None', averageScore: 100, highRiskCount: 0, employeesCount: 0 };

  
  const branches = Array.from(new Set(employees.map(e => e.branch).filter(Boolean)));
  const branchStats: BranchStat[] = branches.map(br => {
    const brEmps = employees.filter(e => e.branch === br);
    const avgBrScore = brEmps.reduce((acc, curr) => acc + curr.awarenessScore, 0) / brEmps.length;

    return {
      name: br || 'Unknown',
      employeesCount: brEmps.length,
      averageScore: Math.round(avgBrScore)
    };
  });

  const mostImprovedBranch = branchStats.length > 0
    ? [...branchStats].sort((a, b) => b.averageScore - a.averageScore)[0]
    : { name: 'Pune', averageScore: 100, employeesCount: 0 }; 

  
  const highRiskEmployees: HighRiskEmployee[] = employees
    .filter(e => e.riskCategory === 'HIGH' || e.awarenessScore < 65)
    .slice(0, 5)
    .map(e => ({
      name: e.name || 'Anonymous User',
      email: e.email,
      department: e.department || 'Unknown',
      branch: e.branch || 'Unknown',
      awarenessScore: e.awarenessScore,
      riskCategory: e.riskCategory
    }));

  
  const totalDelivered = logs.filter(l => l.deliveredAt).length;
  const totalOpened = logs.filter(l => l.openedAt).length;
  const totalClicked = logs.filter(l => l.clickedAt).length;
  const totalSubmitted = logs.filter(l => l.submittedAt).length;

  const openRate = totalDelivered > 0 ? Math.round((totalOpened / totalDelivered) * 100) : 0;
  const clickRate = totalDelivered > 0 ? Math.round((totalClicked / totalDelivered) * 100) : 0;
  const submitRate = totalDelivered > 0 ? Math.round((totalSubmitted / totalDelivered) * 100) : 0;

  
  
  const templateFails: Record<string, { clicks: number; submits: number; total: number; name: string }> = {};
  logs.forEach(log => {
    const tName = log.campaign?.template?.name || log.campaign?.name || 'Unknown Template';
    if (!templateFails[tName]) {
      templateFails[tName] = { clicks: 0, submits: 0, total: 0, name: tName };
    }
    templateFails[tName].total += 1;
    if (log.clickedAt) templateFails[tName].clicks += 1;
    if (log.submittedAt) templateFails[tName].submits += 1;
  });

  const failingTemplates = Object.values(templateFails)
    .map(t => ({
      name: t.name,
      clickRate: t.total > 0 ? Math.round((t.clicks / t.total) * 100) : 0,
      submitRate: t.total > 0 ? Math.round((t.submits / t.total) * 100) : 0,
      totalInteractions: t.clicks + t.submits
    }))
    .sort((a, b) => b.clickRate - a.clickRate || b.totalInteractions - a.totalInteractions);

  const topPhishingTemplate = failingTemplates.length > 0 
    ? failingTemplates[0] 
    : { name: 'Microsoft 365 Password Reset', clickRate: 42, submitRate: 28 };

  
  const quizProgress = await prisma.quizProgress.findMany();
  const totalQuizzes = quizProgress.length;
  const completedQuizzes = quizProgress.filter(qp => qp.completed).length;
  const quizCompletionRate = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

  
  const activeCampaignsCount = campaigns.filter(c => c.status === 'ACTIVE').length;

  return {
    avgScore,
    totalEmployees,
    activeCampaignsCount,
    departmentStats,
    branchStats,
    highestRiskDept,
    mostImprovedBranch,
    highRiskEmployees,
    campaignStats: {
      openRate,
      clickRate,
      submitRate,
      totalDelivered,
      totalClicked,
      totalSubmitted
    },
    topPhishingTemplate,
    quizCompletionRate,
    campaigns: campaigns.slice(0, 5).map(c => ({
      name: c.name,
      status: c.status,
      clicks: c.logs.filter(l => l.clickedAt).length,
      submits: c.logs.filter(l => l.submittedAt).length,
      delivered: c.logs.filter(l => l.deliveredAt).length,
      clickRate: c.logs.filter(l => l.deliveredAt).length > 0 
        ? Math.round((c.logs.filter(l => l.clickedAt).length / c.logs.filter(l => l.deliveredAt).length) * 100)
        : 0,
      submitRate: c.logs.filter(l => l.deliveredAt).length > 0
        ? Math.round((c.logs.filter(l => l.submittedAt).length / c.logs.filter(l => l.deliveredAt).length) * 100)
        : 0,
      templateName: c.template?.name || 'Unknown'
    }))
  };
}


export async function getEmployeeSecurityDetails(userEmail: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      campaignLogs: {
        include: {
          campaign: {
            include: {
              template: true
            }
          }
        }
      },
      quizProgress: {
        include: {
          module: true
        }
      }
    }
  });

  if (!user) return null;

  const failedSimulations = user.campaignLogs.filter(log => log.clickedAt || log.submittedAt);
  const totalCampaigns = user.campaignLogs.length;
  
  
  const allModules = await prisma.trainingModule.findMany({
    include: { quizzes: true }
  });

  const completedModuleIds = user.quizProgress.filter(qp => qp.completed).map(qp => qp.moduleId);
  const recommendedModules = allModules
    .filter(m => !completedModuleIds.includes(m.id))
    .slice(0, 3)
    .map(m => ({
      id: m.id,
      title: m.title,
      description: m.description
    }));

  return {
    name: user.name || 'Employee',
    email: user.email,
    awarenessScore: user.awarenessScore,
    riskCategory: user.riskCategory,
    failedSimulations: failedSimulations.map(log => ({
      campaignName: log.campaign.name,
      templateName: log.campaign.template.name,
      clicked: !!log.clickedAt,
      submitted: !!log.submittedAt,
      date: log.clickedAt || log.submittedAt || log.createdAt
    })),
    recommendedModules,
    totalCampaigns,
    failedCount: failedSimulations.length
  };
}
