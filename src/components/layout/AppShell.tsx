'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PPLogo from './PPLogo';
import AIAssistant from '../ai/AIAssistant';
import NotificationCenter from '../notifications/NotificationCenter';
import { 
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
  ChevronLeft,
  ChevronRight,
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
      <div className={`flex items-center rounded-lg transition-all duration-150 ${
        isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
      } ${
        active 
          ? 'bg-white/[0.04] text-white font-medium border-l-2 border-[#00D26A]' 
          : 'text-zinc-400 hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent'
      }`}>
        <div className={`transition-colors shrink-0 ${active ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
          {icon}
        </div>
        
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              className="text-xs ml-3 font-sans"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Hover Tooltip when Collapsed */}
        {isCollapsed && (
          <div className="absolute left-14 top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-[#121212] border border-[#1F1F1F] text-white text-[10px] font-mono tracking-wider opacity-0 group-hover:opacity-100 pointer-events-none transition duration-100 z-50 whitespace-nowrap shadow-xl">
            {label}
          </div>
        )}

        {active && !isCollapsed && (
          <motion.div 
            layoutId="sidebarActiveIndicator"
            className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#00D26A]"
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
  const [isMobile, setIsMobile] = useState(false);
  const [bypassMobileGate, setBypassMobileGate] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const bypassed = sessionStorage.getItem('pinkman_mobile_bypass') === 'true';
    if (bypassed) {
      setBypassMobileGate(true);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBypass = () => {
    sessionStorage.setItem('pinkman_mobile_bypass', 'true');
    setBypassMobileGate(true);
  };

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
      <main className="flex-1 w-full min-h-screen bg-[#050505] text-white flex flex-col justify-center">
        {children}
      </main>
    );
  }

  if (isSimulationPage) {
    return <main className="flex-1 w-full min-h-screen bg-[#050505] text-white">{children}</main>;
  }

  if (isMobile && !bypassMobileGate) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#A8A8A8] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-12 h-12 rounded-lg border border-white/10 bg-[#121212] flex items-center justify-center text-white text-base font-bold mb-3">
          PP
        </div>
        <h1 className="font-extrabold text-white text-[10px] tracking-widest uppercase font-mono mb-8">PINKMAN PROTECTS</h1>
        
        {/* Laptop Illustration */}
        <div className="w-36 h-24 relative mx-auto mb-8 text-[#A8A8A8]">
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-40">
            <rect x="15" y="5" width="70" height="42" rx="2" fill="#121212" stroke="#1F1F1F" strokeWidth="1.5"/>
            <line x1="25" y1="15" x2="75" y2="15" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="25" y1="22" x2="55" y2="22" stroke="#444444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="25" y1="29" x2="65" y2="29" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5 47H95C95 49 93 51 90 51H10C7 51 5 49 5 47Z" fill="#1F1F1F"/>
            <rect x="44" y="48" width="12" height="1.5" rx="0.5" fill="#444444"/>
          </svg>
        </div>

        <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono mb-2">LAPTOP RECOMMENDED</h2>
        <p className="text-xs text-[#A8A8A8] max-w-xs mx-auto leading-relaxed mb-8">
          For the best experience, please use Pinkman Protects on a laptop or desktop.
        </p>

        <button
          onClick={handleBypass}
          className="px-5 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase font-mono tracking-wider transition"
        >
          Continue Anyway
        </button>
      </div>
    );
  }

  const adminMenu = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
    { href: '/admin/soc', label: 'SOC Command', icon: <Activity size={14} /> },
    { href: '/admin/campaigns', label: 'Campaigns', icon: <Send size={14} /> },
    { href: '/admin/templates', label: 'Template Library', icon: <FileText size={14} /> },
    { href: '/admin/analytics', label: 'Analytics & Logs', icon: <BarChart3 size={14} /> },
    { href: '/admin/employees', label: 'Employee Registry', icon: <Users size={14} /> },
    { href: '/admin/reports', label: 'Reports & Compliance', icon: <FileText size={14} /> },
    { href: '/admin/audit', label: 'Audit Logs', icon: <ClipboardList size={14} /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings size={14} /> },
  ];

  const employeeMenu = [
    { href: '/learning', label: 'Learning Center', icon: <GraduationCap size={14} /> },
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
    <div className="flex min-h-screen w-full relative bg-[#050505]">
      
      {/* Desktop Collapsible Sidebar */}
      <motion.aside 
        animate={{ width: isCollapsed ? 70 : 220 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="hidden md:flex flex-col fixed inset-y-0 left-0 bg-[#0B0B0B] border-r border-[#1F1F1F] z-40 overflow-hidden"
      >
        {/* Brand Logo & Collapse Toggle */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-[#1F1F1F]/40 relative">
          <Link href="/" className="flex items-center overflow-hidden">
            <PPLogo size={20} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="ml-2.5 shrink-0"
                >
                  <h1 className="font-extrabold text-white text-[10px] tracking-wider font-mono">PINKMAN PROTECTS</h1>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          
          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-1/2 -translate-y-1/2 right-2 p-1 rounded border border-[#1F1F1F] bg-[#121212] text-zinc-500 hover:text-white transition"
          >
            {isCollapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6 scrollbar-thin">
          {/* Render Admin Menu if not employee */}
          {userRole !== 'EMPLOYEE' && visibleAdminMenu.length > 0 && (
            <div>
              {!isCollapsed && (
                <span className="px-3 text-[9px] uppercase font-mono font-bold tracking-widest text-zinc-600 block mb-2">Operations</span>
              )}
              <div className="space-y-0.5">
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
              <span className="px-3 text-[9px] uppercase font-mono font-bold tracking-widest text-zinc-600 block mb-2">Awareness</span>
            )}
            <div className="space-y-0.5">
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

        {/* Footer profile log out */}
        <div className="p-2 border-t border-[#1F1F1F]/40">
          <Link href="/auth/logout" className="bg-[#121212] rounded-lg p-2 flex items-center gap-2 hover:bg-[#1C1C1C] border border-[#1F1F1F] transition block">
            <div className="w-7 h-7 rounded bg-[#1F1F1F] border border-white/5 flex items-center justify-center text-white text-[9px] font-bold font-mono shrink-0">
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
                <span className="text-[8px] text-zinc-500 font-mono flex items-center gap-1 mt-0.5">
                  <Building size={8} /> {sessionUser ? sessionUser.orgName.split(' ')[0] : 'Enterprise'}
                </span>
              </motion.div>
            )}
          </Link>
        </div>
      </motion.aside>

      {/* Main viewport area */}
      <motion.div 
        animate={{ paddingLeft: isCollapsed ? 78 : 228 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="flex-1 flex flex-col min-h-screen"
      >
        {/* Main top header */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-[#1F1F1F]/20 backdrop-blur-md sticky top-0 z-30 bg-[#050505]/80">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 border border-[#1F1F1F] bg-[#0A0A0A]"
            >
              <Menu size={14} />
            </button>

            {/* Path indicator */}
            <div className="hidden sm:flex items-center gap-1 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              <span>PINKMAN_SYS</span>
              <span>::</span>
              <span className="text-[#00D26A] font-bold">
                {pathname?.split('/').filter(Boolean).join('_') || 'ROOT'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status indicators */}
            <div className="hidden lg:flex items-center gap-3.5 border border-[#1F1F1F] rounded-lg px-3 py-1 bg-[#0B0B0B] text-[9px] font-mono text-zinc-500">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D26A]" />
                <span>Simulation Monitor:</span>
                <span className="text-white font-bold">ACTIVE</span>
              </div>
              <div className="h-3 w-px bg-[#1F1F1F]" />
              <div className="flex items-center gap-1.5">
                <span>Role:</span>
                <span className="text-white font-bold">{userRole}</span>
              </div>
            </div>

            {/* Notification Bell */}
            <NotificationCenter />

            {/* Simulation tester link */}
            <Link 
              href="/simulation/landing/test"
              className="text-[9px] font-mono flex items-center gap-1 bg-[#121212] border border-[#1F1F1F] hover:border-zinc-700 text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg transition"
            >
              <Eye size={10} /> Test Page
            </Link>
          </div>
        </header>

        {/* Content canvas */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto relative z-10">
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
              className="fixed inset-y-0 left-0 w-60 bg-[#0B0B0B] border-r border-[#1F1F1F] p-5 z-50 md:hidden flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PPLogo size={18} />
                    <h1 className="font-extrabold text-white text-xs tracking-wider font-mono">PINKMAN PROTECTS</h1>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-zinc-400 hover:text-white p-1"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Admin visible menu */}
                  {userRole !== 'EMPLOYEE' && visibleAdminMenu.length > 0 && (
                    <div>
                      <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-zinc-600 block mb-1">Operations</span>
                      <div className="space-y-0.5">
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
                    <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-zinc-600 block mb-1">Awareness</span>
                    <div className="space-y-0.5">
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
              <div className="pt-4 border-t border-[#1F1F1F]/40">
                <Link 
                  href="/auth/logout" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#121212] rounded-lg p-2 flex items-center gap-2.5 hover:bg-[#1C1C1C] border border-[#1F1F1F] transition block"
                >
                  <div className="w-7 h-7 rounded bg-[#1F1F1F] flex items-center justify-center text-white text-[9px] font-bold font-mono">
                    {sessionUser ? getInitials(sessionUser.name) : 'US'}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-white">
                      {sessionUser ? sessionUser.name : 'SecOps Node'}
                    </p>
                    <span className="text-[8px] text-[#00D26A] font-mono">
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
