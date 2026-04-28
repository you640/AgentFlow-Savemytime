import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ArrowRight, 
  Mail, 
  ShoppingBag, 
  FileText, 
  Truck, 
  Settings2,
  Plus,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { TemplateLibrary } from './TemplateLibrary';
import { WORKFLOW_TEMPLATES, WorkflowTemplate } from '../../constants/templates';

interface NodeProps {
  icon: any;
  label: string;
  sub: string;
  type: 'trigger' | 'action' | 'logic';
  delay?: number;
}

const Node: React.FC<NodeProps> = ({ icon: Icon, label, sub, type, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="glass-card p-4 min-w-[200px] flex items-center gap-4 relative"
  >
     <div className={cn(
       "p-3 rounded-xl border",
       type === 'trigger' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
       type === 'action' ? "bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan" :
       "bg-brand-purple/10 border-brand-purple/20 text-brand-purple"
     )}>
        <Icon className="w-5 h-5" />
     </div>
     <div>
        <div className="text-xs font-mono uppercase opacity-50 tracking-tighter">{type}</div>
        <div className="text-sm font-bold text-white">{label}</div>
        <div className="text-[10px] text-slate-500">{sub}</div>
     </div>
  </motion.div>
);

export const FlowBuilder: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState<WorkflowTemplate | null>(null);

  if (!activeTemplate) {
    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <header>
          <h2 className="text-3xl font-bold tracking-tight text-white">Action Graph</h2>
          <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-mono font-medium">Build and deploy autonomous logic</p>
        </header>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white/80">Select a Template to Start</h3>
            <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-white/40 font-bold text-xs hover:text-white transition-colors">
              Custom Flow (Empty)
            </button>
          </div>
          <TemplateLibrary onSelect={setActiveTemplate} />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTemplate(null)}
            className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold">{activeTemplate.name}</h2>
            <p className="text-slate-500 text-sm">{activeTemplate.description}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 border border-white/10 rounded-xl text-white/40 font-bold text-sm hover:bg-white/5 transition-colors">
            Test Workflow
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-xl text-white font-bold text-sm shadow-xl shadow-brand-cyan/20 flex items-center gap-2 neon-glow-cyan">
            Deploy Now
          </button>
        </div>
      </div>

      <div className="glass h-[540px] w-full overflow-hidden relative cursor-grab active:cursor-grabbing p-12 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-opacity-10 border border-white/5 rounded-[2rem] shadow-inner shadow-black">
         {/* Simple Visual Flow Representation */}
         <div className="flex items-center gap-12 relative flex-wrap justify-center max-w-4xl">
            {activeTemplate.nodes.map((node, i) => (
              <React.Fragment key={i}>
                <Node 
                  type={node.type} 
                  icon={node.icon} 
                  label={node.label} 
                  sub={node.sub} 
                  delay={i * 0.15}
                />
                
                {i < activeTemplate.nodes.length - 1 && (
                  <div className="w-12 h-[2px] bg-gradient-to-r from-white/10 to-brand-cyan/30 relative">
                     <motion.div 
                        animate={{ x: [0, 48, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-brand-cyan blur-md rounded-full" 
                     />
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Background Grid Accent */}
            <div className="absolute inset-0 z-[-1] opacity-10">
               <svg width="100%" height="100%">
                 <pattern id="pattern-dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                   <circle cx="1.5" cy="1.5" r="1" fill="#fff" />
                 </pattern>
                 <rect width="100%" height="100%" fill="url(#pattern-dots)" />
               </svg>
            </div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-card p-6 flex items-center gap-4 border-l-2 border-l-amber-500/50">
            <Zap className="w-8 h-8 text-amber-500" />
            <div>
               <div className="text-white font-bold tracking-tight">Vysoká Priorita</div>
               <div className="text-[10px] text-white/30 uppercase font-mono tracking-widest mt-1">Spracovanie do 15s</div>
            </div>
         </div>
         <div className="glass-card p-6 flex items-center gap-4 border-l-2 border-l-brand-purple/50">
            <Mail className="w-8 h-8 text-brand-purple" />
            <div>
               <div className="text-white font-bold tracking-tight">Notifications Active</div>
               <div className="text-[10px] text-white/30 uppercase font-mono tracking-widest mt-1">Sent to Admin App</div>
            </div>
         </div>
         <div className="glass-card p-6 flex items-center gap-4 border-l-2 border-l-brand-cyan/50">
            <Settings2 className="w-8 h-8 text-brand-cyan" />
            <div>
               <div className="text-white font-bold tracking-tight">Auto-Recovery</div>
               <div className="text-[10px] text-white/30 uppercase font-mono tracking-widest mt-1">Retry Error Handler</div>
            </div>
         </div>
      </div>
    </div>
  );
};

