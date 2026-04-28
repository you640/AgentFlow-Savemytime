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
  BellOff
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { requestNotificationPermission, simulateIncomingEvent } from '../../services/notificationService';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/inbox', label: 'Inbox', icon: Mail },
  { path: '/workflows', label: 'Workflows', icon: Workflow },
  { path: '/analytics', label: 'Analytics', icon: LineChart },
  { path: '/integrations', label: 'Integrations', icon: Blocks },
];

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSidebarCollapsed, toggleSidebar } = useStore();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationPermission('granted');
      simulateIncomingEvent('task'); // Test notification
    } else {
      setNotificationPermission('denied');
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050507] overflow-hidden antialiased font-sans">
      {/* Sidebar Navigation */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        className="h-full bg-[#0a0a0f] border-r border-white/5 flex flex-col items-center z-20 shadow-2xl shadow-black"
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
             <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-4 mb-4">
                <div className="text-[10px] font-mono text-white/40 uppercase mb-2">Connected Store</div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <span className="text-xs font-bold">Shopify Pro</span>
                </div>
             </div>
           )}
          <button 
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 rounded-xl text-white/40 hover:text-[#00f5ff] hover:bg-[#00f5ff]/5 transition-all"
          >
            {isSidebarCollapsed ? <Plus className="w-6 h-6 rotate-45" /> : <ChevronLeft className="w-6 h-6" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto scrollbar-hide flex flex-col">
        {/* Header Strip */}
        <header className="px-8 py-6 flex justify-between items-center border-b border-white/5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              Dashboard 
              <span className="text-[#00f5ff] text-[10px] font-mono border border-[#00f5ff]/30 px-2 py-0.5 rounded uppercase tracking-widest leading-none">
                Active System
              </span>
            </h1>
            <p className="text-white/40 text-[11px] mt-1 uppercase tracking-widest font-medium">
              Autonomous Operations Agent • Q2 2026 Edition
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={handleRequestNotifications}
               className={cn(
                 "p-2 rounded-xl border transition-all",
                 notificationPermission === 'granted' 
                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" 
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white"
               )}
               title={notificationPermission === 'granted' ? "Notifications Enabled" : "Enable Notifications"}
             >
               {notificationPermission === 'granted' ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
             </button>
             <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Fully Autonomous</span>
             </div>
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="px-5 py-2 bg-[#a855f7] text-white rounded-xl text-xs font-bold neon-glow-purple tracking-widest"
             >
               DEPLOY WORKFLOW
             </motion.button>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full flex-1">
          {children}
        </div>

        {/* Floating Agent Orb Overlay Decor */}
        <div className="fixed bottom-8 right-8 z-50">
          <AgentOrb />
        </div>
        
        {/* Background Gradients */}
        <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#a855f7]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-[#00f5ff]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
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
            <p className="text-brand-cyan font-mono text-xs uppercase mb-1">Active Operation</p>
            <p className="text-white font-medium">{agentStatus.task || 'Processing data nodes...'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
