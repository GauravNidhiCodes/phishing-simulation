'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  LayoutDashboard, 
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
  User
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
          ? 'bg-gradient-to-r from-brand-blue/20 to-brand-cyan/10 border-l-2 border-brand-blue text-white font-medium shadow-[0_0_15px_rgba(37,99,235,0.05)]' 
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
            className="absolute right-4 w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_#06b6d4]"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </div>
    </Link>
  );
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If path is simulation landing page, do not render layout shell (needs full-screen realistic mock browser environment)
  const isSimulationPage = pathname?.includes('/simulation/landing/');

  if (isSimulationPage) {
    return <main className="flex-1 w-full min-h-screen bg-white text-gray-900">{children}</main>;
  }

  const adminMenu = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { href: '/admin/campaigns', label: 'Campaigns', icon: <Send size={16} /> },
    { href: '/admin/templates', label: 'Template Library', icon: <FileText size={16} /> },
    { href: '/admin/analytics', label: 'Analytics & Logs', icon: <BarChart3 size={16} /> },
    { href: '/admin/employees', label: 'Employee Registry', icon: <Users size={16} /> },
  ];

  const employeeMenu = [
    { href: '/learning', label: 'Learning Center', icon: <GraduationCap size={16} /> },
  ];

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
            <ShieldAlert className="text-brand-cyan shrink-0 animate-pulse" size={22} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 shrink-0"
                >
                  <h1 className="font-extrabold text-white text-xs tracking-wider">AEGIS GUARD</h1>
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
          <div>
            {!isCollapsed && (
              <span className="px-3 text-[9px] uppercase font-mono font-bold tracking-widest text-gray-500 block mb-2">Operations</span>
            )}
            <div className="space-y-1">
              {adminMenu.map((item) => (
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

        {/* Footer client card */}
        <div className="p-3 border-t border-cyber-border/40">
          <div className="bg-white/3 rounded-xl p-2.5 flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan text-[10px] font-bold font-mono shrink-0">
              AC
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="truncate"
              >
                <p className="text-[10px] font-bold text-white truncate">Acme Corp</p>
                <span className="text-[8px] text-emerald-400 font-mono flex items-center">
                  <CheckCircle2 size={8} className="mr-0.5" /> Verified
                </span>
              </motion.div>
            )}
          </div>
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
              <span className="text-gray-500">AEGIS_SYS</span>
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
                <span className="text-brand-cyan font-bold">SECURE</span>
              </div>
            </div>

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
                    <ShieldAlert className="text-brand-cyan mr-1" size={20} />
                    <h1 className="font-extrabold text-white text-sm tracking-wider">AEGIS GUARD</h1>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-gray-500 block mb-2">Operations</span>
                    <div className="space-y-1">
                      {adminMenu.map((item) => (
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

              <div className="pt-4 border-t border-cyber-border/40">
                <div className="bg-white/3 rounded-xl p-2.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan text-xs font-bold font-mono">
                    AC
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Acme Corp</p>
                    <span className="text-[10px] text-emerald-400 font-mono">Tenant Mode</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
export default AppShell;
