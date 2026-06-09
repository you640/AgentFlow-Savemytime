import { InboxItem } from '../types';

export const MOCK_INBOX_ITEMS: InboxItem[] = [
  { id: '1', source: 'gmail', sender: 'Milan K.', title: 'Zmena v objednávke #1233', preview: 'Prosím o zmenu adresy doručenia na ul. Mlynská 4...', time: '14:22', category: 'high' },
  { id: '2', source: 'shopify', sender: 'System', title: 'Nová objednávka #8821', preview: 'Zákazník vybral platbu vopred, čakáme na úhradu.', time: '13:10', category: 'auto-resolved' },
  { id: '3', source: 'instagram', sender: '_nina.style_', title: 'DM: Otázka na veľkosť', preview: 'Ahojte, budú tieto šaty aj v modrej farbe?', time: '11:05', category: 'medium' },
  { id: '4', source: 'support', sender: 'Jozef T.', title: 'Reklamácia #990', preview: 'Tovar mi prišiel poškodený, posielam fotky...', time: 'Včera', category: 'high' },
];
