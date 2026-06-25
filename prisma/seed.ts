import { PrismaClient } from "@prisma/client";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "prisma/dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seeding...");

  // Clean up database
  await prisma.quizProgress.deleteMany({});
  await prisma.quizQuestion.deleteMany({});
  await prisma.trainingModule.deleteMany({});
  await prisma.campaignLog.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.emailTemplate.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.verifiedDomain.deleteMany({});
  await prisma.organization.deleteMany({});

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: "Acme Corporation",
    },
  });

  // 2. Create Domains
  await prisma.verifiedDomain.createMany({
    data: [
      {
        domain: "acme.com",
        txtRecordKey: "acme-verification-6e9f82d1a3b",
        isVerified: true,
        organizationId: org.id,
      },
      {
        domain: "acme-corp.com",
        txtRecordKey: "acme-corp-verification-7c2a1b9d4e8",
        isVerified: false,
        organizationId: org.id,
      },
    ],
  });

  // 3. Create Users (Admins and Employees)
  const admin = await prisma.user.create({
    data: {
      email: "secops@acme.com",
      name: "Sarah Jenkins",
      role: "ORG_ADMIN",
      department: "Security",
      awarenessScore: 98,
      riskCategory: "LOW",
      organizationId: org.id,
    },
  });

  const employeesData = [
    // Engineering
    { name: "Arjun Mehta", email: "arjun.mehta@tata.co.in", department: "Engineering", branch: "Bengaluru", score: 92, risk: "LOW" },
    { name: "Priya Sharma", email: "priya.sharma@tata.co.in", department: "Engineering", branch: "Pune", score: 85, risk: "LOW" },
    { name: "Rajesh Kumar", email: "rajesh.kumar@reliance.in", department: "Engineering", branch: "Hyderabad", score: 55, risk: "HIGH" },
    // HR
    { name: "Deepika Patel", email: "deepika.patel@tata.co.in", department: "HR", branch: "Mumbai", score: 78, risk: "MEDIUM" },
    { name: "Amit Singh", email: "amit.singh@reliance.in", department: "HR", branch: "Delhi", score: 90, risk: "LOW" },
    // Sales
    { name: "Vikram Malhotra", email: "vikram.malhotra@tata.co.in", department: "Sales", branch: "Pune", score: 45, risk: "HIGH" },
    { name: "Ananya Iyer", email: "ananya.iyer@reliance.in", department: "Sales", branch: "Chennai", score: 72, risk: "MEDIUM" },
    { name: "Suresh Nair", email: "suresh.nair@tata.co.in", department: "Sales", branch: "Kolkata", score: 64, risk: "MEDIUM" },
    // Finance
    { name: "Neha Gupta", email: "neha.gupta@reliance.in", department: "Finance", branch: "Mumbai", score: 89, risk: "LOW" },
    { name: "Rohan Das", email: "rohan.das@tata.co.in", department: "Finance", branch: "Kolkata", score: 58, risk: "HIGH" },
    // Marketing
    { name: "Karan Johar", email: "karan.johar@reliance.in", department: "Marketing", branch: "Mumbai", score: 95, risk: "LOW" },
    { name: "Shalini Sen", email: "shalini.sen@tata.co.in", department: "Marketing", branch: "Delhi", score: 68, risk: "MEDIUM" },
    // Operations
    { name: "Aditya Verma", email: "aditya.verma@reliance.in", department: "Operations", branch: "Hyderabad", score: 74, risk: "MEDIUM" },
    { name: "Meera Bai", email: "meera.bai@tata.co.in", department: "Operations", branch: "Bengaluru", score: 82, risk: "LOW" },
    // IT Support
    { name: "Sanjay Dutt", email: "sanjay.dutt@reliance.in", department: "IT Support", branch: "Pune", score: 91, risk: "LOW" },
    { name: "Jyoti Rao", email: "jyoti.rao@tata.co.in", department: "IT Support", branch: "Bengaluru", score: 50, risk: "HIGH" }
  ];

  const employees = [];
  for (const emp of employeesData) {
    const user = await prisma.user.create({
      data: {
        name: emp.name,
        email: emp.email,
        role: "EMPLOYEE",
        department: emp.department,
        branch: emp.branch,
        awarenessScore: emp.score,
        riskCategory: emp.risk,
        organizationId: org.id,
      },
    });
    employees.push(user);
  }

  // 4. Create Prebuilt Indian Corporate Templates
  const template1 = await prisma.emailTemplate.create({
    data: {
      name: "Microsoft 365 Password Reset",
      subject: "Action Required: Microsoft 365 Password Reset for {{name}}",
      bodyHtml: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="background-color: #0078d4; padding: 15px; border-top-left-radius: 8px; border-top-right-radius: 8px; color: white; font-weight: bold; font-size: 18px;">
            Microsoft IT Security Operations
          </div>
          <div style="padding: 20px;">
            <p>Dear {{name}},</p>
            <p>Our global security telemetry systems have identified suspicious authentication requests originating from an unverified IP address in your region. In accordance with corporate compliance guidelines, a mandatory password reset is required immediately.</p>
            <p style="margin: 25px 0; text-align: center;">
              <a href="{{link}}" style="background-color: #0078d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Update Password Now</a>
            </p>
            <p style="font-size: 11px; color: #666; line-height: 1.5;">This linkage verification link will expire in 2 hours. Failure to authenticate will trigger automatic suspension of your active directory account to prevent potential data exfiltration.</p>
          </div>
          <div style="background-color: #f4f4f4; padding: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; text-align: center; font-size: 11px; color: #666;">
            Internal IT Helpdesk Operations | secure-portal-m365.co.in
          </div>
        </div>
      `,
      indicators: JSON.stringify([
        { id: 1, type: "sender", label: "Deceptive Mail Server Domain", text: "Sent from 'secure-portal-m365.co.in' instead of verified '@company.co.in'" },
        { id: 2, type: "urgency", label: "Extreme Time Coercion", text: "Demands resolution 'within 2 hours' or 'automatic suspension' to force immediate action" }
      ]),
    },
  });

  const template2 = await prisma.emailTemplate.create({
    data: {
      name: "HR Leave Policy Update",
      subject: "URGENT: Revised Corporate Leave Policy & FY26 Holiday Calendar",
      bodyHtml: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <p>Dear Employees,</p>
          <p>Please note that the executive committee has approved revisions to the corporate leave policy, effective next week. The carry-forward limits and earned leave calculations have been modified for all business divisions.</p>
          <p>Please review the updated policy handbook and the FY26 Holiday Calendar spreadsheet immediately to confirm your eligibility:</p>
          <p style="margin: 20px 0;">
            <a href="{{link}}" style="color: #0078d4; font-weight: bold; text-decoration: underline;">Revised_Leave_Policy_FY26.xlsx</a>
          </p>
          <p>Regards,</p>
          <p><strong>Corporate HR Operations Team</strong><br/>compensation-benefits@company.co.in</p>
        </div>
      `,
      indicators: JSON.stringify([
        { id: 1, type: "link", label: "Suspicious Download Destination", text: "Hyperlink points to an external simulation tracking portal instead of an internal HRMS system" }
      ]),
    },
  });

  const template3 = await prisma.emailTemplate.create({
    data: {
      name: "Salary Credit Notification",
      subject: "Disbursement Confirmation: Salary Credited for {{name}}",
      bodyHtml: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h3 style="color: #1b5e20;">Corporate Payroll Administration</h3>
          <p>Dear {{name}},</p>
          <p>This is to confirm that your payroll disbursement for the current month has been successfully processed and credited to your registered bank account.</p>
          <p>You can check and download your digital payslip, including tax deductions and benefits adjustments, at our secure portal below:</p>
          <p style="margin: 20px 0;">
            <a href="{{link}}" style="background-color: #1b5e20; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Download Payslip (PDF)</a>
          </p>
          <p>Thanks,</p>
          <p>Finance & Accounts Division</p>
        </div>
      `,
      indicators: JSON.stringify([
        { id: 1, type: "financial", label: "Financial Incentive", text: "Exploits high-curiosity payroll information to lure user to input credentials" }
      ]),
    },
  });

  const template4 = await prisma.emailTemplate.create({
    data: {
      name: "IT Helpdesk Security Alert",
      subject: "Critical Notice: Blocked IP Alert on Your Office Workstation",
      bodyHtml: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h3 style="color: #c62828;">IT Infrastructure Command Center</h3>
          <p>Attention {{name}},</p>
          <p>Our internal firewall has blocked multiple suspicious outbound communication requests originating from your active workstation IP. To prevent quarantine of your machine, you must run the diagnostic agent and verify your SSO token immediately.</p>
          <p style="margin: 20px 0; text-align: center;">
            <a href="{{link}}" style="background-color: #c62828; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Run Security Agent</a>
          </p>
          <p>IT Helpdesk Support Node</p>
        </div>
      `,
      indicators: JSON.stringify([
        { id: 1, type: "urgency", label: "Scare Tactics", text: "Uses threatening language ('quarantine of machine', 'blocked IP') to prompt immediate link click" }
      ]),
    },
  });

  const template5 = await prisma.emailTemplate.create({
    data: {
      name: "PF / EPFO Update",
      subject: "EPFO e-Sewa Notification: Mandatory Aadhaar-UAN Linkage Action",
      bodyHtml: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h3 style="color: #0d47a1;">Employees' Provident Fund Organisation (India)</h3>
          <p>Dear Subscriber,</p>
          <p>Under statutory EPFO compliance circulars, all subscribers are mandated to link their Aadhaar number to their Universal Account Number (UAN) to avoid suspension of provident fund contributions and interest credits.</p>
          <p>Please authenticate your UAN profile credentials in the Unified Portal to complete the linkage process immediately:</p>
          <p style="margin: 20px 0; text-align: center;">
            <a href="{{link}}" style="background-color: #0d47a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Link Aadhaar-UAN Online</a>
          </p>
          <p>This is a system generated notice. Do not reply to this email.</p>
        </div>
      `,
      indicators: JSON.stringify([
        { id: 1, type: "sender", label: "Government Spoofer", text: "EPFO emails will only arrive from verified government domains (gov.in) and never corporate internal routers" }
      ]),
    },
  });

  const template6 = await prisma.emailTemplate.create({
    data: {
      name: "Income Tax Declaration Reminder",
      subject: "Tax Compliance: Investment Declaration Submission Deadline for FY26",
      bodyHtml: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <p>Hello {{name}},</p>
          <p>This is a reminder that the window for submitting your IT Investment Declarations for the current financial year closes in 48 hours. Failure to declare will result in higher tax deduction at source (TDS) in this month's payroll.</p>
          <p>Please upload all relevant receipts and forms in our employee tax utility dashboard:</p>
          <p style="margin: 20px 0;">
            <a href="{{link}}" style="color: #0078d4; font-weight: bold; text-decoration: underline;">Access Tax Declaration Portal</a>
          </p>
          <p>Finance Operations - Payroll Desk</p>
        </div>
      `,
      indicators: JSON.stringify([
        { id: 1, type: "urgency", label: "Financial Urgency", text: "Forces action by threat of immediate salary deductions" }
      ]),
    },
  });

  const template7 = await prisma.emailTemplate.create({
    data: {
      name: "Vendor Invoice Approval",
      subject: "Finance Portal: Review Pending Invoice Approval for Vendor Services",
      bodyHtml: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <p>Hi Team,</p>
          <p>We have received an overdue invoice from our service provider for project milestones delivered last month. To prevent delay penalties, please audit and approve the invoice spreadsheet below:</p>
          <p style="margin: 20px 0;">
            <a href="{{link}}" style="color: #0078d4; font-weight: bold; text-decoration: underline;">Approve_Invoice_88492.pdf</a>
          </p>
          <p>Finance operations</p>
        </div>
      `,
      indicators: JSON.stringify([
        { id: 1, type: "sender", label: "Vague Sender details", text: "Sent with generic footer 'Finance operations' without vendor names or tracking logs" }
      ]),
    },
  });

  const template8 = await prisma.emailTemplate.create({
    data: {
      name: "Internal Meeting Invitation",
      subject: "CEO Townhall Meet: Discussion on FY26 Appraisals & Strategy",
      bodyHtml: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <p>Hello Team,</p>
          <p>You are invited to join the upcoming CEO Townhall video session. We will cover key business strategy updates, organizational shifts, and the upcoming FY26 appraisal cycles.</p>
          <p>Please register and confirm your attendance link to secure your connection slot:</p>
          <p style="margin: 20px 0; text-align: center;">
            <a href="{{link}}" style="background-color: #f57c00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Accept Invite & Join Meeting</a>
          </p>
          <p>Executive Office Assistant Desk</p>
        </div>
      `,
      indicators: JSON.stringify([
        { id: 1, type: "link", label: "Deceptive Meeting Link", text: "Accept meeting link routes to an external login gate instead of Zoom/Teams corporate connectors" }
      ]),
    },
  });

  const template9 = await prisma.emailTemplate.create({
    data: {
      name: "Company VPN Access Renewal",
      subject: "IT Infrastructure: Corporate VPN Access Token Expiration Notice",
      bodyHtml: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <p>Hi {{name}},</p>
          <p>Your corporate VPN remote access token is scheduled to expire at the end of this week. To prevent loss of connection to secure staging nodes and internal dashboards, you must renew your credentials immediately.</p>
          <p style="margin: 20px 0; text-align: center;">
            <a href="{{link}}" style="background-color: #0288d1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Renew VPN Token Now</a>
          </p>
          <p>Infrastructure Team Support Node</p>
        </div>
      `,
      indicators: JSON.stringify([
        { id: 1, type: "urgency", label: "Operational Disruption Threat", text: "Triggers panic regarding loss of corporate network connectivity" }
      ]),
    },
  });

  // 5. Create Campaigns
  // Campaign 1: Completed Q1 Campaign
  const campaignQ1 = await prisma.campaign.create({
    data: {
      name: "Q1 IT Password Audit",
      status: "COMPLETED",
      templateId: template1.id,
      organizationId: org.id,
      scheduledStart: new Date("2026-02-15T09:00:00Z"),
      startedAt: new Date("2026-02-15T09:05:00Z"),
      completedAt: new Date("2026-02-25T17:00:00Z"),
    },
  });

  // Campaign 2: Completed Q2 Campaign
  const campaignQ2 = await prisma.campaign.create({
    data: {
      name: "Q2 HR Benefits Assessment",
      status: "COMPLETED",
      templateId: template2.id,
      organizationId: org.id,
      scheduledStart: new Date("2026-05-10T08:00:00Z"),
      startedAt: new Date("2026-05-10T08:00:00Z"),
      completedAt: new Date("2026-05-20T17:00:00Z"),
    },
  });

  // Campaign 3: Active Campaign
  const campaignQ3 = await prisma.campaign.create({
    data: {
      name: "Q3 Billing Simulation",
      status: "ACTIVE",
      templateId: template3.id,
      organizationId: org.id,
      scheduledStart: new Date("2026-06-20T09:00:00Z"),
      startedAt: new Date("2026-06-20T09:05:00Z"),
    },
  });

  // Campaign 4: Scheduled Campaign
  const campaignQ4 = await prisma.campaign.create({
    data: {
      name: "Q4 End-of-Year Audit",
      status: "SCHEDULED",
      templateId: template1.id,
      organizationId: org.id,
      scheduledStart: new Date("2026-11-01T09:00:00Z"),
    },
  });

  // 6. Generate Simulation Logs (Campaign logs)
  // Let's create realistic performance trends.
  // In Q1, employees performed poorly. In Q2, they did better.
  console.log("Creating campaign logs...");

  // Q1 Simulation Logs:
  // Alex, Lisa, Harvey: Opened, but did not click.
  // Chloe, Chloe, Emily: Opened and clicked.
  // Marcus, John, Matthew: Opened, clicked, and submitted.
  // Rest did not open.
  const q1Logs = [
    { user: employees[0], open: true, click: false, submit: false }, // Alex
    { user: employees[1], open: true, click: true, submit: false }, // Jessica
    { user: employees[2], open: true, click: true, submit: true }, // Marcus (High risk)
    { user: employees[3], open: true, click: true, submit: false }, // Emily
    { user: employees[4], open: false, click: false, submit: false }, // David
    { user: employees[5], open: true, click: true, submit: true }, // John (High risk)
    { user: employees[6], open: true, click: true, submit: true }, // Chloe (Medium risk)
    { user: employees[7], open: true, click: true, submit: false }, // Robert
    { user: employees[8], open: true, click: false, submit: false }, // Lisa
    { user: employees[9], open: true, click: true, submit: true }, // Matthew (High risk)
    { user: employees[10], open: false, click: false, submit: false }, // Harvey
  ];

  for (const logItem of q1Logs) {
    const baseTime = new Date(campaignQ1.startedAt!);
    const deliveredAt = new Date(baseTime.getTime() + Math.random() * 600000); // within 10 min
    const openedAt = logItem.open ? new Date(deliveredAt.getTime() + Math.random() * 3600000) : null; // within 1 hr
    const clickedAt = logItem.click && openedAt ? new Date(openedAt.getTime() + Math.random() * 1800000) : null;
    const submittedAt = logItem.submit && clickedAt ? new Date(clickedAt.getTime() + Math.random() * 600000) : null;

    await prisma.campaignLog.create({
      data: {
        campaignId: campaignQ1.id,
        userId: logItem.user.id,
        deliveredAt,
        openedAt,
        clickedAt,
        submittedAt,
      },
    });
  }

  // Q2 Simulation Logs (Slightly improved due to training):
  const q2Logs = [
    { user: employees[0], open: true, click: false, submit: false },
    { user: employees[1], open: true, click: false, submit: false },
    { user: employees[2], open: true, click: true, submit: false }, // Marcus improved: clicked but didn't submit
    { user: employees[3], open: false, click: false, submit: false },
    { user: employees[4], open: true, click: false, submit: false },
    { user: employees[5], open: true, click: true, submit: true }, // John still submitted
    { user: employees[6], open: true, click: false, submit: false }, // Chloe improved
    { user: employees[7], open: false, click: false, submit: false },
    { user: employees[8], open: true, click: false, submit: false },
    { user: employees[9], open: true, click: true, submit: false }, // Matthew improved
    { user: employees[10], open: false, click: false, submit: false },
  ];

  for (const logItem of q2Logs) {
    const baseTime = new Date(campaignQ2.startedAt!);
    const deliveredAt = new Date(baseTime.getTime() + Math.random() * 600000);
    const openedAt = logItem.open ? new Date(deliveredAt.getTime() + Math.random() * 3600000) : null;
    const clickedAt = logItem.click && openedAt ? new Date(openedAt.getTime() + Math.random() * 1800000) : null;
    const submittedAt = logItem.submit && clickedAt ? new Date(clickedAt.getTime() + Math.random() * 600000) : null;

    await prisma.campaignLog.create({
      data: {
        campaignId: campaignQ2.id,
        userId: logItem.user.id,
        deliveredAt,
        openedAt,
        clickedAt,
        submittedAt,
      },
    });
  }

  // Q3 Simulation Logs (Active now, partial logs):
  const q3Logs = [
    { user: employees[0], open: true, click: false, submit: false },
    { user: employees[1], open: false, click: false, submit: false },
    { user: employees[2], open: true, click: false, submit: false }, // Marcus low risk action
    { user: employees[5], open: true, click: true, submit: false }, // John clicked but no submit!
    { user: employees[9], open: true, click: false, submit: false }, // Matthew no click
  ];

  for (const logItem of q3Logs) {
    const baseTime = new Date(campaignQ3.startedAt!);
    const deliveredAt = new Date(baseTime.getTime() + Math.random() * 300000);
    const openedAt = logItem.open ? new Date(deliveredAt.getTime() + Math.random() * 1200000) : null;
    const clickedAt = logItem.click && openedAt ? new Date(openedAt.getTime() + Math.random() * 1200000) : null;

    await prisma.campaignLog.create({
      data: {
        campaignId: campaignQ3.id,
        userId: logItem.user.id,
        deliveredAt,
        openedAt,
        clickedAt,
      },
    });
  }

  // 7. Create Learning Modules and Questions
  console.log("Creating training modules...");
  const mod1 = await prisma.trainingModule.create({
    data: {
      title: "Introduction to Social Engineering",
      description: "Understand the core concepts of social engineering, how psychological triggers are abused, and general indicators of email deception.",
      contentHtml: `
        <h3>What is Social Engineering?</h3>
        <p>Social engineering is the psychological manipulation of people into performing actions or divulging confidential information. Rather than targeting software system vulnerabilities, attackers exploit human emotions such as panic, urgency, authority, or greed.</p>
        
        <h3>The Phishing Lifecycle</h3>
        <ul>
          <li><strong>Information Gathering:</strong> Scrapers collect emails and organizational structures.</li>
          <li><strong>Pretexting:</strong> Building a scenario (e.g., standard billing request, password expiry).</li>
          <li><strong>Exploitation:</strong> Triggering an emotional action (e.g. click link, open invoice).</li>
        </ul>

        <h3>Primary Psychological Triggers</h3>
        <p>Be skeptical of emails that make you feel:
          <ul>
            <li><strong>Panic / Fear:</strong> 'Your account will be suspended.'</li>
            <li><strong>Greed / Curiosity:</strong> 'Review your custom holiday bonus.'</li>
            <li><strong>Compliance / Authority:</strong> 'Sarah Jenkins (Security Operations) requested this file.'</li>
          </ul>
        </p>
      `,
    },
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        moduleId: mod1.id,
        question: "What is the primary target of a social engineering attack?",
        options: JSON.stringify([
          "Firewall configurations",
          "Human psychology and behavior",
          "Network routers",
          "Encryption keys"
        ]),
        correct: 1,
      },
      {
        moduleId: mod1.id,
        question: "Which of the following is a key emotional trigger used in phishing campaigns?",
        options: JSON.stringify([
          "Relaxed curiosity",
          "Strict objectivity",
          "Urgency or fear of suspension",
          "Complete transparency"
        ]),
        correct: 2,
      }
    ],
  });

  const mod2 = await prisma.trainingModule.create({
    data: {
      title: "Identifying Deceptive URLs",
      description: "Learn how to analyze hyperlinks, hover targets, subdomains, and identify look-alike typosquatting domains.",
      contentHtml: `
        <h3>Deconstructing a Domain Name</h3>
        <p>A domain structure is read from right to left:</p>
        <p style="background: #111; padding: 10px; border-radius: 4px; font-family: monospace;">
          subdomain.<strong>second-level-domain</strong>.top-level-domain/path
        </p>
        <p>For example, in <strong>acme.com-security-auth.net</strong>, the actual domain is <strong>com-security-auth.net</strong>, NOT <strong>acme.com</strong>. The text 'acme.com' is simply part of the second-level domain name to deceive you.</p>

        <h3>Typosquatting & Homoglyphs</h3>
        <p>Typosquatting involves registering common misspellings (e.g., <code>amzon.com</code>). Homoglyph attacks use similar-looking characters from different alphabets (e.g., replacing 'o' with Greek omicron 'ο').</p>

        <h3>Link Inspection Standard Procedure</h3>
        <p>Always <strong>hover</strong> over a link to view the destination URL. If the tooltip destination domain doesn't align with the sender's verified identity, do not click.</p>
      `,
    },
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        moduleId: mod2.id,
        question: "In the URL 'https://microsoft.support-portal.info/login', what is the actual domain being contacted?",
        options: JSON.stringify([
          "microsoft.com",
          "support-portal.info",
          "microsoft.support-portal.info",
          "support-portal"
        ]),
        correct: 1,
      },
      {
        moduleId: mod2.id,
        question: "What is hover validation?",
        options: JSON.stringify([
          "Clicking a link to see if it triggers an error page",
          "Hovering your cursor over the link to verify the true path prior to clicking",
          "Using a browser addon to verify domain details",
          "Copying and pasting the link into Google search"
        ]),
        correct: 1,
      }
    ],
  });

  // 8. Seed user progress in training modules
  // Sarah (Admin) has completed all
  await prisma.quizProgress.create({
    data: {
      userId: admin.id,
      moduleId: mod1.id,
      completed: true,
      score: 100,
    },
  });

  await prisma.quizProgress.create({
    data: {
      userId: admin.id,
      moduleId: mod2.id,
      completed: true,
      score: 100,
    },
  });

  // Alex Rivera (Low risk engineering) completed module 1
  await prisma.quizProgress.create({
    data: {
      userId: employees[0].id,
      moduleId: mod1.id,
      completed: true,
      score: 100,
    },
  });

  // John Miller (High risk sales) started but failed quiz
  await prisma.quizProgress.create({
    data: {
      userId: employees[5].id,
      moduleId: mod1.id,
      completed: false,
      score: 50,
    },
  });

  console.log("Seeding complete! Admin and mock workspace populated successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
