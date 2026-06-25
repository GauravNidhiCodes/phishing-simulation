import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const AUDIT_FILE = path.join(process.cwd(), 'src/app/api/auth/audit_logs.json');

export async function GET() {
  try {
    if (fs.existsSync(AUDIT_FILE)) {
      const logs = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
      return NextResponse.json(logs);
    }
    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
