"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, RefreshCw, Download, Monitor } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Table, THead, TH, TBody, TD } from "@/components/ui/Table";
import { LoadingState, EmptyState } from "@/components/ui/States";

const BRANCHES = ["Pune", "Bengaluru", "Hyderabad", "Mumbai", "Delhi", "Chennai", "Kolkata"];
const ROLES = ["SUPERADMIN", "SECURITY_ADMIN", "HR_MANAGER", "DEPT_MANAGER", "EMPLOYEE"];

function actionTone(action: string): "danger" | "accent" | "info" | "muted" {
  const a = action.toLowerCase();
  if (a.includes("delete") || a.includes("fail")) return "danger";
  if (a.includes("create") || a.includes("add")) return "accent";
  if (a.includes("login") || a.includes("session") || a.includes("logout")) return "info";
  return "muted";
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedAction, setSelectedAction] = useState("ALL");

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/audit");
      if (res.ok) setLogs(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress?.includes(searchTerm);
    const matchBranch = selectedBranch === "ALL" || log.branch === selectedBranch;
    const matchRole = selectedRole === "ALL" || log.role === selectedRole;
    let matchAction = true;
    if (selectedAction !== "ALL") {
      const act = log.action.toLowerCase();
      const sel = selectedAction.toLowerCase();
      if (sel === "campaign") matchAction = act.includes("campaign");
      else if (sel === "employee") matchAction = act.includes("employee");
      else if (sel === "template") matchAction = act.includes("template");
      else if (sel === "settings") matchAction = act.includes("settings") || act.includes("password") || act.includes("org_switch");
      else if (sel === "auth") matchAction = act.includes("login") || act.includes("logout");
      else if (sel === "reports") matchAction = act.includes("report");
    }
    return matchSearch && matchBranch && matchRole && matchAction;
  });

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ["Timestamp (IST)", "User", "Email", "Role", "Branch", "Action", "IP Address", "Browser/Client", "Details"];
    const csvRows = [headers.join(",")];
    filteredLogs.forEach((log) => {
      const formattedTime = new Date(log.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).replace(/,/g, "");
      const values = [formattedTime, log.name, log.email, log.role, log.branch, log.action, log.ipAddress, log.browser.replace(/,/g, " "), log.details.replace(/,/g, " ")];
      csvRows.push(values.map((v) => `"${v}"`).join(","));
    });
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI("data:text/csv;charset=utf-8," + csvRows.join("\n")));
    link.setAttribute("download", `audit_log_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasFilters = searchTerm || selectedBranch !== "ALL" || selectedRole !== "ALL" || selectedAction !== "ALL";

  return (
    <div>
      <PageHeader
        eyebrow="Security"
        title="Audit log"
        description="Every meaningful action across the platform — who did what, when, and from where."
        actions={
          <div className="flex items-center gap-2.5">
            <Button variant="secondary" size="sm" icon={<RefreshCw size={14} className={loading ? "animate-spin" : ""} />} onClick={fetchLogs}>Refresh</Button>
            <Button variant="secondary" size="sm" icon={<Download size={14} />} disabled={filteredLogs.length === 0} onClick={handleExportCSV}>Export</Button>
          </div>
        }
      />

      <Card pad="md" className="mb-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <Input icon={<Search size={15} />} placeholder="Search by name, email, IP…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
            <option value="ALL">All branches</option>
            {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
          </Select>
          <Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="ALL">All roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
          </Select>
          <Select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)}>
            <option value="ALL">All actions</option>
            <option value="AUTH">Authentication</option>
            <option value="CAMPAIGN">Campaigns</option>
            <option value="TEMPLATE">Templates</option>
            <option value="EMPLOYEE">People</option>
            <option value="SETTINGS">Settings</option>
            <option value="REPORTS">Reports</option>
          </Select>
        </div>
        {hasFilters && (
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[12.5px] text-ink-faint">
            <span>Showing <span className="font-medium text-ink">{filteredLogs.length}</span> matching entries</span>
            <button onClick={() => { setSearchTerm(""); setSelectedBranch("ALL"); setSelectedRole("ALL"); setSelectedAction("ALL"); }} className="text-accent hover:underline">Clear filters</button>
          </div>
        )}
      </Card>

      <Card pad="none">
        {loading ? (
          <LoadingState label="Gathering activity" sublabel="Reading the audit trail." />
        ) : filteredLogs.length === 0 ? (
          <EmptyState icon={<Search size={20} />} title="No matching activity" description="Nothing matches your current filters. Try clearing them." />
        ) : (
          <Table>
            <THead>
              <TH>When (IST)</TH>
              <TH>User</TH>
              <TH>Role</TH>
              <TH>Branch</TH>
              <TH>Action</TH>
              <TH>Origin</TH>
              <TH>Details</TH>
            </THead>
            <TBody>
              <AnimatePresence initial={false}>
                {filteredLogs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(index * 0.015, 0.3), duration: 0.2 }}
                    className="border-b border-line/70 transition-colors last:border-0 hover:bg-white/[0.02]"
                  >
                    <TD className="whitespace-nowrap font-mono text-[12px] text-ink-faint">
                      {new Date(log.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: true })}
                    </TD>
                    <TD className="whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-inset text-[11px] font-semibold text-ink-soft">{initials(log.name)}</span>
                        <div>
                          <p className="font-medium text-ink">{log.name || "Unknown"}</p>
                          <p className="text-[12px] text-ink-faint">{log.email}</p>
                        </div>
                      </div>
                    </TD>
                    <TD className="whitespace-nowrap"><Badge tone="muted">{log.role}</Badge></TD>
                    <TD className="whitespace-nowrap"><span className="flex items-center gap-1 text-[13px]"><MapPin size={12} className="text-ink-faint" /> {log.branch || "—"}</span></TD>
                    <TD className="whitespace-nowrap"><Badge tone={actionTone(log.action)}>{log.action}</Badge></TD>
                    <TD className="whitespace-nowrap font-mono text-[12px] text-ink-faint">
                      <div>{log.ipAddress}</div>
                      <div className="flex max-w-[150px] items-center gap-1 truncate" title={log.browser}><Monitor size={11} /> {log.browser}</div>
                    </TD>
                    <TD className="min-w-[200px] text-[13px] leading-relaxed">{log.details}</TD>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
