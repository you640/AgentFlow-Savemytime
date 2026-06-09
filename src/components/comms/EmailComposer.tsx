import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  X, 
  Paperclip, 
  Image as ImageIcon, 
  Smile, 
  Sparkles, 
  Trash2, 
  Maximize2,
  ChevronDown,
  Mail,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const EmailComposer: React.FC = () => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSending(false);
    setIsSent(true);
    
    // Reset after success view
    setTimeout(() => {
      setIsSent(false);
      setFormData({ to: '', subject: '', body: '' });
    }, 3000);
  };

  const generateWithAI = () => {
    setIsAIGenerating(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        body: prev.body + "\n\nNÁVRH AI: Preverili sme vašu požiadavku ohľadom oneskorenia dopravy. Momentálne koordinujeme doručenie s naším logistickým partnerom (Packeta), aby sme doručenie urýchlili. Vaše podacie číslo zásielky je stále aktívne."
      }));
      setIsAIGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Komunikačné centrum
            <span className="text-brand-purple text-[10px] font-mono border border-brand-purple/30 px-2 py-0.5 rounded uppercase tracking-widest leading-none">
              SMTP Aktívne
            </span>
          </h2>
          <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-mono">Pripravujte dôležité odpovede pre zákazníkov</p>
        </div>
      </header>

      <div className="relative">
        <AnimatePresence mode="wait">
          {isSent ? (
            <motion.div 
              key="sent-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px]"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Správa odoslaná</h3>
                <p className="text-white/40 mt-2">Váš e-mail bol úspešne odoslaný cez AutoOps SMTP bránu.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="compose-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden flex flex-col min-h-[600px] border border-white/10 shadow-2xl"
            >
              <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-brand-purple" />
                  </div>
                  <span className="text-sm font-bold text-white">Nová odchádzajúca správa</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 transition-colors"><Maximize2 className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </div>

              <form onSubmit={handleSend} className="flex-1 flex flex-col">
                <div className="p-6 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 py-2 border-b border-white/5 group">
                    <span className="text-xs font-mono text-white/20 w-12 group-focus-within:text-brand-cyan transition-colors">TO:</span>
                    <input 
                      type="email" 
                      required
                      value={formData.to}
                      onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      placeholder="zakaznik@priklad.sk"
                      className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm font-medium"
                    />
                    <div className="flex gap-2">
                      <button type="button" className="text-[10px] text-white/20 hover:text-white uppercase font-bold px-2">Cc</button>
                      <button type="button" className="text-[10px] text-white/20 hover:text-white uppercase font-bold px-2">Bcc</button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-4 py-2 border-b border-white/5 group">
                    <span className="text-xs font-mono text-white/20 w-12 group-focus-within:text-brand-cyan transition-colors">SUB:</span>
                    <input 
                      type="text" 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Objednávka #4492 - Riešenie"
                      className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm font-medium"
                    />
                  </div>

                  <div className="relative flex-1 py-4">
                    <textarea 
                      required
                      value={formData.body}
                      onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                      placeholder="Napíšte správu alebo použite AI na vytvorenie návrhu..."
                      className="w-full h-64 md:h-80 bg-transparent border-none focus:outline-none text-white text-sm leading-relaxed resize-none scrollbar-hide"
                    />
                    
                    <AnimatePresence>
                      {isAIGenerating && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-bg-dark/60 backdrop-blur-[2px] flex items-center justify-center z-10"
                        >
                           <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/10 shadow-xl">
                              <Sparkles className="w-4 h-4 text-brand-cyan animate-pulse" />
                              <span className="text-xs font-mono text-brand-cyan">AI premýšľa...</span>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-auto p-6 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-1">
                    <button type="button" className="p-3 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"><Paperclip className="w-5 h-5" /></button>
                    <button type="button" className="p-3 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"><ImageIcon className="w-5 h-5" /></button>
                    <button type="button" className="p-3 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"><Smile className="w-5 h-5" /></button>
                    <div className="w-[1px] h-6 bg-white/10 mx-2 hidden md:block" />
                    <button 
                      type="button" 
                      onClick={generateWithAI}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-bold hover:bg-brand-cyan/20 transition-all uppercase tracking-widest"
                    >
                      <Sparkles className="w-3 h-3" />
                      Kúzelný AI Návrh
                    </button>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button type="button" className="p-3 hover:bg-red-500/10 rounded-xl text-white/20 hover:text-red-500 transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center bg-brand-purple rounded-xl overflow-hidden shadow-lg shadow-brand-purple/20 hover:shadow-brand-purple/40 transition-all w-full md:w-auto">
                      <button 
                        type="submit"
                        disabled={isSending}
                        className={cn(
                          "px-8 py-3 text-white text-sm font-bold flex items-center justify-center gap-3 flex-1 md:flex-none",
                          isSending && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {isSending ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {isSending ? 'Odosiela sa...' : 'Odoslať správu'}
                      </button>
                      <div className="w-[1px] h-full bg-black/10" />
                      <button type="button" className="px-3 py-3 hover:bg-black/10 transition-colors">
                        <ChevronDown className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex items-start gap-4 border-l-2 border-brand-cyan">
          <div className="p-3 rounded-xl bg-brand-cyan/10">
            <Zap className="w-5 h-5 text-brand-cyan" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Zosynchronizované s CRM</h4>
            <p className="text-white/30 text-[10px] uppercase font-mono tracking-widest mt-1">Aktualizuje vlákna v Shopify a Instagrame</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-start gap-4 border-l-2 border-brand-purple">
          <div className="p-3 rounded-xl bg-brand-purple/10">
            <Sparkles className="w-5 h-5 text-brand-purple" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Ochrana tónu a údajov</h4>
            <p className="text-white/30 text-[10px] uppercase font-mono tracking-widest mt-1">Skenuje tón komunikácie a osobné údaje (PII)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
