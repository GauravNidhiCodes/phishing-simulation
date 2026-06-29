"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { AuthLayout, AuthAlert, PasswordChecklist } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const qEmail = searchParams.get("email");
    const qToken = searchParams.get("token");
    if (qEmail) setEmail(qEmail);
    if (qToken) setToken(qToken);
  }, [searchParams]);

  const isValid =
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[0-9]/.test(newPassword) &&
    /[^A-Za-z0-9]/.test(newPassword) &&
    newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "We couldn't reset your password.");
      else setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong on our end.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-5">
        <AuthAlert tone="success">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <span>Your password is updated. You can sign in with it now.</span>
        </AuthAlert>
        <Link href="/auth/login">
          <Button variant="primary" size="lg" className="w-full" iconRight={<ArrowRight size={16} />}>
            Continue to sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <AuthAlert>
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </AuthAlert>
      )}
      <Field label="Work email" htmlFor="email">
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.in" />
      </Field>
      <Field label="Reset token" htmlFor="token">
        <Input id="token" type="text" required value={token} onChange={(e) => setToken(e.target.value)} placeholder="RST-XXXXXX" className="font-mono" />
      </Field>
      <Field label="New password" htmlFor="new">
        <Input id="new" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Choose a strong password" />
      </Field>
      <Field label="Confirm password" htmlFor="confirm">
        <Input id="confirm" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" />
      </Field>
      <div className="rounded-[10px] border border-line bg-inset p-3.5">
        <PasswordChecklist password={newPassword} confirm={confirmPassword} />
      </div>
      <Button type="submit" variant="primary" size="lg" loading={loading} disabled={!isValid} className="w-full">
        Update password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Use the token from your reset link to choose a new password."
      footer={
        <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-ink-soft hover:text-ink">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      }
    >
      <Suspense
        fallback={
          <div className="py-6 text-center text-[13px] text-ink-faint">
            Preparing your reset form…
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
