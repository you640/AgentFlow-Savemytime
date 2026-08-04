import { create } from 'zustand';

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

interface AppState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  agentStatus: AgentStatus;
  setAgentStatus: (status: AgentStatus) => void;
  timeSavedCount: number;
  addTimeSaved: (hours: number) => void;

  // Autopilot / Zarobený deň voľna
  autopilot: AutopilotState;
  bankTime: (hours: number) => void;   // agent odpracoval hodiny → napĺňa banku času
  activateDayOff: () => void;          // minie jeden zarobený deň a spustí autopilota
  logHandledTask: () => void;          // pripočíta úlohu vybavenú počas aktívneho dňa
  endDayOff: () => void;               // ukončí autopilota (vráti kontrolu majiteľovi)
}

export const useStore = create<AppState>((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  agentStatus: { state: 'idle' },
  setAgentStatus: (status) => set({ agentStatus: status }),
  timeSavedCount: 142.5,
  addTimeSaved: (hours) => set((state) => ({ timeSavedCount: state.timeSavedCount + hours })),

  autopilot: {
    hoursBanked: 6.5,
    earnedDays: 1,
    daysTaken: 2,
    isActive: false,
    activatedAt: null,
    handledToday: 0,
  },

  bankTime: (hours) => set((state) => {
    const totalBanked = state.autopilot.hoursBanked + hours;
    const newDays = Math.floor(totalBanked / HOURS_PER_EARNED_DAY);
    return {
      timeSavedCount: Math.round((state.timeSavedCount + hours) * 10) / 10,
      autopilot: {
        ...state.autopilot,
        hoursBanked: Math.round((totalBanked % HOURS_PER_EARNED_DAY) * 10) / 10,
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
}));
