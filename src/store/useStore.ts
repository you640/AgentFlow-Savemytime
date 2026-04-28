import { create } from 'zustand';

interface AgentStatus {
  state: 'idle' | 'processing' | 'listening' | 'speaking';
  task?: string;
}

interface AppState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  agentStatus: AgentStatus;
  setAgentStatus: (status: AgentStatus) => void;
  timeSavedCount: number;
  addTimeSaved: (hours: number) => void;
}

export const useStore = create<AppState>((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  agentStatus: { state: 'idle' },
  setAgentStatus: (status) => set({ agentStatus: status }),
  timeSavedCount: 142.5,
  addTimeSaved: (hours) => set((state) => ({ timeSavedCount: state.timeSavedCount + hours })),
}));
