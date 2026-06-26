import { NextResponse } from 'next/server';
import { getSecurityInsights, getEmployeeSecurityDetails } from './insights';

// Local knowledge base data
const KNOWLEDGE_BASE = [
  {
    topic: 'phishing',
    title: 'Phishing Awareness',
    content: `Phishing is a cyber attack where attackers send deceptive emails or messages to trick you into revealing sensitive information, like passwords, or clicking malicious links.
- **Key Indicators**: Generic greetings, urgent/coercive tone, mismatched sender domains, and links pointing to suspicious URLs.
- **Vigilance Protocol**: Never enter credentials on screens opened directly from emails. Look for the actual URL in the browser address bar.`
  },
  {
    topic: 'malware',
    title: 'Malware Defense',
    content: `Malware (malicious software) is designed to compromise, harm, or exploit computers and networks.
- **Delivery Vectors**: Infected email attachments, compromised downloads, and USB drives.
- **Vigilance Protocol**: Do not download or execute attachments from external senders. Ensure your system firewall and antivirus solutions are active.`
  },
  {
    topic: 'social engineering',
    title: 'Social Engineering',
    content: `Social engineering is the manipulation of human trust to gain access to restricted spaces, data, or funds.
- **Common Techniques**: Pretexting (acting as someone else), baiting, and intimidation.
- **Vigilance Protocol**: Verify the identity of individuals requesting access or sensitive credentials through an independent secondary channel.`
  },
  {
    topic: 'ransomware',
    title: 'Ransomware Protection',
    content: `Ransomware encrypts your files and folders, demanding payment in exchange for a decryption key.
- **Best Safeguards**: Regular automatic backups stored separately from the network, and avoiding unauthorized software downloads.
- **Vigilance Protocol**: If your screen suddenly locks or alerts you of file encryption, immediately disconnect your network cable and alert the SecOps team.`
  },
  {
    topic: 'password security',
    title: 'Password Security',
    content: `Weak or reused passwords account for a high percentage of security breaches.
- **Best Practices**: Use passphrases (4-5 random words), include numbers, uppercase letters, and special symbols. Never reuse corporate passwords for external websites.`
  },
  {
    topic: 'mfa',
    title: 'Multi-Factor Authentication (MFA)',
    content: `MFA adds a critical second layer of protection. Even if your password is leaked, attackers cannot authenticate without the second factor.
- **Types**: Authenticator app codes (TOTP), hardware keys, and push notifications. Never approve an MFA prompt you didn't initiate.`
  },
  {
    topic: 'safe browsing',
    title: 'Safe Browsing Habits',
    content: `Browsing the web poses risks from drive-by downloads or spoofed phishing portals.
- **Precautions**: Always verify HTTPS status. Avoid downloading browser extensions from third-party sites, and block pop-ups.`
  },
  {
    topic: 'upi fraud',
    title: 'UPI Payment Fraud',
    content: `In India, Unified Payments Interface (UPI) fraud is common where victims are tricked into sending money or authorizing debit requests.
- **Important Warning**: **Entering your UPI PIN is ONLY required for sending/debiting money, NEVER for receiving money.**
- **Protocol**: Decline unexpected request notifications in your UPI app (GPay, PhonePe, Paytm).`
  },
  {
    topic: 'qr scam',
    title: 'QR Code Payment Scams',
    content: `Attackers place malicious or spoofed QR codes in public places or send them via WhatsApp.
- **Scam Mechanism**: Scanning the QR code initiates a transaction to approve money transfer or authorization of account access.
- **Protocol**: Verify the merchant display name on screen before approving any QR payment.`
  },
  {
    topic: 'email fraud',
    title: 'Email Fraud & Spoofing',
    content: `Attackers forge email headers so that the sender address appears to be from a trusted source, like your company's CEO or Finance department.
- **Techniques**: Look-alike domains (e.g. \`c0mpany.co.in\` instead of \`company.co.in\`).
- **Protocol**: Treat requests for immediate bank transfers or invoice changes with high skepticism and confirm verbally.`
  }
];

