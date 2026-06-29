import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const AUDIT_FILE = path.join(process.cwd(), 'src/app/api/auth/audit_logs.json');

function readJson(filePath: string, defaultVal: any) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {}
  return defaultVal;
}

// User registry details for lookup in logs mapping
const USER_REGISTRY: Record<string, { name: string; role: string; branch: string }> = {
  'superadmin@company.in': { name: 'Arjun Mehta', role: 'SUPERADMIN', branch: 'Pune' },
  'admin@company.in': { name: 'Rajesh Kumar', role: 'SECURITY_ADMIN', branch: 'Bengaluru' },
  'hr@company.in': { name: 'Priya Sharma', role: 'HR_MANAGER', branch: 'Delhi' },
  'manager@company.in': { name: 'Vikram Malhotra', role: 'DEPT_MANAGER', branch: 'Mumbai' },
  'secops@company.in': { name: 'Sneha Nair', role: 'SECURITY_ADMIN', branch: 'Pune' }
};

const MOCK_ADMIN_ACTIVITIES = [
  {
    id: "AUDIT-M01",
    timestamp: "2026-06-25T14:35:00.000Z",
    email: "admin@company.in",
    name: "Rajesh Kumar",
    role: "SECURITY_ADMIN",
    branch: "Bengaluru",
    eventType: "CAMPAIGN_CREATED",
    action: "Campaign Created",
    ipAddress: "103.45.12.8",
    browser: "Chrome 124.0.0 / macOS",
    details: "Created campaign 'IT Helpdesk Password Verification' targeting Operations and Finance."
  },
  {
    id: "AUDIT-M02",
    timestamp: "2026-06-25T12:10:00.000Z",
    email: "hr@company.in",
    name: "Priya Sharma",
    role: "HR_MANAGER",
    branch: "Delhi",
    eventType: "EMPLOYEE_ADDED",
    action: "Employee Added",
    ipAddress: "49.206.112.55",
    browser: "Safari 17.4 / iOS",
    details: "Added new employee 'Siddharth Joshi' to HR department in Mumbai branch."
  },
  {
    id: "AUDIT-M03",
    timestamp: "2026-06-25T11:45:00.000Z",
    email: "superadmin@company.in",
    name: "Arjun Mehta",
    role: "SUPERADMIN",
    branch: "Pune",
    eventType: "SETTINGS_CHANGE",
    action: "Organization Settings Changed",
    ipAddress: "192.168.1.45",
    browser: "Firefox 125.0 / Windows",
    details: "Changed Default Timezone to 'Asia/Kolkata' and verified GST details."
  },
  {
    id: "AUDIT-M04",
    timestamp: "2026-06-25T10:15:00.000Z",
    email: "admin@company.in",
    name: "Rajesh Kumar",
    role: "SECURITY_ADMIN",
    branch: "Bengaluru",
    eventType: "TEMPLATE_CREATED",
    action: "Template Created",
    ipAddress: "103.45.12.8",
    browser: "Chrome 124.0.0 / macOS",
    details: "Created custom template 'Income Tax Declaration Notice' for Finance department."
  },
  {
    id: "AUDIT-M05",
    timestamp: "2026-06-24T16:30:00.000Z",
    email: "manager@company.in",
    name: "Vikram Malhotra",
    role: "DEPT_MANAGER",
    branch: "Mumbai",
    eventType: "REPORT_GENERATED",
    action: "Report Generated",
    ipAddress: "117.211.89.4",
    browser: "Edge 123.0 / Windows",
    details: "Generated Quarterly Department Awareness Compliance report for Sales team."
  },
  {
    id: "AUDIT-M06",
    timestamp: "2026-06-24T14:22:00.000Z",
    email: "admin@company.in",
    name: "Rajesh Kumar",
    role: "SECURITY_ADMIN",
    branch: "Bengaluru",
    eventType: "CAMPAIGN_EDITED",
    action: "Campaign Edited",
    ipAddress: "103.45.12.8",
    browser: "Chrome 124.0.0 / macOS",
    details: "Edited targeted departments for campaign 'VPN Access Renewal Awareness'."
  },
  {
    id: "AUDIT-M07",
    timestamp: "2026-06-24T11:05:00.000Z",
    email: "hr@company.in",
    name: "Priya Sharma",
    role: "HR_MANAGER",
    branch: "Delhi",
    eventType: "EMPLOYEE_UPDATED",
    action: "Employee Updated",
    ipAddress: "49.206.112.55",
    browser: "Safari 17.4 / iOS",
    details: "Updated manager settings and role assignments for employee 'Jyoti Rao'."
  },
  {
    id: "AUDIT-M08",
    timestamp: "2026-06-23T15:40:00.000Z",
    email: "admin@company.in",
    name: "Rajesh Kumar",
    role: "SECURITY_ADMIN",
    branch: "Bengaluru",
    eventType: "TEMPLATE_MODIFIED",
    action: "Template Modified",
    ipAddress: "103.45.12.8",
    browser: "Chrome 124.0.0 / macOS",
    details: "Modified indicators and html layout for 'PF / EPFO Updates' awareness template."
  },
  {
    id: "AUDIT-M09",
    timestamp: "2026-06-23T10:12:00.000Z",
    email: "superadmin@company.in",
    name: "Arjun Mehta",
    role: "SUPERADMIN",
    branch: "Pune",
    eventType: "CAMPAIGN_DELETED",
    action: "Campaign Deleted",
    ipAddress: "192.168.1.45",
    browser: "Firefox 125.0 / Windows",
    details: "Deleted archived draft campaign 'Festival Bonus Clickbait Simulation'."
  },
  {
    id: "AUDIT-M10",
    timestamp: "2026-06-22T09:30:00.000Z",
    email: "superadmin@company.in",
    name: "Arjun Mehta",
    role: "SUPERADMIN",
    branch: "Pune",
    eventType: "REPORT_GENERATED",
    action: "Report Generated",
    ipAddress: "192.168.1.45",
    browser: "Chrome 124.0.0 / macOS",
    details: "Generated Board Security Awareness Audit Summary PDF."
  }
];

