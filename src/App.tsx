import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Shell } from './components/layout/Shell';
import { Overview } from './components/dashboard/Overview';
import { UnifiedInbox } from './components/inbox/UnifiedInbox';
import { FlowBuilder } from './components/workflows/FlowBuilder';
import { IntegrationsGrid } from './components/integrations/IntegrationsGrid';
import { EmailComposer } from './components/comms/EmailComposer';
import { ShopifyConsole } from './components/integrations/ShopifyConsole';

export default function App() {
  return (
    <Router>
      <Shell>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/comms" element={<EmailComposer />} />
          <Route path="/inbox" element={<UnifiedInbox />} />
          <Route path="/workflows" element={<FlowBuilder />} />
          <Route path="/integrations" element={<IntegrationsGrid />} />
          <Route path="/shopify" element={<ShopifyConsole />} />
          <Route path="/analytics" element={<Overview />} /> {/* Reuse overview for demo */}
        </Routes>
      </Shell>
    </Router>
  );
}

