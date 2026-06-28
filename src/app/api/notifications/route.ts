import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const NOTIFICATIONS_FILE = path.join(process.cwd(), 'src/app/api/notifications/notifications.json');

// Helper to read JSON data safely
function readNotifications(): any[] {
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      const fileContent = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Error reading notifications file:", error);
  }
  return [];
}

// Helper to write JSON data safely
function writeNotifications(data: any[]) {
  try {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing notifications file:", error);
  }
}

// Session authentication check (matching the app session cookie)
function getSessionUser(request: Request): any | null {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionCookie = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('pinkman_session='))
      ?.split('=')[1];

    if (!sessionCookie) return null;
    const decodedString = Buffer.from(sessionCookie, 'base64').toString('utf-8');
    return JSON.parse(decodedString);
  } catch (e) {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const category = searchParams.get('category')?.toUpperCase().trim() || '';
    const priority = searchParams.get('priority')?.toUpperCase().trim() || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    let allNotifs = readNotifications();

    // 1. Filtering
    if (search) {
      allNotifs = allNotifs.filter(n => 
        n.title.toLowerCase().includes(search) || 
        n.message.toLowerCase().includes(search)
      );
    }

    if (category && category !== 'ALL') {
      allNotifs = allNotifs.filter(n => n.category === category);
    }

    if (priority && priority !== 'ALL') {
      allNotifs = allNotifs.filter(n => n.priority === priority);
    }

    // Sort: newest first
    allNotifs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // 2. Pagination
    const totalCount = allNotifs.length;
    const startIndex = (page - 1) * limit;
    const paginatedNotifs = allNotifs.slice(startIndex, startIndex + limit);
    const unreadCount = allNotifs.filter(n => !n.isRead).length;

    return NextResponse.json({
      notifications: paginatedNotifs,
      unreadCount,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
    }

    const body = await request.json();
    const { action, id, notificationData } = body;

    let allNotifs = readNotifications();

    if (action === 'markRead') {
      if (!id) {
        return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
      }
      allNotifs = allNotifs.map(n => n.id === id ? { ...n, isRead: true } : n);
      writeNotifications(allNotifs);
      return NextResponse.json({ success: true, unreadCount: allNotifs.filter(n => !n.isRead).length });
    }

    if (action === 'markAllRead') {
      allNotifs = allNotifs.map(n => ({ ...n, isRead: true }));
      writeNotifications(allNotifs);
      return NextResponse.json({ success: true, unreadCount: 0 });
    }

    if (action === 'delete') {
      if (!id) {
        return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
      }
      allNotifs = allNotifs.filter(n => n.id !== id);
      writeNotifications(allNotifs);
      return NextResponse.json({ success: true, unreadCount: allNotifs.filter(n => !n.isRead).length });
    }

    // Creating mock alerts dynamically to trigger real-time updates inside dashboard/feed
    if (action === 'createMock') {
      const mockNotifs = [
        {
          category: 'SECURITY_ALERT',
          title: 'High-Risk Employee Detected',
          message: 'An operations manager in Hyderabad was flagged in the HIGH risk index after 2 click failures.',
          priority: 'CRITICAL'
        },
        {
          category: 'CAMPAIGN',
          title: 'Campaign Completed',
          message: 'Phishing Campaign "Festival Bonus Announcement" completed with 8% overall click rate.',
          priority: 'MEDIUM'
        },
        {
          category: 'LEARNING',
          title: 'Employee Training Milestone',
          message: 'Rohan Sharma from Mumbai branch successfully completed the compliance quiz with a 100% score.',
          priority: 'LOW'
        },
        {
          category: 'AI_RECOMMENDATION',
          title: 'AI Advisory Update',
          message: 'Awareness dropped in Sales department. AI recommends executing a credential harvesting simulation.',
          priority: 'HIGH'
        },
        {
          category: 'ANNOUNCEMENT',
          title: 'Security Policy Modification',
          message: 'Administrator updated company authentication policy: Session timeouts enforced to 15 mins.',
          priority: 'MEDIUM'
        }
      ];

      // Select random item
      const chosen = mockNotifs[Math.floor(Math.random() * mockNotifs.length)];
      const newNotif = {
        id: `NTF-${Math.floor(Math.random() * 9000) + 1000}`,
        category: chosen.category,
        title: chosen.title,
        message: chosen.message,
        priority: chosen.priority,
        isRead: false,
        timestamp: new Date().toISOString()
      };

      allNotifs.unshift(newNotif);
      writeNotifications(allNotifs);
      return NextResponse.json({ success: true, notification: newNotif, unreadCount: allNotifs.filter(n => !n.isRead).length });
    }

    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
