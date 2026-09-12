import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Clock, 
  Zap, 
  Mail, 
  Eye, 
  MousePointerClick, 
  ArrowUpRight, 
  Search, 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  Plus, 
  X, 
  ChevronDown, 
  CheckCircle, 
  Calendar, 
  SlidersHorizontal,
  ThumbsUp,
  BarChart3,
  Percent,
  MessageSquareCode,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// Colors for Pie/Donut Chart
const COLORS = ['#00f5ff', '#a855f7', '#f43f5e', '#10b981', '#f59e0b'];

interface SentCommunication {
  id: string;
  templateName: string;
  subject: string;
  recipient: string;
  sentAt: string;
  source: 'gmail' | 'eshop' | 'support' | 'custom';
  openRate: number; // in %
  clickRate: number; // in %
  responseTimeSeconds: number; // average response time to customer reply
  status: 'opened' | 'clicked' | 'delivered' | 'bounced';
  body: string;
}

const INITIAL_SENT_COMMUNICATIONS: SentCommunication[] = [
  {
    id: 'c-1',
    templateName: 'Zmena doručovacej adresy',
    subject: 'Potvrdenie zmeny doručovacej adresy - Objednávka #1233',
    recipient: 'milan.k@azet.sk',
    sentAt: '2026-06-10 14:20',
    source: 'eshop',
    openRate: 98,
    clickRate: 15,
    responseTimeSeconds: 300, // 5 min
    status: 'opened',
    body: 'Dobrý deň pán K., potvrdzujeme, že Vaša doručovacia adresa pre objednávku #1233 bola úspešne upravená na ul. Mlynská 4, 040 01 Košice podľa Vášho dopytu. Radi pomôžeme s ďalšími zmenami.'
  },
  {
    id: 'c-2',
    templateName: 'Výzva k úhrade bankovým prevodom',
    subject: 'Platobné inštrukcie k objednávke #8821',
    recipient: 'petra.m@azet.sk',
    sentAt: '2026-06-10 13:10',
    source: 'eshop',
    openRate: 92,
    clickRate: 85,
    responseTimeSeconds: 600, // 10 min
    status: 'clicked',
    body: 'Dobrý deň Petra, ďakujeme za Vašu objednávku #8821. Na základe Vašej voľby Vám zasielame platobné detaily: IBAN: SK12 0900 0000 0012 3456 7890, VS: 8821. Tovar vyexpedujeme ihneď po registrácii platby.'
  },
  {
    id: 'c-3',
    templateName: 'Predbežná rezervácia farby',
    subject: 'Rezervácia veľkosti M (tmavomodrá) potvrdene',
    recipient: 'nina.style@instagram.com',
    sentAt: '2026-06-10 11:00',
    source: 'support',
    openRate: 100,
    clickRate: 90,
    responseTimeSeconds: 900, // 15 min
    status: 'clicked',
    body: 'Ahoj Nina! Modrý variant naskladňujeme už tento piatok o 10:00 v limitovanom počte. Úspešne sme Vám rezervovali veľkosť M v našom systéme.'
  },
  {
    id: 'c-4',
    templateName: 'Poškodenie balíka - náhradný diel',
    subject: 'Riešenie poškodenia reklamácie #990',
    recipient: 'jozef.t@gmail.com',
    sentAt: '2026-06-09 17:15',
    source: 'support',
    openRate: 88,
    clickRate: 42,
    responseTimeSeconds: 2700, // 45 min
    status: 'opened',
    body: 'Vážený pán Jozef, úprimne sa ospravedlňujeme za vzniknuté nepríjemnosti. Už zajtra Vám bezplatne zašleme nový bezchybný kus.'
  },
  {
    id: 'c-5',
    templateName: 'Dotazník spokojnosti',
    subject: 'Ako ste spokojný s vybavením objednávky #8113?',
    recipient: 'tomas.v@centrum.sk',
    sentAt: '2026-06-09 10:30',
    source: 'support',
    openRate: 45,
    clickRate: 22,
    responseTimeSeconds: 0, // No reply expected
    status: 'delivered',
    body: 'Dobrý deň, radi by sme sa spýtali, akú skúsenosť ste mali s naším personálom a doručením objednaného tovaru. Pomôžte nám zlepšiť náš eshop.'
  },
  {
    id: 'c-6',
    templateName: 'Expedícia zásielky',
    subject: 'Zásielka z Vášho obchodu bola odovzdaná prepravcovi Packeta',
    recipient: 'kovac.peter@gmail.com',
    sentAt: '2026-06-08 16:45',
    source: 'eshop',
    openRate: 85,
    clickRate: 78,
    responseTimeSeconds: 120, // 2 min
    status: 'clicked',
    body: 'Dobrý deň Peter, Vaša zásielka bola práve expedovaná a odovzdaná kuriérovi Packeta. Sledovacie číslo zásielky: Z12245318.'
  },
  {
    id: 'c-7',
    templateName: 'Upozornenie na nedokončený nákup',
    subject: 'Zabudli ste niečo v nákupnom košíku?',
    recipient: 'lenka.k@gmail.com',
    sentAt: '2026-06-08 09:12',
    source: 'gmail',
    openRate: 52,
    clickRate: 28,
    responseTimeSeconds: 0,
    status: 'opened',
    body: 'Ahoj Lenka, všimli sme si, že v košíku máš stále uložené vybrané kúsky z našej najnovšej limitovanej kolekcie. Dokonči nákup v nasledujúcich 24 hodinách a získaj zľavu 10% s kódom KOSIK10.'
  },
  {
    id: 'c-8',
    templateName: 'Nedoručený e-mail (Mailbox plný)',
    subject: 'Upozornenie o vytvorení účtu eshopu',
    recipient: 'chybny_mail@neexistuje.sk',
    sentAt: '2026-06-07 15:30',
    source: 'custom',
    openRate: 0,
    clickRate: 0,
    responseTimeSeconds: 0,
    status: 'bounced',
    body: 'Vitajte v našom zákazníckom klube! Vaša registrácia prebehla úspešne. Prihlasovacie meno: chybny_mail@neexistuje.sk.'
  }
];

