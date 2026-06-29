import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    
    const totalEmployees = await prisma.user.count({
      where: { role: 'EMPLOYEE' }
    });

    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' }
    });

    
    const avgScore = employees.length > 0 
      ? Math.round(employees.reduce((acc, curr) => acc + curr.awarenessScore, 0) / employees.length) 
      : 100;

    
    const riskCounts = {
      LOW: employees.filter(e => e.riskCategory === 'LOW').length,
      MEDIUM: employees.filter(e => e.riskCategory === 'MEDIUM').length,
      HIGH: employees.filter(e => e.riskCategory === 'HIGH').length,
    };

    
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
        campaign: true
      }
    });

    
    const totalDelivered = logs.filter(l => l.deliveredAt).length;
    const totalOpened = logs.filter(l => l.openedAt).length;
    const totalClicked = logs.filter(l => l.clickedAt).length;
    const totalSubmitted = logs.filter(l => l.submittedAt).length;

    const openRate = totalDelivered > 0 ? Math.round((totalOpened / totalDelivered) * 100) : 0;
    const clickRate = totalDelivered > 0 ? Math.round((totalClicked / totalDelivered) * 100) : 0;
    const submitRate = totalDelivered > 0 ? Math.round((totalSubmitted / totalDelivered) * 100) : 0;

    
    const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));
    const departmentStats = departments.map(dept => {
      const deptEmps = employees.filter(e => e.department === dept);
      const avgDeptScore = deptEmps.reduce((acc, curr) => acc + curr.awarenessScore, 0) / deptEmps.length;
      
      
      const deptEmpIds = deptEmps.map(e => e.id);
      const deptLogs = logs.filter(l => deptEmpIds.includes(l.userId));
      const deptClicks = deptLogs.filter(l => l.clickedAt).length;
      const deptSubmits = deptLogs.filter(l => l.submittedAt).length;

      return {
        name: dept || 'Unknown',
        employeesCount: deptEmps.length,
        averageScore: Math.round(avgDeptScore),
        clicksCount: deptClicks,
        submitsCount: deptSubmits,
      };
    }).sort((a, b) => b.averageScore - a.averageScore);

    
    const completedCampaigns = campaigns
      .filter(c => c.status === 'COMPLETED' && c.startedAt)
      .sort((a, b) => new Date(a.startedAt!).getTime() - new Date(b.startedAt!).getTime());

    const campaignTrends = completedCampaigns.map(c => {
      const cLogs = c.logs;
      const cDelivered = cLogs.filter(l => l.deliveredAt).length;
      const cOpened = cLogs.filter(l => l.openedAt).length;
      const cClicked = cLogs.filter(l => l.clickedAt).length;
      const cSubmitted = cLogs.filter(l => l.submittedAt).length;

      return {
        name: c.name,
        openRate: cDelivered > 0 ? Math.round((cOpened / cDelivered) * 100) : 0,
        clickRate: cDelivered > 0 ? Math.round((cClicked / cDelivered) * 100) : 0,
        submitRate: cDelivered > 0 ? Math.round((cSubmitted / cDelivered) * 100) : 0,
      };
    });

    return NextResponse.json({
      totalEmployees,
      avgScore,
      riskCounts,
      rates: {
        delivered: totalDelivered,
        opened: totalOpened,
        clicked: totalClicked,
        submitted: totalSubmitted,
        openRate,
        clickRate,
        submitRate,
      },
      departmentStats,
      campaignTrends,
      campaignsSummary: campaigns.map(c => ({
        id: c.id,
        name: c.name,
        status: c.status,
        templateName: c.template.name,
        scheduledStart: c.scheduledStart,
        logsCount: c.logs.length,
        clicks: c.logs.filter(l => l.clickedAt).length,
        submits: c.logs.filter(l => l.submittedAt).length,
      }))
    });
  } catch (error: any) {
    console.error('Error fetching admin dashboard metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data', details: error.message }, { status: 500 });
  }
}
