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
  Globe,
  FileText,
  Instagram
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { INTEGRATIONS } from '../../constants/integrations';


const getIntegrationIcon = (iconName: string) => {
  switch (iconName) {
    case 'ShoppingBag': return ShoppingBag;
    case 'Truck': return Truck;
    case 'FileText': return FileText;
    case 'Mail': return Mail;
    case 'Instagram': return Instagram;
    default: return Blocks;
  }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const IntegrationsGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleOpenModule = (id: string, status: 'connected' | 'disconnected') => {
    if (id === '1' && status === 'connected') {
      navigate('/shopify');
    } else if (status === 'connected') {
      alert('Tento modul je spravovaný plne autonómnym AI agentom bez potreby manuálneho zásahu.');
    } else {
      alert('Tento integrátor zatiaľ nie je aktívny. Pre synchronizáciu prepojte API kľúče.');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Integrations Hub</h2>
          <p className="text-white/30 text-xs mt-1 uppercase tracking-widest font-mono">Link your small business logic ecosystem</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="hidden lg:flex bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl items-center gap-3">
              <Globe className="w-4 h-4 text-[#00f5ff]" />
              <span className="text-[10px] uppercase font-mono tracking-tighter text-[#00f5ff] font-bold">All Nodes Active</span>
           </div>
           <button className="flex-1 md:flex-none px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Request Sync
           </button>
        </div>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {INTEGRATIONS.map((integration) => {
          const IconComponent = getIntegrationIcon(integration.icon);

          return (
            <motion.div 
              key={integration.id}
              variants={item}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => handleOpenModule(integration.id, integration.status)}
              className={cn(
                "glass-card p-8 group relative overflow-hidden cursor-pointer selection:bg-transparent",
                integration.status === 'connected' ? "border-t-2 border-t-emerald-500" : ""
              )}
            >
              {/* Visual background decor for connected cards */}
              {integration.status === 'connected' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl -z-10 group-hover:bg-emerald-500/10 transition-colors" />
              )}

              <div className="flex justify-between items-start mb-8">
                 <div className={cn(
                   "w-14 h-14 rounded-2xl glass border border-white/5 flex items-center justify-center p-3 relative",
                   integration.status === 'connected' && "shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                 )}>
                    <IconComponent className={cn(
                      "w-full h-full",
                      integration.status === 'connected' ? "text-[#00f5ff]" : "text-white/20"
                    )} />
                    {integration.status === 'connected' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-bg-dark" />
                    )}
                 </div>
              </div>
              
              <h3 className="text-lg font-bold text-white tracking-tight">{integration.name}</h3>
              <p className="text-white/30 text-xs mt-2 leading-relaxed h-10 line-clamp-2 uppercase tracking-wide font-medium">{integration.description}</p>
              
              <button className={cn(
                 "mt-8 w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all",
                 integration.status === 'connected' 
                  ? "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white" 
                  : "bg-[#00f5ff]/10 text-[#00f5ff] hover:bg-[#00f5ff]/20 border border-[#00f5ff]/20"
              )}>
                 {integration.status === 'connected' ? 'Open Module' : 'Sync Connector'}
                 <ExternalLink className="w-3 h-3" />
              </button>
            </motion.div>
          );
        })}
        
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
      </motion.div>
    </div>
  );
};