// Historical Trend Data over Last 7 Days
const INITIAL_TREND_DATA = [
  { Day: 'Št', Sent: 120, OpenRate: 72, ClickRate: 38, AIResponseMin: 2.1, HumanResponseMin: 45 },
  { Day: 'Pi', Sent: 145, OpenRate: 75, ClickRate: 41, AIResponseMin: 1.8, HumanResponseMin: 42 },
  { Day: 'So', Sent: 80,  OpenRate: 78, ClickRate: 46, AIResponseMin: 1.5, HumanResponseMin: 55 },
  { Day: 'Ne', Sent: 95,  OpenRate: 82, ClickRate: 49, AIResponseMin: 1.3, HumanResponseMin: 60 },
  { Day: 'Po', Sent: 190, OpenRate: 71, ClickRate: 35, AIResponseMin: 2.3, HumanResponseMin: 38 },
  { Day: 'Ut', Sent: 210, OpenRate: 74, ClickRate: 40, AIResponseMin: 1.9, HumanResponseMin: 35 },
  { Day: 'St', Sent: 154, OpenRate: 81, ClickRate: 48, AIResponseMin: 1.2, HumanResponseMin: 32 },
];

// Monthly aggregate metrics to simulate different time views
const TREND_DATA_30_DAYS = [
  { Day: 'Týždeň 1', Sent: 780, OpenRate: 72, ClickRate: 38, AIResponseMin: 2.4, HumanResponseMin: 48 },
  { Day: 'Týždeň 2', Sent: 910, OpenRate: 74, ClickRate: 41, AIResponseMin: 1.9, HumanResponseMin: 43 },
  { Day: 'Týždeň 3', Sent: 840, OpenRate: 76, ClickRate: 44, AIResponseMin: 1.6, HumanResponseMin: 39 },
  { Day: 'Týždeň 4', Sent: 1020, OpenRate: 79, ClickRate: 47, AIResponseMin: 1.4, HumanResponseMin: 34 },
];

const TREND_DATA_90_DAYS = [
  { Day: 'Marec', Sent: 3100, OpenRate: 69, ClickRate: 34, AIResponseMin: 2.8, HumanResponseMin: 55 },
  { Day: 'Apríl', Sent: 3420, OpenRate: 73, ClickRate: 39, AIResponseMin: 2.1, HumanResponseMin: 49 },
  { Day: 'Máj', Sent: 3950, OpenRate: 77, ClickRate: 43, AIResponseMin: 1.7, HumanResponseMin: 41 },
  { Day: 'Jún (Akt.)', Sent: 1540, OpenRate: 80, ClickRate: 48, AIResponseMin: 1.3, HumanResponseMin: 33 },
];

