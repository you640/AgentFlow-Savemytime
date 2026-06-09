import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  ArrowLeft, 
  TrendingUp, 
  Box, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Truck, 
  Sparkles, 
  User, 
  AlertTriangle,
  Play,
  Check,
  Zap,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { sendNotification } from '../../services/notificationService';
import { cn } from '../../lib/utils';

// Interfaces
interface ShopifyProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  location: string;
  price: number;
  category: string;
  autoReplenish: boolean;
  minThreshold: number;
}

interface ShopifyOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: string;
  total: number;
  date: string;
  paymentStatus: 'Paid' | 'Unpaid';
  fulfillmentStatus: 'Fulfilled' | 'Unfulfilled';
  carrier?: 'Packeta' | 'GLS';
  trackingNumber?: string;
}

// Initial Mock Inventory ("Sklad")
const INITIAL_PRODUCTS: ShopifyProduct[] = [
  { id: 'p1', name: 'AirPods Max Charcoal', sku: 'SHPF-AP-MAX-CH', stock: 14, location: 'Sektor B1 / Regál A', price: 549, category: 'Elektronika', autoReplenish: true, minThreshold: 5 },
  { id: 'p2', name: 'Logitech MX Master 3S', sku: 'SHPF-LOGI-MX3', stock: 2, location: 'Sektor A3 / Regál D', price: 109, category: 'Príslušenstvo', autoReplenish: true, minThreshold: 5 },
  { id: 'p3', name: 'Keychron K3 Pro ISO-SK', sku: 'SHPF-KEYC-K3P', stock: 28, location: 'Sektor B5 / Regál C1', price: 129, category: 'Klávesnice', autoReplenish: false, minThreshold: 10 },
  { id: 'p4', name: 'Apple Studio Display 27"', sku: 'SHPF-AAPL-STD27', stock: 4, location: 'Paletový regál P2', price: 1749, category: 'Monitory', autoReplenish: true, minThreshold: 2 },
  { id: 'p5', name: 'Kábel USB-C Kevlar 2m', sku: 'SHPF-CABL-KEV2', stock: 142, location: 'Drobný tovar Box 12', price: 19, category: 'Káble', autoReplenish: false, minThreshold: 20 },
];

// Initial Orders ("Objednávky")
const INITIAL_ORDERS: ShopifyOrder[] = [
  { id: 'o1', orderNumber: '#SHPF-9142', customerName: 'Ján Malík', customerEmail: 'jan.malik@gmail.com', items: '1x AirPods Max Charcoal', total: 549, date: 'Dnes, 14:22', paymentStatus: 'Paid', fulfillmentStatus: 'Unfulfilled' },
  { id: 'o2', orderNumber: '#SHPF-9141', customerName: 'Simona Kováčová', customerEmail: 'simona@kovac.sk', items: '2x Kábel USB-C Kevlar 2m, 1x Keychron K3 Pro', total: 167, date: 'Dnes, 11:05', paymentStatus: 'Paid', fulfillmentStatus: 'Fulfilled', carrier: 'Packeta', trackingNumber: 'Z584129420SK' },
  { id: 'o3', orderNumber: '#SHPF-9140', customerName: 'Martin Štefanko', customerEmail: 'm.stefanko@seznam.cz', items: '1x Logitech MX Master 3S', total: 109, date: 'Včera, 18:41', paymentStatus: 'Paid', fulfillmentStatus: 'Fulfilled', carrier: 'GLS', trackingNumber: 'GLS91480284SK' },
];

