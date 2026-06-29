"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, MailCheck, ArrowRight } from "lucide-react";
import { AuthLayout, AuthAlert } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "We couldn't process that request.");
      else {
        setMessage(data.message);
        setResetToken(data.resetToken);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong on our end.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={message ? "Check your inbox" : "Reset your password"}
      subtitle={
        message
          ? undefined
          : "Enter your work email and we'll send a secure reset link."
      }
      footer={
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-ink-soft hover:text-ink"
        >
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      }
    >
      {message ? (
        <div className="space-y-5">
          <AuthAlert tone="success">
            <MailCheck size={16} className="mt-0.5 shrink-0" />
            <span>{message}</span>
          </AuthAlert>
          {resetToken && (
            <div className="space-y-3 rounded-[10px] border border-line bg-inset p-4">
              <p className="text-[12.5px] leading-relaxed text-ink-soft">
                For this evaluation build, your reset link is ready below.
              </p>
              <Link
                href={`/auth/reset-password?email=${encodeURIComponent(
                  email
                )}&token=${resetToken}`}
              >
                <Button variant="accent" size="sm" iconRight={<ArrowRight size={15} />}>
                  Open reset form
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <AuthAlert>
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </AuthAlert>
          )}
          <Field label="Work email" htmlFor="email">
            <Input
              id="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.in"
            />
          </Field>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
