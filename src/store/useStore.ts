import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AgentStatus {
  state: 'idle' | 'processing' | 'listening' | 'speaking';
  task?: string;
}

// Koľko odpracovaných hodín agenta = jeden zarobený deň voľna
export const HOURS_PER_EARNED_DAY = 8;

interface AutopilotState {
  hoursBanked: number;      // hodiny nazbierané k ďalšiemu dňu voľna (0 – HOURS_PER_EARNED_DAY)
  earnedDays: number;       // zarobené a ešte nevyčerpané dni voľna
  daysTaken: number;        // už vyčerpané dni voľna
  isActive: boolean;        // autopilot práve riadi e-shop
  activatedAt: number | null;
  handledToday: number;     // úlohy vybavené agentom počas aktívneho dňa
}

interface StreakState {
  current: number;              // dní po sebe, kedy agent ušetril čas
  best: number;                 // najdlhšia dosiahnutá séria
  lastActiveDate: string | null; // 'YYYY-MM-DD' posledného aktívneho dňa
}

// Lokálny dátum ako 'YYYY-MM-DD' (bez UTC posunu)
const dateStr = (d: Date = new Date()): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const diffDays = (a: string, b: string): number =>
  Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);

// Aplikuje pravidlo série pre dnešný deň (idempotentne — raz za deň)
const computeStreak = (s: StreakState): StreakState => {
  const today = dateStr();
  if (s.lastActiveDate === today) return s; // dnes už započítané
  const current =
    s.lastActiveDate && diffDays(s.lastActiveDate, today) === 1 ? s.current + 1 : 1;
  return { current, best: Math.max(s.best, current), lastActiveDate: today };
};

interface AppState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  agentStatus: AgentStatus;
  setAgentStatus: (status: AgentStatus) => void;
  timeSavedCount: number;
  addTimeSaved: (hours: number) => void;

  // Séria "X dní po sebe ti agent ušetril čas"
  streak: StreakState;

  // Autopilot / Zarobený deň voľna
  autopilot: AutopilotState;
  bankTime: (hours: number) => void;   // agent odpracoval hodiny → napĺňa banku času
  activateDayOff: () => void;          // minie jeden zarobený deň a spustí autopilota
  logHandledTask: () => void;          // pripočíta úlohu vybavenú počas aktívneho dňa
  endDayOff: () => void;               // ukončí autopilota (vráti kontrolu majiteľovi)
}

const round1 = (n: number) => Math.round(n * 10) / 10;

const DEFAULT_AUTOPILOT: AutopilotState = {
  hoursBanked: 6.5,
  earnedDays: 1,
  daysTaken: 2,
  isActive: false,
  activatedAt: null,
  handledToday: 0,
};

// Séria beží — posledný aktívny deň = včera, takže prvá práca dnes ju posunie +1
const DEFAULT_STREAK: StreakState = {
  current: 12,
  best: 18,
  lastActiveDate: dateStr(new Date(Date.now() - 86_400_000)),
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      agentStatus: { state: 'idle' },
      setAgentStatus: (status) => set({ agentStatus: status }),
      timeSavedCount: 142.5,
      addTimeSaved: (hours) => set((state) => ({ timeSavedCount: round1(state.timeSavedCount + hours) })),

      streak: { ...DEFAULT_STREAK },
      autopilot: { ...DEFAULT_AUTOPILOT },

      bankTime: (hours) => set((state) => {
        const totalBanked = state.autopilot.hoursBanked + hours;
        const newDays = Math.floor(totalBanked / HOURS_PER_EARNED_DAY);
        return {
          timeSavedCount: round1(state.timeSavedCount + hours),
          // Agent dnes ušetril čas → udrž/posuň sériu
          streak: computeStreak(state.streak),
          autopilot: {
            ...state.autopilot,
            hoursBanked: round1(totalBanked % HOURS_PER_EARNED_DAY),
            earnedDays: state.autopilot.earnedDays + newDays,
          },
        };
      }),

      activateDayOff: () => set((state) => {
        if (state.autopilot.earnedDays < 1 || state.autopilot.isActive) return state;
        return {
          agentStatus: { state: 'processing', task: 'Autopilot: riadim celý e-shop za teba' },
          autopilot: {
            ...state.autopilot,
            earnedDays: state.autopilot.earnedDays - 1,
            daysTaken: state.autopilot.daysTaken + 1,
            isActive: true,
            activatedAt: Date.now(),
            handledToday: 0,
          },
        };
      }),

      logHandledTask: () => set((state) => {
        if (!state.autopilot.isActive) return state;
        return { autopilot: { ...state.autopilot, handledToday: state.autopilot.handledToday + 1 } };
      }),

      endDayOff: () => set((state) => ({
        agentStatus: { state: 'idle' },
        autopilot: { ...state.autopilot, isActive: false, activatedAt: null },
      })),
    }),
    {
      name: 'autoops-storage',
      // Perzistujeme len dáta, ktoré majú prežiť refresh — nie prechodný UI stav
      partialize: (state) => ({
        timeSavedCount: state.timeSavedCount,
        autopilot: state.autopilot,
        streak: state.streak,
      }),
    }
  )
);
