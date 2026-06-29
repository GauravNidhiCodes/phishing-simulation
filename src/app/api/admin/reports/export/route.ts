import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branch') || 'All';
    const deptFilter = searchParams.get('department') || 'All';
    const campaignFilter = searchParams.get('campaign') || 'All';
    const employeeFilter = searchParams.get('employee') || 'All';
    const riskFilter = searchParams.get('riskLevel') || 'All';
    const format = searchParams.get('format') || 'csv';

    
    const org = await prisma.organization.findFirst();
    const orgName = org ? org.name : 'Pinkman Protects Enterprise';

    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      include: {
        quizProgress: true,
        campaignLogs: true
      }
    });

    const campaigns = await prisma.campaign.findMany();
    const totalModules = await prisma.trainingModule.count() || 13;

    
    let filteredEmployees = [...employees];
    if (branchFilter !== 'All') filteredEmployees = filteredEmployees.filter(e => e.branch === branchFilter);
    if (deptFilter !== 'All') filteredEmployees = filteredEmployees.filter(e => e.department === deptFilter);
    if (employeeFilter !== 'All') filteredEmployees = filteredEmployees.filter(e => e.id === employeeFilter);
    if (riskFilter !== 'All') filteredEmployees = filteredEmployees.filter(e => e.riskCategory === riskFilter);

    
    let filteredCampaigns = [...campaigns];
    if (campaignFilter !== 'All') filteredCampaigns = filteredCampaigns.filter(c => c.id === campaignFilter);

    const filteredCampaignIds = new Set(filteredCampaigns.map(c => c.id));
    const filteredEmployeeIds = new Set(filteredEmployees.map(e => e.id));

    const allLogs = await prisma.campaignLog.findMany({
      include: { user: true, campaign: true }
    });

    const filteredLogs = allLogs.filter(l => 
      filteredCampaignIds.has(l.campaignId) && 
      filteredEmployeeIds.has(l.userId)
    );

    
    const totalEmployeesCount = filteredEmployees.length;
    const avgAwarenessScore = totalEmployeesCount > 0
      ? Math.round(filteredEmployees.reduce((sum, e) => sum + e.awarenessScore, 0) / totalEmployeesCount)
      : 100;
    
    const activeCampaignsCount = filteredCampaigns.filter(c => c.status === 'ACTIVE').length;
    const completedCampaignsCount = filteredCampaigns.filter(c => c.status === 'COMPLETED').length;
    const highRiskCount = filteredEmployees.filter(e => e.riskCategory === 'HIGH').length;

    let totalCompletedQuizzes = 0;
    filteredEmployees.forEach(e => {
      totalCompletedQuizzes += e.quizProgress.filter(qp => qp.completed).length;
    });
    const totalAssignedQuizzesCount = totalModules * totalEmployeesCount || 1;
    const trainingCompletionRate = Math.min(100, Math.round((totalCompletedQuizzes / totalAssignedQuizzesCount) * 100));

    
    const totalDelivered = filteredLogs.filter(l => l.deliveredAt).length;
    const totalClicked = filteredLogs.filter(l => l.clickedAt).length;
    const clickRate = totalDelivered > 0 ? Math.round((totalClicked / totalDelivered) * 100) : 0;

    
    const reportId = `REP-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowIST = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    
    
    let csvContent = "";
    csvContent += `==================================================\n`;
    csvContent += `PINKMAN PROTECTS - REPORTING & COMPLIANCE SUMMARY\n`;
    csvContent += `==================================================\n\n`;
    
    csvContent += `Report Metadata:\n`;
    csvContent += `Report ID, ${reportId}\n`;
    csvContent += `Generated Date & Time (IST), ${nowIST}\n`;
    csvContent += `Organization Name, ${orgName}\n`;
    csvContent += `Filters Applied: \n`;
    csvContent += `- Branch, ${branchFilter}\n`;
    csvContent += `- Department, ${deptFilter}\n`;
    csvContent += `- Campaign, ${campaignFilter === 'All' ? 'All Campaigns' : campaignFilter}\n`;
    csvContent += `- Risk Category, ${riskFilter}\n\n`;

    csvContent += `EXECUTIVE SUMMARY STATS:\n`;
    csvContent += `Metric, Value\n`;
    csvContent += `Overall Security Awareness Score, ${avgAwarenessScore}%\n`;
    csvContent += `Total Targeted Employees, ${totalEmployeesCount}\n`;
    csvContent += `Active Simulation Campaigns, ${activeCampaignsCount}\n`;
    csvContent += `Completed Simulation Campaigns, ${completedCampaignsCount}\n`;
    csvContent += `High Risk Employee Count, ${highRiskCount}\n`;
    csvContent += `Training Compliance Rate, ${trainingCompletionRate}%\n`;
    csvContent += `Simulation Phishing Click-through Rate, ${clickRate}%\n\n`;

    
    csvContent += `BRANCH PERFORMANCE AUDIT:\n`;
    csvContent += `Branch, Employees, Avg Awareness Score, Clicks Count, Training Completion %\n`;
    
    const branches = ['Pune', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata'];
    branches.forEach(brName => {
      const brEmps = employees.filter(e => e.branch === brName);
      const brEmpIds = new Set(brEmps.map(e => e.id));
      const brLogs = allLogs.filter(l => brEmpIds.has(l.userId));
      const brClicks = brLogs.filter(l => l.clickedAt).length;

      const brCompleted = brEmps.reduce((sum, e) => sum + e.quizProgress.filter(qp => qp.completed).length, 0);
      const brTotal = totalModules * brEmps.length || 1;
      const brCompliance = Math.min(100, Math.round((brCompleted / brTotal) * 100));
      const brScore = brEmps.length > 0 ? Math.round(brEmps.reduce((sum, e) => sum + e.awarenessScore, 0) / brEmps.length) : 100;

      csvContent += `${brName}, ${brEmps.length}, ${brScore}%, ${brClicks}, ${brCompliance}%\n`;
    });
    csvContent += `\n`;

    
    csvContent += `DEPARTMENT PERFORMANCE AUDIT:\n`;
    csvContent += `Department, Employees, Avg Awareness Score, Clicks Count, Training Completion %\n`;
    
    const depts = ['Engineering', 'HR', 'Finance', 'Sales', 'Marketing', 'IT Support', 'Operations'];
    depts.forEach(dName => {
      const dEmps = employees.filter(e => e.department === dName);
      const dEmpIds = new Set(dEmps.map(e => e.id));
      const dLogs = allLogs.filter(l => dEmpIds.has(l.userId));
      const dClicks = dLogs.filter(l => l.clickedAt).length;

      const dCompleted = dEmps.reduce((sum, e) => sum + e.quizProgress.filter(qp => qp.completed).length, 0);
      const dTotal = totalModules * dEmps.length || 1;
      const dCompliance = Math.min(100, Math.round((dCompleted / dTotal) * 100));
      const dScore = dEmps.length > 0 ? Math.round(dEmps.reduce((sum, e) => sum + e.awarenessScore, 0) / dEmps.length) : 100;

      csvContent += `${dName}, ${dEmps.length}, ${dScore}%, ${dClicks}, ${dCompliance}%\n`;
    });
    csvContent += `\n`;

    
    csvContent += `HIGH RISK EMPLOYEES DETAILS:\n`;
    csvContent += `Name, Email, Score, Branch, Department\n`;
    const highRiskEmps = filteredEmployees.filter(e => e.riskCategory === 'HIGH');
    highRiskEmps.forEach(e => {
      csvContent += `${e.name || 'Anonymous'}, ${e.email}, ${e.awarenessScore}%, ${e.branch || 'Pune'}, ${e.department || 'Operations'}\n`;
    });

    const fileName = `pinkman_protects_compliance_report_${reportId}.${format === 'excel' ? 'csv' : 'csv'}`;
    const contentType = format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv';

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': `${contentType}; charset=utf-8`,
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });

  } catch (error: any) {
    console.error('Error generating export file:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