export const EmailPerformanceDashboard: React.FC = () => {
  // State for all sent communication logs & dashboard values
  const [communications, setCommunications] = useState<SentCommunication[]>(INITIAL_SENT_COMMUNICATIONS);
  const [trendData, setTrendData] = useState(INITIAL_TREND_DATA);
  const [timePeriod, setTimePeriod] = useState<'7d' | '30d' | '90d'>('7d');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulation Modal State
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [simSubject, setSimSubject] = useState('');
  const [simTemplate, setSimTemplate] = useState('Zmena doručenia');
  const [simRecipient, setSimRecipient] = useState('');
  const [simSource, setSimSource] = useState<'gmail' | 'eshop' | 'support' | 'custom'>('support');
  const [simStatus, setSimStatus] = useState<'opened' | 'clicked' | 'delivered'>('clicked');
  const [simMessageText, setSimMessageText] = useState('Dobrý deň, dopyt ohľadom doručenia balíka bol spracovaný naším AutoOps agentom.');

  // Drilled communication details modal/view
  const [detailedCommId, setDetailedCommId] = useState<string | null>(null);

  // SLA Warnings state (KPI Target adjuster state)
  const [kpiTargetOpenRate, setKpiTargetOpenRate] = useState<number>(75);
  const [kpiTargetCTR, setKpiTargetCTR] = useState<number>(40);

  // Resolve active chart dataset based on timeframe
  const activeTrendData = useMemo(() => {
    if (timePeriod === '30d') return TREND_DATA_30_DAYS;
    if (timePeriod === '90d') return TREND_DATA_90_DAYS;
    return trendData;
  }, [timePeriod, trendData]);

  // Handle source filtering and search filtering for logs table
  const filteredCommunications = useMemo(() => {
    return communications.filter(item => {
      const matchSource = selectedSource === 'all' || item.source === selectedSource;
      const matchSearch = searchQuery.trim() === '' || 
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.templateName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSource && matchSearch;
    });
  }, [communications, selectedSource, searchQuery]);

  // Aggregate Key Statistics
  const stats = useMemo(() => {
    const total = filteredCommunications.length;
    if (total === 0) {
      return { totalSent: 0, avgOpenRate: 0, avgCTR: 0, avgResponseTimeMin: 0, bounceCount: 0 };
    }

    const deliveredCount = filteredCommunications.filter(c => c.status !== 'bounced').length;
    const openedCount = filteredCommunications.filter(c => c.status === 'opened' || c.status === 'clicked').length;
    const clickedCount = filteredCommunications.filter(c => c.status === 'clicked').length;
    const bounces = filteredCommunications.filter(c => c.status === 'bounced').length;

    // Response time: only averages communications with non-zero response times
    const withResponse = filteredCommunications.filter(c => c.responseTimeSeconds > 0);
    const totalResponseSeconds = withResponse.reduce((sum, c) => sum + c.responseTimeSeconds, 0);
    const avgResponseTimeMin = withResponse.length > 0 ? (totalResponseSeconds / withResponse.length / 60) : 0;

    // Open/CTR logic: based on initial high-fidelity aggregates plus added variations
    const openSum = filteredCommunications.reduce((sum, c) => sum + c.openRate, 0);
    const ctrSum = filteredCommunications.reduce((sum, c) => sum + c.clickRate, 0);

    return {
      totalSent: total,
      avgOpenRate: Math.round(openSum / total),
      avgCTR: Math.round(ctrSum / total),
      avgResponseTimeMin: Math.round(avgResponseTimeMin * 10) / 10,
      bounceCount: bounces
    };
  }, [filteredCommunications]);

  // Pie chart calculation for channels split out
  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredCommunications.forEach(c => {
      counts[c.source] = (counts[c.source] || 0) + 1;
    });

    return Object.keys(counts).map(key => ({
      name: key === 'gmail' ? 'Gmail Direct' : key === 'eshop' ? 'E-shop Trigger' : key === 'support' ? 'Support Ticket' : 'Custom Webhook',
      value: counts[key]
    }));
  }, [filteredCommunications]);

  // SLA alert status values
  const isOpenRateBelowTarget = stats.avgOpenRate < kpiTargetOpenRate;
  const isCTRBelowTarget = stats.avgCTR < kpiTargetCTR;

  // Simulate a New Comm Send Action
  const handleSimulateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simSubject || !simRecipient) {
      return;
    }

    const newId = `c-${Date.now()}`;
    // Assign realistic rates based on status
    let randOpen = 0;
    let randCTR = 0;
    
    if (simStatus === 'clicked') {
      randOpen = Math.floor(Math.random() * 20) + 80; // 80 - 100%
      randCTR = Math.floor(Math.random() * 30) + 60; // 60 - 90%
    } else if (simStatus === 'opened') {
      randOpen = Math.floor(Math.random() * 30) + 70; // 70 - 100%
      randCTR = 0;
    } else {
      randOpen = 0;
      randCTR = 0;
    }

    const newComm: SentCommunication = {
      id: newId,
      templateName: simTemplate,
      subject: simSubject,
      recipient: simRecipient,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      source: simSource,
      openRate: randOpen,
      clickRate: randCTR,
      responseTimeSeconds: simSource === 'support' ? 90 : 180, // Simulation responds extremely fast
      status: simStatus,
      body: simMessageText
    };

    // Update communications logs
    setCommunications(prev => [newComm, ...prev]);

    // Update current 7d trend metrics on the last day to visualize dynamic recalculation on graphs!
    setTrendData(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      if (lastIndex >= 0) {
        updated[lastIndex] = {
          ...updated[lastIndex],
          Sent: updated[lastIndex].Sent + 1,
          OpenRate: Math.round((updated[lastIndex].OpenRate * 4 + randOpen) / 5),
          ClickRate: Math.round((updated[lastIndex].ClickRate * 4 + randCTR) / 5),
          AIResponseMin: Math.max(0.8, Math.round(((updated[lastIndex].AIResponseMin * 5) + 1.2) / 6 * 10) / 10)
        };
      }
      return updated;
    });

    // Reset simulation modal
    setSimSubject('');
    setSimRecipient('');
    setSimMessageText('Ahoj, potvrdzujeme spracovanie Vášho dopytu systémovým agentom v reálnom čase.');
    setIsSimulateOpen(false);
  };

  // Reset all simulated data to pristine mock layout
  const handleResetData = () => {
    setCommunications(INITIAL_SENT_COMMUNICATIONS);
    setTrendData(INITIAL_TREND_DATA);
    setSelectedSource('all');
    setSearchQuery('');
    setDetailedCommId(null);
  };

  // Drilled details helper
  const activeDetailedComm = useMemo(() => {
    return communications.find(c => c.id === detailedCommId) || null;
  }, [communications, detailedCommId]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Controller Filters Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#0a0a0f] p-4 md:p-6 rounded-2xl border border-white/5 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#00f5ff]" />
            Analytické filtre a KPI Manažment
          </h2>
          <p className="text-xs text-white/40">Upravte ciele, filtrujte prepojené kanály alebo simulujte nové kampane</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Time range controller */}
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
            {[
              { id: '7d', label: '7 dní' },
              { id: '30d', label: '30 dní' },
              { id: '90d', label: '3 mesiace' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimePeriod(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
                  timePeriod === tab.id 
                    ? 'bg-gradient-to-r from-[#00f5ff]/20 to-[#a855f7]/20 text-white border border-[#00f5ff]/30 shadow-md' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Source/Channel Selector */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-[#050507] text-white border border-white/10 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#00f5ff] transition-colors cursor-pointer"
          >
            <option value="all">Všetky kanály</option>
            <option value="eshop">E-shop Triggers</option>
            <option value="gmail">Klientský Gmail</option>
            <option value="support">Enquiry Support (AI)</option>
            <option value="custom">Manuálne rozhranie</option>
          </select>

          {/* Simulate Action Button */}
          <button
            onClick={() => setIsSimulateOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#00f5ff]/10 to-[#a855f7]/10 hover:from-[#00f5ff]/20 hover:to-[#a855f7]/20 text-[#00f5ff] border border-[#00f5ff]/20 rounded-xl text-xs font-bold hover:text-white transition-all flex items-center gap-2 cursor-pointer neon-glow-cyan"
          >
            <Plus className="w-3.5 h-3.5" />
            Simulovať odoslanie
          </button>

          {/* Reset Button */}
          <button
            onClick={handleResetData}
            title="Obnoviť predvolené štatistiky"
            className="p-2 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target KPI Alert Sliders Overlay Widget (Architectural craftsmanship) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-4 glass-card p-4 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em]">Nastavenie cieľov SLA</span>
              <Sliders className="w-4 h-4 text-white/30" />
            </div>
            <h3 className="text-sm font-bold text-white mb-6">Dynamické stráženie KPI Limitov</h3>
            
            <div className="space-y-6">
              {/* Slider 1: Open Rate KPI */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-white/50">Min. miera otvorenia (Open Rate):</span>
                  <span className="text-[#00f5ff]">{kpiTargetOpenRate}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="95" 
                  value={kpiTargetOpenRate}
                  onChange={(e) => setKpiTargetOpenRate(Number(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#00f5ff]"
                />
              </div>

              {/* Slider 2: Click Through Rate KPI */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-white/50">Min. miera preklikov (CTR):</span>
                  <span className="text-[#a855f7]">{kpiTargetCTR}%</span>
                </div>
                <input 
                  type="range" 
                  min="15" 
                  max="70" 
                  value={kpiTargetCTR}
                  onChange={(e) => setKpiTargetCTR(Number(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#a855f7]"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 space-y-3">
            {isOpenRateBelowTarget || isCTRBelowTarget ? (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2 text-amber-400 text-[11px] leading-relaxed animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white text-xs mb-0.5">SLA Upozornenie aktívne!</span>
                  {isOpenRateBelowTarget && `• Výkon otvorenia zaostáva za cieľom ${kpiTargetOpenRate}%. `}
                  {isCTRBelowTarget && `• CTR nesplnil požadovaných ${kpiTargetCTR}%.`}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2 text-emerald-400 text-[11px] font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Všetky kritické kanály plnia nastavené limity odozvy doručenia.</span>
              </div>
            )}
          </div>
        </div>

        {/* Bento Grid Analytics Metric Cards */}
        <div className="xl:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {/* Card 1: Total Sent */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            className="glass-card p-3 md:p-6 flex flex-col justify-between border-l-2 border-l-[#00f5ff]"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em]">Celkovo odoslané</span>
                <div className="p-2 bg-[#00f5ff]/10 text-[#00f5ff] rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">{stats.totalSent}</div>
            </div>
            <div className="mt-8 flex items-center gap-1.5 text-xs">
              <span className="text-emerald-400 font-bold font-mono">+18%</span>
              <span className="text-white/30 truncate">oproti minulému mesiacu</span>
            </div>
          </motion.div>

          {/* Card 2: Average Open Rate */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            className={`glass-card p-3 md:p-6 flex flex-col justify-between border-l-2 transition-colors ${
              isOpenRateBelowTarget ? 'border-l-amber-500 bg-amber-500/[0.01]' : 'border-l-emerald-500'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em]">Miera otvorenia</span>
                <div className={`p-2 rounded-lg ${isOpenRateBelowTarget ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-white flex items-baseline gap-1">
                <span>{stats.avgOpenRate}</span>
                <span className="text-sm font-sans text-white/40 font-normal">%</span>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between text-[11px] font-mono">
              <span className="text-white/30">Cieľ: {kpiTargetOpenRate}%</span>
              <span className={`font-bold ${isOpenRateBelowTarget ? 'text-amber-500' : 'text-emerald-400'}`}>
                {isOpenRateBelowTarget ? '⚠️ Pod cieľom' : '✓ Splnené'}
              </span>
            </div>
          </motion.div>

          {/* Card 3: Average CTR */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            className={`glass-card p-3 md:p-6 flex flex-col justify-between border-l-2 transition-colors ${
              isCTRBelowTarget ? 'border-l-amber-500 bg-amber-500/[0.01]' : 'border-l-[#a855f7]'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em]">Miera kliknutí (CTR)</span>
                <div className={`p-2 rounded-lg ${isCTRBelowTarget ? 'bg-amber-500/10 text-amber-500' : 'bg-[#a855f7]/10 text-[#a855f7]'}`}>
                  <MousePointerClick className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-white flex items-baseline gap-1">
                <span>{stats.avgCTR}</span>
                <span className="text-sm font-sans text-white/40 font-normal">%</span>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between text-[11px] font-mono">
              <span className="text-white/30">Cieľ: {kpiTargetCTR}%</span>
              <span className={`font-bold ${isCTRBelowTarget ? 'text-amber-500' : 'text-emerald-400'}`}>
                {isCTRBelowTarget ? '⚠️ Pod cieľom' : '✓ Splnené'}
              </span>
            </div>
          </motion.div>

          {/* Card 4: Response Latency */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            className="glass-card p-3 md:p-6 flex flex-col justify-between border-l-2 border-l-rose-500"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em]">Doba odozvy AI</span>
                <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-baseline gap-1">
                <span>{stats.avgResponseTimeMin}</span>
                <span className="text-sm font-sans text-white/40 font-normal">min</span>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-1.5 text-[11px] font-mono text-white/30 justify-between">
              <span>Limit SLA: 15min</span>
              <span className="text-emerald-400 font-bold">100% SLA Safe</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Charts Hub (Open Rates & Click Rates Over Time & Response Comparison) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Chart 1: Daily Sent, Open Rates & CTR Area Graph */}
        <div className="lg:col-span-8 glass-card p-6 md:p-8 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00f5ff]" />
                Historický monitoring doručenia a konverzie
              </h3>
              <p className="text-xs text-white/30 font-mono mt-0.5 uppercase tracking-wide">
                Trendový vývoj za zvolené obdobie ({timePeriod === '7d' ? '7 dní' : timePeriod === '30d' ? '30 dní' : '3 mesiace'})
              </p>
            </div>
            
            {/* Chart Legend Indicators */}
            <div className="flex gap-4 text-xs font-mono select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00f5ff]" />
                <span className="text-white/60">Miera otvorenia %</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
                <span className="text-white/60">CTR %</span>
              </div>
            </div>
          </div>

          <div className="h-[280px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientOpen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00f5ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradientCTR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="Day" 
                  stroke="#ffffff25" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#ffffff25" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  domain={[0, 100]}
                />
                <ChartTooltip 
                  contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px' }}
                  itemStyle={{ fontSize: '12px' }}
                  labelStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#888' }}
                />
                <Area 
                  type="monotone" 
                  name="Miera otvorenia (%)"
                  dataKey="OpenRate" 
                  stroke="#00f5ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#gradientOpen)" 
                />
                <Area 
                  type="monotone" 
                  name="CTR (%)"
                  dataKey="ClickRate" 
                  stroke="#a855f7" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#gradientCTR)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Response latency comparison (AI vs Human) */}
        <div className="lg:col-span-4 glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              SLA Rýchlosť Odozvy (AI vs Človek)
            </h3>
            <p className="text-xs text-white/30 font-mono mt-0.5 uppercase tracking-wide">
              Priemerná doba vybavenia zákazníckej požiadavky
            </p>
          </div>

          <div className="h-[250px] w-full my-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { category: 'Return', AI: 1.5, Človek: 65 },
                { category: 'Doručenie', AI: 1.1, Človek: 45 },
                { category: 'Faktúry', AI: 0.8, Človek: 35 },
                { category: 'Otázky', AI: 2.3, Človek: 90 }
              ]}>
                <CartesianGrid strokeDasharray="6 6" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="category" stroke="#ffffff25" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff25" fontSize={10} tickLine={false} label={{ value: 'minúty', angle: -90, position: 'insideLeft', fill: '#ffffff25', style: { fontSize: 10 } }} axisLine={false} />
                <ChartTooltip
                  contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="AI" fill="#00f5ff" radius={[4, 4, 0, 0]} name="AutoOps Agent" />
                <Bar dataKey="Človek" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Manuálna podpora" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 space-y-2 text-xs">
            <div className="flex justify-between font-mono text-[10px] text-white/30">
              <span>EFEKTIVITA AUTONÓMIE</span>
              <span className="text-emerald-400 font-bold">98.2% Úspora času</span>
            </div>
            <p className="text-white/60 text-[11px] leading-relaxed">
              AutoOps integrácia odpovedá do piatich minút vo všetkých fázach, čím predchádza stornovaniu objednávok a šetrí klientskych agentov v najvyťaženejších časoch dňa.
            </p>
          </div>
        </div>

      </div>

      {/* Grid containing Channel Split and Live Recalculating Area Chart of volumes */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Donut Chart split */}
        <div className="md:col-span-5 glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#a855f7]" />
              Podiel kanálov komunikácie
            </h3>
            <p className="text-xs text-white/30 font-mono mt-0.5 uppercase tracking-wide">
              Distribúcia správ na základe pôvodu dopytu
            </p>
          </div>

          <div className="h-[200px] w-full flex items-center justify-center my-4">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '11px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-white/30">Žiadne dáta k distribúcii</div>
            )}
          </div>

          {/* Key Legend split list with metrics */}
          <div className="space-y-2.5 pt-2 border-t border-white/5">
            {pieData.map((data, idx) => {
              const percentage = Math.round((data.value / stats.totalSent) * 100) || 0;
              return (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-white/60">{data.name}</span>
                  </div>
                  <div className="flex gap-3 font-mono">
                    <span className="text-white/40">{data.value} ks</span>
                    <span className="text-white font-bold">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Sent volumes breakdown chart */}
        <div className="md:col-span-7 glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#00f5ff]" />
              Denné objemy odoslaných správ
            </h3>
            <p className="text-xs text-white/30 font-mono mt-0.5 uppercase tracking-wide">
              Sledovanie celkového počtu odoslaných odpovedí denne
            </p>
          </div>

          <div className="h-[210px] w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeTrendData}>
                <CartesianGrid strokeDasharray="6 6" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="Day" stroke="#ffffff25" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff25" fontSize={10} tickLine={false} axisLine={false} />
                <ChartTooltip
                  contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', color: '#00f5ff', fontWeight: 'bold' }}
                />
                <Bar dataKey="Sent" fill="#00f5ff" radius={[4, 4, 0, 0]} name="Počet odoslaných" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#00f5ff] bg-[#00f5ff]/5 border border-[#00f5ff]/10 rounded-xl p-3.5">
            <Sparkles className="w-4 h-4 text-[#00f5ff] shrink-0 animate-pulse" />
            <span className="text-[11px] leading-relaxed">
              Zvýšené objemy počas začiatku týždňa sú automaticky obsluhované bez frontov na základe spustených procesov a pripojených e-shop integrácií.
            </span>
          </div>
        </div>
      </div>

      {/* Sent communications details list and log grid */}
      <div className="glass-card p-6 md:p-8 select-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Záznam odoslanej komunikácie</h3>
            <p className="text-xs text-white/30">Podrobný denník pre audit výkonu správ a mien zákazníkov</p>
          </div>

          {/* Live Search inside audit list */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Vyhľadať podľa adresáta, šablóny..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#050507] text-xs text-white border border-white/10 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-[#a855f7] transition-all font-sans"
            />
            <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          {filteredCommunications.length > 0 ? (
            <table className="w-full min-w-[720px] text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 font-mono text-[9px] text-white/30 uppercase tracking-wider">
                  <th className="py-3 px-4">Šablóna / Predmet</th>
                  <th className="py-3 px-4">Zákazník</th>
                  <th className="py-3 px-4">Kanál</th>
                  <th className="py-3 px-4 text-center">Open Rate %</th>
                  <th className="py-3 px-4 text-center">CTR %</th>
                  <th className="py-3 px-4 text-center">Odozva</th>
                  <th className="py-3 px-4 text-right">Stav</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredCommunications.map((comm) => (
                  <tr 
                    key={comm.id} 
                    onClick={() => setDetailedCommId(comm.id)}
                    className="hover:bg-white/[0.01] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 pr-6">
                      <div className="font-bold text-white group-hover:text-[#00f5ff] transition-all truncate max-w-[280px]">
                        {comm.templateName}
                      </div>
                      <div className="text-[10px] text-white/40 truncate max-w-[280px] mt-0.5">
                        {comm.subject}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-white/70">{comm.recipient}</td>
                    <td className="py-4 px-4">
                      <span className="inline-block text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border bg-white/[0.02] border-white/10 text-white/50">
                        {comm.source}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold">
                      {comm.status === 'bounced' ? (
                        <span className="text-red-400">-</span>
                      ) : (
                        <span className={comm.openRate >= kpiTargetOpenRate ? 'text-emerald-400' : 'text-amber-400'}>
                          {comm.openRate}%
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold">
                      {comm.status === 'bounced' ? (
                        <span className="text-red-400">-</span>
                      ) : (
                        <span className={comm.clickRate >= kpiTargetCTR ? 'text-emerald-400' : 'text-slate-400'}>
                          {comm.clickRate > 0 ? `${comm.clickRate}%` : '0%'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center font-mono text-white/60">
                      {comm.responseTimeSeconds > 0 ? (
                        `${Math.round(comm.responseTimeSeconds / 60 * 10) / 10} min`
                      ) : (
                        <span className="text-white/20 italic text-[10px]">bez odpovede</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-block text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${
                        comm.status === 'clicked' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : comm.status === 'opened' 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                            : comm.status === 'delivered' 
                              ? 'bg-white/5 text-white/55 border border-white/10' 
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {comm.status === 'clicked' ? 'Kliknuté' : comm.status === 'opened' ? 'Otvorené' : comm.status === 'delivered' ? 'Doručené' : 'Odmietnuté'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-xs text-white/30 font-mono">
              Nenašli sa žiadne záznamy pre zvolené filtre.
            </div>
          )}
        </div>
      </div>

      {/* Advanced Drawer/Detail Modal for Drilled Sent Communication Item */}
      <AnimatePresence>
        {activeDetailedComm && (
          <div className="fixed inset-0 bg-[#050508]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b12] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Top Details Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-start bg-white/[0.01]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/15 px-2 py-0.5 rounded">
                      Audítor doručenia • {activeDetailedComm.source.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-white/30 font-mono">{activeDetailedComm.sentAt}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{activeDetailedComm.templateName}</h3>
                  <p className="text-[11px] text-white/50 mt-1 font-mono">ID: {activeDetailedComm.id}</p>
                </div>
                
                <button 
                  onClick={() => setDetailedCommId(null)}
                  className="p-1.5 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Core Content details */}
              <div className="p-6 space-y-6">
                
                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                    <span className="text-white/40 text-[9px] font-mono uppercase tracking-wider block mb-1">Status doručenia</span>
                    <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                      activeDetailedComm.status === 'clicked' ? 'text-emerald-400 bg-emerald-500/10' :
                      activeDetailedComm.status === 'opened' ? 'text-blue-400 bg-blue-500/10' :
                      activeDetailedComm.status === 'delivered' ? 'text-white/70 bg-white/5' : 'text-red-400 bg-red-500/10'
                    }`}>
                      {activeDetailedComm.status}
                    </span>
                  </div>

                  <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl font-mono">
                    <span className="text-white/40 text-[9px] uppercase tracking-wider block mb-1">Miera otvorenia</span>
                    <span className="text-xs font-bold text-white">{activeDetailedComm.openRate}%</span>
                  </div>

                  <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl font-mono">
                    <span className="text-white/40 text-[9px] uppercase tracking-wider block mb-1">Miera CTR</span>
                    <span className="text-xs font-bold text-white">{activeDetailedComm.clickRate}%</span>
                  </div>

                  <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl font-mono">
                    <span className="text-white/40 text-[9px] uppercase tracking-wider block mb-1">Rýchlosť AI SLA</span>
                    <span className="text-xs font-bold text-[#00f5ff]">
                      {activeDetailedComm.responseTimeSeconds > 0 ? (
                        `${Math.round(activeDetailedComm.responseTimeSeconds / 60 * 10) / 10} min`
                      ) : (
                        'Nerelevantná'
                      )}
                    </span>
                  </div>
                </div>

                {/* Audit Timeline */}
                <div className="space-y-2">
                  <span className="text-white/40 text-[9px] font-mono uppercase tracking-wider block">Auditovatelná cesta udalostí</span>
                  <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl text-[11px] space-y-3 font-mono">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>E-mail úspešne doručený do schránky (SMTP OK)</span>
                    </div>
                    {activeDetailedComm.status !== 'bounced' && (
                      <div className="flex items-center gap-2 text-blue-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Správa bola prvýkrát prečítaná a otvorená adresátom</span>
                      </div>
                    )}
                    {activeDetailedComm.status === 'clicked' && (
                      <div className="flex items-center gap-2 text-[#a855f7]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Zaznamenaný preklik na URL adresu vo vnútri šablóny</span>
                      </div>
                    )}
                    {activeDetailedComm.responseTimeSeconds > 0 && (
                      <div className="flex items-center gap-2 text-[#00f5ff]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI AutoOps automaticky spracovalo a zaslalo spätnú reakciu</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Simulated Email Body Preview */}
                <div className="space-y-2">
                  <span className="text-white/40 text-[9px] font-mono uppercase tracking-wider block">Náhľad šablóny správy</span>
                  <div className="p-4 bg-[#050507] border border-white/10 rounded-xl text-xs text-white/80 font-sans leading-relaxed whitespace-pre-wrap max-h-[160px] overflow-y-auto">
                    <p className="font-bold text-white mb-2">Prijímateľ: {activeDetailedComm.recipient}</p>
                    <p className="font-bold text-white mb-4">Predmet: {activeDetailedComm.subject}</p>
                    <div className="border-t border-white/5 pt-3">
                      {activeDetailedComm.body}
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer controllers */}
              <div className="p-4 bg-white/[0.01] border-t border-white/5 flex justify-end gap-2.5">
                <button
                  onClick={() => setDetailedCommId(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl text-xs font-bold text-white/70 transition-colors cursor-pointer"
                >
                  Zatvoriť prehľad
                </button>
                <button
                  onClick={() => {
                    const emailString = `mailto:${activeDetailedComm.recipient}?subject=Re: ${activeDetailedComm.subject}`;
                    window.open(emailString);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#00f5ff]/20 to-[#a855f7]/20 border border-[#00f5ff]/30 text-white font-bold text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Napísať priamo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Broadcast simulation dialogue dialog */}
      <AnimatePresence>
        {isSimulateOpen && (
          <div className="fixed inset-0 bg-[#050508]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b12] border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00f5ff] animate-pulse" />
                  <h3 className="text-base font-bold text-white">Simulátor odosielania komunikácie</h3>
                </div>
                <button 
                  onClick={() => setIsSimulateOpen(false)}
                  className="p-1.5 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSimulateSend}>
                <div className="p-6 space-y-4 text-xs">
                  <p className="text-white/40 leading-normal mb-2">
                    Nasimulujte reálne správanie nového e-mailu. Po vložení sa vygeneruje miera otvorenia, priradí sa zvolený kanál a v reálnom čase sa prekreslia všetky grafické výstupy nad touto obrazovkou.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-white/50 block font-mono text-[10px] uppercase">Kanál doručenia</label>
                      <select
                        value={simSource}
                        onChange={(e) => setSimSource(e.target.value as any)}
                        className="w-full bg-[#050507] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f5ff] transition-colors"
                      >
                        <option value="support">AI Enquiry Spark Support</option>
                        <option value="eshop">E-shop Transactional</option>
                        <option value="gmail">Gmail Outreach</option>
                        <option value="custom">Manuálna odpoveď</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-white/50 block font-mono text-[10px] uppercase">Simulovaný stav</label>
                      <select
                        value={simStatus}
                        onChange={(e) => setSimStatus(e.target.value as any)}
                        className="w-full bg-[#050507] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f5ff] transition-colors"
                      >
                        <option value="clicked">Kliknuté (Opened & Clicked)</option>
                        <option value="opened">Len otvorené (Opened Only)</option>
                        <option value="delivered">Len doručené (Doručené)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white/50 block font-mono text-[10px] uppercase">Vyberte názov šablóny</label>
                    <select
                      value={simTemplate}
                      onChange={(e) => {
                        setSimTemplate(e.target.value);
                        if (e.target.value === 'Zmena doručenia') {
                          setSimSubject('Potvrdenie zmeny adresy - Objednávka');
                          setSimMessageText('Dobrý deň, Vaša doručovacia adresa bola úspešne zmenená.');
                        } else if (e.target.value === 'Ukončenie nákupu') {
                          setSimSubject('Váš košík na Vás stále čaká!');
                          setSimMessageText('Ahoj, všimli sme si, že máš v košíku stále produkty.');
                        } else {
                          setSimSubject('Ďakujeme za kontaktovanie technickej podpory');
                          setSimMessageText('Vážený zákazník, zaznamenali sme Vašu požiadavku.');
                        }
                      }}
                      className="w-full bg-[#050507] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f5ff] transition-colors"
                    >
                      <option value="Zmena doručenia">Zmena doručenia (#1233)</option>
                      <option value="Ukončenie nákupu">Ukončenie nákupu (Zľava 10%)</option>
                      <option value="Technický lístok">Technický lístok (Zákaznícka zóna)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white/50 block font-mono text-[10px] uppercase">E-mailová adresa prijímateľa</label>
                    <input
                      required
                      type="email"
                      placeholder="napr. zakaznik@azet.sk"
                      value={simRecipient}
                      onChange={(e) => setSimRecipient(e.target.value)}
                      className="w-full bg-[#050507] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a855f7] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white/50 block font-mono text-[10px] uppercase">Predmet správy</label>
                    <input
                      required
                      type="text"
                      placeholder="napr. Informácie k doručeniu balíka"
                      value={simSubject}
                      onChange={(e) => setSimSubject(e.target.value)}
                      className="w-full bg-[#050507] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a855f7] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white/50 block font-mono text-[10px] uppercase">Text správy (Náhľad tela)</label>
                    <textarea
                      rows={3}
                      value={simMessageText}
                      onChange={(e) => setSimMessageText(e.target.value)}
                      className="w-full bg-[#050507] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a855f7] transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-white/[0.01] border-t border-white/5 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsSimulateOpen(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl text-xs font-bold text-white/70 transition-colors cursor-pointer"
                  >
                    Zrušiť
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-[#00f5ff] to-[#a855f7] font-bold text-xs text-black rounded-xl hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Zaradiť do nite
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
