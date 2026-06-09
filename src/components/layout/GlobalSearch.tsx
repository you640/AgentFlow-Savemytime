import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Workflow, Blocks, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WORKFLOW_TEMPLATES } from '../../constants/templates';
import { INTEGRATIONS } from '../../constants/integrations';
import { MOCK_INBOX_ITEMS } from '../../constants/inbox';
import { cn } from '../../lib/utils';

export const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    workflows: any[];
    integrations: any[];
    inbox: any[];
  }>({ workflows: [], integrations: [], inbox: [] });
  
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ workflows: [], integrations: [], inbox: [] });
      return;
    }

    const lowerQuery = query.toLowerCase();

    const filteredWorkflows = WORKFLOW_TEMPLATES.filter(w => 
      w.name.toLowerCase().includes(lowerQuery) || 
      w.description.toLowerCase().includes(lowerQuery)
    );

    const filteredIntegrations = INTEGRATIONS.filter(i => 
      i.name.toLowerCase().includes(lowerQuery) || 
      i.description.toLowerCase().includes(lowerQuery)
    );

    const filteredInbox = MOCK_INBOX_ITEMS.filter(item => 
      item.sender.toLowerCase().includes(lowerQuery) || 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.preview.toLowerCase().includes(lowerQuery)
    );

    setResults({
      workflows: filteredWorkflows,
      integrations: filteredIntegrations,
      inbox: filteredInbox,
    });
  }, [query]);

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  const hasResults = results.workflows.length > 0 || results.integrations.length > 0 || results.inbox.length > 0;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white group w-64"
      >
        <Search className="w-4 h-4 group-hover:text-brand-cyan transition-colors" />
        <span className="text-xs font-medium flex-1 text-left">Rýchle vyhľadávanie...</span>
        <span className="text-[10px] font-mono border border-white/10 px-1.5 py-0.5 rounded opacity-50 block sm:hidden lg:block">⌘K</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center md:pt-[15vh] px-0 md:px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-bg-dark/95 backdrop-blur-xl md:bg-bg-dark/80"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full h-full md:h-auto md:max-w-2xl bg-[#0a0a0f] md:glass-card overflow-hidden md:border border-white/10 shadow-2xl flex flex-col md:max-h-[70vh] md:rounded-[2rem]"
            >
              <div className="p-6 md:p-4 border-b border-white/5 flex items-center gap-4 bg-[#0a0a0f] sticky top-0 z-10">
                <Search className="w-6 h-6 md:w-5 md:h-5 text-brand-cyan" />
                <input 
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Vyhľadať v systéme..." 
                  className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder:text-white/20 text-xl md:text-lg py-2"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6 md:w-5 md:h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-4 scrollbar-hide pb-24 md:pb-4">
                {query && !hasResults && (
                  <div className="py-20 text-center">
                    <p className="text-white/20 text-sm font-medium italic">Nenašli sa žiadne výsledky pre "{query}"</p>
                  </div>
                )}

                {!query && (
                  <div className="py-12 md:py-8 text-center">
                    <p className="text-white/20 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] px-4">Začnite písať pre vyhľadanie procesov, integrácií alebo správ</p>
                  </div>
                )}

                {results.workflows.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2 px-2">
                       <Workflow className="w-3 h-3" />
                       Procesy
                    </h3>
                    <div className="space-y-1">
                      {results.workflows.map((w) => (
                        <button 
                          key={w.id}
                          onClick={() => handleSelect('/workflows')}
                          className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors">{w.name}</div>
                            <div className="text-[10px] text-white/30">{w.description}</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.integrations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2 px-2">
                       <Blocks className="w-3 h-3" />
                       Integrácie
                    </h3>
                    <div className="space-y-1">
                      {results.integrations.map((i) => (
                        <button 
                          key={i.id}
                          onClick={() => handleSelect('/integrations')}
                          className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors">{i.name}</div>
                            <div className="text-[10px] text-white/30">{i.description}</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.inbox.length > 0 && (
                  <div className="mb-2">
                    <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2 px-2">
                       <Mail className="w-3 h-3" />
                       Prijaté správy
                    </h3>
                    <div className="space-y-1">
                      {results.inbox.map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => handleSelect('/inbox')}
                          className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between group"
                        >
                          <div className="flex-1 min-w-0 mr-4">
                            <div className="flex justify-between items-baseline">
                               <span className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors truncate">{item.sender}</span>
                               <span className="text-[10px] text-white/20 font-mono flex-shrink-0">{item.time}</span>
                            </div>
                            <div className="text-[11px] text-white/60 truncate">{item.title}</div>
                            <div className="text-[10px] text-white/20 truncate italic">"{item.preview}"</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-white/5 border-t border-white/5 flex justify-between items-center px-4">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-[10px] text-white/20">
                      <span className="font-mono bg-white/5 px-1 rounded border border-white/10">↵</span>
                      <span>Vybrať</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] text-white/20">
                      <span className="font-mono bg-white/5 px-1 rounded border border-white/10">↑↓</span>
                      <span>Pohybovať sa</span>
                   </div>
                </div>
                <div className="text-[10px] text-white/20 font-mono">
                   Nájdených {results.workflows.length + results.integrations.length + results.inbox.length} uzlov
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
