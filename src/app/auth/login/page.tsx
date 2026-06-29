"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, AlertCircle, ChevronDown } from "lucide-react";
import { AuthLayout, AuthAlert } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";

const demoAccounts = [
  { role: "Super admin", email: "superadmin@company.in", password: "Superadmin123!" },
  { role: "Security admin", email: "admin@company.in", password: "Admin123!" },
  { role: "HR manager", email: "hr@company.in", password: "HrManager123!" },
  { role: "Team member", email: "rahul@company.in", password: "password123" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Those credentials didn't match. Try again.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      router.push(data.user.role === "EMPLOYEE" ? "/learning" : "/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong on our end.");
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your security console."
      footer={
        <>
          Forgot your password?{" "}
          <Link href="/auth/forgot-password" className="text-ink-soft underline-offset-2 hover:text-ink hover:underline">
            Reset it
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-5">
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

        <Field
          label="Password"
          htmlFor="password"
          action={
            <Link
              href="/auth/forgot-password"
              className="text-[12.5px] text-ink-faint transition-colors hover:text-ink-soft"
            >
              Forgot?
            </Link>
          }
        >
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-ink-faint transition-colors hover:text-ink"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
        </Field>

        <label className="flex cursor-pointer select-none items-center gap-2.5 text-[13px] text-ink-soft">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-line bg-inset accent-[#3ecf8e]"
          />
          Keep me signed in on this device
        </label>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
          iconRight={!loading && <ArrowRight size={16} />}
        >
          Sign in
        </Button>
      </form>

      <div className="mt-6 border-t border-line pt-5">
        <button
          onClick={() => setShowDemo((s) => !s)}
          className="flex w-full items-center justify-between text-[12.5px] text-ink-faint transition-colors hover:text-ink-soft"
        >
          <span>Demo accounts for evaluation</span>
          <ChevronDown
            size={15}
            className={"transition-transform " + (showDemo ? "rotate-180" : "")}
          />
        </button>
        {showDemo && (
          <div className="mt-3 space-y-1.5">
            {demoAccounts.map((a) => (
              <button
                key={a.email}
                onClick={() => {
                  setEmail(a.email);
                  setPassword(a.password);
                }}
                className="flex w-full items-center justify-between rounded-[9px] border border-line bg-inset px-3 py-2 text-left transition-colors hover:border-line-strong"
              >
                <span className="text-[12.5px] font-medium text-ink-soft">{a.role}</span>
                <span className="font-mono text-[11.5px] text-ink-faint">{a.email}</span>
              </button>
            ))}
            <p className="pt-1 text-[11.5px] leading-relaxed text-ink-faint">
              This is a protected console. Activity is logged and audited.
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
