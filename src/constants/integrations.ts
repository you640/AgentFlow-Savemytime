import { Integration } from '../types';

export const INTEGRATIONS: Integration[] = [
  { id: '1', name: 'Shopify', description: 'Sklad a objednávky', icon: 'ShoppingBag', status: 'connected' },
  { id: '2', name: 'WooCommerce', description: 'Sync produktov', icon: 'ShoppingBag', status: 'disconnected' },
  { id: '3', name: 'SuperFaktura', description: 'Auto-fakturácia (SK)', icon: 'FileText', status: 'connected' },
  { id: '4', name: 'Packeta', description: 'Tracking & Distribúcia', icon: 'Truck', status: 'connected' },
  { id: '5', name: 'iDoklad', description: 'Účtovný systém (CZ)', icon: 'FileText', status: 'disconnected' },
  { id: '6', name: 'GLS', description: 'Kuriérska služba', icon: 'Truck', status: 'disconnected' },
  { id: '7', name: 'Gmail', description: 'Zákaznícky servis', icon: 'Mail', status: 'connected' },
  { id: '8', name: 'Instagram DM', description: 'Podpora na sociálnych sieťach', icon: 'Instagram', status: 'connected' },
];
