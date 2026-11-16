import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Send,
  Sparkles,
  RotateCcw,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  at: number;
}

const WELCOME_TEXT =
  'Ahoj, som Ela 👋 Som tu na to, aby ti mesačne vracala ten najcennejší zdroj — čas. Čo ti teraz najviac leží na srdci? ☕';

// Ukážkové rýchle vstupy — nalievame ich do inputu jedným klikom.
const QUICK_PROMPTS: Array<{ label: string; text: string }> = [
  { label: '🧾 Zákazník žiada refund', text: 'Zákazník žiada vrátenie peňazí za objednávku #8821. Ako najjemnejšie odpovedať?' },
  { label: '📦 Meškajúca Packeta', text: 'Packeta zásielka mešká 3 dni. Čo poslať zákazníkovi, aby bol pokojný?' },
  { label: '💡 Ako zarobiť deň voľna rýchlejšie', text: 'Čo môžem dnes nechať na teba, aby som skôr zarobil deň voľna?' },
  { label: '📊 Pozri analytiku a poraď', text: 'Rýchlo pozri posledný týždeň v analytike a povedz mi jednu konkrétnu vec, čo zlepšiť.' },
];

const now = () =>
  new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' });

export const EliChat: React.FC = () => {
  const { autopilot, streak, timeSavedCount } = useStore();
  const reduceMotion = useReducedMotion();

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: 'assistant', content: WELCOME_TEXT, at: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigError, setIsConfigError] = useState(false);
  const msgId = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll na posledné správy
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      setIsConfigError(false);

      const userMsg: ChatMessage = {
        id: msgId.current++,
        role: 'user',
        content: trimmed,
        at: Date.now(),
      };
      const newHistory = [...messages, userMsg];
      setMessages(newHistory);
      setInput('');
      setLoading(true);

      try {
        const res = await fetch('/api/mistral/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
            context: {
              banka_casu_hodin: autopilot.hoursBanked,
              zarobene_dni_volna: autopilot.earnedDays,
              vycerpane_dni_volna: autopilot.daysTaken,
              seria_dni_po_sebe: streak.current,
              celkovo_usetreny_cas_hodin: timeSavedCount,
            },
          }),
        });

        const payload = await res.json().catch(() => ({ error: 'Neplatná odpoveď servera.' }));

        if (!res.ok) {
          setError(payload?.error || `Chyba (${res.status}).`);
          if (payload?.isConfigError) setIsConfigError(true);
          return;
        }

        const reply: string = payload?.reply ?? '';
        setMessages((prev) => [
          ...prev,
          { id: msgId.current++, role: 'assistant', content: reply, at: Date.now() },
        ]);
      } catch (err: any) {
        setError(err?.message || 'Elu sa nepodarilo kontaktovať.');
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, autopilot, streak, timeSavedCount]
  );

  const reset = () => {
    setMessages([{ id: 0, role: 'assistant', content: WELCOME_TEXT, at: Date.now() }]);
    setError(null);
    setIsConfigError(false);
    msgId.current = 1;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="min-w-0">
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <motion.span
              animate={reduceMotion ? undefined : { rotate: [0, 8, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
              aria-hidden
            >
              ✨
            </motion.span>
            Ela — tvoja operačka
          </h2>
          <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-mono">
            Tu som, aby som ti vrátila čas · poháňa ma Mistral
          </p>
        </div>
        <button
          onClick={reset}
          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f5ff]/50"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Nový rozhovor
        </button>
      </header>

      {/* Chat card */}
      <div className="glass-card p-0 overflow-hidden flex flex-col h-[70vh] min-h-[480px]">
        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-none"
          aria-live="polite"
        >
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words',
                  m.role === 'user'
                    ? 'bg-[#00f5ff]/10 border border-[#00f5ff]/20 text-white'
                    : 'bg-white/[0.04] border border-white/10 text-white/90'
                )}
              >
                {m.content}
                <div
                  className={cn(
                    'mt-1.5 text-[10px] font-mono tracking-widest uppercase',
                    m.role === 'user' ? 'text-[#00f5ff]/60 text-right' : 'text-white/30'
                  )}
                >
                  {m.role === 'assistant' ? 'Ela · ' : 'Ty · '}
                  {new Date(m.at).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 bg-white/[0.04] border border-white/10 text-white/60 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#a855f7]" />
                Ela premýšľa…
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-2xl px-4 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="flex-1">
                <p className="font-medium">{error}</p>
                {isConfigError && (
                  <p className="text-xs mt-1 text-rose-300/80">
                    V produkcii nastav{' '}
                    <code className="font-mono bg-black/30 px-1 py-0.5 rounded">MISTRAL_API_KEY</code>{' '}
                    v Vercel → Settings → Environment Variables a redeployni.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="px-4 md:px-6 pb-3 flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q.label}
                onClick={() => send(q.text)}
                disabled={loading}
                className="text-[11px] font-mono uppercase tracking-widest text-white/50 hover:text-[#00f5ff] bg-white/[0.03] hover:bg-[#00f5ff]/10 border border-white/5 hover:border-[#00f5ff]/20 rounded-lg px-3 py-1.5 transition-all"
              >
                {q.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-white/5 p-3 md:p-4 bg-white/[0.02] flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Napíš Ele — Enter odošle, Shift+Enter = nový riadok"
            rows={1}
            aria-label="Správa pre Elu"
            className="flex-1 min-w-0 resize-none max-h-32 bg-transparent text-white placeholder:text-white/30 text-sm focus:outline-none px-3 py-2.5 rounded-xl border border-white/10 focus:border-[#00f5ff]/40 transition-colors"
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            aria-label="Odoslať správu"
            className={cn(
              'shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f5ff]',
              loading || !input.trim()
                ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-br from-[#00f5ff] to-[#a855f7] text-black hover:brightness-110 neon-glow-cyan'
            )}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Hint stripe */}
      <div className="glass-card p-4 md:p-5 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-[#a855f7] shrink-0 mt-0.5" />
        <p className="text-xs md:text-sm text-white/60 leading-relaxed">
          Ela vidí tvoj aktuálny stav Autopilota (banku času, sériu, zarobené dni voľna) a prispôsobuje
          odpovede. Vyskúšaj: „pomôž mi s touto správou od zákazníka…" alebo „čo môžem dnes nechať na teba?".
        </p>
      </div>
    </div>
  );
};
