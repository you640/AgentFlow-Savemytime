import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  RotateCcw,
  Send,
  User,
  ArrowLeft,
  Check,
  AlertTriangle,
  FileText,
  Filter,
  Calendar,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { MOCK_INBOX_ITEMS } from '../../constants/inbox';
import { WORKFLOW_TEMPLATES } from '../../constants/templates';
import { InboxItem } from '../../types';

const sourceIcons = {
  gmail: Mail,
  eshop: ShoppingBag,
  instagram: Instagram,
  support: MessageCircle,
};

const categoryStyles = {
  high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  'auto-resolved': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const msgCategoryLabels = {
  invoices: 'Faktúry',
  support: 'Zákaznícka podpora',
  social: 'Sociálne siete',
  general: 'Všeobecné dopyty'
};

const msgCategoryStyles = {
  invoices: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  support: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  social: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
  general: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

interface ThreadMessage {
  id: string;
  senderName: string;
  isMe: boolean;
  body: string;
  timestamp: string;
  isAI?: boolean;
}

interface ExtendedInboxItem extends InboxItem {
  isRead: boolean;
  isArchived: boolean;
  assignedWorkflow?: string;
  messages: ThreadMessage[];
  date: string;
  msgCategory: 'invoices' | 'support' | 'general' | 'social';
}

const ENRICHED_MOCK_ITEMS: ExtendedInboxItem[] = [
  {
    id: '1',
    source: 'gmail',
    sender: 'Milan K.',
    title: 'Zmena v objednávke #1233',
    preview: 'Prosím o zmenu adresy doručenia na ul. Mlynská 4...',
    time: '14:22',
    category: 'high',
    isRead: false,
    isArchived: false,
    date: '2026-06-10T14:22:00Z',
    msgCategory: 'support',
    messages: [
      {
        id: '1-1',
        senderName: 'Milan K.',
        isMe: false,
        body: 'Dobrý deň, prosím o zmenu adresy doručenia na ul. Mlynská 4, Košice, nakoľko som pôvodne zadal zlé PSČ v objednávke #1233. Ešte to nebolo odoslané?',
        timestamp: '14:15'
      },
      {
        id: '1-2',
        senderName: 'AutoOps Bot',
        isMe: true,
        body: 'Dobrý deň, pán K. Overil som stav Vašej objednávky #1233. Vaša zásielka ešte nebola odovzdaná kuriérovi, takže sme adresu úspešne upravili na: Mlynská 4, 040 01 Košice, Slovenská pošta. Systémové údaje boli aktualizované.',
        timestamp: '14:20',
        isAI: true
      },
      {
        id: '1-3',
        senderName: 'Milan K.',
        isMe: false,
        body: 'Super, veľmi pekne vám ďakujem za rýchlu reakciu a ochotu! Teším sa na balíček.',
        timestamp: '14:22'
      }
    ]
  },
  {
    id: '2',
    source: 'eshop',
    sender: 'E-shop System',
    title: 'Nová objednávka #8821',
    preview: 'Zákazník vybral platbu vopred, čakáme na úhradu.',
    time: '13:10',
    category: 'auto-resolved',
    isRead: true,
    isArchived: false,
    date: '2026-06-10T13:10:00Z',
    msgCategory: 'invoices',
    messages: [
      {
        id: '2-1',
        senderName: 'E-shop System',
        isMe: false,
        body: 'Nová objednávka #8821 od zákazníka Petra M. (petra.m@azet.sk). Suma: 84.90 EUR - Čaká sa na platbu prevodom na účet.',
        timestamp: '13:00'
      },
      {
        id: '2-2',
        senderName: 'AutoOps Invoice Agent',
        isMe: true,
        body: 'E-mail odoslaný zákazníkovi: Dobrý deň Petra, ďakujeme za Vašu objednávku #8821. Na základe Vašej voľby Vám zasielame platobné detaily: IBAN: SK12 0900 0000 0012 3456 7890, VS: 8821. Tovar vyexpedujeme ihneď po registrácii platby.',
        timestamp: '13:10',
        isAI: true
      }
    ]
  },
  {
    id: '3',
    source: 'instagram',
    sender: '_nina.style_',
    title: 'DM: Otázka na veľkosť',
    preview: 'Ahojte, budú tieto šaty aj v modrej farbe?',
    time: '11:05',
    category: 'medium',
    isRead: false,
    isArchived: false,
    date: '2026-06-10T11:05:00Z',
    msgCategory: 'social',
    messages: [
      {
        id: '3-1',
        senderName: '_nina.style_',
        isMe: false,
        body: 'Ahojte 🌸 budú tieto šaty aj v krásnej modrej farbe? Na webe vidím len čierne a biele vo veľkosti M, mňa by zaujímala tá tmavomodrá. Ďakujem!',
        timestamp: '10:45'
      },
      {
        id: '3-2',
        senderName: 'AutoOps Support Bot',
        isMe: true,
        body: 'Ahoj Nina! Modrý variant naskladňujeme už tento piatok o 10:00 v limitovanom počte 15 kusov. Chceš si vytvoriť predbežnú rezerváciu pre veľkosť M?',
        timestamp: '11:00',
        isAI: true
      },
      {
        id: '3-3',
        senderName: '_nina.style_',
        isMe: false,
        body: 'Ánooo, určite si prosím rezervovať veľkosť M, ak sa dá! Vy ste úžasní. Ďakujem moc!',
        timestamp: '11:05'
      }
    ]
  },
  {
    id: '4',
    source: 'support',
    sender: 'Jozef T.',
    title: 'Reklamácia #990',
    preview: 'Tovar mi prišiel poškodený, posielam fotky...',
    time: 'Včera',
    category: 'high',
    isRead: false,
    isArchived: false,
    date: '2026-06-09T16:30:00Z',
    msgCategory: 'support',
    messages: [
      {
        id: '4-1',
        senderName: 'Jozef T.',
        isMe: false,
        body: 'Dobrý deň, dnes mi prišiel balík reklamácie #990 no krabica bola preliačená a vnútri je prasknutý plastový kryt. Posielam fotky v prílohe. Žiadam o okamžitú refundáciu peňazí alebo nápravu.',
        timestamp: 'Včera 16:30'
      },
      {
        id: '4-2',
        senderName: 'AutoOps Podpora',
        isMe: true,
        body: 'Vážený pán Jozef, úprimne sa ospravedlňujeme za vzniknuté nepríjemnosti. Zrejme došlo k poškodeniu počas prepravy. Radi Vám pomôžeme situáciu vyriešiť - preferujete vrátenie peňazí na IBAN (napíšte nám ho), alebo Vám zajtra bezplatne zašleme nový bezchybný kus?',
        timestamp: 'Včera 17:15'
      },
      {
        id: '4-3',
        senderName: 'Jozef T.',
        isMe: false,
        body: 'Ďakujem za rýchle riešenie, poprosím radšej poslať nový kus. Starý vám am poslať späť?',
        timestamp: 'Včera 18:00'
      }
    ]
  },
  {
    id: '5',
    source: 'eshop',
    sender: 'E-shop Invoice Bot',
    title: 'Mesačná faktúra #INV-2026-06',
    preview: 'Spracovaná platba za mesačné predplatné pre eshop.',
    time: '08. Jún',
    category: 'low',
    isRead: true,
    isArchived: false,
    date: '2026-06-08T09:15:00Z',
    msgCategory: 'invoices',
    messages: [
      {
        id: '5-1',
        senderName: 'E-shop Invoice Bot',
        isMe: false,
        body: 'Mesačné vyúčtovanie za služby e-shop platformy pre obchod bolo úspešne strhnuté z Vašej pridanej karty vo výške $39.00 USD. Faktúra #INV-2026-06 je priložená k stiahnutiu.',
        timestamp: '08. Jún 09:15'
      }
    ]
  },
  {
    id: '6',
    source: 'gmail',
    sender: 'Zuzana Marková',
    title: 'Otázka na doručenie do zahraničia',
    preview: 'Chcela by som sa opýtať, či posielate objednávky aj do Rakúska na adresu...',
    time: '07. Jún',
    category: 'medium',
    isRead: false,
    isArchived: false,
    date: '2026-06-07T12:40:00Z',
    msgCategory: 'general',
    messages: [
      {
        id: '6-1',
        senderName: 'Zuzana Marková',
        isMe: false,
        body: 'Dobrý deň, chcela by som sa opýtať, či posielate objednávky aj do Rakúska a aká je cena poštovného. Na Vašej stránke som to nenašla špecifikované.',
        timestamp: '07. Jún 12:40'
      }
    ]
  },
  {
    id: '7',
    source: 'instagram',
    sender: 'lucy.blogger',
    title: 'DM: Návrh barteru',
    preview: 'Dobrý deň, som influencerka a chcela by som spraviť unboxing...',
    time: '05. Jún',
    category: 'low',
    isRead: true,
    isArchived: false,
    date: '2026-06-05T18:22:00Z',
    msgCategory: 'social',
    messages: [
      {
        id: '7-1',
        senderName: 'lucy.blogger',
        isMe: false,
        body: 'Ahojte! Máte naozaj jedinečné kúsky. Chcela by som vám ponúknuť spoluprácu formou unboxingu a reels tagov na mojom profile (25k followers) výmenou za 2 šaty.',
        timestamp: '05. Jún 18:22'
      }
    ]
  },
  {
    id: '8',
    source: 'support',
    sender: 'Radovan Beňo',
    title: 'Nesprávna veľkosť obuvi - výmena',
    preview: 'Dnes mi dorazili topánky ale potreboval by som o číslo väčšie...',
    time: '04. Jún',
    category: 'high',
    isRead: false,
    isArchived: false,
    date: '2026-06-04T10:11:00Z',
    msgCategory: 'support',
    messages: [
      {
        id: '8-1',
        senderName: 'Radovan Beňo',
        isMe: false,
        body: 'Dobrý deň, dnes mi od vás dorazili poltopánky prosím vás, ale žiaľ sú mi tesné. Chcel by som ich vymeniť z veľkosti 42 na 43, ak ich máte skladom.',
        timestamp: '04. Jún 10:11'
      }
    ]
  }
];

export const UnifiedInbox: React.FC = () => {
  const [items, setItems] = useState<ExtendedInboxItem[]>(() => [...ENRICHED_MOCK_ITEMS]);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [workflowMenuOpen, setWorkflowMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Filter & Sorting states
  const [filterSender, setFilterSender] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [showFilters, setShowFilters] = useState<boolean>(true);

  // Thread detail navigation states
  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => ENRICHED_MOCK_ITEMS[0]?.id || null);
  const [mobileView, setMobileView] = useState<'list' | 'thread'>('list');

  // New Reply Text & Smart Suggestions States
  const [replyText, setReplyText] = useState('');
  const [selectedTone, setSelectedTone] = useState<string>('profesionálny');
  const [smartReplies, setSmartReplies] = useState<Array<{strategy: string; subject: string; body: string}>>([]);
  const [isSmartLoading, setIsSmartLoading] = useState<boolean>(false);
  const [smartError, setSmartError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Compute unique senders dynamically
  const uniqueSenders = useMemo(() => {
    const senders = new Set<string>();
    items.forEach(item => {
      if (!item.isArchived) {
        senders.add(item.sender);
      }
    });
    return Array.from(senders).sort();
  }, [items]);

  // Compute filtered and sorted list
  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter(item => !item.isArchived);

    // 1. Filter by Sender
    if (filterSender !== 'all') {
      result = result.filter(item => item.sender === filterSender);
    }

    // 2. Filter by Priority (category field)
    if (filterPriority !== 'all') {
      result = result.filter(item => item.category === filterPriority);
    }

    // 3. Filter by Category (msgCategory field)
    if (filterCategory !== 'all') {
      result = result.filter(item => item.msgCategory === filterCategory);
    }

    // 4. Filter by Date range
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= start;
      });
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate <= end;
      });
    }

    // 5. Sort
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'sender-asc') {
        return a.sender.localeCompare(b.sender, 'sk');
      }
      if (sortBy === 'sender-desc') {
        return b.sender.localeCompare(a.sender, 'sk');
      }
      if (sortBy === 'priority-desc') {
        const priorityWeight = { high: 3, medium: 2, low: 1, 'auto-resolved': 0 };
        return (priorityWeight[b.category] || 0) - (priorityWeight[a.category] || 0);
      }
      if (sortBy === 'priority-asc') {
        const priorityWeight = { high: 3, medium: 2, low: 1, 'auto-resolved': 0 };
        return (priorityWeight[a.category] || 0) - (priorityWeight[b.category] || 0);
      }
      if (sortBy === 'category-asc') {
        return (a.msgCategory || '').localeCompare(b.msgCategory || '', 'sk');
      }
      return 0;
    });

    return result;
  }, [items, filterSender, filterPriority, filterCategory, startDate, endDate, sortBy]);

  const activeItems = filteredAndSortedItems;
  
  // Resolve active thread
  const currentActiveThread = activeItems.find(item => item.id === activeThreadId) || activeItems[0] || null;

  const isFilterActive = filterSender !== 'all' || filterPriority !== 'all' || filterCategory !== 'all' || startDate !== '' || endDate !== '';
  
  const handleResetFilters = () => {
    setFilterSender('all');
    setFilterPriority('all');
    setFilterCategory('all');
    setStartDate('');
    setEndDate('');
    setSortBy('date-desc');
  };

  // Auto scroll threads
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentActiveThread?.messages?.length]);

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
    setItems([...ENRICHED_MOCK_ITEMS]);
    setSelectedIds([]);
    setActiveThreadId(ENRICHED_MOCK_ITEMS[0]?.id || null);
    setSmartReplies([]);
    setReplyText('');
    setMobileView('list');
    handleResetFilters();
    showNotification('Dáta boli resetované na pôvodný stav.', 'info');
  };

  // Direct send replying into thread history
  const handleSendReply = () => {
    if (!replyText.trim() || !currentActiveThread) return;

    const newMessage: ThreadMessage = {
      id: `reply-${Date.now()}`,
      senderName: 'Môj E-shop',
      isMe: true,
      body: replyText,
      timestamp: new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })
    };

    setItems(prev => prev.map(item => {
      if (item.id === currentActiveThread.id) {
        return {
          ...item,
          isRead: true, // Mark read on reply
          messages: [...(item.messages || []), newMessage],
          preview: replyText // Update summary text
        };
      }
      return item;
    }));

    setReplyText('');
    setSmartReplies([]);
    showNotification('Odpoveď bola úspešne odoslaná do prebiehajúcej konverzácie.', 'success');
  };

  // Gemini-powered suggestion analyzer using actual thread contents context
  const handleGenerateSmartSuggestions = async () => {
    if (!currentActiveThread) return;

    setIsSmartLoading(true);
    setSmartError(null);
    setSmartReplies([]);

    // Find the last message that came from the customer with text to digest
    const lastCustomerMsg = [...(currentActiveThread.messages || [])]
      .reverse()
      .find(m => !m.isMe);

    const messageToAnalyze = lastCustomerMsg ? lastCustomerMsg.body : currentActiveThread.preview;

    try {
      const response = await fetch('/api/gemini/smart-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: currentActiveThread.sender,
          subject: currentActiveThread.title,
          message: messageToAnalyze,
          tone: selectedTone,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Nepodarilo sa vygenerovať inteligentné návrhy.');
      }

      const data = await response.json();
      if (data && data.replies && Array.isArray(data.replies)) {
        setSmartReplies(data.replies);
        showNotification('Gemini vygeneroval 3 kontextuálne odpovede pre túto niť.', 'success');
      } else {
        throw new Error('Nepodporovaný formát odpovede zo servera.');
      }
    } catch (err: any) {
      console.error(err);
      setSmartError(err.message || 'Chyba servera pri analýze správy.');
    } finally {
      setIsSmartLoading(false);
    }
  };

  const allSelected = activeItems.length > 0 && selectedIds.length === activeItems.length;
  const isSomeSelected = selectedIds.length > 0;
  const unreadCount = activeItems.filter(item => !item.isRead).length;

  return (
    <div className="glass-card overflow-hidden animate-in fade-in slide-in-from-right duration-700 relative min-h-[580px] flex flex-col">
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

      {/* Main Top Header */}
      <div className="px-8 py-6 border-b border-white/5 flex flex-wrap justify-between items-center gap-4 bg-[#0a0a0f] shrink-0">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-3">
            Prioritný Inbox
            {unreadCount > 0 ? (
              <span className="text-[10px] font-mono bg-[#a855f7]/20 text-[#a855f7] px-3 py-1 rounded-full uppercase tracking-tighter font-bold">
                {unreadCount} Nové {unreadCount === 1 ? 'Správa' : unreadCount < 5 ? 'Správy' : 'Správ'}
              </span>
            ) : (
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-tighter font-bold">
                Všetko vybavené
              </span>
            )}
          </h2>
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-mono mt-1">Prepojené pre vlákna správ a konverzácií</p>
        </div>
        <div className="flex items-center gap-2">
          {items.some(item => item.isArchived) && (
            <button 
              onClick={handleResetInbox}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/65 hover:text-white hover:bg-white/10 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
              title="Obnoviť predvolené dáta inboxu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Obnoviť</span>
            </button>
          )}
          <button className="px-5 py-2.5 rounded-xl bg-[#00f5ff]/10 text-[#00f5ff] text-xs font-bold hover:bg-[#00f5ff]/20 transition-all flex items-center gap-2 border border-[#00f5ff]/20 neon-glow-cyan cursor-pointer">
             <Sparkles className="w-4 h-4" />
             Inteligentné triedenie
          </button>
        </div>
      </div>

      {activeItems.length === 0 ? (
        /* Full screen empty state */
        <div className="py-24 px-8 text-center flex flex-col items-center justify-center gap-4 flex-1">
          <div className="w-16 h-16 rounded-3xl glass border border-white/5 flex items-center justify-center bg-gradient-to-br from-[#00f5ff]/10 to-[#a855f7]/10">
            <Mail className="w-8 h-8 text-white/20 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white/80 animate-bounce">Inbox vyčistený!</h3>
            <p className="text-xs text-white/30 mt-1 max-w-sm mx-auto">Všetky prioritné správy boli úspešne spracované, vyriešené alebo archivované.</p>
          </div>
          <button 
            onClick={handleResetInbox}
            className="mt-2 px-5 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-white/60 hover:text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Dobiť ukážkové správy
          </button>
        </div>
      ) : (
        /* Responsive Split Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 divide-y lg:divide-y-0 lg:divide-x divide-white/5 bg-[#050508]/10 min-h-[560px]">
          
          {/* Left Column: Messages List Overview */}
          <div className={cn(
            "lg:col-span-5 flex flex-col h-full",
            mobileView === 'thread' ? 'hidden lg:flex' : 'flex'
          )}>
            {/* Header / Bulk check */}
            <div className="px-6 py-4 bg-white/[0.01] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 shrink-0 select-none">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAllToggle(e.target.checked)}
                  className="w-4 h-4 rounded border border-white/10 bg-white/5 checked:bg-[#00f5ff] checked:border-[#00f5ff] text-[#00f5ff] transition-all cursor-pointer focus:ring-0 focus:ring-offset-0 focus:outline-none"
                />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#00f5ff] font-bold">
                  {isSomeSelected ? `Vybrané: ${selectedIds.length} z ${activeItems.length}` : 'Vybrať pre hromadnú správu'}
                </span>
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <Filter className="w-3 h-3 text-[#00f5ff]" />
                <span>Prispôsobiť zobrazenie</span>
                {isFilterActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff]" />}
              </button>
            </div>

            {/* Collapsible Filters & Sorting Panel */}
            <AnimatePresence initial={true}>
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-[#07070d] border-b border-white/5"
                >
                  <div className="p-4 grid grid-cols-2 gap-3 text-xs">
                    {/* Sender select */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-mono tracking-widest uppercase font-bold flex items-center gap-1">
                        <User className="w-2.5 h-2.5" /> Odosielateľ
                      </label>
                      <select 
                        value={filterSender}
                        onChange={(e) => setFilterSender(e.target.value)}
                        className="bg-[#0b0b14] text-white border border-white/10 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-[#00f5ff] font-medium"
                      >
                        <option value="all">Všetci dopytovatelia</option>
                        {uniqueSenders.map(sender => (
                          <option key={sender} value={sender}>{sender}</option>
                        ))}
                      </select>
                    </div>

                    {/* Priority Select */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-mono tracking-widest uppercase font-bold flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" /> Priorita dopytu
                      </label>
                      <select 
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="bg-[#0b0b14] text-white border border-white/10 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-[#00f5ff] font-medium"
                      >
                        <option value="all">Všetky urgentnosti</option>
                        <option value="high">Vysoká (high)</option>
                        <option value="medium">Stredná (medium)</option>
                        <option value="low">Nízka (low)</option>
                        <option value="auto-resolved">Samo-vyriešené (resolved)</option>
                      </select>
                    </div>

                    {/* Category Select */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-mono tracking-widest uppercase font-bold flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" /> Tematická kategória
                      </label>
                      <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-[#0b0b14] text-white border border-white/10 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-[#00f5ff] font-medium"
                      >
                        <option value="all">Všetky témy dopytov</option>
                        <option value="invoices">Faktúry a poplatky</option>
                        <option value="support">Zákaznícka podpora</option>
                        <option value="social">Sociálne siete & DM</option>
                        <option value="general">Všeobecné dopyty</option>
                      </select>
                    </div>

                    {/* Sort Select */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-mono tracking-widest uppercase font-bold flex items-center gap-1">
                        <ArrowUpDown className="w-2.5 h-2.5" /> Radiť doručené
                      </label>
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-[#0b0b14] text-white border border-white/10 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-[#00f5ff] font-medium"
                      >
                        <option value="date-desc">Dátum: Najnovšie</option>
                        <option value="date-asc">Dátum: Najstaršie</option>
                        <option value="sender-asc">Meno: A-Z</option>
                        <option value="sender-desc">Meno: Z-A</option>
                        <option value="priority-desc">Urgentnosť: Najvyššia</option>
                        <option value="priority-asc">Urgentnosť: Najnižšia</option>
                        <option value="category-asc">Kategória: A-Z</option>
                      </select>
                    </div>

                    {/* Start Date */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-mono tracking-widest uppercase font-bold flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" /> Obdobie od
                      </label>
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-[#0b0b14] text-white border border-white/10 rounded-lg px-2 py-1 text-[11px] h-[26px] focus:outline-none focus:border-[#00f5ff]"
                      />
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-mono tracking-widest uppercase font-bold flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" /> Obdobie do
                      </label>
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-[#0b0b14] text-white border border-white/10 rounded-lg px-2 py-1 text-[11px] h-[26px] focus:outline-none focus:border-[#00f5ff]"
                      />
                    </div>
                  </div>

                  {isFilterActive && (
                    <div className="px-4 pb-3 flex justify-between items-center text-[10px] select-none border-t border-white/[0.02] pt-2">
                      <span className="text-white/30 font-mono">Filtre sú zapnuté</span>
                      <button 
                        onClick={handleResetFilters}
                        className="text-rose-400 hover:text-rose-300 transition-colors uppercase font-mono font-bold cursor-pointer"
                      >
                        Vyčistiť filtre (reset)
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scrollable list items */}
            <div className="divide-y divide-white/5 overflow-y-auto max-h-[580px] scrollbar-thin scrollbar-thumb-white/5 flex-1">
              <AnimatePresence initial={false}>
                {activeItems.map((item) => {
                  const Icon = sourceIcons[item.source];
                  const isSelected = selectedIds.includes(item.id);
                  const isActive = currentActiveThread?.id === item.id;
                  
                  return (
                    <motion.div 
                      key={item.id}
                      layoutId={`item-${item.id}`}
                      exit={{ opacity: 0, x: -30, height: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.015)' }}
                      className={cn(
                        "p-5 flex items-start gap-4 cursor-pointer group transition-all relative border-l-2 select-none",
                        isActive ? "bg-white/[0.035] border-l-[#a855f7]" : "border-l-transparent hover:bg-white/[0.005]",
                        isSelected ? "bg-white/[0.015]" : ""
                      )}
                      onClick={() => {
                        setActiveThreadId(item.id);
                        setMobileView('thread');
                        // Auto write read state
                        setItems(prev => prev.map(p => p.id === item.id ? { ...p, isRead: true } : p));
                      }}
                    >
                      {/* Self-contained stopPropagation checkbox wrapper */}
                      <div className="pt-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectToggle(item.id, e.target.checked)}
                          className="w-4 h-4 rounded border border-white/10 bg-[#050507] checked:bg-[#00f5ff] checked:border-[#00f5ff] text-[#00f5ff] transition-all cursor-pointer focus:ring-0 focus:ring-offset-0 focus:outline-none"
                        />
                      </div>

                      {/* Icon Avatar */}
                      <div className="shrink-0 relative">
                        <div className={cn(
                          "w-10 h-10 rounded-xl border flex items-center justify-center relative bg-gradient-to-br transition-all duration-300",
                          isActive ? "border-[#a855f7]/40 from-[#a855f7]/5 to-transparent shadow-md" : "border-white/10 from-white/5 to-transparent"
                        )}>
                          <Icon className={cn(
                            "w-4 h-4 transition-colors",
                            isActive ? "text-[#a855f7]" : "text-white/30 group-hover:text-white"
                          )} />
                          {!item.isRead && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00f5ff] rounded-full border border-[#050507] shadow animate-pulse" />
                          )}
                        </div>
                      </div>

                      {/* Sender / Preview Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className={cn(
                            "font-bold text-xs tracking-tight transition-colors",
                            !item.isRead ? "text-white" : "text-white/50"
                          )}>{item.sender}</span>
                          <span className="text-[9px] text-white/30 font-mono italic tracking-tighter">
                            {item.time}
                          </span>
                        </div>
                        <div className={cn(
                          "text-xs truncate transition-colors",
                          !item.isRead ? "font-bold text-white" : "font-normal text-white/70"
                        )}>
                          {item.title}
                        </div>
                        <p className="text-[11px] text-white/40 line-clamp-1 italic mt-1 font-sans">
                          "{item.preview}"
                        </p>
                        
                        {/* Interactive dynamic category tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className={cn(
                            "text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border font-mono select-none",
                            msgCategoryStyles[item.msgCategory] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          )}>
                            {msgCategoryLabels[item.msgCategory] || 'Všeobecné'}
                          </span>

                          {/* Inline assigned status */}
                          {item.assignedWorkflow && (
                            <div className="flex items-center gap-1 bg-[#a855f7]/10 text-[#c084fc] px-2 py-0.5 rounded border border-[#a855f7]/20 text-[8px] font-bold font-mono">
                              <Workflow className="w-2.5 h-2.5" />
                              <span>{item.assignedWorkflow}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Indicator Box */}
                      <div className="shrink-0 self-start pt-1">
                        <span className={cn(
                          "text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border block text-center min-w-[75px]", 
                          categoryStyles[item.category] || categoryStyles['low']
                        )}>
                          {item.category === 'auto-resolved' ? 'Vyriešené' : item.category === 'high' ? 'Vysoká' : item.category === 'medium' ? 'Stredná' : 'Nízka'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {/* Quick clean footer */}
            <div className="p-4 bg-white/[0.01] text-center border-t border-white/5 shrink-0 select-none">
              <button 
                onClick={() => {
                  const autoResolvedIds = activeItems.filter(item => item.category === 'auto-resolved').map(item => item.id);
                  if (autoResolvedIds.length > 0) {
                    setItems(prev => prev.map(item => autoResolvedIds.includes(item.id) ? { ...item, isArchived: true } : item));
                    showNotification(`Samočinne vyriešené správy (${autoResolvedIds.length}) boli úspešne archivované.`);
                  } else {
                    showNotification('Žiadne správy k hromadnej automatickej archivácii.', 'info');
                  }
                }}
                className="text-[9px] font-mono text-white/20 hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
              >
                Archivovať vyriešené s AI
              </button>
            </div>
          </div>

          {/* Right Column: Detailed Converasation Thread (ThreadView) */}
          <div className={cn(
            "lg:col-span-7 flex flex-col bg-slate-950/20",
            mobileView === 'list' ? 'hidden lg:flex' : 'flex'
          )}>
            {currentActiveThread ? (
              <div className="flex flex-col h-full flex-1">
                {/* Active Thread Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
                  <div className="flex items-center gap-3">
                    {/* Mobile Back Button */}
                    <button 
                      onClick={() => setMobileView('list')}
                      className="lg:hidden p-2 mr-1 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold font-mono uppercase cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 text-white" />
                    </button>

                    <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/15 bg-white/5 text-[11px] font-bold font-mono">
                      {currentActiveThread.sender.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{currentActiveThread.sender}</span>
                        <span className="text-[9px] uppercase tracking-wider font-mono font-bold bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/20 px-1.5 py-0.5 rounded">
                          {currentActiveThread.source}
                        </span>
                      </div>
                      <div className="text-[10px] text-white/40 truncate font-mono tracking-tight mt-0.5">
                        Predmet: {currentActiveThread.title}
                      </div>
                    </div>
                  </div>

                  {/* Actions for active thread */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setItems(prev => prev.map(item => item.id === currentActiveThread.id ? { ...item, isRead: !item.isRead } : item));
                        showNotification('Stav prečítania správy upravený.', 'info');
                      }}
                      className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-[#00f5ff] transition-all cursor-pointer"
                      title={currentActiveThread.isRead ? 'Označiť ako neprečítané' : 'Označiť ako prečítané'}
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setItems(prev => prev.map(item => item.id === currentActiveThread.id ? { ...item, isArchived: true } : item));
                        showNotification('Vlákno bolo presunuté do archívu.');
                        setActiveThreadId(null);
                        setMobileView('list');
                      }}
                      className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-[#a855f7] transition-all cursor-pointer"
                      title="Archivovať vlákno"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Animated conversation bubble stream */}
                <div className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[380px] lg:max-h-[440px] scrollbar-thin scrollbar-thumb-white/5 bg-[#030305]/20">
                  <div className="text-center">
                    <span className="inline-block text-[8px] font-mono uppercase tracking-widest text-white/20 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-full">
                      História nite • {currentActiveThread.source.toUpperCase()}
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {currentActiveThread.messages?.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex flex-col max-w-[85%]",
                          msg.isMe ? "ml-auto items-end" : "mr-auto items-start"
                        )}
                      >
                        {/* Bubble */}
                        <div className={cn(
                          "px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap font-sans border shadow-md",
                          msg.isMe 
                            ? "bg-gradient-to-br from-indigo-950/80 to-slate-900 border-indigo-500/20 text-white rounded-tr-none" 
                            : "bg-[#111118] border-white/5 text-slate-200 rounded-tl-none"
                        )}>
                          <p>{msg.body}</p>
                        </div>
                        
                        {/* Meta information */}
                        <div className="flex items-center gap-1.5 mt-1.5 px-1 font-mono text-[9px] font-medium text-white/30">
                          <span>{msg.isMe ? 'Ja' : msg.senderName}</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                          {msg.isAI && (
                            <span className="inline-flex items-center gap-0.5 text-[8px] text-[#00f5ff] uppercase bg-[#00f5ff]/10 px-1 rounded border border-[#00f5ff]/15 font-bold animate-pulse">
                              <Sparkles className="w-2 h-2" /> AI AutoOps
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Reply & Contextual Gemini Engine Panel */}
                <div className="p-4 border-t border-white/5 bg-[#0a0a0f] shrink-0 space-y-4">
                  {/* Automated AI generator widget */}
                  <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl space-y-3">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        <span className="text-[10px] font-mono text-rose-300 font-bold uppercase tracking-wider">
                          Pomocník Gemini Smart-Reply
                        </span>
                      </div>
                      
                      {/* Interactive Tone Toggle group */}
                      <div className="flex gap-1">
                        {[
                          { id: 'profesionálny', label: '👔 Profi' },
                          { id: 'priateľský', label: '🤝 Milý' },
                          { id: 'stručný', label: '⚡ Rýchly' },
                          { id: 'ospravedlňujúci', label: '🙏 Prepáč' }
                        ].map(t => {
                          const isSel = selectedTone === t.id;
                          return (
                            <button
                              type="button"
                              key={t.id}
                              onClick={() => setSelectedTone(t.id)}
                              className={cn(
                                "text-[9px] font-bold px-1.5 py-1 rounded transition-all cursor-pointer",
                                isSel
                                  ? "bg-rose-500/15 border-rose-500/50 text-rose-300 border font-bold"
                                  : "text-white/40 hover:text-white hover:bg-white/5"
                              )}
                            >
                              {t.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <p className="text-[10px] text-white/30 font-sans leading-relaxed">
                      Gemini zanalyzuje poslednú prichádzajúcu správu od {currentActiveThread.sender} a navrhne tri unikátne profesionálne odpovede v stavenom tónovom formáte.
                    </p>

                    <button
                      type="button"
                      onClick={handleGenerateSmartSuggestions}
                      disabled={isSmartLoading}
                      className="w-full py-2 bg-gradient-to-r from-rose-600/20 to-[#a855f7]/20 border border-rose-500/10 hover:border-rose-500/30 text-rose-400 hover:text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {isSmartLoading ? (
                        <>
                          <div className="w-3 h-3 border-2 border-[#00f5ff]/30 border-t-[#00f5ff] rounded-full animate-spin" />
                          <span>Gemini generuje odpovede...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Navrhnúť odpoveď s AI</span>
                        </>
                      )}
                    </button>

                    {/* Gemini Error prompt */}
                    {smartError && (
                      <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[10px] flex items-start gap-1.5 leading-normal">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{smartError}</span>
                      </div>
                    )}

                    {/* Smart reply options display */}
                    {smartReplies.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                        {smartReplies.map((rep, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setReplyText(rep.body);
                              showNotification('Navrhovaná odpoveď bola skopírovaná do editora!', 'success');
                            }}
                            className="p-2.5 bg-[#050508]/80 hover:bg-rose-500/[0.03] border border-white/5 hover:border-rose-500/30 rounded-lg text-left cursor-pointer transition-all space-y-1.5 group"
                          >
                            <div className="flex justify-between items-center gap-1">
                              <span className="text-[8px] font-mono bg-rose-500/10 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/15 max-w-[100px] truncate font-bold">
                                {rep.strategy}
                              </span>
                              <span className="text-[8px] text-emerald-400/80 group-hover:block hidden font-bold">✓ Vybrať</span>
                            </div>
                            <p className="text-[9px] text-white/50 leading-normal line-clamp-3 font-sans group-hover:text-white/80">
                              {rep.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Manual Type textarea & controls */}
                  <div className="flex gap-2.5 items-end">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Napíšte priamu odpoveď pre ${currentActiveThread.sender}...`}
                      className="flex-1 bg-[#050507] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7]/30 transition-all font-sans leading-relaxed resize-none h-[42px] max-h-[120px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-md",
                        replyText.trim()
                          ? "bg-gradient-to-r from-[#00f5ff] to-[#a855f7] text-black hover:brightness-110"
                          : "bg-white/5 text-white/20 border border-white/5 pointer-events-none"
                      )}
                      title="Odoslať odpoveď"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Splash screen when no thread is present */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-2">
                <FileText className="w-10 h-10 text-white/10" />
                <h4 className="text-sm font-bold text-white/60">Zvoľte konverzáciu</h4>
                <p className="text-xs text-white/30 max-w-xs font-sans">
                  Vyberte ktorékoľvek vlákno správy v ľavom paneli pre zobrazenie kompletnej histórie dopytu a histórie správ.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Floating Toolbar for bulk selected rows action */}
      <AnimatePresence>
        {isSomeSelected && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0a0a11]/95 border border-white/10 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 z-40 transition-shadow hover:shadow-[#00f5ff]/5"
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
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#00f5ff]" />
                Označiť prečítané
              </button>

              <button
                onClick={handleBulkArchive}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Archive className="w-4 h-4 text-[#a855f7]" />
                Archivovať
              </button>

              <div className="relative flex-1 sm:flex-none">
                <button
                  onClick={() => setWorkflowMenuOpen(!workflowMenuOpen)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00f5ff]/20 to-[#a855f7]/20 border border-[#00f5ff]/20 hover:from-[#00f5ff]/30 hover:to-[#a855f7]/30 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-all flex items-start gap-2.5 group cursor-pointer"
                          >
                            <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-[#a855f7]/20 transition-all shrink-0">
                              <WfIcon className="w-3.5 h-3.5 text-[#a855f7] group-hover:text-white transition-colors" />
                            </div>
                            <div className="truncate">
                              <div className="font-bold truncate text-white">{wf.name}</div>
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
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-[#ff4646]/10 hover:border-[#ff4646]/30 hover:text-red-400 text-white/40 flex items-center justify-center transition-all shrink-0 cursor-pointer"
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
