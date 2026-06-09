import React from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  ShoppingBag, 
  Instagram, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { MOCK_INBOX_ITEMS } from '../../constants/inbox';

const sourceIcons = {
  gmail: Mail,
  shopify: ShoppingBag,
  instagram: Instagram,
  support: MessageCircle,
};

const categoryStyles = {
  high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  'auto-resolved': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export const UnifiedInbox: React.FC = () => {
  return (
    <div className="glass-card overflow-hidden animate-in fade-in slide-in-from-right duration-700">
      <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0f]">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-3">
            Priority Inbox
            <span className="text-[10px] font-mono bg-[#a855f7]/20 text-[#a855f7] px-3 py-1 rounded-full uppercase tracking-tighter">
              3 New Responses
            </span>
          </h2>
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-mono mt-1">Cross-platform Customer Intelligence</p>
        </div>
        <button className="px-5 py-2 rounded-xl bg-[#00f5ff]/10 text-[#00f5ff] text-xs font-bold hover:bg-[#00f5ff]/20 transition-all flex items-center gap-2 border border-[#00f5ff]/20 neon-glow-cyan">
           <Sparkles className="w-4 h-4" />
           Smart Sort
        </button>
      </div>
      
      <div className="divide-y divide-white/5">
        {MOCK_INBOX_ITEMS.map((item) => {
          const Icon = sourceIcons[item.source];
          return (
            <motion.div 
              key={item.id}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.01)' }}
              className="p-6 flex gap-6 cursor-pointer group transition-colors"
            >
              <div className="shrink-0">
                 <div className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center relative bg-gradient-to-br from-white/5 to-transparent">
                    <Icon className="w-6 h-6 text-white/30 group-hover:text-white transition-colors" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-[#050507] border border-white/10 flex items-center justify-center p-1 overflow-hidden">
                       <div className="w-full h-full bg-gradient-to-br from-[#00f5ff] to-[#a855f7] opacity-60" />
                    </div>
                 </div>
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                 <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-sm text-white tracking-tight">{item.sender}</span>
                    <span className="text-[10px] text-white/20 font-mono italic tracking-tighter">{item.time} ago</span>
                 </div>
                 <div className="text-sm font-semibold text-white/80 line-clamp-1 truncate">{item.title}</div>
                 <div className="text-xs text-white/30 line-clamp-1 italic mt-1 font-medium italic">"{item.preview}"</div>
              </div>

              <div className="flex flex-col items-end justify-center gap-3 shrink-0">
                 <span className={cn(
                   "text-[9px] uppercase tracking-[0.1em] font-bold px-3 py-1 rounded-lg border", 
                   categoryStyles[item.category]
                 )}>
                    {item.category === 'auto-resolved' ? 'System Cleared' : item.category}
                 </span>
                 {item.category === 'auto-resolved' && (
                    <motion.div 
                      key="resolved"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider"
                    >
                       <CheckCircle2 className="w-3.5 h-3.5" />
                       <span>AI Handled</span>
                    </motion.div>
                 )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="p-4 bg-white/[0.01] text-center border-t border-white/5">
         <button className="text-[9px] font-mono text-white/20 hover:text-white transition-colors uppercase tracking-widest">
           Archive Cleared Conversations
         </button>
      </div>
    </div>
  );
};
