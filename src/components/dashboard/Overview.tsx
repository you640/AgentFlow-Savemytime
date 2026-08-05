import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Clock,
  Zap,
  Package,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Plane,
  Flame
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { useStore, HOURS_PER_EARNED_DAY } from '../../store/useStore';
import { cn } from '../../lib/utils';


const mockData = [
  { name: 'Mon', value: 12 },
  { name: 'Tue', value: 19 },
  { name: 'Wed', value: 15 },
  { name: 'Thu', value: 22 },
  { name: 'Fri', value: 30 },
  { name: 'Sat', value: 24 },
  { name: 'Sun', value: 18 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const Overview: React.FC = () => {
  const { timeSavedCount, autopilot, streak } = useStore();
  const hasEarnedDay = autopilot.earnedDays >= 1;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Autopilot CTA banner */}
      <motion.div variants={item}>
        <Link
          to="/autopilot"
          className="block glass-card p-6 relative overflow-hidden group border-l-4 border-l-[#00f5ff] hover:border-l-[#a855f7] transition-colors"
        >
          <div className="absolute -right-6 -top-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Plane className="w-32 h-32 text-[#00f5ff]" />
          </div>
          <div className="flex items-center justify-between gap-4 relative">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00f5ff]">Autopilot</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {streak.current} dní séria
                </span>
                {hasEarnedDay && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                    {autopilot.earnedDays} deň voľna pripravený
                  </span>
                )}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                {hasEarnedDay
                  ? 'Agent ti zarobil deň voľna. Aktivuj ho →'
                  : `Ešte ${Math.round((HOURS_PER_EARNED_DAY - autopilot.hoursBanked) * 10) / 10} h a máš deň voľna`}
              </h3>
              <p className="text-white/40 text-xs mt-1">
                Nechaj agenta riadiť celý e-shop a venuj čas tomu, na čom naozaj záleží.
              </p>
            </div>
            <ArrowUpRight className="w-6 h-6 text-white/30 group-hover:text-[#00f5ff] transition-colors shrink-0" />
          </div>
        </Link>
      </motion.div>

      {/* Bento Grid Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-fr">
        {/* Large Time Saved Card */}
        <motion.div 
          variants={item}
          whileHover={{ y: -4, scale: 1.01 }}
          className="md:col-span-12 lg:col-span-4 glass-card p-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="w-32 h-32 text-[#00f5ff]" />
          </div>
          <div className="flex flex-col h-full">
            <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Dnes ušetrený čas</span>
            <div className="flex items-baseline gap-3 mt-auto">
              <span className="text-4xl md:text-5xl font-bold text-white neon-text-cyan">{timeSavedCount}</span>
              <span className="text-[#00f5ff] font-mono font-bold text-xs md:text-sm tracking-widest uppercase">Hodín</span>
            </div>
            <div className="mt-8 w-full h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "70%" }}
                 transition={{ delay: 0.5, duration: 1.5 }}
                 className="h-full bg-[#00f5ff] neon-glow-cyan" 
               />
            </div>
          </div>
        </motion.div>

        {/* Tickets Resolved Card */}
        <motion.div 
          variants={item}
          whileHover={{ y: -4, scale: 1.01 }}
          className="md:col-span-6 lg:col-span-4 glass-card p-6"
        >
          <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Vyriešené požiadavky</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl md:text-4xl font-bold text-white tracking-tighter">142</span>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono ml-auto">
              <TrendingUp className="w-3 h-3" />
              <span>+12%</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
             {['Vyriešené AI', 'Vysoká utilita', 'Auto-návrh'].map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-white/5 rounded-md text-[9px] font-mono uppercase text-white/40 tracking-wider">
                  {tag}
                </span>
             ))}
          </div>
        </motion.div>

        {/* Revenue Guarded Card */}
        <motion.div 
          variants={item}
          whileHover={{ y: -4, scale: 1.01 }}
          className="md:col-span-6 lg:col-span-4 glass-card p-6 border-l-4 border-l-[#a855f7]"
        >
          <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Chránený obrat</span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl md:text-4xl font-bold text-white tracking-tighter">€1,840</span>
          </div>
          <div className="mt-6 p-3 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/20">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#a855f7]" />
                <span className="text-[10px] font-bold text-[#a855f7] uppercase tracking-widest">Auto-Upsell Aktívny</span>
             </div>
          </div>
        </motion.div>

        {/* Main Analytics Hub */}
        <motion.div variants={item} className="md:col-span-12 lg:col-span-8 glass-card p-4 md:p-8 min-w-0">
          <div className="flex justify-between items-center mb-6 md:mb-10 gap-4">
            <div className="min-w-0">
               <h3 className="text-lg md:text-xl font-bold tracking-tight">Výkon systému</h3>
               <p className="text-white/30 text-[10px] md:text-xs mt-1 uppercase tracking-widest font-mono">Metriky efektivity v reálnom čase</p>
            </div>
            <div className="hidden sm:flex gap-4 shrink-0">
              <div className="flex items-center gap-2 group cursor-pointer">
                 <div className="w-2 h-2 rounded-full bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]" />
                 <span className="text-[10px] font-mono uppercase tracking-widest text-[#00f5ff]">Hodiny optimalizácie</span>
              </div>
            </div>
          </div>
          <div className="h-[280px] md:h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f5ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="10 10" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px' }}
                  itemStyle={{ color: '#00f5ff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00f5ff" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity Sidebar Bento */}
        <motion.div variants={item} className="md:col-span-12 lg:col-span-4 glass-card p-6 md:p-8 flex flex-col">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
            <Zap className="w-5 h-5 text-[#a855f7]" />
            Denník live udalostí
          </h3>
          <div className="space-y-8 relative flex-1 before:absolute before:left-[1px] before:top-2 before:bottom-2 before:w-[px] before:bg-white/5">
            {[ 
              { title: "Spracovanie faktúr", subtitle: "SuperFaktura +3", time: "2 min", icon: ShieldCheck, color: "text-emerald-400" },
              { title: "Logistika: Packeta", subtitle: "Zvoz objednaný", time: "12 min", icon: Package, color: "text-blue-400" },
              { title: "Support Ticket", subtitle: "AI Návrh: Odoslaný", time: "1 hod", icon: MessageSquare, color: "text-[#a855f7]" },
              { title: "E-shop Sync", subtitle: "Sklad aktualizovaný", time: "2 hod", icon: Zap, color: "text-[#00f5ff]" },
            ].map((item, i) => (
              <div key={i} className="pl-6 relative">
                <div className={cn("absolute left-[-4px] top-1.5 w-2 h-2 rounded-full", item.color.replace('text', 'bg'))} />
                <div className="flex flex-col">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs text-white font-bold tracking-tight">{item.title}</span>
                    <span className="text-[10px] text-white/20 font-mono italic">{item.time}</span>
                  </div>
                  <span className="text-[11px] text-[#e2e8f0]/40 mt-0.5">{item.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-2">
            <button className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-white/40 hover:text-white hover:bg-brand-cyan/5 hover:border-brand-cyan/20 transition-all flex items-center justify-center gap-2"
              onClick={() => {
                const types = ['task', 'error', 'message'] as const;
                const type = types[Math.floor(Math.random() * types.length)];
                import('../../services/notificationService').then(m => m.simulateIncomingEvent(type));
              }}
            >
              <Zap className="w-3 h-3 text-brand-cyan" />
              Simulovať AI udalosť
            </button>
            <button className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-white/40 hover:text-white transition-colors">
              Zobraziť históriu
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
