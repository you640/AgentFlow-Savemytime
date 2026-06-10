import React, { useState, useEffect } from 'react';
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
  Zap,
  Plus,
  FileText,
  Check,
  Edit,
  Eye,
  Code,
  Copy,
  FileCode,
  FolderOpen,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isSystem?: boolean;
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 't-delay',
    name: 'Ospravedlnenie za meškanie',
    subject: 'Riešenie meškania objednávky {{cislo_objednavky}} | AutoOps',
    body: 'Dobrý deň, {{meno_zakaznika}},\n\nostravujeme sa za nepríjemnosti spojené s meškaním doručenia Vašej objednávky {{cislo_objednavky}}. Momentálne koordinujeme doručenie s naším partnerom {{logisticky_partner}}, aby sme doručenie tejto zásielky urýchlili.\n\nAko kompenzáciu Vám ponúkame zľavový kód {{zlava}} na ďalší nákup.\n\nS pozdravom,\nTím podpory AutoOps',
    isSystem: true,
  },
  {
    id: 't-refund',
    name: 'Potvrdenie refundácie',
    subject: 'Spracovanie refundácie pre objednávku {{cislo_objednavky}}',
    body: 'Dobrý deň, {{meno_zakaznika}},\n\npotvrdzujeme, že finančné prostriedky vo výške {{ciastka}} za vrátený tovar z objednávky {{cislo_objednavky}} boli poukázané na Váš bankový účet.\n\nPrevod obvykle trvá {{pocet_dni}} pracovných dní. V prípade akýchkoľvek ďalších otázok sme Vám k dispozícii.\n\nS pozdravom,\nTím podpory AutoOps',
    isSystem: true,
  },
  {
    id: 't-review',
    name: 'Vyžiadanie spätnej väzby',
    subject: 'Ako prebehol Váš nákup, {{meno_zakaznika}}?',
    body: 'Vážený zákazník {{meno_zakaznika}},\n\nsme radi, že ste si pre nákup vybrali práve nás. Vaša spokojnosť s vybavením objednávky {{cislo_objednavky}} je pre nás kľúčová.\n\nChceli by sme Vás poprosiť o krátke hodnotenie pod týmto odkazom: {{odkaz_hodnotenie}}.\n\nĎakujeme za Váš čas a prajeme pekný deň,\nTím podpory AutoOps',
    isSystem: true,
  }
];

// Utility to parse placeholders from custom string format i.e. {{placeholder}}
function extractPlaceholders(text: string): string[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = new Set<string>();
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.add(match[1].trim());
  }
  return Array.from(matches);
}

