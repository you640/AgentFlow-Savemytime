import { ShoppingBag, Mail, FileText, Truck, AlertCircle, ShoppingCart } from 'lucide-react';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  nodes: {
    type: 'trigger' | 'action' | 'logic';
    label: string;
    sub: string;
    icon: any;
  }[];
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'order-automation',
    name: 'Order Fulfillment Pro',
    description: 'Auto-generate invoices and logistics labels for every Shopify order.',
    icon: ShoppingBag,
    nodes: [
      { type: 'trigger', label: 'Shopify', sub: 'New Order', icon: ShoppingBag },
      { type: 'action', label: 'SuperFaktura', sub: 'Create Invoice', icon: FileText },
      { type: 'action', label: 'Packeta', sub: 'Create Shipment', icon: Truck },
    ]
  },
  {
    id: 'abandoned-cart',
    name: 'Abandoned Cart Rescue',
    description: 'Send AI-personalized discounts to users who left items in cart.',
    icon: ShoppingCart,
    nodes: [
      { type: 'trigger', label: 'Shopify', sub: 'Cart Abandoned', icon: ShoppingCart },
      { type: 'logic', label: 'AI Analyzer', sub: 'Value Check', icon: AlertCircle },
      { type: 'action', label: 'Gmail', sub: 'Send Discount', icon: Mail },
    ]
  },
  {
    id: 'support-auto-reply',
    name: 'Smart Support Agent',
    description: 'Auto-categorize and draft replies for common customer queries.',
    icon: Mail,
    nodes: [
      { type: 'trigger', label: 'Gmail', sub: 'New Message', icon: Mail },
      { type: 'logic', label: 'AI Core', sub: 'Intent Check', icon: AlertCircle },
      { type: 'action', label: 'Gmail', sub: 'Draft Auto-Reply', icon: Mail },
    ]
  }
];
