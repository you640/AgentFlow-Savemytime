import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  ShoppingBag, 
  Instagram, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ChevronDown,
  BookOpen,
  Archive,
  Workflow,
  X,
  RotateCcw
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { MOCK_INBOX_ITEMS } from '../../constants/inbox';
import { WORKFLOW_TEMPLATES } from '../../constants/templates';
import { InboxItem } from '../../types';

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

interface ExtendedInboxItem extends InboxItem {
  isRead: boolean;
  isArchived: boolean;
  assignedWorkflow?: string;
}

export const UnifiedInbox: React.FC = () => {
  const [items, setItems] = useState<ExtendedInboxItem[]>(() => 
    MOCK_INBOX_ITEMS.map(item => ({
      ...item,
      isRead: item.category === 'auto-resolved', // Auto-resolved default to read
      isArchived: false
    }))
  );
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [workflowMenuOpen, setWorkflowMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const activeItems = items.filter(item => !item.isArchived);

  const handleSelectToggle = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleSelectAllToggle = (checked: boolean) => {
    if (checked) {
      setSelectedIds(activeItems.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleBulkMarkRead = () => {
    setItems(prev => prev.map(item => 
      selectedIds.includes(item.id) ? { ...item, isRead: true } : item
    ));
    showNotification(`Označené správy (${selectedIds.length}) boli označené ako prečítané.`);
    setSelectedIds([]);
  };

  const handleBulkArchive = () => {
    setItems(prev => prev.map(item => 
      selectedIds.includes(item.id) ? { ...item, isArchived: true } : item
    ));
    showNotification(`Označené správy (${selectedIds.length}) boli úspešne archivované.`);
    setSelectedIds([]);
  };

  const handleBulkAssignWorkflow = (workflowId: string, workflowName: string) => {
    setItems(prev => prev.map(item => 
      selectedIds.includes(item.id) ? { ...item, assignedWorkflow: workflowName } : item
    ));
    showNotification(`Správy (${selectedIds.length}) boli priradené k procesu: ${workflowName}.`);
    setSelectedIds([]);
    setWorkflowMenuOpen(false);
  };

  const handleResetInbox = () => {
    setItems(MOCK_INBOX_ITEMS.map(item => ({
      ...item,
      isRead: item.category === 'auto-resolved',
      isArchived: false,
      assignedWorkflow: undefined
    })));
    setSelectedIds([]);
    showNotification('Dáta boli resetované na pôvodný stav.', 'info');
  };

  const allSelected = activeItems.length > 0 && selectedIds.length === activeItems.length;
  const isSomeSelected = selectedIds.length > 0;
  const unreadCount = activeItems.filter(item => !item.isRead).length;

  return (
    <div className="glass-card overflow-hidden animate-in fade-in slide-in-from-right duration-700 relative min-h-[450px]">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={cn(
              "absolute top-4 left-1/2 px-6 py-3 rounded-xl border z-50 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-bold font-mono tracking-tight",
              notification.type === 'success' 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                : "bg-[#00f5ff]/10 border-[#00f5ff]/30 text-[#00f5ff]"
            )}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-8 py-6 border-b border-white/5 flex flex-wrap justify-between items-center gap-4 bg-[#0a0a0f]">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-3">
            Prioritný Inbox
            {unreadCount > 0 ? (
              <span className="text-[10px] font-mono bg-[#a855f7]/20 text-[#a855f7] px-3 py-1 rounded-full uppercase tracking-tighter">
                {unreadCount} Nové {unreadCount === 1 ? 'Správa' : unreadCount < 5 ? 'Správy' : 'Správ'}
              </span>
            ) : (
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-tighter">
                Všetko vybavené
              </span>
            )}
          </h2>
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-mono mt-1">Komunikácia zo všetkých platforiem</p>
        </div>
        <div className="flex items-center gap-2">
          {items.some(item => item.isArchived || item.assignedWorkflow) && (
            <button 
              onClick={handleResetInbox}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/65 hover:text-white hover:bg-white/10 transition-all text-xs flex items-center gap-1.5"
              title="Obnoviť predvolené dáta inboxu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Obnoviť</span>
            </button>
          )}
          <button className="px-5 py-2.5 rounded-xl bg-[#00f5ff]/10 text-[#00f5ff] text-xs font-bold hover:bg-[#00f5ff]/20 transition-all flex items-center gap-2 border border-[#00f5ff]/20 neon-glow-cyan">
             <Sparkles className="w-4 h-4" />
             Inteligentné triedenie
          </button>
        </div>
      </div>

      {activeItems.length > 0 && (
        <div className="px-8 py-3 bg-white/[0.01] border-b border-white/5 flex items-center gap-3">
          <input 
            type="checkbox"
            checked={allSelected}
            onChange={(e) => handleSelectAllToggle(e.target.checked)}
            className="w-4 h-4 rounded border border-white/10 bg-white/5 checked:bg-[#00f5ff] checked:border-[#00f5ff] text-[#00f5ff] transition-all cursor-pointer focus:ring-0 focus:ring-offset-0 focus:outline-none"
          />
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
            {isSomeSelected ? `Vybrané: ${selectedIds.length} z ${activeItems.length}` : 'Vybrať všetky správy'}
          </span>
        </div>
      )}
      
      <div className="divide-y divide-white/5 relative bg-[#050508]/10">
        <AnimatePresence initial={false}>
          {activeItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 px-8 text-center flex flex-col items-center justify-center gap-4"
            >
              <div className="w-16 h-16 rounded-3xl glass border border-white/5 flex items-center justify-center bg-gradient-to-br from-[#00f5ff]/10 to-[#a855f7]/10">
                <Mail className="w-8 h-8 text-white/20 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white/80 animate-bounce">Inbox vyčistený!</h3>
                <p className="text-xs text-white/30 mt-1 max-w-sm mx-auto">Všetky prioritné správy boli úspešne spracované, vyriešené alebo archivované.</p>
              </div>
              <button 
                onClick={handleResetInbox}
                className="mt-2 px-5 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-white/60 hover:text-white font-bold text-xs transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Dobiť ukážkové správy
              </button>
            </motion.div>
          ) : (
            activeItems.map((item) => {
              const Icon = sourceIcons[item.source];
              const isSelected = selectedIds.includes(item.id);
              return (
                <motion.div 
                  key={item.id}
                  layoutId={`item-${item.id}`}
                  exit={{ opacity: 0, x: -30, height: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.015)' }}
                  className={cn(
                    "p-6 flex items-center gap-6 cursor-pointer group transition-all relative border-l-2 select-none",
                    isSelected ? "bg-white/[0.02] border-l-[#00f5ff]" : "border-l-transparent"
                  )}
                  onClick={() => handleSelectToggle(item.id, !isSelected)}
                >
                  <div className="shrink-0 flex items-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectToggle(item.id, e.target.checked)}
                      className="w-4 h-4 rounded border border-white/10 bg-[#050507] checked:bg-[#00f5ff] checked:border-[#00f5ff] text-[#00f5ff] transition-all cursor-pointer focus:ring-0 focus:ring-offset-0 focus:outline-none"
                    />
                  </div>

                  <div className="shrink-0 relative">
                     <div className={cn(
                       "w-12 h-12 rounded-2xl glass border flex items-center justify-center relative bg-gradient-to-br transition-all duration-300",
                       isSelected ? "border-[#00f5ff]/40 from-[#00f5ff]/5 to-transparent shadow-md shadow-[#00f5ff]/5" : "border-white/10 from-white/5 to-transparent"
                     )}>
                        <Icon className={cn(
                          "w-6 h-6 transition-colors",
                          isSelected ? "text-[#00f5ff]" : "text-white/30 group-hover:text-white"
                        )} />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-[#050507] border border-white/10 flex items-center justify-center p-1 overflow-hidden font-sans">
                           <div className="w-full h-full bg-gradient-to-br from-[#00f5ff] to-[#a855f7] opacity-60" />
                        </div>
                        {!item.isRead && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00f5ff] rounded-full border-2 border-[#050507] shadow shadow-[#00f5ff]/25 animate-pulse" />
                        )}
                     </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                     <div className="flex justify-between items-baseline mb-1">
                        <span className={cn(
                          "font-bold text-sm tracking-tight transition-colors",
                          !item.isRead ? "text-white" : "text-white/50"
                        )}>{item.sender}</span>
                        <span className="text-[10px] text-white/20 font-mono italic tracking-tighter">{item.time === 'Včera' ? 'Včera' : `o ${item.time}`}</span>
                     </div>
                     <div className={cn(
                       "text-sm line-clamp-1 truncate transition-colors",
                       !item.isRead ? "font-bold text-white/95" : "font-normal text-white/60"
                     )}>{item.title}</div>
                     <div className="text-xs text-white/30 line-clamp-1 italic mt-1 font-medium font-sans">
                       "{item.preview}"
                     </div>
                     
                     {item.assignedWorkflow && (
                       <div className="flex items-center gap-1.5 mt-2.5 self-start bg-[#a855f7]/10 text-[#c084fc] px-2.5 py-1 rounded-lg border border-[#a855f7]/20 text-[10px] font-bold uppercase tracking-wider font-mono">
                         <Workflow className="w-3 h-3" />
                         <span>Spustený proces: {item.assignedWorkflow}</span>
                       </div>
                     )}
                  </div>
 
                  <div className="flex flex-col items-end justify-center gap-3 shrink-0">
                     <span className={cn(
                       "text-[9px] uppercase tracking-[0.1em] font-bold px-3 py-1 rounded-lg border focus-visible:outline-none", 
                       categoryStyles[item.category]
                     )}>
                        {item.category === 'auto-resolved' ? 'Vyriešené AI' : item.category === 'high' ? 'Vysoká' : item.category === 'medium' ? 'Stredná' : 'Nízka'}
                     </span>
                     {item.category === 'auto-resolved' && (
                        <motion.div 
                          key="resolved"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider"
                        >
                           <CheckCircle2 className="w-3.5 h-3.5" />
                           <span>Spracované AI</span>
                        </motion.div>
                     )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
      
      {activeItems.length > 0 && (
        <div className="p-4 bg-white/[0.01] text-center border-t border-white/5">
           <button 
             onClick={() => {
               const autoResolvedIds = activeItems.filter(item => item.category === 'auto-resolved').map(item => item.id);
               if (autoResolvedIds.length > 0) {
                 setItems(prev => prev.map(item => autoResolvedIds.includes(item.id) ? { ...item, isArchived: true } : item));
                 showNotification(`Samočinne vyriešené správy (${autoResolvedIds.length}) boli úspešne archivované.`);
               } else {
                 showNotification('Žiadne správy k hromadnej archivácii.', 'info');
               }
             }}
             className="text-[9px] font-mono text-white/20 hover:text-white transition-colors uppercase tracking-widest relative z-10"
           >
             Archivovať vyriešené konverzácie
           </button>
        </div>
      )}

      <AnimatePresence>
        {isSomeSelected && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0a0a11]/95 border border-white/10 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 z-40 transition-shadow hover:shadow-[#00f5ff]/5 cursor-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-md bg-[#00f5ff]/20 border border-[#00f5ff] flex items-center justify-center text-[11px] font-mono font-bold text-[#00f5ff]">
                {selectedIds.length}
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Označených správ
                </span>
                <p className="text-[10px] text-white/30 hidden sm:block">Pre vybrané položky vykonáte hromadné operácie</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={handleBulkMarkRead}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <BookOpen className="w-4 h-4 text-[#00f5ff]" />
                Označiť ako prečítané
              </button>

              <button
                onClick={handleBulkArchive}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Archive className="w-4 h-4 text-[#a855f7]" />
                Archivovať
              </button>

              <div className="relative flex-1 sm:flex-none">
                <button
                  onClick={() => setWorkflowMenuOpen(!workflowMenuOpen)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00f5ff]/20 to-[#a855f7]/20 border border-[#00f5ff]/20 hover:from-[#00f5ff]/30 hover:to-[#a855f7]/30 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Workflow className="w-4 h-4 text-[#00f5ff]" />
                  Spustiť proces
                  <ChevronDown className={cn("w-3.5 h-3.5 opacity-60 transition-transform duration-200", workflowMenuOpen && "rotate-180")} />
                </button>

                {workflowMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setWorkflowMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full mb-3 right-0 w-64 rounded-xl bg-[#0a0a0f] border border-white/10 shadow-2xl p-2.5 z-20 flex flex-col gap-1.5 scrollbar-none"
                    >
                      <div className="text-[9px] font-mono text-white/30 px-3 py-1 uppercase tracking-wider">
                        Vyberte automatický proces
                      </div>
                      <div className="h-[1px] bg-white/5 my-0.5" />
                      {WORKFLOW_TEMPLATES.map((wf) => {
                        const WfIcon = wf.icon;
                        return (
                          <button
                            key={wf.id}
                            onClick={() => handleBulkAssignWorkflow(wf.id, wf.name)}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-all flex items-start gap-2.5 group"
                          >
                            <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-[#a855f7]/20 transition-all shrink-0">
                              <WfIcon className="w-3.5 h-3.5 text-[#a855f7] group-hover:text-white transition-colors" />
                            </div>
                            <div className="truncate">
                              <div className="font-bold truncate">{wf.name}</div>
                              <div className="text-[9px] text-white/30 truncate mt-0.5 font-sans group-hover:text-white/50">{wf.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </div>

              <div className="hidden sm:block w-[1px] h-6 bg-white/10 mx-1" />

              <button
                onClick={() => setSelectedIds([])}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/40 hover:text-white flex items-center justify-center transition-all shrink-0"
                title="Zrušiť výber"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
