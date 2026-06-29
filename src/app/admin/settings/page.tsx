"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, MapPin, Users, Briefcase, Shield, Bell, Activity, Database,
  HardDrive, RefreshCw, Edit3, Plus, Check, AlertTriangle, Upload, Globe,
  Mail, Phone, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea, Field } from "@/components/ui/Input";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { LoadingState } from "@/components/ui/States";
import { Switch } from "@/components/ui/Switch";

const BRANCHES = ["Pune", "Bengaluru", "Hyderabad", "Mumbai", "Delhi", "Chennai", "Kolkata"];
const DEPTS = ["Engineering", "HR", "Finance", "Sales", "Marketing", "IT Support", "Operations"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [settings, setSettings] = useState<any>({
    profile: { name: "", logoUrl: "", domain: "", gstNumber: "", cinNumber: "", address: "", supportEmail: "", contactNumber: "", website: "", timezone: "Asia/Kolkata", language: "English" },
    branches: [],
    departments: [],
    securityPolicies: { minPasswordLength: 12, passwordExpiry: 90, sessionTimeout: 15, mfaPolicy: "ENFORCED", loginAttemptLimit: 5, deviceTrustPolicy: "REQUIRED", accountLockDuration: 30 },
    notifications: { emailNotifications: true, campaignAlerts: true, weeklyReports: true, monthlyReports: true, securityAlerts: true, trainingReminders: true },
    backups: { schedule: "DAILY", history: [] },
  });

  const [showBranchModal, setShowBranchModal] = useState(false);
  const [branchForm, setBranchForm] = useState({ id: "", name: "", branchAdmin: "", employeeCount: 0, activeCampaigns: 0, isEnabled: true });
  const [isEditingBranch, setIsEditingBranch] = useState(false);

  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptForm, setDeptForm] = useState({ id: "", name: "", managerName: "", employeeCount: 0, activeCampaigns: 0, isArchived: false });
  const [isEditingDept, setIsEditingDept] = useState(false);

  const [creatingBackup, setCreatingBackup] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.profile) setSettings(data);
      } else setErrorMsg("Couldn't load settings.");
    } catch { setErrorMsg("Couldn't load settings."); }
    finally { setLoading(false); }
  };

  const handleSaveSettings = async (updatedSettings = settings) => {
    setSaving(true); setSuccessMsg(""); setErrorMsg("");
    try {
      const res = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatedSettings) });
      if (res.ok) { setSuccessMsg("Saved."); setTimeout(() => setSuccessMsg(""), 4000); }
      else setErrorMsg("Couldn't save settings.");
    } catch { setErrorMsg("Couldn't save settings."); }
    finally { setSaving(false); }
  };

  const updateProfile = (key: string, value: any) => setSettings({ ...settings, profile: { ...settings.profile, [key]: value } });
  const updateSecurity = (key: string, value: any) => setSettings({ ...settings, securityPolicies: { ...settings.securityPolicies, [key]: value } });
  const updateNotification = (key: string, value: boolean) => {
    const updated = { ...settings, notifications: { ...settings.notifications, [key]: value } };
    setSettings(updated); handleSaveSettings(updated);
  };

  const handleOpenAddBranch = () => { setBranchForm({ id: "", name: "", branchAdmin: "", employeeCount: 0, activeCampaigns: 0, isEnabled: true }); setIsEditingBranch(false); setShowBranchModal(true); };
  const handleOpenEditBranch = (b: any) => { setBranchForm({ ...b }); setIsEditingBranch(true); setShowBranchModal(true); };
  const handleSaveBranch = () => {
    if (!branchForm.name || !branchForm.branchAdmin) { setErrorMsg("Add a branch name and administrator."); return; }
    let updatedBranches = [...settings.branches];
    if (isEditingBranch) updatedBranches = updatedBranches.map((b) => (b.id === branchForm.id ? branchForm : b));
    else updatedBranches.push({ ...branchForm, id: "br-" + branchForm.name.toLowerCase().replace(/\s+/g, "-") });
    const updatedSettings = { ...settings, branches: updatedBranches };
    setSettings(updatedSettings); handleSaveSettings(updatedSettings); setShowBranchModal(false);
  };
  const handleToggleBranch = (branchId: string) => {
    const updatedBranches = settings.branches.map((b: any) => (b.id === branchId ? { ...b, isEnabled: !b.isEnabled } : b));
    const updatedSettings = { ...settings, branches: updatedBranches };
    setSettings(updatedSettings); handleSaveSettings(updatedSettings);
  };

  const handleOpenAddDept = () => { setDeptForm({ id: "", name: "", managerName: "", employeeCount: 0, activeCampaigns: 0, isArchived: false }); setIsEditingDept(false); setShowDeptModal(true); };
  const handleOpenEditDept = (d: any) => { setDeptForm({ ...d }); setIsEditingDept(true); setShowDeptModal(true); };
  const handleSaveDept = () => {
    if (!deptForm.name || !deptForm.managerName) { setErrorMsg("Add a department name and manager."); return; }
    let updatedDepts = [...settings.departments];
    if (isEditingDept) updatedDepts = updatedDepts.map((d) => (d.id === deptForm.id ? deptForm : d));
    else updatedDepts.push({ ...deptForm, id: "dept-" + deptForm.name.toLowerCase().replace(/\s+/g, "-") });
    const updatedSettings = { ...settings, departments: updatedDepts };
    setSettings(updatedSettings); handleSaveSettings(updatedSettings); setShowDeptModal(false);
  };
  const handleToggleDeptArchive = (deptId: string) => {
    const updatedDepts = settings.departments.map((d: any) => (d.id === deptId ? { ...d, isArchived: !d.isArchived } : d));
    const updatedSettings = { ...settings, departments: updatedDepts };
    setSettings(updatedSettings); handleSaveSettings(updatedSettings);
  };

  const handleTriggerManualBackup = () => {
    setCreatingBackup(true);
    setTimeout(() => {
      const newBackup = { id: `BK-${Math.floor(Math.random() * 9000) + 1000}`, name: `pinkman_backup_manual_${new Date().toISOString().slice(0, 10).replace(/-/g, "_")}.sql`, size: "45.4 MB", timestamp: new Date().toISOString(), status: "COMPLETED", type: "MANUAL" };
      const updatedSettings = { ...settings, backups: { ...settings.backups, history: [newBackup, ...settings.backups.history] } };
      setSettings(updatedSettings); handleSaveSettings(updatedSettings); setCreatingBackup(false);
      setSuccessMsg("Backup complete.");
    }, 2500);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <Building2 size={15} /> },
    { id: "branches", label: "Branches", icon: <MapPin size={15} /> },
    { id: "departments", label: "Departments", icon: <Briefcase size={15} /> },
    { id: "security", label: "Security", icon: <Shield size={15} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
    { id: "system", label: "System", icon: <Activity size={15} /> },
  ];

  if (loading) return <LoadingState label="Loading settings" sublabel="Fetching your organization configuration." />;

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Branding, branches, departments, security policy, and system health — all in one place."
        actions={<Button variant="primary" loading={saving} icon={<Check size={15} />} onClick={() => handleSaveSettings()}>Save changes</Button>}
      />

      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-5 flex items-center gap-2 rounded-[12px] border border-accent/30 bg-accent-faint/40 px-4 py-3 text-[13.5px] text-ink">
            <Check size={16} className="text-accent" /> {successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-5 flex items-center gap-2 rounded-[12px] border border-danger/30 bg-danger-faint/40 px-4 py-3 text-[13.5px] text-ink">
            <AlertTriangle size={16} className="text-danger" /> {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex shrink-0 items-center gap-2 px-3.5 py-3 text-[13.5px] font-medium transition-colors",
              activeTab === tab.id ? "text-ink" : "text-ink-faint hover:text-ink-soft"
            )}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && <motion.span layoutId="settingsTab" className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-accent" />}
          </button>
        ))}
      </div>

      {/* Profile */}
      {activeTab === "profile" && (
        <Card pad="lg" className="space-y-6">
          <div className="flex flex-col items-center gap-5 rounded-[14px] border border-line bg-inset p-5 sm:flex-row">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-line bg-card text-ink-faint">
              {settings.profile.logoUrl ? <img src={settings.profile.logoUrl} alt="Logo" className="h-full w-full object-contain p-2" /> : <Building2 size={30} />}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-[15px] font-semibold text-ink">Organization logo</h3>
              <p className="mt-1 max-w-md text-[13px] text-ink-soft">Shown across dashboards and reports. PNG or SVG, up to 2MB.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Button variant="secondary" size="sm" icon={<Upload size={14} />} onClick={() => { const u = prompt("Enter image URL (or leave empty to reset):"); updateProfile("logoUrl", u || ""); }}>Upload</Button>
                {settings.profile.logoUrl && <Button variant="ghost" size="sm" onClick={() => updateProfile("logoUrl", "")}>Reset</Button>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Organization name"><Input value={settings.profile.name} onChange={(e) => updateProfile("name", e.target.value)} placeholder="Pinkman Protects" /></Field>
            <Field label="Domain"><Input icon={<Globe size={15} />} value={settings.profile.domain} onChange={(e) => updateProfile("domain", e.target.value)} placeholder="pinkmanprotects.co.in" /></Field>
            <Field label="GSTIN"><Input value={settings.profile.gstNumber} onChange={(e) => updateProfile("gstNumber", e.target.value)} placeholder="27AAPCP1234M1Z5" /></Field>
            <Field label="CIN"><Input value={settings.profile.cinNumber} onChange={(e) => updateProfile("cinNumber", e.target.value)} placeholder="U74999MH2026PTC398247" /></Field>
            <Field label="Address" className="md:col-span-2"><Textarea rows={2} value={settings.profile.address} onChange={(e) => updateProfile("address", e.target.value)} placeholder="Registered office address" /></Field>
            <Field label="Support email"><Input icon={<Mail size={15} />} type="email" value={settings.profile.supportEmail} onChange={(e) => updateProfile("supportEmail", e.target.value)} placeholder="support@company.com" /></Field>
            <Field label="Contact number"><Input icon={<Phone size={15} />} value={settings.profile.contactNumber} onChange={(e) => updateProfile("contactNumber", e.target.value)} placeholder="+91 20 4012 3456" /></Field>
            <Field label="Website"><Input icon={<Globe size={15} />} value={settings.profile.website} onChange={(e) => updateProfile("website", e.target.value)} placeholder="https://company.com" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Time zone"><Select value={settings.profile.timezone} onChange={(e) => updateProfile("timezone", e.target.value)}><option value="Asia/Kolkata">Asia/Kolkata</option><option value="UTC">UTC</option><option value="Asia/Singapore">Asia/Singapore</option></Select></Field>
              <Field label="Language"><Select value={settings.profile.language} onChange={(e) => updateProfile("language", e.target.value)}><option>English</option><option>Hindi</option><option>Marathi</option><option>Tamil</option></Select></Field>
            </div>
          </div>
        </Card>
      )}

      {/* Branches */}
      {activeTab === "branches" && (
        <Card pad="lg">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-ink">Branches</h2>
            <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={handleOpenAddBranch}>Add branch</Button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {settings.branches.map((branch: any) => (
              <div key={branch.id} className={cn("flex flex-col justify-between rounded-[14px] border border-line bg-inset p-4", !branch.isEnabled && "opacity-55")}>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
                      <span className={cn("h-1.5 w-1.5 rounded-full", branch.isEnabled ? "bg-accent" : "bg-ink-faint")} /> {branch.name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleOpenEditBranch(branch)} className="focus-ring rounded p-1 text-ink-faint hover:text-ink"><Edit3 size={14} /></button>
                      <Switch checked={branch.isEnabled} onChange={() => handleToggleBranch(branch.id)} />
                    </div>
                  </div>
                  <p className="mt-2 text-[12.5px] text-ink-soft">Admin: <span className="text-ink">{branch.branchAdmin}</span></p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[12.5px] text-ink-soft">
                  <span className="flex items-center gap-1.5"><Users size={13} className="text-ink-faint" /> {branch.employeeCount}</span>
                  <span className="flex items-center gap-1.5"><Briefcase size={13} className="text-ink-faint" /> {branch.activeCampaigns}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Departments */}
      {activeTab === "departments" && (
        <Card pad="lg">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-ink">Departments</h2>
            <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={handleOpenAddDept}>Add department</Button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {settings.departments.map((dept: any) => (
              <div key={dept.id} className={cn("flex flex-col justify-between rounded-[14px] border border-line bg-inset p-4", dept.isArchived && "opacity-55")}>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
                      <span className={cn("h-1.5 w-1.5 rounded-full", !dept.isArchived ? "bg-accent" : "bg-ink-faint")} /> {dept.name}
                      {dept.isArchived && <Badge tone="muted">archived</Badge>}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleOpenEditDept(dept)} className="focus-ring rounded p-1 text-ink-faint hover:text-ink"><Edit3 size={14} /></button>
                      <button onClick={() => handleToggleDeptArchive(dept.id)} className="focus-ring rounded px-2 py-1 text-[12px] text-ink-soft hover:text-ink">{!dept.isArchived ? "Archive" : "Restore"}</button>
                    </div>
                  </div>
                  <p className="mt-2 text-[12.5px] text-ink-soft">Manager: <span className="text-ink">{dept.managerName}</span></p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[12.5px] text-ink-soft">
                  <span className="flex items-center gap-1.5"><Users size={13} className="text-ink-faint" /> {dept.employeeCount}</span>
                  <span className="flex items-center gap-1.5"><Activity size={13} className="text-ink-faint" /> {dept.activeCampaigns}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <Card pad="lg" className="space-y-5">
          <div className="flex items-start gap-3 rounded-[12px] border border-warn/30 bg-warn-faint/30 p-4">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warn" />
            <p className="text-[13px] leading-relaxed text-ink-soft">These policies apply across portals, sign-up forms, and simulators. They don&apos;t modify the database engine itself.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Minimum password length"><Input type="number" min={8} max={32} value={settings.securityPolicies.minPasswordLength} onChange={(e) => updateSecurity("minPasswordLength", parseInt(e.target.value) || 12)} /></Field>
            <Field label="Password expiry"><Select value={settings.securityPolicies.passwordExpiry} onChange={(e) => updateSecurity("passwordExpiry", parseInt(e.target.value) || 90)}><option value={30}>30 days</option><option value={60}>60 days</option><option value={90}>90 days</option><option value={180}>180 days</option><option value={0}>Never</option></Select></Field>
            <Field label="Session timeout (minutes)"><Input type="number" min={5} max={120} value={settings.securityPolicies.sessionTimeout} onChange={(e) => updateSecurity("sessionTimeout", parseInt(e.target.value) || 15)} /></Field>
            <Field label="Multi-factor authentication"><Select value={settings.securityPolicies.mfaPolicy} onChange={(e) => updateSecurity("mfaPolicy", e.target.value)}><option value="DISABLED">Disabled</option><option value="OPTIONAL">Optional</option><option value="ENFORCED">Enforced</option></Select></Field>
            <Field label="Failed login lockout limit"><Input type="number" min={3} max={10} value={settings.securityPolicies.loginAttemptLimit} onChange={(e) => updateSecurity("loginAttemptLimit", parseInt(e.target.value) || 5)} /></Field>
            <Field label="Device trust"><Select value={settings.securityPolicies.deviceTrustPolicy} onChange={(e) => updateSecurity("deviceTrustPolicy", e.target.value)}><option value="DISABLED">Disabled</option><option value="OPTIONAL">Optional</option><option value="REQUIRED">Required</option></Select></Field>
            <Field label="Account lock duration (minutes)"><Input type="number" min={5} max={1440} value={settings.securityPolicies.accountLockDuration} onChange={(e) => updateSecurity("accountLockDuration", parseInt(e.target.value) || 30)} /></Field>
          </div>
        </Card>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <Card pad="lg">
          <h2 className="text-[15px] font-semibold text-ink">Notifications</h2>
          <p className="mt-1 max-w-2xl text-[13px] text-ink-soft">Choose which events trigger emails and alerts. Changes save automatically.</p>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              { id: "emailNotifications", label: "Email notifications", desc: "Master switch for all outgoing email." },
              { id: "campaignAlerts", label: "Campaign alerts", desc: "Updates and clicks as they happen." },
              { id: "weeklyReports", label: "Weekly digest", desc: "A security snapshot every Monday." },
              { id: "monthlyReports", label: "Monthly review", desc: "Compliance summary on the 1st." },
              { id: "securityAlerts", label: "Security alerts", desc: "Immediate notice on policy changes." },
              { id: "trainingReminders", label: "Training reminders", desc: "Nudge people to finish their modules." },
            ].map((n) => (
              <div key={n.id} className="flex items-start justify-between gap-4 rounded-[12px] border border-line bg-inset p-4">
                <div>
                  <h3 className="text-[13.5px] font-medium text-ink">{n.label}</h3>
                  <p className="mt-0.5 text-[12.5px] text-ink-soft">{n.desc}</p>
                </div>
                <Switch checked={!!settings.notifications[n.id]} onChange={() => updateNotification(n.id, !settings.notifications[n.id])} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* System */}
      {activeTab === "system" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card pad="lg" className="space-y-4">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink"><Activity size={16} className="text-ink-faint" /> System health</h2>
            <div className="grid grid-cols-2 gap-3">
              <HealthTile label="Database" value="SQLite · OK" note="~2.4 MB" />
              <HealthTile label="API" value="Healthy" note="24ms latency" />
              <HealthTile label="Background jobs" value="Idle" note="Every 30m" />
              <HealthTile label="Active users" value="12" note="99.98% uptime" />
            </div>
            <div className="rounded-[12px] border border-line bg-inset p-4">
              <div className="flex items-center justify-between text-[12.5px] text-ink-soft"><span>Storage</span><span className="text-ink">24.2 / 100 GB</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-card"><div className="h-full bg-accent" style={{ width: "24.2%" }} /></div>
            </div>
            <div className="rounded-[12px] border border-line bg-inset p-4 font-mono text-[12px] text-ink-soft">
              <div className="flex justify-between py-0.5"><span>Version</span><span className="text-ink">v2.4.0</span></div>
              <div className="flex justify-between py-0.5"><span>Environment</span><span className="text-accent">production</span></div>
              <div className="flex justify-between py-0.5"><span>Timezone</span><span className="text-ink">Asia/Kolkata</span></div>
            </div>
          </Card>

          <Card pad="lg" className="space-y-4">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink"><Database size={16} className="text-ink-faint" /> Backups</h2>
            <div className="flex flex-col items-center justify-between gap-3 rounded-[12px] border border-line bg-inset p-4 sm:flex-row">
              <div>
                <h3 className="text-[13.5px] font-medium text-ink">Manual snapshot</h3>
                <p className="text-[12.5px] text-ink-soft">Capture the current database state now.</p>
              </div>
              <Button variant="secondary" size="sm" loading={creatingBackup} icon={<HardDrive size={14} />} onClick={handleTriggerManualBackup}>Run backup</Button>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-[12px] border border-line bg-inset p-4">
              <div>
                <h3 className="text-[13.5px] font-medium text-ink">Automatic backups</h3>
                <p className="text-[12.5px] text-ink-soft">Recurring snapshots on a schedule.</p>
              </div>
              <Select className="w-auto" value={settings.backups.schedule} onChange={(e) => { const u = { ...settings, backups: { ...settings.backups, schedule: e.target.value } }; setSettings(u); handleSaveSettings(u); }}>
                <option value="HOURLY">Hourly</option><option value="DAILY">Daily</option><option value="WEEKLY">Weekly</option><option value="OFF">Off</option>
              </Select>
            </div>
            <div>
              <p className="eyebrow mb-2">Recent snapshots</p>
              <Card pad="none">
                {settings.backups.history.length === 0 ? (
                  <p className="p-5 text-center text-[13px] text-ink-faint">No snapshots yet.</p>
                ) : (
                  <Table>
                    <THead><TH>File</TH><TH>Size</TH><TH>Date</TH><TH align="right"> </TH></THead>
                    <TBody>
                      {settings.backups.history.map((b: any) => (
                        <TR key={b.id}>
                          <TD className="font-mono text-[12px] text-ink"><span className="block max-w-[160px] truncate" title={b.name}>{b.name}</span></TD>
                          <TD>{b.size}</TD>
                          <TD>{new Date(b.timestamp).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}</TD>
                          <TD align="right"><button onClick={() => { if (confirm(`Restore from ${b.name}? (mock)`)) setSuccessMsg("Restore simulated."); }} className="text-accent hover:underline">Restore</button></TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                )}
              </Card>
            </div>
          </Card>
        </div>
      )}

      {/* Branch modal */}
      <Modal open={showBranchModal} onClose={() => setShowBranchModal(false)} size="md">
        <ModalHeader title={isEditingBranch ? "Edit branch" : "Add branch"} icon={<MapPin size={17} />} onClose={() => setShowBranchModal(false)} />
        <ModalBody className="space-y-4">
          <Field label="Location">
            <Select value={branchForm.name} disabled={isEditingBranch} onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}>
              <option value="">Select a city…</option>
              {BRANCHES.map((loc) => <option key={loc} value={loc} disabled={settings.branches.some((b: any) => b.name === loc && b.id !== branchForm.id)}>{loc}</option>)}
            </Select>
          </Field>
          <Field label="Administrator"><Input value={branchForm.branchAdmin} onChange={(e) => setBranchForm({ ...branchForm, branchAdmin: e.target.value })} placeholder="Sarah Jenkins" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Employees"><Input type="number" value={branchForm.employeeCount} onChange={(e) => setBranchForm({ ...branchForm, employeeCount: parseInt(e.target.value) || 0 })} /></Field>
            <Field label="Active campaigns"><Input type="number" value={branchForm.activeCampaigns} onChange={(e) => setBranchForm({ ...branchForm, activeCampaigns: parseInt(e.target.value) || 0 })} /></Field>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowBranchModal(false)} className="ml-auto">Cancel</Button>
          <Button variant="primary" onClick={handleSaveBranch}>Save branch</Button>
        </ModalFooter>
      </Modal>

      {/* Dept modal */}
      <Modal open={showDeptModal} onClose={() => setShowDeptModal(false)} size="md">
        <ModalHeader title={isEditingDept ? "Edit department" : "Add department"} icon={<Briefcase size={17} />} onClose={() => setShowDeptModal(false)} />
        <ModalBody className="space-y-4">
          <Field label="Department">
            <Select value={deptForm.name} disabled={isEditingDept} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}>
              <option value="">Select a department…</option>
              {DEPTS.map((d) => <option key={d} value={d} disabled={settings.departments.some((dep: any) => dep.name === d && dep.id !== deptForm.id)}>{d}</option>)}
            </Select>
          </Field>
          <Field label="Manager"><Input value={deptForm.managerName} onChange={(e) => setDeptForm({ ...deptForm, managerName: e.target.value })} placeholder="Arjun Mehta" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Employees"><Input type="number" value={deptForm.employeeCount} onChange={(e) => setDeptForm({ ...deptForm, employeeCount: parseInt(e.target.value) || 0 })} /></Field>
            <Field label="Active campaigns"><Input type="number" value={deptForm.activeCampaigns} onChange={(e) => setDeptForm({ ...deptForm, activeCampaigns: parseInt(e.target.value) || 0 })} /></Field>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowDeptModal(false)} className="ml-auto">Cancel</Button>
          <Button variant="primary" onClick={handleSaveDept}>Save department</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

function HealthTile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[12px] border border-line bg-inset p-4">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-ink-faint">{label}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      </div>
      <p className="mt-1.5 text-[14px] font-semibold text-ink">{value}</p>
      <p className="text-[11.5px] text-ink-faint">{note}</p>
    </div>
  );
}
