"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";

export default function SessionExpiredPage() {
  return (
    <AuthLayout
      title="Your session timed out"
      subtitle="We signed you out after 15 minutes of inactivity to keep your account safe."
    >
      <div className="space-y-5">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-line bg-inset text-ink-soft">
          <Clock size={20} />
        </div>
        <Link href="/auth/login">
          <Button variant="primary" size="lg" className="w-full" iconRight={<ArrowRight size={16} />}>
            Sign in again
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
