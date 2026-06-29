"use client";

import React from "react";
import Link from "next/link";
import { ShieldX, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";

const roleAccess = [
  { role: "Super admin", scope: "Everything across the platform" },
  { role: "Security admin", scope: "Campaigns, templates, analytics" },
  { role: "HR manager", scope: "People registry and reports" },
  { role: "Dept. manager", scope: "Team metrics and reports" },
  { role: "Team member", scope: "Personal learning center" },
];

export default function AccessDeniedPage() {
  return (
    <AuthLayout
      title="You don't have access to this"
      subtitle="Your role doesn't include this area. Here's what each role can reach."
    >
      <div className="space-y-5">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#492626] bg-[#1a1111] text-danger">
          <ShieldX size={20} />
        </div>

        <div className="divide-y divide-line overflow-hidden rounded-[10px] border border-line">
          {roleAccess.map((r) => (
            <div
              key={r.role}
              className="flex items-center justify-between gap-4 px-3.5 py-2.5"
            >
              <span className="text-[13px] font-medium text-ink">{r.role}</span>
              <span className="text-right text-[12.5px] text-ink-faint">
                {r.scope}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          <Button
            onClick={() => window.history.back()}
            variant="secondary"
            size="lg"
            className="w-full"
            icon={<ArrowLeft size={16} />}
          >
            Go back
          </Button>
          <Link href="/auth/login">
            <Button variant="primary" size="lg" className="w-full">
              Sign in as someone else
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
