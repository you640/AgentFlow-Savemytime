import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plane,
  Sparkles,
  Power,
  Clock,
  CheckCircle2,
  Moon,
  Bot,
  Play,
  PartyPopper,
} from 'lucide-react';
import { useStore, HOURS_PER_EARNED_DAY } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { sendNotification } from '../../services/notificationService';

// Správy, ktoré agent "vybavuje" počas aktívneho dňa voľna
const FEED_TEMPLATES: ((n: number) => string)[] = [
  (n) => `Vybavil som objednávku #${n} — faktúra odoslaná`,
  () => `Odpovedal som zákazníčke na otázku o veľkosti`,
  () => `Naplánoval som zvoz Packeta na zajtra 9:00`,
  (n) => `Vyriešil som reklamáciu #${n} — náhradný kus na ceste`,
  (n) => `Poslal som platobné inštrukcie k objednávke #${n}`,
  () => `Zálohoval som denný report do SuperFaktúry`,
  (n) => `Upsell: ponúkol som doplnok k objednávke #${n}`,
  () => `Vybavil som DM na Instagrame — rezervácia potvrdená`,
];

interface FeedItem {
  id: number;
  text: string;
  time: string;
}

const randOrder = () => Math.floor(1000 + Math.random() * 9000);
const nowTime = () =>
  new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' });

// Kruhový progress k ďalšiemu dňu voľna
const ProgressRing: React.FC<{ percent: number; label: string; sub: string }> = ({
  percent,
  label,
  sub,
}) => {
  const r = 72;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(percent, 100) / 100);
  return (
    <div className="relative w-[190px] h-[190px]">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 190 190">
        <circle cx="95" cy="95" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <motion.circle
          cx="95"
          cy="95"
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(0,245,255,0.4))' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white neon-text-cyan">{label}</span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 mt-1">{sub}</span>
      </div>
    </div>
  );
};

