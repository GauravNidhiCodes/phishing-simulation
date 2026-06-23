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
    { name: "Alex Rivera", email: "alex.r@acme.com", department: "Engineering", score: 92, risk: "LOW" },
    { name: "Jessica Wang", email: "jess.w@acme.com", department: "Engineering", score: 85, risk: "LOW" },
    { name: "Marcus Brody", email: "marcus.b@acme.com", department: "Engineering", score: 55, risk: "HIGH" },
    // HR
    { name: "Emily Blunt", email: "emily.b@acme.com", department: "Human Resources", score: 78, risk: "MEDIUM" },
    { name: "David Vance", email: "david.v@acme.com", department: "Human Resources", score: 90, risk: "LOW" },
    // Sales
    { name: "John Miller", email: "john.m@acme.com", department: "Sales", score: 45, risk: "HIGH" },
    { name: "Chloe Price", email: "chloe.p@acme.com", department: "Sales", score: 72, risk: "MEDIUM" },
    { name: "Robert Downey", email: "robert.d@acme.com", department: "Sales", score: 64, risk: "MEDIUM" },
    // Finance
    { name: "Lisa Kudrow", email: "lisa.k@acme.com", department: "Finance", score: 89, risk: "LOW" },
    { name: "Matthew Perry", email: "matthew.p@acme.com", department: "Finance", score: 58, risk: "HIGH" },
    // Legal
    { name: "Harvey Specter", email: "harvey.s@acme.com", department: "Legal", score: 95, risk: "LOW" },
  ];

  const employees = [];
  for (const emp of employeesData) {
    const user = await prisma.user.create({
      data: {
        name: emp.name,
        email: emp.email,
        role: "EMPLOYEE",
        department: emp.department,
        awarenessScore: emp.score,
        riskCategory: emp.risk,
        organizationId: org.id,
      },
    });
    employees.push(user);
  }

  // 4. Create Prebuilt Templates
  const template1 = await prisma.emailTemplate.create({
    data: {
      name: "IT Password Audit Alert",
      subject: "IMMEDIATE: Mandatory Password Policy Update",
      bodyHtml: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #d32f2f;">Critical System Access Security Check</h2>
          <p>Dear {{name}},</p>
          <p>Our intrusion detection systems have flagged unusual activity originating from your active region. As part of Acme Corporation's updated cybersecurity compliance program, you are required to re-authenticate and review your credentials immediately.</p>
          <p style="margin: 25px 0;">
            <a href="{{link}}" style="background-color: #d32f2f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Credentials Now</a>
          </p>
          <p>Failure to complete this verification within 24 hours will result in automatic lockout of your corporate active directory account.</p>
          <p>Best regards,<br/>IT Infrastructure Operations Team<br/><strong>support@acme-secure-portal.com</strong></p>
        </div>
      `,
      indicators: JSON.stringify([
        { id: 1, type: "sender", label: "Mismatched Domain", text: "Sent from 'acme-secure-portal.com' instead of 'acme.com'" },
        { id: 2, type: "urgency", label: "Artificial Urgency", text: "Contains coercive statements ('within 24 hours', 'automatic lockout') to induce panic" },
        { id: 3, type: "link", label: "Deceptive Link Destination", text: "Link redirects to an external simulation server rather than internal SSO portal" }
      ]),
    },
  });

  const template2 = await prisma.emailTemplate.create({
    data: {
      name: "HR Benefits Annual Update",
      subject: "URGENT: Review Your 2026 Health Plan Enrollment details",
      bodyHtml: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <p>Hello {{name}},</p>
          <p>Acme Corporation HR benefits updates have been finalized for the upcoming quarter. Due to corporate subsidy changes, there are adjustments to your healthcare deductions. Please check the new enrollment spreadsheet to ensure your deductions remain accurate.</p>
          <p style="margin: 20px 0;">
            <a href="{{link}}" style="color: #1a73e8; text-decoration: underline; font-weight: bold;">Download_Benefits_Sheet_2026.xlsx</a>
          </p>
          <p>Thank you,</p>
          <p>HR Compensation & Benefits Department</p>
        </div>
      `,
      indicators: JSON.stringify([
        { id: 1, type: "link", label: "Unexpected Attachment Link", text: "Hyperlink acts as a document loader rather than standard employee portal links" },
        { id: 2, type: "greeting", label: "Generic Salutation", text: "Uses generic greeting 'Hello {{name}}' rather than standard personalized business greeting" }
      ]),
    },
  });

  const template3 = await prisma.emailTemplate.create({
    data: {
      name: "Finance Invoice Dispute",
      subject: "Unpaid Invoice #88493 - Overdue Notification",
      bodyHtml: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <p>To Whom It May Concern,</p>
          <p>Please find attached our overdue invoice #88493. We have not received payment for services rendered in March 2026. If payment is not submitted by Friday, interest fees of 1.5% weekly will be appended to the balance.</p>
          <p>Please review the details in our accounting server dashboard:</p>
          <p style="margin: 20px 0;">
            <a href="{{link}}" style="background-color: #f0ad4e; color: black; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Invoice Statement</a>
          </p>
          <p>Sincerely,</p>
          <p>Global Billing Services<br/>billing@accounting-notices.net</p>
        </div>
      `,
      indicators: JSON.stringify([
        { id: 1, type: "sender", label: "Unknown Third Party", text: "Sent from '@accounting-notices.net' which has no vendor association" },
        { id: 2, type: "financial", label: "Financial Coercion", text: "Demands payments and threatens penalty fees to bypass standard purchase order audits" }
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
