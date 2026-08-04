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
    name: 'Vybavovanie objednávok',
    description: 'Automatické generovanie faktúr a štítkov pre každú novú objednávku.',
    icon: ShoppingBag,
    nodes: [
      { type: 'trigger', label: 'E-shop', sub: 'Nová objednávka', icon: ShoppingBag },
      { type: 'action', label: 'SuperFaktura', sub: 'Vytvoriť faktúru', icon: FileText },
      { type: 'action', label: 'Packeta', sub: 'Objednať zásielku', icon: Truck },
    ]
  },
  {
    id: 'abandoned-cart',
    name: 'Záchrana opusteného košíka',
    description: 'AI personalizované zľavy užívateľom, ktorí nechali tovar v košíku.',
    icon: ShoppingCart,
    nodes: [
      { type: 'trigger', label: 'E-shop', sub: 'Opustený košík', icon: ShoppingCart },
      { type: 'logic', label: 'AI Analyzátor', sub: 'Kontrola ceny', icon: AlertCircle },
      { type: 'action', label: 'Gmail', sub: 'Odoslať zľavu', icon: Mail },
    ]
  },
  {
    id: 'support-auto-reply',
    name: 'Smart Zákaznícky Servis',
    description: 'Automatická kategorizácia a vytváranie konceptov odpovedí pre zákazníkov.',
    icon: Mail,
    nodes: [
      { type: 'trigger', label: 'Gmail', sub: 'Nová správa', icon: Mail },
      { type: 'logic', label: 'AI Jadro', sub: 'Kontrola zámeru', icon: AlertCircle },
      { type: 'action', label: 'Gmail', sub: 'Koncept odpovede', icon: Mail },
    ]
  }
];
