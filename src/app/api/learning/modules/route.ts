import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const COURSE_METADATA: Record<string, {
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  takeaways: string[];
  videoUrl: string;
  interactiveScenario: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}> = {
  "Introduction to Social Engineering": {
    category: "Social Engineering",
    difficulty: "Beginner",
    duration: "10 mins",
    takeaways: [
      "Understand psychological triggers like fear, urgency, and greed.",
      "Recognize the 3 phases of a social engineering attack lifecycle.",
      "Verify unexpected requests through out-of-band channels."
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    interactiveScenario: {
      question: "You receive an urgent message from your manager on Slack requesting your password to check a billing emergency. What do you do?",
      options: [
        "Send the password immediately to avoid delaying business operations.",
        "Decline and call your manager directly to verify the request.",
        "Share the password but change it immediately after 1 hour."
      ],
      correct: 1,
      explanation: "Out-of-band validation is the most secure protocol for unexpected sensitive requests."
    }
  },
  "Identifying Deceptive URLs": {
    category: "Safe Internet Browsing",
    difficulty: "Intermediate",
    duration: "12 mins",
    takeaways: [
      "Inspect domains from right to left to locate the true destination.",
      "Understand typosquatting (lookalike characters) and homoglyphs.",
      "Hover over links prior to clicking to audit the true anchor path."
    ],
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    interactiveScenario: {
      question: "Which of the following domains is the authentic Microsoft login endpoint?",
      options: [
        "https://login.microsoft.com-security-update.info/login",
        "https://login.microsoftonline.com/oauth2",
        "https://microsoft-support-gateway.net/auth"
      ],
      correct: 1,
      explanation: "In 'login.microsoftonline.com', the authentic second-level domain is microsoftonline.com, which is owned by Microsoft. The other options use 'microsoft' as a subdomain of external malicious domains."
    }
  },
  "Password Security": {
    category: "Password Security",
    difficulty: "Beginner",
    duration: "8 mins",
    takeaways: [
      "Create high-entropy passwords combining letters, digits, and symbols.",
      "Use password managers instead of writing credentials down.",
      "Avoid reusing the same password across corporate and personal applications."
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    interactiveScenario: {
      question: "What is the best way to secure your corporate login accounts?",
      options: [
        "Choose a password with 8 letters and update it every month.",
        "Use a password manager to generate unique, 16+ character passphrases.",
        "Store passwords in a password-protected Excel spreadsheet on your desktop."
      ],
      correct: 1,
      explanation: "Password managers ensure high-entropy, unique passwords without the risk of local file theft."
    }
  },
  "Multi-Factor Authentication (MFA)": {
    category: "Multi-Factor Authentication (MFA)",
    difficulty: "Beginner",
    duration: "10 mins",
    takeaways: [
      "Always enable app-based push or TOTP MFA rather than SMS where possible.",
      "Never approve MFA push notifications that you did not trigger.",
      "Treat MFA prompt-bombing as an active credential compromise indicator."
    ],
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    interactiveScenario: {
      question: "You receive three successive MFA verification push prompts on your phone at 3 AM. What should you do?",
      options: [
        "Approve the prompt to stop the notifications.",
        "Ignore the notifications and check them during work hours.",
        "Deny the request and report the authentication attempt to the IT Security Desk."
      ],
      correct: 2,
      explanation: "Unexpected MFA prompts indicate an attacker already has your password and is trying to bypass MFA. Immediate reporting is mandatory."
    }
  },
  "Safe Internet Browsing": {
    category: "Safe Internet Browsing",
    difficulty: "Intermediate",
    duration: "12 mins",
    takeaways: [
      "Look for HTTPS indicators but remember it only guarantees encryption, not trust.",
      "Disable automatic file downloads in browser preferences.",
      "Audit browser extension permissions and delete unused plugins."
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    interactiveScenario: {
      question: "You click a link and a prompt asks you to add a browser extension to read a PDF file. What is the safest action?",
      options: [
        "Add the extension, view the file, and then uninstall it.",
        "Decline the extension install and contact support to check the file link.",
        "Open the link in an incognito window and add the extension."
      ],
      correct: 1,
      explanation: "Malicious extensions can read all website data, including cookies and passwords. Never install untrusted add-ons."
    }
  },
  "Data Privacy": {
    category: "Data Privacy",
    difficulty: "Intermediate",
    duration: "15 mins",
    takeaways: [
      "Classify corporate files as Public, Internal, Confidential, or Restricted.",
      "Always encrypt spreadsheets containing Personally Identifiable Information (PII).",
      "Do not upload proprietary code or customer lists to public AI models."
    ],
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    interactiveScenario: {
      question: "You need to clean up a list of customer emails using a public web formatting tool. Is this allowed?",
      options: [
        "Yes, as long as the website has a valid SSL certificate.",
        "No, uploading customer PII to unverified third-party websites violates corporate data privacy policies.",
        "Yes, if you delete the uploaded file from the site history afterwards."
      ],
      correct: 1,
      explanation: "Intranet PII should never be transmitted to external servers without compliance approvals."
    }
  },
  "Ransomware Awareness": {
    category: "Ransomware Awareness",
    difficulty: "Advanced",
    duration: "14 mins",
    takeaways: [
      "Ransomware encrypts local drives and maps external shares to lock files.",
      "Phishing attachments (.zip, .scr, .exe) are primary delivery vectors.",
      "Isolate infected devices by unplugging network cables immediately."
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    interactiveScenario: {
      question: "Your desktop files suddenly change extensions and a text note demands payment. What should you do first?",
      options: [
        "Shut down the machine and wait 1 hour to see if it restores.",
        "Immediately isolate the network connection (unplug cable/WIFI) and report to SecOps.",
        "Attempt to locate decryption keys on Google search forums."
      ],
      correct: 1,
      explanation: "Immediate network isolation prevents ransomware from lateral movement to server nodes."
    }
  },
  "Mobile Device Security": {
    category: "Mobile Device Security",
    difficulty: "Beginner",
    duration: "10 mins",
    takeaways: [
      "Enable mobile lock pins and enroll in corporate MDM trackers.",
      "Do not connect to public open airport/cafe WIFI without active VPN links.",
      "Only install apps from verified App Store or Google Play storefronts."
    ],
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    interactiveScenario: {
      question: "You are working from a local cafe and need to access internal databases. What is the safe practice?",
      options: [
        "Use the cafe's public open WIFI as it is fast.",
        "Use your mobile hotspot or activate corporate VPN before accessing company nodes.",
        "Only work on non-sensitive emails while connected to public networks."
      ],
      correct: 1,
      explanation: "Cafe networks are susceptible to man-in-the-middle interceptions. VPN or hot-spotting is required."
    }
  },
  "Remote Work Security": {
    category: "Remote Work Security",
    difficulty: "Intermediate",
    duration: "12 mins",
    takeaways: [
      "Never let family members or guests access your corporate laptop.",
      "Secure home routers by changing default admin logins and enabling WPA3.",
      "Lock screens when stepping away from workspaces, even at home."
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    interactiveScenario: {
      question: "Your sibling asks to use your work computer for 15 minutes to print a boarding pass. What do you do?",
      options: [
        "Log them in and supervise them while they print the file.",
        "Decline and print the file for them from your personal device.",
        "Open a guest browser profile on your work laptop for them to use."
      ],
      correct: 1,
      explanation: "Corporate assets are strictly restricted to authorized employees to prevent accidental leaks or malware."
    }
  },
  "UPI & Digital Payment Fraud Awareness": {
    category: "UPI & Digital Payment Fraud Awareness",
    difficulty: "Intermediate",
    duration: "15 mins",
    takeaways: [
      "Entering your UPI PIN is ONLY required for sending money, NEVER for receiving.",
      "Verify beneficiary names on payment previews before authorizing transactions.",
      "Report fake bank support numbers circulating on social platforms."
    ],
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    interactiveScenario: {
      question: "A buyer on OLX sends a request link claiming they want to transfer a booking advance to you. It asks for your UPI PIN. What is this?",
      options: [
        "A standard verification prompt to confirm your bank route.",
        "An active fraud scam. PIN numbers are only typed to debit your account.",
        "A secure protocol used by retail payment systems."
      ],
      correct: 1,
      explanation: "Receiving UPI transfers does not require inputting a security PIN. PIN entries authorize outgoing funds."
    }
  },
  "QR Code Scam Awareness": {
    category: "QR Code Scam Awareness",
    difficulty: "Beginner",
    duration: "8 mins",
    takeaways: [
      "Scammers paste malicious stickers over authentic merchant QR codes.",
      "Scanning a QR code can trigger redirects to malicious transaction gateways.",
      "Always match physical merchant labels with mobile display names prior to pay approval."
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    interactiveScenario: {
      question: "You scan a QR code at a local store and the payment page redirects you to an external lottery portal asking for login details. What is this?",
      options: [
        "A standard merchant promo spin.",
        "A redirect hack. Close the tab immediately and notify the merchant.",
        "A secure partner verification portal."
      ],
      correct: 1,
      explanation: "Malicious codes redirect users to credential interception sites. Close immediately."
    }
  },
  "WhatsApp & SMS Scam Awareness": {
    category: "WhatsApp & SMS Scam Awareness",
    difficulty: "Intermediate",
    duration: "10 mins",
    takeaways: [
      "Ignore messages claiming high-reward part-time jobs (e.g. YouTube liking).",
      "Treat SMS notifications regarding electricity bills cutoffs as high-priority fraud.",
      "Never share OTP verification codes with anyone, including support agents."
    ],
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    interactiveScenario: {
      question: "You receive a WhatsApp message from an unknown number with a profile picture of your company CEO requesting an urgent Amazon Gift Card. What do you do?",
      options: [
        "Buy the cards immediately to prevent organizational bottleneck.",
        "Ignore it and contact the CEO or HR through verified company channels to report the impersonation.",
        "Reposition the chat and ask for verification documents via WhatsApp."
      ],
      correct: 1,
      explanation: "Impersonation scams exploit the hierarchy. Validate via official internal email or call."
    }
  },
  "Email Security": {
    category: "Email Security",
    difficulty: "Beginner",
    duration: "12 mins",
    takeaways: [
      "Check email headers to verify the sender's true envelope address.",
      "Be suspicious of generic greetings (e.g., 'Dear Employee') and coercive timelines.",
      "Report questionable attachments to the security operations hub."
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    interactiveScenario: {
      question: "An email claiming to be from the IT Desk arrives asking you to verify your inbox configuration by opening a attached utility file. What is the correct procedure?",
      options: [
        "Open it in safe mode to review the content.",
        "Forward the message to your team to see if they got it.",
        "Do not open the file. Report it immediately using the report dashboard button."
      ],
      correct: 2,
      explanation: "Email attachments can install keyloggers or backdoors. IT Support will never distribute diagnostics via email files."
    }
  }
};

export async function GET() {
  try {
    
    const org = await prisma.organization.findFirst();
    if (!org) {
      return NextResponse.json({ error: 'Tenant not initialized' }, { status: 500 });
    }

    
    const user = await prisma.user.findFirst({
      where: { role: 'EMPLOYEE', organizationId: org.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'No employee users seeded in database.' }, { status: 404 });
    }

    
    const databaseModulesCount = await prisma.trainingModule.count();
    if (databaseModulesCount < 13) {
      console.log(`Auto-seeding training modules (current count: ${databaseModulesCount})...`);
      
      const existingModules = await prisma.trainingModule.findMany();
      const existingTitles = new Set(existingModules.map(m => m.title));

      for (const title of Object.keys(COURSE_METADATA)) {
        if (!existingTitles.has(title)) {
          const meta = COURSE_METADATA[title];
          const newModule = await prisma.trainingModule.create({
            data: {
              title,
              description: `Understand core safety behaviors regarding ${meta.category}. Key concepts cover interactive checkups, takeaways, and quiz validations.`,
              contentHtml: `
                <h3>Welcome to ${title}</h3>
                <p>This session focuses on crucial behaviors that secure our organization's endpoints and data networks.</p>
                <h4>Interactive Objectives</h4>
                <ul>
                  ${meta.takeaways.map(t => `<li>${t}</li>`).join('')}
                </ul>
                <p>Ensure you review the reading materials and complete the final validation check to clear compliance.</p>
              `
            }
          });

          
          await prisma.quizQuestion.createMany({
            data: [
              {
                moduleId: newModule.id,
                question: meta.interactiveScenario.question,
                options: JSON.stringify(meta.interactiveScenario.options),
                correct: meta.interactiveScenario.correct
              },
              {
                moduleId: newModule.id,
                question: `What is the primary key takeaway from our study on ${meta.category}?`,
                options: JSON.stringify([
                  "Verify sender identities and out-of-band links before taking action",
                  "Ignore indicators if they arrive from a manager's name",
                  "MFA can be safely disabled on personal hotspots"
                ]),
                correct: 0
              }
            ]
          });
        }
      }
    }

    
    const modules = await prisma.trainingModule.findMany({
      include: {
        quizzes: true,
        progress: {
          where: { userId: user.id }
        }
      }
    });

    
    const enrichedModules = modules.map(m => {
      const metadata = COURSE_METADATA[m.title] || {
        category: "General Security",
        difficulty: "Beginner",
        duration: "10 mins",
        takeaways: [
          "Understand the core concepts of cybersecurity safety checks.",
          "Recognize primary indicators of malicious interaction.",
          "Verify requests through official communication paths."
        ],
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        interactiveScenario: {
          question: "You get an email asking you to check details. What do you do?",
          options: ["Check it", "Call sender", "Ignore"],
          correct: 1,
          explanation: "Verification is standard."
        }
      };

      return {
        id: m.id,
        title: m.title,
        description: m.description,
        contentHtml: m.contentHtml,
        createdAt: m.createdAt,
        category: metadata.category,
        difficulty: metadata.difficulty,
        duration: metadata.duration,
        takeaways: metadata.takeaways,
        videoUrl: metadata.videoUrl,
        interactiveScenario: metadata.interactiveScenario,
        quizzes: m.quizzes.map(q => ({
          id: q.id,
          question: q.question,
          options: JSON.parse(q.options),
          correct: q.correct
        })),
        progress: m.progress
      };
    });

    
    const completedCourses = enrichedModules.filter(m => m.progress && m.progress[0]?.completed).length;
    const inProgressCourses = enrichedModules.filter(m => m.progress && m.progress.length > 0 && !m.progress[0].completed).length;
    const learningProgress = enrichedModules.length > 0 ? Math.round((completedCourses / enrichedModules.length) * 100) : 0;

    
    const certificates = enrichedModules
      .filter(m => m.progress && m.progress[0]?.completed)
      .map(m => ({
        id: `CERT-${m.id.slice(0, 8).toUpperCase()}-${user.id.slice(0, 8).toUpperCase()}`,
        employeeName: user.name || "Employee Node",
        organizationName: org.name,
        courseName: m.title,
        completionDate: m.progress[0].updatedAt.toISOString().split('T')[0]
      }));

    
    
    
    
    const completedSet = new Set(enrichedModules.filter(m => m.progress && m.progress[0]?.completed).map(m => m.title));
    const recommendedTitles: string[] = [];

    if (user.awarenessScore < 75) {
      recommendedTitles.push("Email Security", "Introduction to Social Engineering");
    }
    if (user.department === 'Finance' || user.department === 'Sales') {
      recommendedTitles.push("UPI & Digital Payment Fraud Awareness", "QR Code Scam Awareness");
    } else if (user.department === 'Engineering' || user.department === 'IT Support') {
      recommendedTitles.push("Password Security", "Multi-Factor Authentication (MFA)");
    } else {
      recommendedTitles.push("WhatsApp & SMS Scam Awareness", "Safe Internet Browsing");
    }

    
    let recommended = enrichedModules.filter(m => recommendedTitles.includes(m.title) && !completedSet.has(m.title));
    if (recommended.length === 0) {
      recommended = enrichedModules.filter(m => !completedSet.has(m.title)).slice(0, 2);
    }

    return NextResponse.json({
      user,
      modules: enrichedModules,
      stats: {
        learningProgress,
        completedCourses,
        inProgressCourses,
        certificatesEarned: certificates.length,
        learningStreak: completedCourses > 0 ? 5 + (completedCourses * 2) : 0, 
        weeklyProgress: [
          { day: 'Mon', value: completedCourses > 1 ? 1 : 0 },
          { day: 'Tue', value: completedCourses > 2 ? 1 : 0 },
          { day: 'Wed', value: completedCourses > 0 ? 1 : 0 },
          { day: 'Thu', value: 0 },
          { day: 'Fri', value: 0 },
          { day: 'Sat', value: 0 },
          { day: 'Sun', value: 0 }
        ],
        upcomingMandatory: [
          { title: "Diwali Festivity Safety Circular", deadline: "2026-10-25" },
          { title: "EPFO Aadhaar Exemption Audit", deadline: "2026-11-15" }
        ]
      },
      recommended: recommended.map(m => ({ id: m.id, title: m.title, category: m.category, duration: m.duration, difficulty: m.difficulty })),
      certificates
    });

  } catch (error: any) {
    console.error('Error loading learning modules:', error);
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

    
    const allProgress = await prisma.quizProgress.findMany({
      where: { userId }
    });

    const totalModules = await prisma.trainingModule.count() || 13;
    const completedCount = allProgress.filter(p => p.completed).length;
    const avgQuizScore = allProgress.length > 0
      ? allProgress.reduce((sum, curr) => sum + curr.score, 0) / allProgress.length
      : 0;

    
    const trainingFactor = (completedCount / totalModules) * 35;
    const quizFactor = (avgQuizScore / 100) * 65;
    const newAwarenessScore = Math.min(100, Math.round(trainingFactor + quizFactor));

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