export async function GET() {
  try {
    const authLogs = readJson(AUDIT_FILE, []);
    
    // Map existing authentication logs to match dashboard display format
    const formattedAuthLogs = authLogs.map((log: any) => {
      const email = log.email || 'unknown@company.in';
      const registryEntry = USER_REGISTRY[email.toLowerCase()] || { name: 'Unknown User', role: 'EMPLOYEE', branch: 'Pune' };
      
      let action = 'System Operation';
      if (log.eventType === 'LOGIN_SUCCESS') action = 'Login';
      else if (log.eventType === 'LOGIN_FAILURE') action = 'Failed Login Attempt';
      else if (log.eventType === 'LOGOUT') action = 'Logout';
      else if (log.eventType === 'PASSWORD_CHANGE') action = 'Change Password';
      else if (log.eventType === 'ORG_SWITCH') action = 'Organization Settings Changed';
      else if (log.eventType === 'SETTINGS_CHANGE') action = 'Organization Settings Changed';

      return {
        id: log.id || `AUDIT-${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: log.timestamp || new Date().toISOString(),
        email: email,
        name: registryEntry.name,
        role: log.role || registryEntry.role,
        branch: log.branch || registryEntry.branch,
        eventType: log.eventType,
        action: action,
        ipAddress: log.ipAddress || '127.0.0.1',
        browser: log.browser || 'Chrome 124.0.0 / macOS',
        details: log.details || 'No additional details provided.'
      };
    });

    // Combine logs and sort by timestamp in descending order
    const allLogs = [...formattedAuthLogs, ...MOCK_ADMIN_ACTIVITIES];
    allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(allLogs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
