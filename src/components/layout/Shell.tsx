import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Mail, 
  Workflow, 
  Settings, 
  LineChart, 
  Blocks,
  ChevronLeft,
  ChevronRight,
  Bot,
  Circle,
  Bell,
  BellOff,
  Plus,
  Palette
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { requestNotificationPermission, simulateIncomingEvent } from '../../services/notificationService';
import { GlobalSearch } from './GlobalSearch';

const navItems = [
  { path: '/', label: 'Prehľad', icon: LayoutDashboard },
  { path: '/comms', label: 'Comms', icon: Plus },
  { path: '/inbox', label: 'Inbox', icon: Mail },
  { path: '/workflows', label: 'Procesy', icon: Workflow },
  { path: '/analytics', label: 'Analytika', icon: LineChart },
  { path: '/integrations', label: 'Integrácie', icon: Blocks },
  { path: '/components', label: 'Dizajn', icon: Palette },
];

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isSidebarCollapsed, toggleSidebar } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const activeLabel = navItems.find(item => item.path === location.pathname)?.label || 'Systém';

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationPermission('granted');
      simulateIncomingEvent('task');
    } else {
      setNotificationPermission('denied');
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050507] overflow-hidden antialiased font-sans">
      {/* Desktop Sidebar Navigation */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarCollapsed ? 80 : 260,
          x: 0 
        }}
        className="hidden md:flex h-full bg-[#0a0a0f] border-r border-white/5 flex-col items-center z-20 shadow-2xl shadow-black"
      >
        <div className="py-8 px-6 flex items-center gap-3 w-full justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f5ff] to-[#a855f7] flex items-center justify-center neon-glow-cyan shrink-0">
             <Bot className="w-5 h-5 text-white" />
          </div>
          {!isSidebarCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-xl tracking-tight text-white"
            >
              AutoOps AI
            </motion.span>
          )}
        </div>

        <nav className="flex-1 w-full px-4 space-y-4 mt-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group overflow-hidden whitespace-nowrap",
                isActive 
                  ? "text-[#00f5ff] bg-[#00f5ff]/5 border border-[#00f5ff]/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-6 h-6 shrink-0" />
              {!isSidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto mb-8 w-full px-4">
           {!isSidebarCollapsed && (
             <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-4">
                <div className="text-[10px] font-mono text-white/40 uppercase mb-2">Prepojený E-shop</div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <span className="text-xs font-bold">E-shop Pro</span>
                </div>
             </div>
           )}
          <button 
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 rounded-xl text-white/40 hover:text-[#00f5ff] hover:bg-[#00f5ff]/5 transition-all text-sm font-bold uppercase tracking-widest gap-2"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-6 h-6" /> : (
              <>
                <ChevronLeft className="w-6 h-6" />
                <span>Skryť menu</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0a0a0f]/90 backdrop-blur-2xl border-t border-white/5 z-50 flex items-center justify-around px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
              isActive ? "text-[#00f5ff]" : "text-white/40"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col pb-24 md:pb-0">
        {/* Header Strip */}
        <header className="px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                {activeLabel} 
                <span className="text-[#00f5ff] text-[10px] font-mono border border-[#00f5ff]/30 px-2 py-0.5 rounded uppercase tracking-widest leading-none">
                  AI Active
                </span>
              </h1>
              <p className="text-white/40 text-[10px] md:text-[11px] mt-1 uppercase tracking-widest font-medium hidden sm:block">
                Autonómny operačný agent • 2026
              </p>
            </div>
            {/* Logo for mobile only in header */}
            <div className="md:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f5ff] to-[#a855f7] flex items-center justify-center neon-glow-cyan shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
             <div className="flex-1 md:flex-none">
               <GlobalSearch />
             </div>
             
             <div className="flex items-center gap-2">
               <button 
                 onClick={handleRequestNotifications}
                 className={cn(
                   "p-3 rounded-xl border transition-all",
                   notificationPermission === 'granted' 
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
                    : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                 )}
               >
                 {notificationPermission === 'granted' ? <Bell className="w-5 h-5 animate-bounce" /> : <BellOff className="w-5 h-5" />}
               </button>
               
               <div className="hidden lg:flex items-center gap-3 bg-white/[0.03] border border-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Plne Autonómny</span>
               </div>
             </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex-1">
          {children}
        </div>

        {/* Floating Agent Orb Overlay Decor */}
        <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40">
          <AgentOrb />
        </div>
        
        {/* Background Gradients */}
        <div className="fixed top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#a855f7]/5 rounded-full blur-[100px] md:blur-[120px] pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] left-[10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#00f5ff]/5 rounded-full blur-[100px] md:blur-[120px] pointer-events-none z-0"></div>
      </main>
    </div>
  );
};

const AgentOrb = () => {
  const { agentStatus } = useStore();
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
      <div className="relative w-16 h-16 rounded-full bg-bg-dark border border-brand-cyan/30 flex items-center justify-center shadow-2xl overflow-hidden shadow-brand-cyan/20">
         {/* Animated inner rings */}
         <motion.div 
            animate={{ 
              rotate: 360,
              scale: agentStatus.state === 'processing' ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-brand-cyan/20 rounded-full"
         />
         <div className="absolute inset-2 border border-brand-purple/20 rounded-full animate-pulse" />
         
         <Bot className={cn(
           "w-7 h-7 transition-colors duration-500",
           agentStatus.state === 'idle' ? "text-brand-cyan" : "text-white"
         )} />
      </div>
      
      <AnimatePresence>
        {agentStatus.state !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute bottom-20 right-0 w-64 glass-card p-4 text-sm"
          >
            <p className="text-brand-cyan font-mono text-xs uppercase mb-1">Aktívna Operácia</p>
            <p className="text-white font-medium">{agentStatus.task || 'Spracovávam dátové uzly...'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
