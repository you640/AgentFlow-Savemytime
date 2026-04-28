export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected';
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  label: string;
  integrationId?: string;
}

export interface InboxItem {
  id: string;
  source: 'gmail' | 'shopify' | 'instagram' | 'support';
  title: string;
  preview: string;
  time: string;
  category: 'low' | 'medium' | 'high' | 'auto-resolved';
  sender: string;
}