export const ShopifyConsole: React.FC = () => {
  const navigate = useNavigate();
  const { addTimeSaved, setAgentStatus } = useStore();
  
  // States
  const [products, setProducts] = useState<ShopifyProductsList>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<ShopifyOrder[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<'sklad' | 'objednavky' | 'automatizacia'>('sklad');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Animation states for a fulfillment simulation
  const [fulfillingOrderId, setFulfillingOrderId] = useState<string | null>(null);
  const [fulfillmentStep, setFulfillmentStep] = useState<string>('');
  
  // Custom states for manual product add
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(50);
  const [newProdStock, setNewProdStock] = useState<number>(10);
  const [newProdLocation, setNewProdLocation] = useState('Sektor A1');

  // Filtered products list
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick statistics totals
  const totalStockItems = products.reduce((sum, p) => sum + p.stock, 0);
  const unfulfilledCount = orders.filter(o => o.fulfillmentStatus === 'Unfulfilled').length;
  const totalPaidRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Manual stock adjustments
  const adjustStock = (productId: string, amount: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextStock = Math.max(0, p.stock + amount);
        // Alert notification if stock drops below threshold
        if (nextStock <= p.minThreshold && p.stock > p.minThreshold) {
          sendNotification(
            '⚠️ Dostupnosť klesla - Shopify',
            `Produkt ${p.name} klesol pod kritickú hranicu (${nextStock} ks skladom).`
          );
        }
        return { ...p, stock: nextStock };
      }
      return p;
    }));
  };

  // Add manual product to stock
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdSku) return;

    const newProduct: ShopifyProduct = {
      id: 'p-' + Date.now(),
      name: newProdName,
      sku: newProdSku.toUpperCase(),
      stock: Number(newProdStock),
      location: newProdLocation,
      price: Number(newProdPrice),
      category: 'Nový Tovar',
      autoReplenish: true,
      minThreshold: 5
    };

    setProducts(prev => [newProduct, ...prev]);
    setIsAddingProduct(false);
    
    // Clear form
    setNewProdName('');
    setNewProdSku('');
    setNewProdPrice(50);
    setNewProdStock(10);
    setNewProdLocation('Sektor A1');

    sendNotification('✅ Sklad aktualizovaný', `Nový produkt ${newProdName} bol naskladnený do Shopify.`);
  };

  // Simulate incoming e-shop order
  const handleSimulateNewOrder = () => {
    // 1. Pick random customer name
    const customers = [
      { name: 'Peter Novák', email: 'peter.novak@zoznam.sk' },
      { name: 'Lucia Šandorová', email: 'lucia.sandor@gmail.com' },
      { name: 'Andrej Hrnčiar', email: 'andrej.hrn99@azet.sk' },
      { name: 'Veronika Balážová', email: 'v.balazova@outlook.sk' },
      { name: 'Marek Krajčí', email: 'marek.k@retail.sk' }
    ];
    const customer = customers[Math.floor(Math.random() * customers.length)];

    // 2. Choose random product that currently has stock
    const eligibleProducts = products.filter(p => p.stock > 0);
    if (eligibleProducts.length === 0) {
      alert('Sklad je úplne vypredaný! Najskôr doplňte zásoby.');
      return;
    }
    const product = eligibleProducts[Math.floor(Math.random() * eligibleProducts.length)];

    // 3. Subtract stock
    adjustStock(product.id, -1);

    // 4. Create Order
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: ShopifyOrder = {
      id: 'o-' + Date.now(),
      orderNumber: `#SHPF-${randomNum}`,
      customerName: customer.name,
      customerEmail: customer.email,
      items: `1x ${product.name}`,
      total: product.price,
      date: 'O minútu',
      paymentStatus: 'Paid',
      fulfillmentStatus: 'Unfulfilled'
    };

    setOrders(prev => [newOrder, ...prev]);

    // 5. Trigger desktop notification
    sendNotification(
      '🛍️ Nová objednávka Shopify!',
      `${customer.name} nakúpil ${product.name} za €${product.price}.`
    );

    // Active state representation
    setAgentStatus({
      state: 'processing',
      task: `Prijatá objednávka ${newOrder.orderNumber}. AI preveruje stav skladu a páruje zákazníka...`
    });

    setTimeout(() => {
      setAgentStatus({ state: 'idle' });
    }, 4000);
  };

  // Simulate automated order fulfillment (Fulfill Order through Packeta courier flow)
  const handleFulfillOrder = async (orderId: string) => {
    const orderObj = orders.find(o => o.id === orderId);
    if (!orderObj || orderObj.fulfillmentStatus === 'Fulfilled') return;

    setFulfillingOrderId(orderId);
    
    // Step process
    const steps = [
      'Overujem skladovú dostupnosť položiek...',
      'Generujem prepravný štítok v Packeta API...',
      'Párujem s logistickým uzlom a priraďujem kuriéra...',
      'Sledovacie číslo vygenerované! Odosielam info e-mail customerovi...'
    ];

    setFulfillmentStep(steps[0]);
    await new Promise(r => setTimeout(r, 1000));
    setFulfillmentStep(steps[1]);
    await new Promise(r => setTimeout(r, 1000));
    setFulfillmentStep(steps[2]);
    await new Promise(r => setTimeout(r, 1200));
    setFulfillmentStep(steps[3]);
    await new Promise(r => setTimeout(r, 1000));

    // Finish Fulfilling
    const randomTrackingNum = 'Z' + Math.floor(100000000 + Math.random() * 900000000) + 'SK';
    
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          fulfillmentStatus: 'Fulfilled',
          carrier: 'Packeta',
          trackingNumber: randomTrackingNum
        };
      }
      return o;
    }));

    // Trigger state changes
    addTimeSaved(0.25); // Fulfilling automatically saves user 15 minutes of work
    setFulfillingOrderId(null);
    setFulfillmentStep('');

    sendNotification(
      '📦 Packeta Expedícia Úspešná!',
      `Zásielka pre ${orderObj.customerName} bola odovzdaná kuriérovi. Sledovacie číslo: ${randomTrackingNum}`
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header with back navigation */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/integrations')}
            className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#10b981]" />
              <h2 className="text-2xl font-bold text-white">Shopify: Sklad, Zásoby & Objednávky</h2>
            </div>
            <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-mono">
              Správa lokálneho skladu a logistiky prepojená s AI rozhraním
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button 
            onClick={handleSimulateNewOrder}
            className="flex-1 md:flex-none px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-bold text-xs shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Simulovať Objednávku z E-shopu
          </button>
          <button 
            onClick={() => {
              // Simulated manual synchronization
              setProducts(prev => [...prev]);
              sendNotification('🔄 Synchronizácia dokončená', 'Skladové zásoby Shopify boli zosynchronizované s centrálnou databázou AutoOps.');
            }}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2"
            title="Aktualizovať dáta"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 border-l-2 border-emerald-500">
          <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">Celkové zásoby</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{totalStockItems} ks</span>
            <span className="text-xs text-white/30 font-mono">v 5 kategóriách</span>
          </div>
          <p className="text-[10px] text-white/20 font-mono mt-3 uppercase">Prepojenie s hlavným skladom aktívne</p>
        </div>

        <div className="glass-card p-6 border-l-2 border-amber-500">
          <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">Čaká na expedíciu</span>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{unfulfilledCount}</span>
              <span className="text-xs text-amber-500 font-mono animate-pulse">● k odoslaniu</span>
            </div>
            {unfulfilledCount > 0 && (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[9px] font-bold uppercase">Pozor</span>
            )}
          </div>
          <p className="text-[10px] text-white/20 font-mono mt-3 uppercase">Kuriéri: Packeta & GLS pripravení</p>
        </div>

        <div className="glass-card p-6 border-l-2 border-indigo-500">
          <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">Dnešný predaj</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">€{totalPaidRevenue}</span>
            <div className="flex items-center text-emerald-400 text-[10px] font-mono gap-0.5">
               <TrendingUp className="w-3 h-3" />
               <span>+14.8%</span>
            </div>
          </div>
          <p className="text-[10px] text-white/20 font-mono mt-3 uppercase">Prijaté platby automaticky spárované</p>
        </div>

        <div className="glass-card p-6 border-l-2 border-[#a855f7]">
          <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">Úspora času (AI Autopilot)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">12.8 hod</span>
            <span className="text-xs text-[#a855f7] font-bold font-mono">Tento týždeň</span>
          </div>
          <p className="text-[10px] text-white/20 font-mono mt-3 uppercase">Auto-tracking & fakturácia aktívne</p>
        </div>
      </div>

      {/* Main Tabs controller */}
      <div className="flex border-b border-white/5 gap-2">
        <button 
          onClick={() => setActiveTab('sklad')}
          className={cn(
            "px-6 py-4 text-xs font-mono uppercase tracking-widest font-bold border-b-2 transition-all",
            activeTab === 'sklad' 
             ? "border-[#10b981] text-[#10b981] bg-white/[0.02]" 
             : "border-transparent text-white/40 hover:text-white"
          )}
        >
          📦 Sklad & Zásoby ({products.length})
        </button>
        <button 
          onClick={() => setActiveTab('objednavky')}
          className={cn(
            "px-6 py-4 text-xs font-mono uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2",
            activeTab === 'objednavky' 
             ? "border-[#10b981] text-[#10b981] bg-white/[0.02]" 
             : "border-transparent text-white/40 hover:text-white"
          )}
        >
          📋 Objednávky ({orders.length})
          {unfulfilledCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('automatizacia')}
          className={cn(
            "px-6 py-4 text-xs font-mono uppercase tracking-widest font-bold border-b-2 transition-all",
            activeTab === 'automatizacia' 
             ? "border-[#10b981] text-[#10b981] bg-white/[0.02]" 
             : "border-transparent text-white/40 hover:text-white"
          )}
        >
          🤖 Autopilot Nastavenia
        </button>
      </div>

      {/* TAB CONTENTS */}
      <AnimatePresence mode="wait">
        {activeTab === 'sklad' && (
          <motion.div 
            key="sklad-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Search and control action bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                  type="text"
                  placeholder="Hľadať produkt, SKU, lokáciu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:border-[#10b981]/40 focus:outline-none text-white text-sm"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={() => setIsAddingProduct(!isAddingProduct)}
                  className="w-full md:w-auto px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Pridať Nový Tovar
                </button>
              </div>
            </div>

            {/* Popup microform for adding new product */}
            <AnimatePresence>
              {isAddingProduct && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-card p-6 overflow-hidden border border-[#10b981]/20 bg-[#0c0d14]"
                >
                  <form onSubmit={handleAddProductSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-mono text-white/40 uppercase block">Názov produktu</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Napr. Apple Magic Trackpad"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#10b981]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-white/40 uppercase block">SKU</label>
                      <input 
                        type="text" 
                        required
                        placeholder="SHPF-TRCK-PD"
                        value={newProdSku}
                        onChange={(e) => setNewProdSku(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#10b981]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/40 uppercase block">Skladom (ks)</label>
                        <input 
                          type="number" 
                          min="0"
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#10b981]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/40 uppercase block">Cena (€)</label>
                        <input 
                          type="number" 
                          min="1"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#10b981]"
                        />
                      </div>
                    </div>
                    <div>
                      <button 
                        type="submit"
                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Potvrdiť Naskladnenie
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inventory table */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-mono uppercase tracking-widest text-[#10b981]">
                      <th className="py-4 px-6 font-semibold">Produkt</th>
                      <th className="py-4 px-4 font-semibold">SKU / Lokácia</th>
                      <th className="py-4 px-4 font-semibold">Stav Zásob</th>
                      <th className="py-4 px-4 font-semibold text-right">Množstvo</th>
                      <th className="py-4 px-4 font-semibold text-right">Cena</th>
                      <th className="py-4 px-6 font-semibold text-center">Auto-Reorder</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredProducts.map((product) => {
                      // Visual cues based on quantity
                      const isLowStock = product.stock <= product.minThreshold;
                      const isWarnStock = product.stock > product.minThreshold && product.stock <= product.minThreshold * 2;
                      
                      return (
                        <tr key={product.id} className="hover:bg-white/[0.01] transition-colors group">
                          
                          {/* Col 1: Product Name */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white/50 group-hover:border-[#10b981]/30 transition-all">
                                {product.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-white group-hover:text-[#10b981] transition-colors leading-tight">{product.name}</h4>
                                <span className="text-[10px] text-white/20 font-mono uppercase tracking-wider">{product.category}</span>
                              </div>
                            </div>
                          </td>

                          {/* Col 2: SKU and Location */}
                          <td className="py-4 px-4">
                            <span className="text-xs font-mono text-white/60 block">{product.sku}</span>
                            <span className="text-[11px] text-white/30">{product.location}</span>
                          </td>

                          {/* Col 3: Visual Badge stock status */}
                          <td className="py-4 px-4">
                            {isLowStock ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                                <AlertTriangle className="w-3 h-3" /> Kritický stav
                              </span>
                            ) : isWarnStock ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                                Nízky stav
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                                Dostatočný
                              </span>
                            )}
                          </td>

                          {/* Col 4: Responsive control adjust qty */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <span className={cn(
                                "font-mono font-bold text-base",
                                isLowStock && "text-rose-400 font-extrabold"
                              )}>
                                {product.stock} ks
                              </span>
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => adjustStock(product.id, -1)}
                                  className="w-6 h-6 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all active:scale-90"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <button 
                                  onClick={() => adjustStock(product.id, 1)}
                                  className="w-6 h-6 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all active:scale-90"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Col 5: Price */}
                          <td className="py-4 px-4 text-right font-mono font-bold text-white/80">
                            €{product.price}
                          </td>

                          {/* Col 6: Autopilot check */}
                          <td className="py-4 px-6 text-center">
                            <button 
                              onClick={() => {
                                setProducts(prev => prev.map(p => 
                                  p.id === product.id ? { ...p, autoReplenish: !p.autoReplenish } : p
                                ));
                              }}
                              className={cn(
                                "px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-lg transition-all border",
                                product.autoReplenish 
                                  ? "bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]" 
                                  : "bg-white/5 border-white/5 text-white/30"
                              )}
                            >
                              {product.autoReplenish ? 'Autopilot Zap' : 'Vypnuté'}
                            </button>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table empty fallback */}
              {filteredProducts.length === 0 && (
                <div className="py-12 text-center text-white/30 font-medium">
                  Nenašli sa žiadne zhodné položky na sklade.
                </div>
              )}
            </div>

            {/* Smart inventory action note */}
            <div className="glass-card p-6 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex gap-3 items-start">
                <Sparkles className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm">Inteligentné doobjednávanie zásob (Re-order)</h4>
                  <p className="text-white/40 text-xs mt-0.5 leading-relaxed">
                    Umelá inteligencia AutoOps sleduje priemernú dennú rýchlosť dopredaja. Pri aktivovanej funkcii Autopilot automaticky vytvorí doobjednávku, zaistí fakturáciu v iDoklade/SuperFaktúre a naskladní tovar hneď ako dorazí preprava Packeta.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ORDER PIPELINE TAB */}
        {activeTab === 'objednavky' && (
          <motion.div 
            key="orders-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Orders Pipeline description list */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-mono uppercase tracking-widest text-[#10b981]">
                      <th className="py-4 px-6 font-semibold">ID Objednávky</th>
                      <th className="py-4 px-4 font-semibold">Zákazník</th>
                      <th className="py-4 px-4 font-semibold">Položky</th>
                      <th className="py-4 px-4 font-semibold text-right">Hodnota</th>
                      <th className="py-4 px-4 font-semibold text-center">Status Platby</th>
                      <th className="py-4 px-4 font-semibold text-center">Expedícia / Transport</th>
                      <th className="py-4 px-6 font-semibold text-center">Akcia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {orders.map((order) => {
                      const isGeneratingThis = fulfillingOrderId === order.id;

                      return (
                        <tr key={order.id} className="hover:bg-white/[0.01] transition-all group">
                          
                          {/* Order code */}
                          <td className="py-4 px-6 font-mono font-bold text-white">
                            <div className="flex items-center gap-2">
                              <span>{order.orderNumber}</span>
                              <span className="text-[10px] text-white/20 font-normal font-sans">({order.date})</span>
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                                <User className="w-3 h-3 text-white/45" />
                              </div>
                              <div>
                                <span className="font-semibold text-white block">{order.customerName}</span>
                                <span className="text-[11px] text-white/30 block leading-none">{order.customerEmail}</span>
                              </div>
                            </div>
                          </td>

                          {/* Items Purchased */}
                          <td className="py-4 px-4">
                            <span className="text-white/60 font-medium">{order.items}</span>
                          </td>

                          {/* Total Value */}
                          <td className="py-4 px-4 text-right font-mono font-bold text-[#10b981]">
                            €{order.total}
                          </td>

                          {/* Payment status badge */}
                          <td className="py-4 px-4 text-center">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                              Zaplatené (Paid)
                            </span>
                          </td>

                          {/* Shipping transport status */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col items-center justify-center">
                              {order.fulfillmentStatus === 'Fulfilled' ? (
                                <div className="space-y-1 text-center">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                                    <Check className="w-3 h-3" /> Splnená
                                  </span>
                                  {order.carrier && (
                                    <span className="text-[11px] text-white/40 block">
                                      {order.carrier}: <code className="text-[10px] font-mono text-emerald-300 font-bold">{order.trackingNumber}</code>
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-mono text-[9px] font-bold uppercase tracking-wider animate-pulse">
                                  Nesplnená (Hold)
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Fulfill action button */}
                          <td className="py-4 px-6 text-center">
                            {order.fulfillmentStatus === 'Fulfilled' ? (
                              <button 
                                disabled
                                className="px-3 py-2 rounded bg-white/5 border border-white/5 text-white/20 text-xs font-bold font-mono uppercase"
                              >
                                Vybavené
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleFulfillOrder(order.id)}
                                disabled={fulfillingOrderId !== null}
                                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/5 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-1.5 mx-auto"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                Odoslať cez Packeta
                              </button>
                            )}
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Seamless Active Fulfillment Animation Screen Overlay */}
            <AnimatePresence>
              {fulfillingOrderId && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-[#050507]/80 backdrop-blur-md flex items-center justify-center p-4"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 15 }}
                    className="glass-card p-10 max-w-md w-full text-center space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                      <RefreshCw className="w-8 h-8 animate-spin" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-white text-lg">AI Expedícia v procese</h4>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                        <span className="text-[#10b981] font-mono text-xs font-semibold">{fulfillmentStep}</span>
                      </div>
                    </div>
                    <p className="text-white/30 text-xs font-mono">
                      Packeta API / Zákaznícky servis komunikácia prebieha automatizovane...
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* AUTOPILOT RULES TAB */}
        {activeTab === 'automatizacia' && (
          <motion.div 
            key="automatizacia-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Synchrónne spracovanie tovaru</h4>
                  <span className="text-[10px] text-white/30 uppercase font-mono tracking-wider">Pravidlo 1</span>
                </div>
              </div>
              <p className="text-white/40 text-xs leading-relaxed">
                Hneď ako Shopify e-shop nahlási novú zaplatenú objednávku, systém automaticky preverí sklad. Na základe doručovacieho PSČ zákazníka vyberie logistické depo Packeta s najnižšími nákladmi na doručenie.
              </p>
              <div className="pt-4 flex items-center justify-between border-t border-white/5">
                <span className="text-emerald-400 font-mono text-xs font-semibold">● Aktívne (Auto-fulfill)</span>
                <input type="checkbox" defaultChecked className="accent-[#10b981] w-4 h-4 cursor-pointer" />
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#a855f7]/10">
                  <Sparkles className="w-5 h-5 text-[#a855f7]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">SuperFaktúra & iDoklad konektor</h4>
                  <span className="text-[10px] text-white/30 uppercase font-mono tracking-wider">Pravidlo 2</span>
                </div>
              </div>
              <p className="text-white/40 text-xs leading-relaxed">
                Po dokončení expedície (Fulfillment) systém vygeneruje legálnu faktúru v slovenskej SuperFaktúre. Táto faktúra sa s prideleným číslom balíka od Packety prenesie priamo na e-mail zákazníkovi.
              </p>
              <div className="pt-4 flex items-center justify-between border-t border-white/5">
                <span className="text-[#a855f7] font-mono text-xs font-semibold">● Aktívne (Billing Sync)</span>
                <input type="checkbox" defaultChecked className="accent-[#a855f7] w-4 h-4 cursor-pointer" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple TypeScript array type helpers to prevent compile problems
type ShopifyProductsList = ShopifyProduct[];
