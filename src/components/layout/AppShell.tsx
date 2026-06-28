'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PPLogo from './PPLogo';
import AIAssistant from '../ai/AIAssistant';
import NotificationCenter from '../notifications/NotificationCenter';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Activity,
  Send, 
  FileText, 
  BarChart3, 
  Users, 
  GraduationCap, 
  Menu, 
  X, 
  Eye, 
  CheckCircle2, 
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Building,
  Settings,
  ClipboardList
} from 'lucide-react';

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, label, icon, active, isCollapsed }) => {
  return (
    <Link href={href} className="block group relative">
      <div className={`flex items-center rounded-xl transition-all duration-200 ${
        isCollapsed ? 'justify-center p-3' : 'px-4 py-3'
      } ${
        active 
          ? 'bg-gradient-to-r from-brand-blue/20 to-brand-cyan/10 border-l-2 border-brand-blue text-white font-medium shadow-[0_0_15px_rgba(229,9,20,0.05)]' 
          : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
      }`}>
        <div className={`transition-colors shrink-0 ${active ? 'text-brand-cyan' : 'text-gray-400 group-hover:text-brand-cyan'}`}>
          {icon}
        </div>
        
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xs ml-3 truncate"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Hover Tooltip when Collapsed */}
        {isCollapsed && (
          <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-cyber-border text-white text-[10px] uppercase font-mono tracking-wider opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150 z-50 whitespace-nowrap shadow-xl">
            {label}
          </div>
        )}

        {active && !isCollapsed && (
          <motion.div 
            layoutId="sidebarActiveGlow"
            className="absolute right-4 w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_#E50914]"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </div>
    </Link>
  );
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);

  // Check if it is a simulation intercept page or an auth centered route
  const isSimulationPage = pathname?.includes('/simulation/landing/');
  const isAuthPage = pathname?.startsWith('/auth');

  // Fetch session details on mount
  useEffect(() => {
    if (!isSimulationPage && !isAuthPage) {
      fetch('/api/auth/session')
        .then(res => res.json())
        .then(data => {
          if (data.authenticated && data.user) {
            setSessionUser(data.user);
          }
        })
        .catch(err => console.error(err));
    }
  }, [pathname, isSimulationPage, isAuthPage]);

  // Inactivity timeout handler
  useEffect(() => {
    if (isSimulationPage || isAuthPage || !sessionUser) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // Set to 15 minutes = 900,000ms
      timeoutId = setTimeout(async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
          setSessionUser(null);
          router.push('/auth/session-expired');
        } catch (e) {
          console.error(e);
        }
      }, 15 * 60 * 1000);
    };

    // Listen to user activity events
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    // Initialize timer
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [sessionUser, isSimulationPage, isAuthPage, router]);

  // If auth page, render centered full-screen content without standard sidebar wrap
  if (isAuthPage) {
    return (
      <main className="flex-1 w-full min-h-screen bg-cyber-dark text-foreground flex flex-col justify-center">
        {children}
      </main>
    );
  }

  if (isSimulationPage) {
    return <main className="flex-1 w-full min-h-screen bg-white text-gray-900">{children}</main>;
  }

  const adminMenu = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { href: '/admin/soc', label: 'SOC Command', icon: <Activity size={16} /> },
    { href: '/admin/campaigns', label: 'Campaigns', icon: <Send size={16} /> },
    { href: '/admin/templates', label: 'Template Library', icon: <FileText size={16} /> },
    { href: '/admin/analytics', label: 'Analytics & Logs', icon: <BarChart3 size={16} /> },
    { href: '/admin/employees', label: 'Employee Registry', icon: <Users size={16} /> },
    { href: '/admin/reports', label: 'Reports & Compliance', icon: <FileText size={16} /> },
    { href: '/admin/audit', label: 'Audit Logs', icon: <ClipboardList size={16} /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings size={16} /> },
  ];

  const employeeMenu = [
    { href: '/learning', label: 'Learning Center', icon: <GraduationCap size={16} /> },
  ];

  // Role-based menu filtering
  const userRole = sessionUser?.role || 'EMPLOYEE';
  const visibleAdminMenu = adminMenu.filter(item => {
    if (userRole === 'SUPERADMIN') return true;
    if (userRole === 'SECURITY_ADMIN') {
      return item.href !== '/admin/employees';
    }
    if (userRole === 'HR_MANAGER') {
      return item.href !== '/admin/campaigns' && item.href !== '/admin/templates';
    }
    if (userRole === 'DEPT_MANAGER') {
      return item.href !== '/admin/campaigns' && item.href !== '/admin/templates' && item.href !== '/admin/employees';
    }
    return false; // Employees have no access to admin links
  });

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'US';
  };

  return (
    <div className="flex min-h-screen w-full relative bg-cyber-dark">
      
      {/* Desktop Collapsible Sidebar */}
      <motion.aside 
        animate={{ width: isCollapsed ? 76 : 240 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="hidden md:flex flex-col fixed inset-y-0 left-0 glass-panel border-r border-cyber-border m-4 rounded-3xl z-40 overflow-hidden"
      >
        {/* Brand Logo & Collapse Toggle */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-cyber-border/40 relative">
          <Link href="/" className="flex items-center overflow-hidden">
            <PPLogo size={22} className="animate-pulse" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 shrink-0"
                >
                  <h1 className="font-extrabold text-white text-xs tracking-wider">PINKMAN PROTECTS</h1>
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest font-mono block">Consent Check</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          
          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 rounded-lg border border-cyber-border bg-black/40 text-gray-500 hover:text-white transition"
          >
            {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-7 scrollbar-thin">
          {/* Render Admin Menu if not employee */}
          {userRole !== 'EMPLOYEE' && visibleAdminMenu.length > 0 && (
            <div>
              {!isCollapsed && (
                <span className="px-3 text-[9px] uppercase font-mono font-bold tracking-widest text-gray-500 block mb-2">Operations</span>
              )}
              <div className="space-y-1">
                {visibleAdminMenu.map((item) => (
                  <SidebarItem 
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={pathname === item.href}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Render Employee Menu */}
          <div>
            {!isCollapsed && (
              <span className="px-3 text-[9px] uppercase font-mono font-bold tracking-widest text-gray-500 block mb-2">Awareness</span>
            )}
            <div className="space-y-1">
              {employeeMenu.map((item) => (
                <SidebarItem 
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={pathname === item.href || pathname?.startsWith('/learning/module')}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer client card / Link to Profile page */}
        <div className="p-3 border-t border-cyber-border/40">
          <Link href="/auth/logout" className="bg-white/3 rounded-xl p-2 flex items-center gap-2.5 overflow-hidden hover:bg-white/5 border border-transparent hover:border-white/5 transition block">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan/25 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan text-[10px] font-bold font-mono shrink-0">
              {sessionUser ? getInitials(sessionUser.name) : 'US'}
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="truncate flex-1 text-left"
              >
                <p className="text-[10px] font-bold text-white truncate leading-tight">
                  {sessionUser ? sessionUser.name : 'SecOps Node'}
                </p>
                <span className="text-[8px] text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                  <Building size={8} /> {sessionUser ? sessionUser.orgName.split(' ')[0] : 'Enterprise'}
                </span>
              </motion.div>
            )}
          </Link>
        </div>
      </motion.aside>

      {/* Main viewport area */}
      <motion.div 
        animate={{ paddingLeft: isCollapsed ? 92 : 256 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="flex-1 flex flex-col min-h-screen"
      >
        {/* Main top header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-cyber-border/20 backdrop-blur-md sticky top-0 z-30 bg-cyber-dark/40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 border border-cyber-border bg-black/40"
            >
              <Menu size={16} />
            </button>

            {/* Path indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
              <span className="text-gray-500">PINKMAN_SYS</span>
              <span>::</span>
              <span className="text-brand-blue font-bold">
                {pathname?.split('/').filter(Boolean).join('_') || 'ROOT'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Status indices */}
            <div className="hidden lg:flex items-center gap-4 border border-cyber-border rounded-xl px-4 py-1.5 bg-black/50 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-gray-500">Simulation Monitor:</span>
                <span className="text-white font-bold">ON</span>
              </div>
              <div className="h-3 w-px bg-cyber-border" />
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">Risk Matrix:</span>
                <span className={`text-[10px] font-bold ${userRole === 'SUPERADMIN' ? 'text-brand-cyan' : 'text-brand-purple'}`}>
                  {userRole}
                </span>
              </div>
            </div>

            {/* Notification Bell & Drawer */}
            <NotificationCenter />

            {/* Simulation tester link */}
            <Link 
              href="/simulation/landing/test"
              className="text-[10px] font-mono flex items-center gap-1 bg-white/5 border border-cyber-border hover:border-brand-blue/30 text-gray-300 hover:text-white px-3 py-1.5 rounded-xl transition"
            >
              <Eye size={10} /> Test Intercept Page
            </Link>
          </div>
        </header>

        {/* Content canvas */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto relative z-10">
          {children}
        </main>
      </motion.div>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />
            
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-cyber-dark border-r border-cyber-border p-6 z-50 md:hidden flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PPLogo size={20} className="mr-1" />
                    <h1 className="font-extrabold text-white text-sm tracking-wider">PINKMAN PROTECTS</h1>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Admin visible menu */}
                  {userRole !== 'EMPLOYEE' && visibleAdminMenu.length > 0 && (
                    <div>
                      <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-gray-500 block mb-2">Operations</span>
                      <div className="space-y-1">
                        {visibleAdminMenu.map((item) => (
                          <div key={item.href} onClick={() => setMobileMenuOpen(false)}>
                            <SidebarItem 
                              href={item.href}
                              label={item.label}
                              icon={item.icon}
                              active={pathname === item.href}
                              isCollapsed={false}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Employee Menu */}
                  <div>
                    <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-gray-500 block mb-2">Awareness</span>
                    <div className="space-y-1">
                      {employeeMenu.map((item) => (
                        <div key={item.href} onClick={() => setMobileMenuOpen(false)}>
                          <SidebarItem 
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            active={pathname === item.href || pathname?.startsWith('/learning/module')}
                            isCollapsed={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile bottom profile card */}
              <div className="pt-4 border-t border-cyber-border/40">
                <Link 
                  href="/auth/logout" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-white/3 rounded-xl p-2.5 flex items-center gap-3 hover:bg-white/5 border border-white/5 transition block"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan text-xs font-bold font-mono">
                    {sessionUser ? getInitials(sessionUser.name) : 'US'}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {sessionUser ? sessionUser.name : 'SecOps Node'}
                    </p>
                    <span className="text-[10px] text-brand-cyan font-mono">
                      {sessionUser ? sessionUser.orgName : 'Pinkman Protects'}
                    </span>
                  </div>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AIAssistant />
    </div>
  );
};
export default AppShell;
