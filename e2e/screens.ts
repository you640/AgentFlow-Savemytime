// Všetky hlavné obrazovky appky (route + label v hlavičke Shellu).
export interface Screen {
  path: string;
  label: string;
}

export const SCREENS: Screen[] = [
  { path: '/', label: 'Prehľad' },
  { path: '/autopilot', label: 'Autopilot' },
  { path: '/comms', label: 'Comms' },
  { path: '/inbox', label: 'Inbox' },
  { path: '/workflows', label: 'Procesy' },
  { path: '/integrations', label: 'Integrácie' },
  { path: '/analytics', label: 'Analytika' },
  { path: '/components', label: 'Dizajn' },
];