// Utility to substitute placeholders instantly inside subject/body
function replacePlaceholders(text: string, values: Record<string, string>): string {
  let result = text;
  Object.entries(values).forEach(([key, val]) => {
    const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\{\\{\\s*${escapedKey}\\s*\\}\\}`, 'g');
    result = result.replace(regex, val || `{{${key}}}`);
  });
  return result;
}

export const EmailComposer: React.FC = () => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  
  // Initialize from draft stored in localStorage if available
  const [formData, setFormData] = useState(() => {
    const savedDraft = localStorage.getItem('autoops_email_draft');
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (e) {
        console.error("Failed parsing email draft", e);
      }
    }
    return {
      to: '',
      subject: '',
      body: ''
    };
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSaved, setLastSaved] = useState<string | null>(() => {
    return localStorage.getItem('autoops_email_draft_saved_at') || null;
  });

  // Periodically auto-save draft content into localStorage
  useEffect(() => {
    if (!formData.to && !formData.subject && !formData.body) {
      setSaveStatus('idle');
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      localStorage.setItem('autoops_email_draft', JSON.stringify(formData));
      const nowStr = new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      localStorage.setItem('autoops_email_draft_saved_at', nowStr);
      setLastSaved(nowStr);
      setSaveStatus('saved');
    }, 1500); // Debounce saves with 1.5s idle timeout

    return () => clearTimeout(timer);
  }, [formData]);

  // State managers for template workflows
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => {
    const saved = localStorage.getItem('autoops_email_templates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed parsing email templates", e);
      }
    }
    return DEFAULT_TEMPLATES;
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'smart_reply'>('smart_reply');
  
  // Custom template builder fields
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    body: ''
  });

  // Dynamic variable values currently being filled
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // List of mock email threads for Gemini Smart Reply context
  const SMART_REPLY_THREADS = [
    { 
      id: '1', 
      sender: 'Milan K.', 
      email: 'milan.k@gmail.com', 
      subject: 'Zmena v objednávke #1233', 
      message: 'Prosím o zmenu adresy doručenia na ul. Mlynská 4, Košice, nakoľko som pôvodne zadal zlé PSČ. Ešte to nebolo odoslané?',
      source: 'Gmail'
    },
    { 
      id: '2', 
      sender: '_nina.style_', 
      email: 'nina@instagram.com', 
      subject: 'Otázka na veľkosť', 
      message: 'Ahojte, budú tieto šaty aj v modrej farbe? Na webe vidím len čierne a biele vo veľkosti M. Ďakujem!',
      source: 'Instagram'
    },
    { 
      id: '3', 
      sender: 'Jozef T.', 
      email: 'jozef.t@support.sk', 
      subject: 'Reklamácia #990', 
      message: 'Tovar mi prišiel poškodený, krabica bola preliačená a vnútri je prasknutý plast. Posielam fotky v prílohe. Žiadam o refundáciu.',
      source: 'Support'
    },
    { 
      id: 'custom', 
      sender: 'Vlastný zákazník', 
      email: 'zakaznik@priklad.sk', 
      subject: 'Vlastná téma', 
      message: '', 
      source: 'Vlastný'
    }
  ];

  // Smart reply states
  const [selectedThreadId, setSelectedThreadId] = useState<string>('1');
  const [customSender, setCustomSender] = useState<string>('');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<string>('profesionálny');
  const [smartReplies, setSmartReplies] = useState<Array<{strategy: string; subject: string; body: string}>>([]);
  const [isSmartLoading, setIsSmartLoading] = useState<boolean>(false);
  const [smartError, setSmartError] = useState<string | null>(null);

  const currentThread = SMART_REPLY_THREADS.find(t => t.id === selectedThreadId);

  // Prepopulate email target on selection changes
  useEffect(() => {
    if (currentThread && currentThread.id !== 'custom') {
      setFormData(prev => ({ ...prev, to: currentThread.email }));
    } else if (currentThread && currentThread.id === 'custom') {
      setFormData(prev => ({ ...prev, to: customSender ? `${customSender.toLowerCase().replace(/\s+/g, '')}@gmail.com` : 'zakaznik@priklad.sk' }));
    }
  }, [selectedThreadId, customSender]);

  const handleGenerateSmartReply = async () => {
    setIsSmartLoading(true);
    setSmartError(null);
    setSmartReplies([]);

    const senderName = selectedThreadId === 'custom' ? (customSender || 'Zákazník') : (currentThread?.sender || 'Zákazník');
    const threadSubject = selectedThreadId === 'custom' ? (customSubject || 'Podpora') : (currentThread?.subject || '');
    const threadMessage = selectedThreadId === 'custom' ? customMessage : (currentThread?.message || '');

    if (!threadMessage.trim()) {
      setSmartError('Zadajte, prosím, obsah správy od zákazníka na analýzu.');
      setIsSmartLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/gemini/smart-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: senderName,
          subject: threadSubject,
          message: threadMessage,
          tone: selectedTone,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Generovanie odpovedí zlyhalo.');
      }

      const data = await response.json();
      if (data && data.replies && Array.isArray(data.replies)) {
        setSmartReplies(data.replies);
        showNotification('Gemini vygeneroval 3 inteligentné odpovede.', 'success');
      } else {
        throw new Error('Nedošlo k vráteniu správneho formátu odpovedí.');
      }
    } catch (err: any) {
      console.error(err);
      setSmartError(err.message || 'Chyba spojenia so serverom.');
    } finally {
      setIsSmartLoading(false);
    }
  };

  // Sync templates to storage automatically
  useEffect(() => {
    localStorage.setItem('autoops_email_templates', JSON.stringify(templates));
  }, [templates]);

  // Read current template properties
  const currentTemplate = templates.find(t => t.id === selectedTemplateId);
  const currentPlaceholders = currentTemplate 
    ? Array.from(new Set([
        ...extractPlaceholders(currentTemplate.subject),
        ...extractPlaceholders(currentTemplate.body)
      ]))
    : [];

  // Re-initialize values whenever selected template changes
  useEffect(() => {
    if (currentTemplate) {
      const vars: Record<string, string> = {};
      currentPlaceholders.forEach(p => {
        // Pre-fill smart defaults for common terms if possible
        if (p === 'cislo_objednavky') vars[p] = '#4492';
        else if (p === 'meno_zakaznika') vars[p] = 'Ján';
        else if (p === 'logisticky_partner') vars[p] = 'Packeta';
        else if (p === 'zlava') vars[p] = 'CYBER10';
        else if (p === 'ciastka') vars[p] = '49.99 €';
        else if (p === 'pocet_dni') vars[p] = '3';
        else if (p === 'odkaz_hodnotenie') vars[p] = 'autoops.sk/spatna-vazba';
        else vars[p] = '';
      });
      setVariableValues(vars);
    }
  }, [selectedTemplateId]);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate SMTP delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSending(false);
    setIsSent(true);

    // Clear saved draft on successful send
    localStorage.removeItem('autoops_email_draft');
    localStorage.removeItem('autoops_email_draft_saved_at');
    setLastSaved(null);
    setSaveStatus('idle');
    
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
      showNotification('AI úspešne vygenerovala a pridala text.', 'success');
    }, 1200);
  };

  const handleApplyTemplate = (withSubstitution: boolean) => {
    if (!currentTemplate) return;

    if (withSubstitution) {
      const compiledSubject = replacePlaceholders(currentTemplate.subject, variableValues);
      const compiledBody = replacePlaceholders(currentTemplate.body, variableValues);
      setFormData(prev => ({
        ...prev,
        subject: compiledSubject,
        body: compiledBody
      }));
      showNotification(`Šablóna "${currentTemplate.name}" s dosadenými hodnotami bola úspešne načítaná do editora!`, 'success');
    } else {
      setFormData(prev => ({
        ...prev,
        subject: currentTemplate.subject,
        body: currentTemplate.body
      }));
      showNotification(`Surová šablóna "${currentTemplate.name}" s premennými bola úspešne prenesená.`, 'info');
    }
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name.trim() || !newTemplate.subject.trim() || !newTemplate.body.trim()) {
      showNotification('Vyplňte, prosím, všetky požadované polia šablóny.', 'info');
      return;
    }

    const created: EmailTemplate = {
      id: 'custom-' + Date.now(),
      name: newTemplate.name.trim(),
      subject: newTemplate.subject.trim(),
      body: newTemplate.body.trim(),
      isSystem: false
    };

    setTemplates(prev => [...prev, created]);
    setSelectedTemplateId(created.id);
    setNewTemplate({ name: '', subject: '', body: '' });
    setActiveTab('browse');
    showNotification('Vlastná komunikačná šablóna úspešne uložená!', 'success');
  };

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTemplates(prev => prev.filter(t => t.id !== id));
    if (selectedTemplateId === id) {
      setSelectedTemplateId('');
    }
    showNotification('Šablóna bola trvalo vymazaná.', 'info');
  };

  // Render text for live preview inside our helper sidebar
  const previewSubject = currentTemplate 
    ? replacePlaceholders(currentTemplate.subject, variableValues) 
    : '';
  const previewBody = currentTemplate 
    ? replacePlaceholders(currentTemplate.body, variableValues) 
    : '';

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-[1440px] mx-auto px-4 md:px-8 w-full relative">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl border z-50 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-bold font-mono tracking-tight bg-slate-900/90 border-white/20 text-white"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Composer Form (8 spans on large screens) */}
        <div className="lg:col-span-7 xl:col-span-8 relative">
          <AnimatePresence mode="wait">
            {isSent ? (
              <motion.div 
                key="sent-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-6 min-h-[580px]"
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
                className="glass-card overflow-hidden flex flex-col min-h-[580px] border border-white/10 shadow-2xl"
              >
                <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-brand-purple" />
                    </div>
                    <span className="text-sm font-bold text-white">Nová odchádzajúca správa</span>
                    
                    {/* Visual draft auto-saved badge */}
                    {(saveStatus === 'saving' || saveStatus === 'saved' || lastSaved) && (
                      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[10px] font-mono select-none">
                        {saveStatus === 'saving' ? (
                          <>
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-white/40">Ukladám návrh...</span>
                          </>
                        ) : (
                          <>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-white/60">Uložené {lastSaved ? `o ${lastSaved}` : ''}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="p-2 hover:bg-white/5 rounded-lg text-white/40 transition-colors"><Maximize2 className="w-4 h-4" /></button>
                    <button type="button" className="p-2 hover:bg-white/5 rounded-lg text-white/40 transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                </div>

                <form onSubmit={handleSend} className="flex-1 flex flex-col">
                  <div className="p-6 space-y-4 flex-1 flex flex-col">
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
                        placeholder="Predmet správy alebo šablóna..."
                        className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm font-medium"
                      />
                    </div>

                    <div className="relative flex-1 py-4 flex flex-col min-h-[300px]">
                      <textarea 
                        required
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                        placeholder="Napíšte správu, vyberte šablónu na pravej strane alebo použite AI na vytvorenie kúzla..."
                        className="w-full flex-1 min-h-[300px] bg-transparent border-none focus:outline-none text-white text-sm leading-relaxed resize-none scrollbar-hide"
                      />
                      
                      <AnimatePresence>
                        {isAIGenerating && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#050508]/80 backdrop-blur-[2px] flex items-center justify-center z-10"
                          >
                             <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/10 shadow-xl">
                                <Sparkles className="w-4 h-4 text-[#00f5ff] animate-pulse" />
                                <span className="text-xs font-mono text-[#00f5ff]">AI premýšľa...</span>
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-auto p-6 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-1 flex-wrap">
                      <button type="button" className="p-3 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"><Paperclip className="w-5 h-5" /></button>
                      <button type="button" className="p-3 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"><ImageIcon className="w-5 h-5" /></button>
                      <button type="button" className="p-3 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"><Smile className="w-5 h-5" /></button>
                      <div className="w-[1px] h-6 bg-white/10 mx-2 hidden md:block" />
                      <button 
                        type="button" 
                        onClick={generateWithAI}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-cyan/10 border border-[#00f5ff]/20 text-[#00f5ff] text-xs font-bold hover:bg-[#00f5ff]/20 transition-all uppercase tracking-widest font-mono"
                      >
                        <Sparkles className="w-3 h-3 text-[#00f5ff]" />
                        Kúzelný AI Návrh
                      </button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button 
                        type="button" 
                        onClick={() => {
                          setFormData({ to: '', subject: '', body: '' });
                          localStorage.removeItem('autoops_email_draft');
                          localStorage.removeItem('autoops_email_draft_saved_at');
                          setLastSaved(null);
                          setSaveStatus('idle');
                          showNotification('Návrh správy bol vymazaný.', 'info');
                        }}
                        className="p-3 hover:bg-red-500/10 rounded-xl text-white/20 hover:text-red-500 transition-all"
                        title="Vymazať návrh"
                      >
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

        {/* Right Column: Template panel (4-5 spans) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="glass-card overflow-hidden border border-white/10 shadow-2xl flex flex-col min-h-[620px]">
            {/* Header Tabs */}
            <div className="flex border-b border-white/5 bg-white/[0.02]">
              <button
                onClick={() => setActiveTab('browse')}
                className={cn(
                  "flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-wider font-mono transition-all border-b-2 flex items-center justify-center gap-1.5",
                  activeTab === 'browse' 
                    ? "text-[#00f5ff] border-[#00f5ff] bg-white/[0.01]" 
                    : "text-white/40 border-transparent hover:text-white/75 hover:bg-white/[0.005]"
                )}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Šablóny
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={cn(
                  "flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-wider font-mono transition-all border-b-2 flex items-center justify-center gap-1.5",
                  activeTab === 'create' 
                    ? "text-[#a855f7] border-[#a855f7] bg-white/[0.01]" 
                    : "text-white/40 border-transparent hover:text-white/75 hover:bg-white/[0.005]"
                )}
              >
                <Plus className="w-3.5 h-3.5" />
                Nová
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('smart_reply')}
                className={cn(
                  "flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-wider font-mono transition-all border-b-2 flex items-center justify-center gap-1.5",
                  activeTab === 'smart_reply' 
                    ? "text-rose-400 border-rose-400 bg-white/[0.01]" 
                    : "text-white/40 border-transparent hover:text-white/75 hover:bg-white/[0.005]"
                )}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                Smart Reply AI
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col overflow-y-auto max-h-[540px] scrollbar-hide">
              <AnimatePresence mode="wait">
                {activeTab === 'browse' ? (
                  <motion.div
                    key="browse-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 flex-1 flex flex-col"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">Zoznam uloženej komunikácie</span>
                      <div className="grid grid-cols-1 gap-2.5 mt-2">
                        {templates.map((template) => {
                          const isSelected = selectedTemplateId === template.id;
                          const vars = Array.from(new Set([
                            ...extractPlaceholders(template.subject),
                            ...extractPlaceholders(template.body)
                          ]));

                          return (
                            <div
                              key={template.id}
                              onClick={() => setSelectedTemplateId(template.id)}
                              className={cn(
                                "p-3.5 rounded-xl border transition-all cursor-pointer group flex items-start gap-3 relative overflow-hidden",
                                isSelected 
                                  ? "bg-gradient-to-br from-[#00f5ff]/5 to-transparent border-[#00f5ff]/50 shadow-md shadow-[#00f5ff]/5" 
                                  : "bg-[#050508]/40 border-white/5 hover:border-white/20 hover:bg-[#050508]/80"
                              )}
                            >
                              <div className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                                isSelected ? "bg-[#00f5ff]/10 text-[#00f5ff]" : "bg-white/5 text-white/30 group-hover:text-white"
                              )}>
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0 pr-8">
                                <div className="text-xs font-bold text-white/90 truncate flex items-center gap-1.5 font-sans">
                                  {template.name}
                                  {template.isSystem && (
                                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-brand-purple/20 text-brand-purple/80 font-mono tracking-tighter uppercase">systémová</span>
                                  )}
                                </div>
                                <div className="text-[10px] text-white/40 truncate font-mono mt-0.5">Predmet: {template.subject}</div>
                                {vars.length > 0 && (
                                  <div className="flex items-center gap-1 flex-wrap mt-1.5">
                                    {vars.map(v => (
                                      <span key={v} className="text-[8px] font-mono px-1 rounded bg-[#00f5ff]/10 text-[#00f5ff]/70 border border-[#00f5ff]/10">
                                        {v}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {!template.isSystem && (
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteTemplate(template.id, e)}
                                  className="absolute top-3.5 right-3 w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                                  title="Vymazať šablónu"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <AnimatePresence>
                      {currentTemplate ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-4 border-t border-white/5 mt-auto space-y-4"
                        >
                          {currentPlaceholders.length > 0 && (
                            <div className="space-y-3 bg-[#050508]/70 p-4 border border-white/5 rounded-xl">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[#00f5ff] flex items-center gap-1.5">
                                <Code className="w-3.5 h-3.5 text-[#00f5ff]" />
                                Dynamické Premenné
                              </span>
                              <div className="grid grid-cols-1 gap-2.5">
                                {currentPlaceholders.map(param => (
                                  <div key={param} className="space-y-1">
                                    <label className="text-[9px] font-mono text-white/40 block">
                                      {`{{ ${param} }}`}
                                    </label>
                                    <input
                                      type="text"
                                      value={variableValues[param] || ''}
                                      onChange={(e) => setVariableValues({
                                        ...variableValues,
                                        [param]: e.target.value
                                      })}
                                      placeholder={`Zadajte hodnotu pre ${param}...`}
                                      className="w-full bg-[#050507] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f5ff] focus:ring-1 focus:ring-[#00f5ff] transition-all font-sans"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Live preview */}
                          <div className="bg-[#050508]/30 border border-white/5 rounded-xl p-4 space-y-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-white/30 flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" /> Live Náhľad
                            </span>
                            <div className="text-xs text-brand-purple font-mono font-bold">
                              Predmet: {previewSubject || currentTemplate.subject}
                            </div>
                            <div className="text-[11px] text-white/50 bg-[#050507]/20 border border-white/5 p-3 rounded-lg overflow-y-auto max-h-40 whitespace-pre-line font-sans scrollbar-hide">
                              {previewBody || currentTemplate.body}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => handleApplyTemplate(true)}
                              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#00f5ff]/20 to-[#a855f7]/20 border border-[#00f5ff]/20 hover:from-[#00f5ff]/30 hover:to-[#a855f7]/30 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                            >
                              <Check className="w-4 h-4 text-[#00f5ff]" />
                              Doplniť & Načítať
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyTemplate(false)}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                            >
                              <FileCode className="w-4 h-4 text-white/40" />
                              Surová šablóna
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-white/20 select-none">
                          <FolderOpen className="w-12 h-12 stroke-[1] mb-2" />
                          <span className="text-xs font-semibold">Vyberte šablónu zo zoznamu vyššie</span>
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : activeTab === 'create' ? (
                  <motion.form
                    key="create-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleCreateTemplate}
                    className="space-y-4 flex-1 flex flex-col"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">Registrovať novú predlohu</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/60">Názov šablóny</label>
                      <input
                        type="text"
                        required
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        placeholder="napr. Informácia o balíku"
                        className="w-full bg-[#050507] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/60">Predmet správy</label>
                      <input
                        type="text"
                        required
                        value={newTemplate.subject}
                        onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                        placeholder="napr. Vaša objednávka {{cislo}} je na ceste!"
                        className="w-full bg-[#050507] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5 flex-1 flex flex-col">
                      <label className="text-xs font-bold text-white/60">Obsah správy</label>
                      <textarea
                        required
                        value={newTemplate.body}
                        onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                        placeholder={`Dobrý deň {{meno}},\n\npotvrdzujeme doručenie...\n\nS pozdravom,\nTím AutoOps`}
                        className="w-full flex-1 min-h-[160px] bg-[#050507] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all resize-none leading-relaxed"
                      />
                    </div>

                    <div className="bg-[#a855f7]/5 border border-[#a855f7]/10 rounded-xl p-3.5 text-[10px] text-white/50 leading-relaxed font-sans mt-2">
                      <span className="font-bold text-[#a855f7] block uppercase tracking-wider mb-1">💡 TIP PRE PREMENNÉ</span>
                      Vložte premennú použitím symbolu <code className="text-[#00f5ff] font-mono font-bold px-1 py-0.5 rounded bg-white/5">{"{{nazov_premennej}}"}</code>. Klávesnica automaticky vygeneruje interaktívne dialógové polia pre používateľov.
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#00f5ff] text-white font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[#a855f7]/15 hover:shadow-[#a855f7]/25 transition-all mt-auto"
                    >
                      Uložiť šablónu
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="smart-reply-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 flex-1 flex flex-col"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        Smart Reply poháňané Gemini
                      </span>
                    </div>

                    {/* Choose Thread Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/60 block">1. Vyberte prichádzajúci dopyt</label>
                      <select
                        value={selectedThreadId}
                        onChange={(e) => {
                          setSelectedThreadId(e.target.value);
                          setSmartReplies([]);
                          setSmartError(null);
                        }}
                        className="w-full bg-[#050507] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all font-sans"
                      >
                        {SMART_REPLY_THREADS.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.id === 'custom' ? '✏️ Vlastný zákaznícky dopyt...' : `${t.sender}: ${t.subject}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Active Thread description */}
                    {selectedThreadId === 'custom' ? (
                      <div className="space-y-2 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                        <div className="space-y-1">
                          <label className="text-[9px] text-white/40 font-mono block uppercase">Meno zákazníka</label>
                          <input
                            type="text"
                            value={customSender}
                            onChange={(e) => setCustomSender(e.target.value)}
                            placeholder="Zadajte meno (napr. Patrik L.)"
                            className="w-full bg-[#050507] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-400 font-sans"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-white/40 font-mono block uppercase">Predmet správy</label>
                          <input
                            type="text"
                            value={customSubject}
                            onChange={(e) => setCustomSubject(e.target.value)}
                            placeholder="Zadajte tému dopytu"
                            className="w-full bg-[#050507] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-400 font-sans"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-white/40 font-mono block uppercase">Obsah správy</label>
                          <textarea
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            placeholder="Napíšte alebo vložte správu, na ktorú chcete odpovedať..."
                            className="w-full min-h-[90px] bg-[#050507] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-400 font-sans resize-none leading-relaxed"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-[#050508]/60 border border-white/5 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple/80 uppercase font-bold">
                            {currentThread?.source}
                          </span>
                          <span className="text-[10px] text-white/40 font-mono">{currentThread?.email}</span>
                        </div>
                        <p className="text-xs text-white/70 italic leading-relaxed">
                          "{currentThread?.message}"
                        </p>
                      </div>
                    )}

                    {/* Tone Options */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/60 block">2. Vyberte štýl tónu</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'profesionálny', label: '👔 Profesionálny' },
                          { id: 'priateľský', label: '🤝 Priateľský' },
                          { id: 'stručný', label: '⚡ Stručný' },
                          { id: 'ospravedlňujúci', label: '🙏 Ospravedlnenie' }
                        ].map(t => {
                          const isSel = selectedTone === t.id;
                          return (
                            <button
                              type="button"
                              key={t.id}
                              onClick={() => setSelectedTone(t.id)}
                              className={cn(
                                "py-2 text-[11px] rounded-xl border font-medium transition-all text-center flex items-center justify-center cursor-pointer",
                                isSel 
                                  ? "bg-rose-500/10 border-rose-500 text-rose-400 font-bold shadow-sm" 
                                  : "bg-white/[0.02] border-white/5 text-white/50 hover:border-white/20 hover:text-white"
                              )}
                            >
                              {t.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      type="button"
                      onClick={handleGenerateSmartReply}
                      disabled={isSmartLoading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-[#a855f7] hover:brightness-110 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/15 cursor-pointer"
                    >
                      {isSmartLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Gemini generuje návrhy...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Vygenerovať odpovede s AI</span>
                        </>
                      )}
                    </button>

                    {/* Error display */}
                    {smartError && (
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-start gap-2.5 leading-relaxed">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Chyba pri generovaní</p>
                          <p className="opacity-80 mt-1 text-[11px]">{smartError}</p>
                        </div>
                      </div>
                    )}

                    {/* Suggestions output list */}
                    <div className="space-y-3 pt-2">
                      {smartReplies.length > 0 && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400/80 block font-bold">
                          ✨ 3 Inteligentné odpovede pre kampaň:
                        </span>
                      )}

                      {smartReplies.map((reply, index) => (
                        <div 
                          key={index}
                          className="p-3.5 bg-[#050508]/60 border border-white/10 rounded-xl space-y-2 hover:border-rose-500/30 transition-all flex flex-col group"
                        >
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-bold border border-rose-500/10 truncate max-w-[200px]">
                              {reply.strategy}
                            </span>
                            <div className="flex gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  let finalTo = 'zakaznik@priklad.sk';
                                  if (selectedThreadId !== 'custom') {
                                    const thread = SMART_REPLY_THREADS.find(t => t.id === selectedThreadId);
                                    if (thread) finalTo = thread.email;
                                  } else {
                                    finalTo = customSender ? `${customSender.toLowerCase().replace(/\s+/g, '')}@gmail.com` : 'zakaznik@priklad.sk';
                                  }
                                  
                                  setFormData({
                                    to: finalTo,
                                    subject: reply.subject,
                                    body: reply.body
                                  });
                                  showNotification('Návrh úspešne prenesený do hlavného editora!', 'success');
                                }}
                                className="py-1 px-2 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 rounded-lg hover:bg-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3 h-3" /> Použiť
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(reply.body);
                                  showNotification('Text skopírovaný do schránky.', 'success');
                                }}
                                className="p-1 px-1.5 text-white/40 hover:text-white rounded bg-white/5 transition-all cursor-pointer"
                                title="Kopírovať"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-[10px] text-brand-purple font-mono font-medium truncate">
                            Predmet: {reply.subject}
                          </div>
                          <p className="text-[10px] leading-relaxed text-white/60 bg-[#050507]/40 p-2.5 rounded-lg whitespace-pre-line border border-white/5 font-sans">
                            {reply.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized with CRM Info Banner Grid */}
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
