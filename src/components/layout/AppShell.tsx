"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PPLogo from "./PPLogo";
import AIAssistant from "../ai/AIAssistant";
import NotificationCenter from "../notifications/NotificationCenter";
import { cn, initials } from "@/lib/utils";
import {
  LayoutDashboard,
  Radio,
  Send,
  LayoutTemplate,
  BarChart3,
  Users,
  GraduationCap,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ScrollText,
  FileBarChart,
  LogOut,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const operationsNav: NavItem[] = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/soc", label: "Live operations", icon: Radio },
  { href: "/admin/campaigns", label: "Campaigns", icon: Send },
  { href: "/admin/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/employees", label: "People", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/admin/audit", label: "Audit log", icon: ScrollText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const trainingNav: NavItem[] = [
  { href: "/learning", label: "Learning", icon: GraduationCap },
];

function filterByRole(role: string): NavItem[] {
  return operationsNav.filter((item) => {
    if (role === "SUPERADMIN") return true;
    if (role === "SECURITY_ADMIN") return item.href !== "/admin/employees";
    if (role === "HR_MANAGER")
      return (
        item.href !== "/admin/campaigns" && item.href !== "/admin/templates"
      );
    if (role === "DEPT_MANAGER")
      return (
        item.href !== "/admin/campaigns" &&
        item.href !== "/admin/templates" &&
        item.href !== "/admin/employees"
      );
    return false;
  });
}

const roleLabel: Record<string, string> = {
  SUPERADMIN: "Super admin",
  SECURITY_ADMIN: "Security admin",
  HR_MANAGER: "HR manager",
  DEPT_MANAGER: "Dept. manager",
  EMPLOYEE: "Team member",
};

/* --------------------------------- Nav row -------------------------------- */

function NavRow({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="group relative block"
      title={collapsed ? item.label : undefined}
    >
      <div
        className={cn(
          "relative flex items-center rounded-[9px] transition-colors duration-150",
          collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2",
          active
            ? "text-ink"
            : "text-ink-soft hover:bg-white/[0.035] hover:text-ink"
        )}
      >
        {active && (
          <motion.span
            layoutId="navActive"
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
            className="absolute inset-0 rounded-[9px] border border-line bg-white/[0.045]"
          />
        )}
        <Icon
          size={17}
          strokeWidth={2}
          className={cn(
            "relative z-10 shrink-0",
            active ? "text-accent" : "text-ink-faint group-hover:text-ink-soft"
          )}
        />
        {!collapsed && (
          <span className="relative z-10 truncate text-[13.5px] font-medium">
            {item.label}
          </span>
        )}
        {collapsed && (
          <span className="pointer-events-none absolute left-[calc(100%+10px)] z-50 whitespace-nowrap rounded-md border border-line-strong bg-elevated px-2.5 py-1 text-[12px] font-medium text-ink opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
            {item.label}
          </span>
        )}
      </div>
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-faint/80">
      {children}
    </p>
  );
}

/* ------------------------------- Mobile gate ------------------------------ */

function MobileGate({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-7 text-center">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas/0 via-canvas/60 to-canvas" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <PPLogo size={40} />
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          Pinkman Protects
        </p>
        <h1 className="mt-7 max-w-xs text-[26px] font-semibold leading-tight tracking-[-0.02em] text-ink">
          Best experienced on a larger screen
        </h1>
        <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-ink-soft">
          The security console is dense with live telemetry and tables. Open it
          on a laptop or desktop for the full picture.
        </p>
        <button
          onClick={onContinue}
          className="focus-ring mt-8 rounded-[10px] border border-line bg-card px-5 py-2.5 text-[13px] font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
        >
          Continue anyway
        </button>
      </motion.div>
    </div>
  );
}

/* ------------------------------- App shell -------------------------------- */

export const AppShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [bypassMobileGate, setBypassMobileGate] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    if (sessionStorage.getItem("pinkman_mobile_bypass") === "true") {
      setBypassMobileGate(true);
    }
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleBypass = () => {
    sessionStorage.setItem("pinkman_mobile_bypass", "true");
    setBypassMobileGate(true);
  };

  const isSimulationPage = pathname?.includes("/simulation/landing/");
  const isAuthPage = pathname?.startsWith("/auth");
  const isLanding = pathname === "/";

  useEffect(() => {
    if (!isSimulationPage && !isAuthPage) {
      fetch("/api/auth/session")
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) setSessionUser(data.user);
        })
        .catch((err) => console.error(err));
    }
  }, [pathname, isSimulationPage, isAuthPage]);

  // Inactivity timeout — sign out after 15 minutes idle.
  useEffect(() => {
    if (isSimulationPage || isAuthPage || !sessionUser) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
          setSessionUser(null);
          router.push("/auth/session-expired");
        } catch (e) {
          console.error(e);
        }
      }, 15 * 60 * 1000);
    };
    const events = ["mousemove", "keydown", "click", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timeoutId);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [sessionUser, isSimulationPage, isAuthPage, router]);

  // Bare canvases — auth, simulation, landing render without the shell.
  if (isAuthPage) {
    return (
      <main className="flex min-h-screen w-full flex-1 flex-col justify-center bg-canvas text-ink">
        {children}
      </main>
    );
  }
  if (isSimulationPage) {
    return (
      <main className="min-h-screen w-full flex-1 bg-canvas text-ink">
        {children}
      </main>
    );
  }
  if (isLanding) {
    return (
      <main className="min-h-screen w-full flex-1 bg-canvas text-ink">
        {children}
      </main>
    );
  }

  if (isMobile && !bypassMobileGate) {
    return <MobileGate onContinue={handleBypass} />;
  }

  const role = sessionUser?.role || "EMPLOYEE";
  const visibleOps = filterByRole(role);
  const showOps = role !== "EMPLOYEE" && visibleOps.length > 0;

  const isActive = (href: string) =>
    pathname === href ||
    (href === "/learning" && pathname?.startsWith("/learning/module"));

  const NavSections = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {showOps && (
        <div>
          {!collapsed && <SectionLabel>Operations</SectionLabel>}
          <div className="space-y-0.5">
            {visibleOps.map((item) => (
              <NavRow
                key={item.href}
                item={item}
                active={isActive(item.href)}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      )}
      <div>
        {!collapsed && <SectionLabel>Training</SectionLabel>}
        <div className="space-y-0.5">
          {trainingNav.map((item) => (
            <NavRow
              key={item.href}
              item={item}
              active={isActive(item.href)}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </>
  );

  const UserCard = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex items-center gap-2.5">
      <Link
        href="/auth/profile"
        onClick={onNavigate}
        className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[10px] border border-transparent px-1.5 py-1.5 transition-colors hover:border-line hover:bg-white/[0.03]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-elevated text-[12px] font-semibold text-ink">
          {initials(sessionUser?.name)}
        </span>
        {!collapsed && (
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-[13px] font-medium text-ink">
              {sessionUser?.name || "Signed in"}
            </span>
            <span className="block truncate text-[11.5px] text-ink-faint">
              {roleLabel[role] || "Member"}
            </span>
          </span>
        )}
      </Link>
      {!collapsed && (
        <Link
          href="/auth/logout"
          onClick={onNavigate}
          title="Sign out"
          className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-ink-faint transition-colors hover:bg-white/[0.04] hover:text-ink"
        >
          <LogOut size={15} />
        </Link>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-canvas">
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 244 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-line bg-surface md:flex"
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-line",
            collapsed ? "justify-center px-0" : "justify-between px-4"
          )}
        >
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <PPLogo size={24} />
            {!collapsed && (
              <span className="whitespace-nowrap text-[14px] font-semibold tracking-[-0.01em] text-ink">
                Pinkman Protects
              </span>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="focus-ring flex h-7 w-7 items-center justify-center rounded-[7px] text-ink-faint transition-colors hover:bg-white/[0.04] hover:text-ink"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="focus-ring mx-auto mt-3 flex h-8 w-8 items-center justify-center rounded-[8px] text-ink-faint transition-colors hover:bg-white/[0.04] hover:text-ink"
            title="Expand sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
        )}

        <nav className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-3 py-5">
          <NavSections />
        </nav>

        <div className="border-t border-line p-3">
          <UserCard />
        </div>
      </motion.aside>

      {/* Main column */}
      <motion.div
        animate={{ paddingLeft: isMobile ? 0 : collapsed ? 68 : 244 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="flex min-h-screen flex-1 flex-col"
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line bg-canvas/80 px-5 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-[9px] border border-line text-ink-soft transition-colors hover:text-ink md:hidden"
            >
              <Menu size={17} />
            </button>
            <Breadcrumb pathname={pathname} />
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-[12px] text-ink-soft lg:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              All systems operational
            </span>
            <NotificationCenter />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1240px] flex-1 px-5 py-7 sm:px-7 sm:py-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-line bg-surface md:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-line px-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <PPLogo size={24} />
                  <span className="text-[14px] font-semibold text-ink">
                    Pinkman Protects
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-[8px] text-ink-faint hover:text-ink"
                >
                  <X size={17} />
                </button>
              </div>
              <nav className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-3 py-5">
                <NavSections onNavigate={() => setMobileMenuOpen(false)} />
              </nav>
              <div className="border-t border-line p-3">
                <UserCard onNavigate={() => setMobileMenuOpen(false)} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AIAssistant />
    </div>
  );
};

/* ------------------------------ Breadcrumb -------------------------------- */

const titleMap: Record<string, string> = {
  admin: "Operations",
  dashboard: "Overview",
  soc: "Live operations",
  campaigns: "Campaigns",
  templates: "Templates",
  analytics: "Analytics",
  employees: "People",
  reports: "Reports",
  audit: "Audit log",
  settings: "Settings",
  learning: "Learning",
  module: "Module",
  notifications: "Notifications",
  profile: "Profile",
};

function Breadcrumb({ pathname }: { pathname: string | null }) {
  const parts = (pathname || "").split("/").filter(Boolean);
  const visible = parts.filter((p) => p !== "admin");
  const crumbs = visible.length ? visible : ["dashboard"];
  return (
    <nav className="flex items-center gap-1.5 text-[13.5px]">
      {crumbs.map((part, i) => {
        const isLast = i === crumbs.length - 1;
        const label =
          titleMap[part] ||
          part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
        return (
          <React.Fragment key={`${part}-${i}`}>
            {i > 0 && <span className="text-ink-faint/60">/</span>}
            <span
              className={cn(
                "truncate",
                isLast ? "font-medium text-ink" : "text-ink-faint"
              )}
            >
              {label}
            </span>
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default AppShell;
