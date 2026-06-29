import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PREFERENCES_FILE = path.join(process.cwd(), 'src/app/api/notifications/preferences.json');


function readPreferences() {
  try {
    if (fs.existsSync(PREFERENCES_FILE)) {
      const fileContent = fs.readFileSync(PREFERENCES_FILE, 'utf-8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Error reading preferences file:", error);
  }
  return {
    email: true,
    dashboard: true,
    learningReminders: true,
    campaignAlerts: true,
    weeklyReports: false,
    monthlyReports: true,
    criticalAlerts: true
  };
}


function writePreferences(data: any) {
  try {
    fs.writeFileSync(PREFERENCES_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing preferences file:", error);
  }
}


function isAuthenticated(request: Request): boolean {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionCookie = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('pinkman_session='))
      ?.split('=')[1];
    return !!sessionCookie;
  } catch (e) {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
    }
    const prefs = readPreferences();
    return NextResponse.json(prefs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
    }
    const body = await request.json();
    
    
    const currentPrefs = readPreferences();
    const newPrefs = {
      ...currentPrefs,
      ...body
    };

    writePreferences(newPrefs);
    return NextResponse.json({ success: true, preferences: newPrefs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