export async function POST(request: Request) {
  try {
    // 1. Authenticate session
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

    const { message } = await request.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message query is required' }, { status: 400 });
    }

    const query = message.toLowerCase().trim();
    const isAdmin = userSession.role !== 'EMPLOYEE';
    const email = userSession.email;

    let responseText = '';

    // Search Knowledge Base first if it matches specific key terms
    const kbMatch = KNOWLEDGE_BASE.find(kb => 
      query.includes(kb.topic) || 
      (kb.topic === 'mfa' && query.includes('multi-factor')) ||
      (kb.topic === 'upi fraud' && (query.includes('upi') || query.includes('google pay') || query.includes('phonepe'))) ||
      (kb.topic === 'qr scam' && (query.includes('qr') || query.includes('quick response')))
    );

    if (kbMatch) {
      responseText = `### Knowledge Base: ${kbMatch.title}\n\n${kbMatch.content}\n\n*Would you like to search for another topic, or do you have a dashboard analytics question?*`;
      return NextResponse.json({ response: responseText });
    }

    // Role-based Intent Routing
    if (isAdmin) {
      const stats = await getSecurityInsights();

      if (query.includes('department') && (query.includes('vulnerable') || query.includes('risk') || query.includes('worst'))) {
        const d = stats.highestRiskDept;
        responseText = `### Vulnerable Department Analysis
The most vulnerable department is **${d.name}**.
* **Average Awareness Score**: \`${d.averageScore}/100\`
* **Total Employees**: \`${d.employeesCount}\`
* **High Risk Employees**: \`${d.highRiskCount}\`

**Recommendation**: Arrange an immediate security awareness briefing for the **${d.name}** department. Focus on credential verification and email spoofing protection.`;
      } 
      
      else if (query.includes('who') && (query.includes('training') || query.includes('immediate') || query.includes('critical'))) {
        if (stats.highRiskEmployees.length === 0) {
          responseText = `### Immediate Training Recommendations
All active employees currently meet the baseline compliance metrics (>70% score). No users require immediate emergency intervention.`;
        } else {
          const list = stats.highRiskEmployees.map((e, idx) => 
            `${idx + 1}. **${e.name}** (${e.email}) - Dept: \`${e.department}\`, Score: \`${e.awarenessScore}/100\` (\`${e.riskCategory}\` Risk)`
          ).join('\n');
          responseText = `### Immediate Training Recommendations
The following employees have high risk indexes or critical scores:

${list}

**Action Plan**: Assign the *Phishing Essentials* and *MFA Defense* courses to these users inside the learning catalog.`;
        }
      } 
      
      else if (query.includes('campaign') || query.includes('template') || query.includes('effectiveness')) {
        const topTemp = stats.topPhishingTemplate;
        const recent = stats.campaigns.map(c => 
          `- **${c.name}** (${c.status}): Targeted through template \`${c.templateName}\`. Click rate: \`${c.clickRate}%\`, Form submissions: \`${c.submitRate}%\`.`
        ).join('\n');
        
        responseText = `### Campaign Performance Summary
Here is the review of recent simulation campaigns:

${recent}

* **Highest Failure Trigger**: The template **"${topTemp.name}"** had the highest interaction rate with a click rate of \`${topTemp.clickRate}%\`.
* **Overall Metrics**: Open Rate: \`${stats.campaignStats.openRate}%\`, Click Rate: \`${stats.campaignStats.clickRate}%\`, Submit Rate: \`${stats.campaignStats.submitRate}%\`.`;
      } 
      
      else if (query.includes('branch') && (query.includes('improved') || query.includes('best') || query.includes('branch comparison'))) {
        const list = stats.branchStats.map(b => 
          `- **${b.name}**: Average Score \`${b.averageScore}/100\` (${b.employeesCount} employees)`
        ).join('\n');
        
        responseText = `### Branch Security Comparison
The most secure / improved branch is **${stats.mostImprovedBranch.name}** with an average security index of **${stats.mostImprovedBranch.averageScore}/100**.

**Branch Standings**:
${list}`;
      } 
      
      else if (query.includes('executive') || query.includes('health') || query.includes('summary')) {
        const topTemp = stats.topPhishingTemplate;
        const hrDept = stats.highestRiskDept;
        responseText = `# Pinkman Protects - Security Executive Summary
Generated on: ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

### 📊 Key Performance Metrics
* **Total Supervised Employees**: \`${stats.totalEmployees}\`
* **Overall Security Score**: \`${stats.avgScore}/100\`
* **Active Campaigns**: \`${stats.activeCampaignsCount}\`
* **Quiz Completion Rate**: \`${stats.quizCompletionRate}%\`

### ⚠️ Top Risks Identified
1. **Department vulnerability**: The **${hrDept.name}** department currently registers the lowest average score (\`${hrDept.averageScore}/100\`).
2. **High-Risk Vector**: Phishing emails structured around **"${topTemp.name}"** continue to achieve the highest click conversions (\`${topTemp.clickRate}%\`).
3. **Emergency Target**: There are currently **${stats.highRiskEmployees.length}** employees flagged in the HIGH risk category needing remediation.

### 🛡️ Recommended Protocol Action
- Deploy a localized simulated phishing attack focusing on UPI & Invoice scams.
- Auto-assign the *MFA Enforcements* training module to the **${hrDept.name}** department.
- Mandate recovery training for high-risk users.`;
      } 
      
      else {
        // Default Admin response
        responseText = `Hello! I am your **Pinkman Protects AI Assistant**. I analyze real-time platform data to help secure your organization. 

**Here are some suggested topics you can ask me:**
- "Which department is most vulnerable?"
- "Who needs immediate training?"
- "Summarize this month's campaigns."
- "Which branch improved the most?"
- "Generate executive summary."
- Or ask about cybersecurity topics like "UPI Fraud" or "MFA".`;
      }

    } else {
      // Employee Specific queries
      const details = await getEmployeeSecurityDetails(email);
      if (!details) {
        return NextResponse.json({ error: 'Employee details not found' }, { status: 404 });
      }

      if (query.includes('fail') || query.includes('why did i')) {
        if (details.failedCount === 0) {
          responseText = `### Phishing Simulation Status
Congratulations **${details.name}**! You have **not clicked or failed** any simulated phishing campaigns in our system. You are practicing great security habits!
- **Current Score**: \`${details.awarenessScore}/100\`
- **Risk Level**: \`${details.riskCategory}\`
Keep up the vigilance!`;
        } else {
          const failures = details.failedSimulations.map(f => 
            `- **Campaign: ${f.campaignName}** (${f.templateName}): You clicked the simulation link on ${new Date(f.date).toLocaleDateString()}.`
          ).join('\n');
          responseText = `### Simulation Failure Analysis
Hi **${details.name}**, you interacted with **${details.failedCount}** simulated phishing emails:

${failures}

**Why did you fail?**
Phishing simulations are built using real-world triggers, such as fake urgent requests (e.g. password expiry or salary bonuses). It's easy to miss look-alike email domains when in a hurry. 

**Key Lesson**: Always verify sender addresses and avoid clicking links inside urgent notices.`;
        }
      } 
      
      else if (query.includes('improve') || query.includes('safety') || query.includes('tips') || query.includes('best practices')) {
        responseText = `### How to Improve Your Security Index
Your current awareness rating is **${details.awarenessScore}/100** (**${details.riskCategory}** risk). Here is how you can boost it:
1. **Never Click Suspicious Links**: Look out for URLs that do not end in your company's domain.
2. **Report Phish**: Use the 'Report Phishing' option in your client instead of ignoring or replying.
3. **Use Strong Passwords**: Secure your account using random word passphrases (e.g. \`Sunny-Delhi-Tea-2026\`).
4. **Learn Daily**: Complete your recommended learning modules to earn badges and improve your score.`;
      } 
      
      else if (query.includes('course') || query.includes('module') || query.includes('recommend')) {
        if (details.recommendedModules.length === 0) {
          responseText = `### Learning Recommendations
Excellent work! You have completed all assigned training courses. I recommend reviewing our **Knowledge Base** topics to stay updated on modern threats like UPI Fraud and QR scams.`;
        } else {
          const list = details.recommendedModules.map(m => 
            `- **${m.title}**: ${m.description}`
          ).join('\n');
          responseText = `### Recommended Courses for You
Based on your current score, you should enroll in these short courses:

${list}

*You can open the **Learning Center** in the sidebar to begin.*`;
      }
      } 
      
      else if (query.includes('indicator') || query.includes('suspicious') || query.includes('link')) {
        responseText = `### Identifying Phishing Cues & Suspicious Links
To check if an email or link is safe, evaluate these **four key cues**:
1. **Mismatched Senders**: The display name says "IT Helpdesk" but the email is \`helpdesk@secure-services.com\`.
2. **Fake Urgency**: Statements like "Action required within 2 hours or account locked".
3. **Hover Links**: Hover your mouse cursor over any link before clicking. If the status bar shows an unfamiliar URL, it is suspicious.
4. **Mismatched Domains**: Looking for characters like \`l\` replaced with \`1\`, or \`o\` with \`0\` (e.g. \`p1nkman.com\` vs \`pinkman.com\`).`;
      } 
      
      else {
        responseText = `Hi **${details.name}**! I am your **Pinkman Protects Security Assistant**. I can help you review your training progress and learn how to recognize phishing threats.

**Ask me questions like:**
- "Why did I fail?"
- "How can I improve my score?"
- "Recommend courses for me."
- "Explain phishing indicators."
- Or explore common cyber threats like "UPI Fraud" or "Password Security" from the Knowledge Base.`;
      }
    }

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
