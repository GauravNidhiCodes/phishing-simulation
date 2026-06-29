"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  MapPin,
  Clock,
  ChevronDown,
  Key,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  History,
  Check,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { PasswordChecklist, AuthAlert } from "@/components/auth/AuthLayout";
import PPLogo from "@/components/layout/PPLogo";

interface SessionUser {
  userId: string;
  email: string;
  name: string;
  role: string;
  orgId: string;
  orgName: string;
  branch: string;
  department: string;
  managerName: string;
  joiningDate: string;
  lastLogin: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  eventType: string;
  email: string;
  ipAddress: string;
  details: string;
}

const roleLabel: Record<string, string> = {
  SUPERADMIN: "Super admin",
  SECURITY_ADMIN: "Security admin",
  HR_MANAGER: "HR manager",
  DEPT_MANAGER: "Dept. manager",
  EMPLOYEE: "Team member",
};

const orgs = [
  "Pinkman Technologies Pvt. Ltd.",
  "Sahyadri Logistics Pvt. Ltd.",
  "Greenleaf Foods Pvt. Ltd.",
  "Nivaan Healthcare Pvt. Ltd.",
];

function Panel({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[14px] border border-line bg-card">
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
        <span className="text-ink-faint">{icon}</span>
        <h3 className="text-[14px] font-semibold text-ink">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[12px] text-ink-faint">
        {icon}
        {label}
      </div>
      <div className="text-[13.5px] font-medium text-ink">{value}</div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  const fetchSession = () => {
    fetch("/api/auth/session")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthenticated");
        return res.json();
      })
      .then((data) => {
        if (data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => router.push("/auth/login"));
  };

  const fetchAuditLogs = () => {
    fetch("/api/auth/audit-logs")
      .then((res) => res.json())
      .then((data) => setAuditLogs(data.slice(0, 10)))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchSession();
    fetchAuditLogs();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) router.push("/auth/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwitchOrg = async (orgName: string) => {
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionType: "switchOrg", targetOrgName: orgName }),
      });
      if (res.ok) {
        setOrgDropdownOpen(false);
        fetchSession();
        fetchAuditLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isValidPassword =
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[0-9]/.test(newPassword) &&
    /[^A-Za-z0-9]/.test(newPassword) &&
    newPassword === confirmPassword;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");
    setPwdLoading(true);
    if (newPassword !== confirmPassword) {
      setPwdError("Those passwords don't match.");
      setPwdLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionType: "changePassword",
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) setPwdError(data.error || "We couldn't update your password.");
      else {
        setPwdSuccess("Password updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        fetchAuditLogs();
      }
    } catch (err: any) {
      setPwdError(err.message || "Something went wrong.");
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas">
        <span className="text-accent">
          <ShieldCheck size={22} className="animate-pulse" />
        </span>
        <span className="text-[13px] text-ink-faint">Loading your profile…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-canvas px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between border-b border-line pb-5">
          <button
            onClick={() =>
              router.push(user.role === "EMPLOYEE" ? "/learning" : "/admin/dashboard")
            }
            className="inline-flex items-center gap-1.5 text-[13.5px] text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft size={15} /> Back to workspace
          </button>
          <div className="flex items-center gap-2 text-ink-faint">
            <PPLogo size={20} />
            <span className="text-[12.5px]">Account</span>
          </div>
        </div>

        <div className="grid items-start gap-6 md:grid-cols-12">
          <div className="space-y-6 md:col-span-7">
            {/* Identity */}
            <div className="rounded-[14px] border border-line bg-card p-6">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px] border border-line bg-elevated text-[18px] font-semibold text-ink">
                  {initials(user.name)}
                </span>
                <div className="min-w-0 space-y-1.5">
                  <h1 className="truncate text-[20px] font-semibold tracking-[-0.02em] text-ink">
                    {user.name}
                  </h1>
                  <p className="truncate text-[13px] text-ink-soft">{user.email}</p>
                  <Badge tone="accent" dot>
                    {roleLabel[user.role] || user.role}
                  </Badge>
                </div>
              </div>
              <div className="mt-6 grid gap-5 border-t border-line pt-6 sm:grid-cols-2">
                <Detail icon={<Building2 size={13} />} label="Department" value={user.department} />
                <Detail icon={<MapPin size={13} />} label="Location" value={`${user.branch} office`} />
                <Detail icon={<User size={13} />} label="Reports to" value={user.managerName} />
                <Detail
                  icon={<Clock size={13} />}
                  label="Last sign-in"
                  value={new Date(user.lastLogin).toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                />
              </div>
            </div>

            {/* Org switcher */}
            <Panel icon={<Building2 size={16} />} title="Active organization">
              <p className="mb-4 text-[13px] leading-relaxed text-ink-soft">
                Switch the tenant you're working in. Useful for super admins
                reviewing compliance across organizations.
              </p>
              <div className="relative">
                <button
                  onClick={() => setOrgDropdownOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-[10px] border border-line bg-inset px-3.5 py-2.5 text-[13.5px] text-ink transition-colors hover:border-line-strong"
                >
                  {user.orgName}
                  <ChevronDown
                    size={16}
                    className={cn("text-ink-faint transition-transform", orgDropdownOpen && "rotate-180")}
                  />
                </button>
                <AnimatePresence>
                  {orgDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute z-20 mt-2 w-full overflow-hidden rounded-[10px] border border-line-strong bg-elevated shadow-xl"
                    >
                      {orgs.map((orgOption) => {
                        const active = user.orgName === orgOption;
                        return (
                          <button
                            key={orgOption}
                            onClick={() => handleSwitchOrg(orgOption)}
                            className={cn(
                              "flex w-full items-center justify-between px-3.5 py-2.5 text-left text-[13px] transition-colors",
                              active
                                ? "bg-white/[0.05] font-medium text-ink"
                                : "text-ink-soft hover:bg-white/[0.04] hover:text-ink"
                            )}
                          >
                            {orgOption}
                            {active && <Check size={15} className="text-accent" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Panel>

            {/* Audit log */}
            <Panel icon={<History size={16} />} title="Recent account activity">
              <div className="scrollbar-thin max-h-[280px] space-y-2 overflow-y-auto pr-1">
                {auditLogs.length === 0 && (
                  <p className="py-6 text-center text-[13px] text-ink-faint">
                    No recent activity to show.
                  </p>
                )}
                {auditLogs.map((log) => {
                  const tone = log.eventType.includes("SUCCESS")
                    ? "accent"
                    : log.eventType.includes("FAILURE")
                    ? "danger"
                    : "neutral";
                  return (
                    <div
                      key={log.id}
                      className="rounded-[10px] border border-line bg-inset p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Badge tone={tone as any}>{log.eventType.replace(/_/g, " ").toLowerCase()}</Badge>
                        <span className="font-mono text-[11.5px] text-ink-faint">
                          {new Date(log.timestamp).toLocaleTimeString("en-US", {
                            timeZone: "Asia/Kolkata",
                          })}
                        </span>
                      </div>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">
                        {log.details}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          {/* Right column */}
          <div className="space-y-6 md:col-span-5">
            <Panel icon={<Key size={16} />} title="Change password">
              <form onSubmit={handleChangePassword} className="space-y-4">
                {pwdError && (
                  <AuthAlert>
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{pwdError}</span>
                  </AuthAlert>
                )}
                {pwdSuccess && (
                  <AuthAlert tone="success">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                    <span>{pwdSuccess}</span>
                  </AuthAlert>
                )}
                <Field label="Current password" htmlFor="cur">
                  <Input id="cur" type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
                </Field>
                <Field label="New password" htmlFor="np">
                  <Input id="np" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Choose a strong password" />
                </Field>
                <Field label="Confirm new password" htmlFor="cnp">
                  <Input id="cnp" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" />
                </Field>
                <div className="rounded-[10px] border border-line bg-inset p-3.5">
                  <PasswordChecklist password={newPassword} confirm={confirmPassword} />
                </div>
                <Button type="submit" variant="primary" loading={pwdLoading} disabled={!isValidPassword} className="w-full">
                  Update password
                </Button>
              </form>
            </Panel>

            <div className="rounded-[14px] border border-line bg-card p-5 text-center">
              <p className="text-[13px] leading-relaxed text-ink-soft">
                Done for now? Sign out to end this session on this device.
              </p>
              <Button onClick={handleLogout} variant="danger" className="mt-4 w-full" icon={<LogOut size={15} />}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
