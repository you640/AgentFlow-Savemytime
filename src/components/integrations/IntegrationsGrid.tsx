import React from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  Truck, 
  CreditCard, 
  Mail, 
  ShoppingBag,
  Plus,
  Blocks, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { cn } from '../../lib/utils';


const integrations = [
  { id: '1', name: 'Shopify', desc: 'Sklad a objednávky', status: 'connected', type: 'ecommerce' },
  { id: '2', name: 'WooCommerce', desc: 'Sync produktov', status: 'disconnected', type: 'ecommerce' },
  { id: '3', name: 'SuperFaktura', desc: 'Auto-fakturácia (SK)', status: 'connected', type: 'finance' },
  { id: '4', name: 'Packeta', desc: 'Tracking & Distribúcia', status: 'connected', type: 'logistics' },
  { id: '5', name: 'iDoklad', desc: 'Účtovný systém (CZ)', status: 'disconnected', type: 'finance' },
  { id: '6', name: 'GLS', desc: 'Kuriérska služba', status: 'disconnected', type: 'logistics' },
  { id: '7', name: 'Gmail', desc: 'Zákaznícky servis', status: 'connected', type: 'comms' },
  { id: '8', name: 'Instagram DM', desc: 'Podpora na sociálnych sieťach', status: 'connected', type: 'comms' },
];

export const IntegrationsGrid: React.FC = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Integrations Hub</h2>
          <p className="text-white/30 text-xs mt-1 uppercase tracking-widest font-mono">Connected System Nodes</p>
        </div>
        <div className="hidden md:flex gap-4">
           <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-full flex items-center gap-3">
              <Globe className="w-4 h-4 text-[#00f5ff]" />
              <span className="text-[10px] uppercase font-mono tracking-tighter text-[#00f5ff] font-bold">Status: All Nodes Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {integrations.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ y: -6, scale: 1.02 }}
            className={cn(
              "glass-card p-8 group relative overflow-hidden",
              item.status === 'connected' ? "border-t-2 border-t-emerald-500" : ""
            )}
          >
            {/* Visual background decor for connected cards */}
            {item.status === 'connected' && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl -z-10 group-hover:bg-emerald-500/10 transition-colors" />
            )}

            <div className="flex justify-between items-start mb-8">
               <div className={cn(
                 "w-14 h-14 rounded-2xl glass border border-white/5 flex items-center justify-center p-3 relative",
                 item.status === 'connected' && "shadow-[0_0_15px_rgba(16,185,129,0.2)]"
               )}>
                  <Blocks className={cn(
                    "w-full h-full",
                    item.status === 'connected' ? "text-[#00f5ff]" : "text-white/20"
                  )} />
                  {item.status === 'connected' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-bg-dark" />
                  )}
               </div>
            </div>
            
            <h3 className="text-lg font-bold text-white tracking-tight">{item.name}</h3>
            <p className="text-white/30 text-xs mt-2 leading-relaxed h-10 line-clamp-2 uppercase tracking-wide font-medium">{item.desc}</p>
            
            <button className={cn(
               "mt-8 w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all",
               item.status === 'connected' 
                ? "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white" 
                : "bg-[#00f5ff]/10 text-[#00f5ff] hover:bg-[#00f5ff]/20 border border-[#00f5ff]/20"
            )}>
               {item.status === 'connected' ? 'Open Module' : 'Sync Connector'}
               <ExternalLink className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
        
        <motion.div 
          whileHover={{ scale: 0.98 }}
          className="glass-card p-8 border border-dashed border-white/10 flex flex-col items-center justify-center gap-6 group cursor-pointer hover:border-[#00f5ff]/30 h-full min-h-[260px]"
        >
           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00f5ff]/10 transition-colors">
              <Plus className="w-8 h-8 text-white/20 group-hover:text-[#00f5ff]" />
           </div>
           <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-[#00f5ff]">New Integration</span>
              <p className="text-[10px] text-white/10 mt-1">Connect your supply chain AI</p>
           </div>
        </motion.div>
      </div>
    </div>
  );
};