export const EarnedDayOff: React.FC = () => {
  const { autopilot, bankTime, activateDayOff, logHandledTask, endDayOff } = useStore();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [summaryHandled, setSummaryHandled] = useState<number | null>(null);
  const feedId = useRef(0);

  const percent = (autopilot.hoursBanked / HOURS_PER_EARNED_DAY) * 100;
  const hoursLeft = Math.round((HOURS_PER_EARNED_DAY - autopilot.hoursBanked) * 10) / 10;
  const hasEarnedDay = autopilot.earnedDays >= 1;

  // Živý feed počas aktívneho dňa voľna
  useEffect(() => {
    if (!autopilot.isActive) return;
    const interval = setInterval(() => {
      const tmpl = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)];
      const item: FeedItem = { id: feedId.current++, text: tmpl(randOrder()), time: nowTime() };
      setFeed((prev) => [item, ...prev].slice(0, 8));
      logHandledTask();
    }, 2500);
    return () => clearInterval(interval);
  }, [autopilot.isActive, logHandledTask]);

  const handleActivate = () => {
    if (!hasEarnedDay) return;
    setFeed([]);
    activateDayOff();
    sendNotification('🏖️ Deň voľna spustený', 'Autopilot preberá celý e-shop. Vypni telefón a uži si deň.');
  };

  const handleEnd = () => {
    setSummaryHandled(autopilot.handledToday);
    endDayOff();
    sendNotification(
      '🌙 Autopilot ukončil deň',
      `Dnešok som zvládol. ${autopilot.handledToday} úloh vybavených, 0 problémov.`
    );
  };

  const handleDemoWork = () => {
    const chunk = Math.round((0.5 + Math.random() * 3) * 10) / 10;
    const willEarn = Math.floor((autopilot.hoursBanked + chunk) / HOURS_PER_EARNED_DAY) >= 1;
    bankTime(chunk);
    if (willEarn) {
      sendNotification('🎉 Zarobil si deň voľna!', 'Agent práve dopracoval na celý deň voľna. Môžeš ho aktivovať.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Plane className="w-7 h-7 text-[#00f5ff]" />
            Autopilot
          </h2>
          <p className="text-white/30 text-xs mt-1 uppercase tracking-widest font-mono">
            Deň voľna, ktorý ti zarobil agent
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-5 py-3 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#a855f7]" />
            <div className="leading-tight">
              <div className="text-lg font-bold text-white">{autopilot.earnedDays}</div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-white/40">Zarobené</div>
            </div>
          </div>
          <div className="glass px-5 py-3 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div className="leading-tight">
              <div className="text-lg font-bold text-white">{autopilot.daysTaken}</div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-white/40">Vyčerpané</div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!autopilot.isActive ? (
          /* ---------- STAV: NEAKTÍVNY ---------- */
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Progress karta */}
            <div className="lg:col-span-5 glass-card p-8 flex flex-col items-center justify-center text-center gap-6">
              <ProgressRing
                percent={percent}
                label={`${autopilot.hoursBanked}h`}
                sub={`z ${HOURS_PER_EARNED_DAY}h`}
              />
              {hasEarnedDay ? (
                <div className="flex items-center gap-2 text-emerald-400">
                  <PartyPopper className="w-5 h-5" />
                  <span className="font-bold">Máš zarobený deň voľna!</span>
                </div>
              ) : (
                <p className="text-white/50 text-sm">
                  Ešte <span className="text-[#00f5ff] font-bold">{hoursLeft}h</span> práce agenta a máš
                  celý deň voľna.
                </p>
              )}
            </div>

            {/* Akcie + vysvetlenie */}
            <div className="lg:col-span-7 glass-card p-8 flex flex-col justify-between gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Ako to funguje</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Zakaždým, keď agent niečo vybaví za teba, napĺňa <b className="text-white">banku času</b>.
                  Keď nazbiera na celý pracovný deň ({HOURS_PER_EARNED_DAY} h), odomkne ti ho.
                  Ty ho aktivuješ, vypneš telefón — a agent riadi celý e-shop sám. Večer dostaneš
                  jednu vetu so súhrnom.
                </p>
              </div>

              <button
                onClick={handleActivate}
                disabled={!hasEarnedDay}
                className={cn(
                  'w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all',
                  hasEarnedDay
                    ? 'bg-gradient-to-r from-[#00f5ff] to-[#a855f7] text-black hover:brightness-110 neon-glow-cyan'
                    : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                )}
              >
                <Power className="w-5 h-5" />
                {hasEarnedDay ? 'Aktivovať deň voľna' : `Ešte ${hoursLeft}h k dňu voľna`}
              </button>

              <button
                onClick={handleDemoWork}
                className="w-full py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-[#00f5ff] bg-white/[0.03] hover:bg-[#00f5ff]/5 border border-white/5 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                Nechať agenta pracovať (demo)
              </button>
            </div>
          </motion.div>
        ) : (
          /* ---------- STAV: AKTÍVNY AUTOPILOT ---------- */
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Kľudový panel */}
            <div className="lg:col-span-5 glass-card p-8 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden">
              <div className="absolute -inset-10 bg-gradient-to-br from-[#00f5ff]/10 to-[#a855f7]/10 blur-3xl -z-10" />
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00f5ff] to-[#a855f7] flex items-center justify-center neon-glow-cyan"
              >
                <Bot className="w-11 h-11 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white">Autopilot beží</h3>
                <p className="text-white/50 text-sm mt-2 max-w-xs">
                  Vypni telefón a uži si deň. Firma je v poriadku — ozvem sa len ak by naozaj horelo.
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white neon-text-cyan">{autopilot.handledToday}</span>
                <span className="text-[#00f5ff] font-mono text-xs uppercase tracking-widest">úloh vybavených</span>
              </div>
              <button
                onClick={handleEnd}
                className="mt-2 px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
              >
                <Moon className="w-4 h-4" />
                Ukončiť deň
              </button>
            </div>

            {/* Živý feed */}
            <div className="lg:col-span-7 glass-card p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                Naživo — čo agent práve vybavuje
              </h3>
              {feed.length === 0 ? (
                <p className="text-white/30 text-sm font-mono">Spúšťam autonómny režim…</p>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {feed.map((f) => (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-sm text-white/80 flex-1">{f.text}</span>
                        <span className="text-[10px] font-mono text-white/20">{f.time}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Večerný súhrn */}
      <AnimatePresence>
        {summaryHandled !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSummaryHandled(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-8 max-w-md w-full text-center space-y-5"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#a855f7]/15 flex items-center justify-center">
                <Moon className="w-8 h-8 text-[#a855f7]" />
              </div>
              <h3 className="text-xl font-bold text-white">Dnešok som zvládol.</h3>
              <p className="text-white/60 text-lg leading-relaxed">
                Firma bežala. <b className="text-white">{summaryHandled} úloh</b> vybavených,{' '}
                <b className="text-emerald-400">0 problémov</b>.
                <br />
                Uži si zajtrajšok. 🌅
              </p>
              <button
                onClick={() => setSummaryHandled(null)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#a855f7] text-black font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Zavrieť
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
